import os
import dotenv
import json
from typing import Annotated
from typing_extensions import TypedDict, Sequence, Literal

from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain import hub

from langchain_core.messages import ToolMessage
from langchain_core.tools import create_retriever_tool
from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.prebuilt import ToolNode

from langchain_openai import ChatOpenAI
from langchain_core.output_parsers import StrOutputParser

from langgraph.checkpoint.memory import MemorySaver
from langchain_core.prompts import PromptTemplate
from langgraph.prebuilt import tools_condition
from langgraph.prebuilt import create_react_agent
from pydantic import BaseModel, Field


from .pm_tools import fetch_pm_document_url, vectorstore
# Load environment variables
dotenv.load_dotenv()
OPENAI_KEY = os.getenv("OPENAI_API_KEY")


class State(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]



class LLM:
    def __init__(self):
        self.graph_builder = StateGraph(State)

        #tool = TavilySearchResults(max_results=2)
        self.tools = [fetch_pm_document_url]
        #self.tools=[]
        retriever = vectorstore.as_retriever()
        retriever_tool = create_retriever_tool(
                            retriever,
                            "retrieve_medical_research_articles",
                            "Search and return accurate information from the medical research articles.",
                        )
        self.tools.append(
            retriever_tool
        )
        
        self.workflow = StateGraph(State)
        self.workflow.add_node("agent", self.agent)
        search_or_retreieve = ToolNode([fetch_pm_document_url, retriever_tool])
        
        
        #Search then retrieve
        self.workflow.add_node("search_or_retrieve", search_or_retreieve)
        #self.workflow.add_node("retrieve", retrieve)
        self.workflow.add_node("rewrite", self.rewrite)
        self.workflow.add_node("generate", self.generate)
        
        self.workflow.add_edge(START, "agent")
        
        
        self.workflow.add_conditional_edges(
            "agent", tools_condition, {"tools":"search_or_retrieve", END: END}
        )
        
        self.workflow.add_conditional_edges("search_or_retrieve", self.grade_documents)
        #self.workflow.add_edge("search", "agent")
        
        
        self.workflow.add_edge("generate", END)
        self.workflow.add_edge("rewrite", "agent")
        
        self.mem_saver = MemorySaver()
        self.graph = self.workflow.compile(checkpointer=self.mem_saver)
        self.mem_saver_config = {"configurable": {"thread_id": "def234"}}
        self.graph.get_graph(xray=True).draw_mermaid_png(output_file_path="test.png")
    def grade_documents(self, state) -> Literal["generate", "rewrite"]:

        # Data model
        class grade(BaseModel):
            """Binary score for relevance check."""

            binary_score: str = Field(description="Relevance score 'yes' or 'no'")

        # LLM
        model = ChatOpenAI(temperature=0, model="gpt-4o", streaming=True)

        # LLM with tool and validation
        llm_with_tool = model.with_structured_output(grade)

        # Prompt
        prompt = PromptTemplate(
            template="""You are a grader assessing relevance of a retrieved document to a user question. \n 
            Here is the retrieved document: \n\n {context} \n\n
            Here is the user question: {question} \n
            If the document contains keyword(s) or semantic meaning related to the user question, grade it as relevant. \n
            Give a binary score 'yes' or 'no' score to indicate whether the document is relevant to the question.""",
            input_variables=["context", "question"],
        )

        # Chain
        chain = prompt | llm_with_tool

        messages = state["messages"]
        last_message = messages[-1]

        question = messages[0].content
        docs = last_message.content

        scored_result = chain.invoke({"question": question, "context": docs})

        score = scored_result.binary_score

        if score == "yes":
            return "generate"

        else:
            return "rewrite"
        
    
    def agent(self, state: State):
        messages = state["messages"]
        model = ChatOpenAI(temperature=0, streaming=True, model="gpt-4-turbo")
        model = model.bind_tools(self.tools)
        response = model.invoke(messages)
        # We return a list, because this will get added to the existing list
        return {"messages": [response]}
    
    
    def rewrite(self, state: State):

        print("---TRANSFORM QUERY---")
        messages = state["messages"]
        question = messages[0].content

        msg = [
            HumanMessage(
                content=f""" \n 
        Look at the input and try to reason about the underlying semantic intent / meaning. \n 
        Here is the initial question:
        \n ------- \n
        {question} 
        \n ------- \n
        Formulate an improved question: """,
            )
        ]

        # Grader
        model = ChatOpenAI(temperature=0, model="gpt-4-0125-preview", streaming=True)
        response = model.invoke(msg)
        return {"messages": [response]}

    def generate(self, state):
        messages = state["messages"]
        question = messages[0].content
        last_message = messages[-1]

        docs = last_message.content

        # Prompt
        prompt = hub.pull("rlm/rag-prompt")

        # LLM
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0, streaming=True)

        # Chain
        rag_chain = prompt | llm | StrOutputParser()

        # Run
        response = rag_chain.invoke({"context": docs, "question": question})
        return {"messages": [response]}
    
    def stream_graph_updates(self, user_input: str):
        inputs = {
            "messages": [
                ("system", "You are a personal health assistant, whose purpose is to use the available tools to provide the user with accurate information, and to answer questions related to healthcare and medicine. Do not answer any off-topic question."),
                ("user", user_input)
            ]
        }
        
        for output in self.graph.stream(input=inputs, config=self.mem_saver_config):
            for key, value in output.items():
                print(key, value)
                yield str(value["messages"][0].content)

    

"""
user_input = "What do you know about LangGraph?"
test = LLM()
test.stream_graph_updates(user_input)"""