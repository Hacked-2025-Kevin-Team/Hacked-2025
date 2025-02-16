import os
from metapub import PubMedFetcher
api_key = os.getenv("NCBI_API_KEY")
fetch = PubMedFetcher(api_key=api_key)

def fetch_medical_documments(query):
    results = fetch.pmids_for_query(query)
    articles = []
    