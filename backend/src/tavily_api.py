from tavily import TavilyClient
import os


client = TavilyClient(os.environ.get("TAVILY_API"))

# To install, run: pip install tavily-python

response = client.search(
    query="get me links to full https://pmc.ncbi.nlm.nih.gov/ research articles",
    search_depth="advanced",
    time_range="d",
    include_answer="advanced"
)


print(response)