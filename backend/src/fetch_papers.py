import os
from openai import OpenAI
from bs4 import BeautifulSoup
import requests
import json
from pypdf import PdfReader


client = OpenAI()


def download_pdf(url, save_path="downloaded.pdf"):
    """Downloads a PDF from a given URL and saves it locally."""
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        with open(save_path, "wb") as pdf_file:
            for chunk in response.iter_content(1024):
                pdf_file.write(chunk)
        return save_path
    else:
        raise Exception(f"Failed to download PDF. Status code: {response.status_code}")


# def extract_text_from_pdf(pdf_path):
#     """Extracts and returns text from a PDF using PyMuPDF (fitz)."""
#     text = ""
#     doc = fitz.open(pdf_path)
#     for page in doc:
#         text += page.get_text("text") + "\n"  # "text" mode keeps spacing better
#     return text.strip()


def search_core(query, api_key, page=1, page_size=1):
    """
    Searches the CORE API for research papers based on a query.

    Parameters:
        query (str): The search term.
        api_key (str): Your CORE API key.
        page (int): The page number (for pagination).
        page_size (int): Number of results per page.

    Returns:
        dict: JSON response from the CORE API.
    """
    base_url = "https://api.core.ac.uk/v3/search/works"
    params = {"query": query, "q": query, "search_id": query, "title": query, "apiKey": api_key, "page": page, "pageSize": page_size}

    response = requests.get(base_url, params=params)

    if response.status_code == 200:
        return response.json()
    else:
        print("Error:", response.status_code, response.text)
        return -1


class ResearchPaper:
    def query_gpt(self, paper: str):
        return client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content": "Write a summary for this paper. Do not use math text. Return a json with 'summary' and 'tags', make the tags fairly broad like 'math', 'social issues', or 'physics' in a space seperated string",
                },
                {"role": "user", "content": paper},
            ],
            response_format={"type": "json_object"},
            store=True,
        )

    def __init__(self, topic: str):
        self.thing = search_core(topic, os.environ.get("CORE_API"))

        if self.thing == -1:
            print("error with CORE api")
        self.title = self.thing["results"][0]["title"]
        self.url = self.thing["results"][0]["downloadUrl"]
        self.json_info = json.loads(self.query_gpt(self.thing["results"][0]["fullText"]).choices[0].message.content)
        self.message = self.json_info["summary"]
        self.tags = self.json_info["tags"].split(" ")


# print(e["results"][0]["title"])

# print("title: " summary.title.strip('\n'))
# print(summary.message)
# print(summary.message)
summary = ResearchPaper("health")
# print(json.dumps(summary.thing, indent=4))
print(summary.message)
print(summary.tags)
