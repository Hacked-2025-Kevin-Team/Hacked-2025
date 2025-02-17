import os
from metapub import PubMedFetcher
from metapub import FindIt
import requests
import pymupdf  
from io import BytesIO
from langchain.tools import tool

@tool
def fetch_pm_document_url(query):
    """Fetch a list of reliable medical research articles based on keywords from the user's question."""
    api_key = os.getenv("NCBI_API_KEY")
    fetcher = PubMedFetcher()
    
    print(query)

    fetched_article_count = 0
    results = fetcher.pmids_for_query(f"{query} AND (Free Full Text[filter])",
                                      api_key=api_key,
                                      retmax="10",
                                    )
    return_dictionary = {}
    
    for pmid in results:
        article_title = fetcher.article_by_pmid(pmid).title
        src = FindIt(pmid, verify=True)
        if src.url:
            fetched_article_count += 1
            return_dictionary[article_title] = src.url
            
            if fetched_article_count >= 3:
                break
        else:
            continue
    
    return return_dictionary 


def extract_text_from_pdf_url(pdf_url):
    """
    Fetches a PDF from a URL and extracts all text from it.
    
    :param pdf_url: URL of the PDF file
    :return: Extracted text as a string
    """
    try:
        # Download the PDF file
        response = requests.get(pdf_url)
        response.raise_for_status()  # Raise error for failed requests

        # Load the PDF into PyMuPDF
        pdf_stream = BytesIO(response.content)
        doc = pymupdf.open(stream=pdf_stream, filetype="pdf")

        # Extract text from each page
        text = "\n".join(page.get_text("text") for page in doc)

        return text
    except Exception as e:
        print(e)
