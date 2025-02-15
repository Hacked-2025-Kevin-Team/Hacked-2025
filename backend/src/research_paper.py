import os
from openai import OpenAI
from bs4 import BeautifulSoup
import requests
import json
from pypdf import PdfReader
import fitz


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


def extract_text_from_pdf(pdf_path):
    """Extracts and returns text from a PDF using PyMuPDF (fitz)."""
    text = ""
    doc = fitz.open(pdf_path)
    for page in doc:
        text += page.get_text("text") + "\n"  # "text" mode keeps spacing better
    return text.strip()


class ResearchPaper:
    def query_gpt(self, paper: str):
            return client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Write a summary for this paper."},
                {
                    "role": "user",
                    "content": paper
                }],
            store = True)
    def __init__(self, string: str):
        self.message = self.query_gpt(string)


pdf_path = download_pdf("https://arxiv.org/pdf/astro-ph/0608371v1")

paper = ResearchPaper(extract_text_from_pdf(pdf_path))

print(paper.message)


