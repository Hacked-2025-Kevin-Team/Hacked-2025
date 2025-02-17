
import requests
from bs4 import BeautifulSoup

from metapub import PubMedFetcher
fetch = PubMedFetcher()






def fetch_latest_websites(og_website):
    req = requests.get(og_website)
    soup = BeautifulSoup(req.text, "html.parser")
    latest_section = soup.find(class_ = "latest-section")
    latest_sites = latest_section.find(class_ = "items-list")


    latest_paper_sites = []
    for element in latest_sites.find_all("a"):

        href_el = element.get("href")


        journal = element.get("data-ga-label")
        art_text = requests.get(og_website+href_el)




        souped_text= BeautifulSoup(art_text.text, "html.parser") 
        latest_paper_sites.append({
            "journal-name": journal, 
            "journal-html": souped_text
        })


    return latest_paper_sites


def fetch_article_pmid(latest_paper_sites):

    for site_dict in latest_paper_sites:

        site = site_dict["journal-html"]
        pmid_list = []

        pap_list = site.find_all(class_ = "docsum-title")
        if len(pap_list) > 1:

            for paper in pap_list:
                pmid = paper.get("data-article-id")
                pmid_list.append(pmid)
                    
        else:
            meta_uid = site.find("meta", attrs={"name": "uid"})

            pmid = meta_uid.get("content")
            pmid_list.append(pmid)
            #site.find(class_="current-id").get()
        site_dict["pmid_list"] = pmid_list



    return latest_paper_sites



og_website = "https://pubmed.ncbi.nlm.nih.gov"


sites = fetch_latest_websites(og_website)
fetch_article_pmid(sites)





#I am going to give you the latest papers of each journal











#print(soup.title.text)  # Extracts page title


#Okay what do I want 


#I want to do a query for the latest research papers 

#Then after I obtain those research papers I will create a summary of them. 

# Maybe even add a picture or two 



#Then I will send the summaries to the front-end of the app. 






