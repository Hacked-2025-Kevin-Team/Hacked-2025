"""Run with `poetry run python -m unittest discover -s tests -v` in backend.

Use real locked dependencies, temporary caches and fixture HTTP responses.
LLM/vector-store construction is mocked because these imports create clients.
"""

from contextlib import ExitStack
import importlib
import importlib.util
import os
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import Mock, patch


ARTICLE_XML = """<PubmedArticleSet><PubmedArticle><MedlineCitation>
<PMID>12345</PMID><Article><Journal><Title>Offline journal</Title>
<JournalIssue><PubDate><Year>2025</Year></PubDate></JournalIssue></Journal>
<ArticleTitle>Offline article</ArticleTitle>
<Abstract><AbstractText>Fixture abstract.</AbstractText></Abstract>
<AuthorList><Author><LastName>Smith</LastName><ForeName>Ada</ForeName>
<Initials>A</Initials></Author></AuthorList></Article>
</MedlineCitation><PubmedData><ArticleIdList>
<ArticleId IdType="pubmed">12345</ArticleId>
</ArticleIdList></PubmedData></PubmedArticle></PubmedArticleSet>"""


class PubMedOfflineTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.stack = ExitStack()
        cls.addClassCleanup(cls.stack.close)
        home = cls.stack.enter_context(tempfile.TemporaryDirectory())
        cls.stack.enter_context(patch.dict(os.environ, {
            "HOME": home,
            "XDG_CACHE_HOME": home,
            "PYTHON_DOTENV_DISABLED": "1",
        }, clear=True))
        # Fail before DNS/connection or HTTP can reach any external service.
        for target in ("socket.getaddrinfo", "socket.socket.connect",
                       "socket.socket.connect_ex", "requests.Session.request"):
            cls.stack.enter_context(patch(
                target, side_effect=AssertionError("Network access in offline test")
            ))
        cls.stack.enter_context(patch("dotenv.load_dotenv", return_value=False))
        source = str(Path(__file__).resolve().parents[1] / "src")
        cls.stack.enter_context(patch.object(sys, "path", [source, *sys.path]))

    def test_dependency_imports_without_pkg_resources(self):
        self.assertIsNone(importlib.util.find_spec("pkg_resources"))
        self.assertIsNone(importlib.util.find_spec("eutils"))
        from metapub import FindIt, PubMedFetcher
        self.assertTrue(callable(FindIt))
        self.assertTrue(callable(PubMedFetcher))

    def test_application_imports(self):
        for name in ("pubmeta", "fetch_news"):
            with self.subTest(module=name):
                module = importlib.import_module(name)
                self.assertTrue(callable(module.fetch.pmids_for_query))
        with patch("langchain_openai.OpenAIEmbeddings") as embeddings, \
                patch("langchain_chroma.vectorstores.Chroma") as chroma:
            tools = importlib.import_module("llm.pm_tools")
            llm = importlib.import_module("llm.llm")
            embeddings.assert_called_once_with(model="text-embedding-3-large")
            chroma.assert_called_once()
            self.assertIs(llm.vectorstore, tools.vectorstore)
            self.assertTrue(callable(tools.search_for_pubmedm_articles.invoke))

    def test_search_and_article_parsing(self):
        from metapub import PubMedFetcher
        with tempfile.TemporaryDirectory() as cache:
            fetcher = PubMedFetcher(cachedir=cache)
            search = Mock(status_code=200, headers={"content-type": "text/xml"},
                          text="<eSearchResult><IdList><Id>12345</Id></IdList></eSearchResult>")
            article = Mock(status_code=200, headers={"content-type": "text/xml"},
                           text=ARTICLE_XML)
            with patch.object(fetcher.qs.client.session, "get",
                              side_effect=[search, article]) as get:
                # Match the date/filter/retmax arguments used by the application.
                ids = fetcher.pmids_for_query(
                    "medicine AND (Free Full Text[filter])", api_key=None,
                    since="2020/01/01", retmax="10", until="2024"
                )
                self.assertEqual(ids, ["12345"])
                result = fetcher.article_by_pmid(ids[0])
                self.assertEqual(result.title, "Offline article")
                self.assertEqual(result.abstract, "Fixture abstract.")
                self.assertEqual(result.authors, ["Smith A"])
                self.assertEqual(str(result.year), "2025")
                self.assertEqual(get.call_count, 2)
                self.assertTrue(get.call_args_list[0].args[0].endswith("esearch.fcgi"))
                params = get.call_args_list[0].kwargs["params"]
                self.assertEqual(params["retmax"], "10")
                self.assertIn("2020/01/01", params["term"])
                self.assertIn("2024", params["term"])


if __name__ == "__main__":
    unittest.main()
