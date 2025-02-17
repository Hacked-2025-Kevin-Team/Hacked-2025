import os
from metapub import PubMedFetcher
from metapub import FindIt
import requests
import pymupdf  
from io import BytesIO
api_key = os.getenv("NCBI_API_KEY")
fetch = PubMedFetcher()

def fetch_medical_documments(query):
    results = fetch.pmids_for_query(f"{query} AND (Free Full Text[filter])",api_key=api_key,since="2020/01/01",retmax="10")
    articles_text = []
    
    for pmid in results:
        article = fetch.article_by_pmid(pmid)
        src = FindIt(pmid, verify=True)
        articles_text.append(extract_text_from_pdf_url(src.url))
        
    for article in articles_text:
        if article != None:
            pass        





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
    