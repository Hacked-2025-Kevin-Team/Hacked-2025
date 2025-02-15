import os
from openai import OpenAI
from bs4 import *
import requests
import json

client = OpenAI()

springer_api_key = os.environ.get("SPRINGER_API", "")
# print(springer_api_key)

class ResearchPaper:
    def query_gpt(self, paper: str):
            return client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "Write a summary for these papers."},
                {
                    "role": "user",
                    "content": paper
                }],
            store = True)
    def __init__(self, string: str):
        self.message = self.query_gpt(string)
    

paper = ResearchPaper("ee")
print(paper.message)


