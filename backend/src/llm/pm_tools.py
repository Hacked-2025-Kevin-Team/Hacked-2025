import os
import dotenv
from metapub import PubMedFetcher
from metapub import FindIt
import requests
import pymupdf  
from io import BytesIO
from langchain.tools import tool
from langchain_openai import OpenAIEmbeddings
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma.vectorstores import Chroma
from langchain_core.documents.base import Document
dotenv.load_dotenv()


vectorstore = Chroma(
        collection_name="rag-chroma",
        embedding_function=OpenAIEmbeddings(model="text-embedding-3-large"),
)
@tool()
def fetch_pm_document_url(query):
    """Fetch a list of reliable medical research articles based on keywords from the user's question, then store in a vector database for later retrieval."""
    api_key = os.getenv("NCBI_API_KEY")
    fetcher = PubMedFetcher()
    
    print(query)

    fetched_article_count = 0
    results = fetcher.pmids_for_query(f"{query} AND (Free Full Text[filter])",
                                      api_key=api_key,
                                      retmax="10",
                                      until="2024"
                                    )
    return_dictionary = {}
    
    for pmid in results:
        article_title = fetcher.article_by_pmid(pmid).title
        src = FindIt(pmid, verify=True)
        if src.url:
            fetched_article_count += 1
            return_dictionary[src.url] = article_title
            
            if fetched_article_count >= 3:
                break
        else:
            continue
    
    pdfs = []
    # Download the PDF files
    for pdf_url in return_dictionary.keys():
        fetched_pdf = requests.get(pdf_url)
        fetched_pdf.raise_for_status()
        
        pdf_stream = BytesIO(fetched_pdf.content)
        doc = pymupdf.open(stream=pdf_stream, filetype="pdf")
        text = "\n".join(page.get_text("text") for page in doc)
        
        document = Document(
            page_content=text,
            metadata={"url": pdf_url, "title": return_dictionary[pdf_url]},
        )
        pdfs.append(document)
    
    text_splitter = RecursiveCharacterTextSplitter.from_tiktoken_encoder(
        chunk_size=200, chunk_overlap=75
    )
    doc_splits = text_splitter.split_documents(pdfs)
    
    vectorstore.add_documents(doc_splits)
    return str(return_dictionary)


#@tool
#def extract_text_and_store_for_retrieval(pdf_urls):
#    """Input a dictionary where the keys are URLS and the values are the title of the article. Fetch the text of the articles from the URLS, then store in a vector database for later retrieval."""
    

 #   return
    



