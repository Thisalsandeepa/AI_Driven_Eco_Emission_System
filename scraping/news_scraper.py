
# import requests
# from bs4 import BeautifulSoup
# from pymongo import MongoClient
# from datetime import datetime, timezone
# import os
# from dotenv import load_dotenv
# import logging
# from typing import List, Dict, Any
# from requests.adapters import HTTPAdapter
# from urllib3.util.retry import Retry

# # Configure logging
# logging.basicConfig(
#     level=logging.INFO,
#     format='%(asctime)s - %(levelname)s - %(message)s'
# )
# logger = logging.getLogger(__name__)

# # Load environment variables
# load_dotenv()

# class NewsScraper:
#     def __init__(self):
#         self.mongo_uri = os.getenv('MONGODB_URI')
#         self.db_name = os.getenv('MONGODB_DB', 'emission')
#         self.collection_name = os.getenv('MONGODB_COLLECTION', 'news_articles')
#         self.headers = {
#             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
#         }
#         self.client = None
#         self.db = None
#         self.collection = None

#         # Configure requests session with retry logic
#         self.session = requests.Session()
#         retries = Retry(
#             total=3,
#             backoff_factor=1,
#             status_forcelist=[500, 502, 503, 504]
#         )
#         self.session.mount('http://', HTTPAdapter(max_retries=retries))
#         self.session.mount('https://', HTTPAdapter(max_retries=retries))

#     def connect_to_mongodb(self):
#         try:
#             self.client = MongoClient(self.mongo_uri)
#             self.db = self.client[self.db_name]
#             self.collection = self.db[self.collection_name]
#             logger.info("Successfully connected to MongoDB")
#         except Exception as e:
#             logger.error(f"Failed to connect to MongoDB: {str(e)}")
#             raise

#     def scrape_greenly_article(self) -> List[Dict[str, Any]]:
#         url = "https://greenly.earth/en-gb/blog/ecology-news/what-are-the-main-pollution-emissions"
#         try:
#             response = self.session.get(url, headers=self.headers)
#             response.raise_for_status()
#             soup = BeautifulSoup(response.content, "html.parser")

#             article = {
#                 "title": soup.select_one("h1").get_text(strip=True),
#                 "link": url,
#                 "source": "Greenly",
#                 "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
#                 "scraped_at": datetime.now(timezone.utc),
#                 "category": "Pollution",
#                 "author": self._extract_author(soup),
#                 "reading_time": self._estimate_reading_time(soup),
#                 "summary": self._extract_summary(soup)
#             }
#             logger.info(f"Successfully scraped article from Greenly: {article['title']}")
#             return [article]
#         except Exception as e:
#             logger.error(f"Error scraping Greenly article: {str(e)}")
#             return []

#     def scrape_epa_news(self) -> List[Dict[str, Any]]:
#         url = "https://www.epa.gov/newsreleases"
#         try:
#             response = self.session.get(url, headers=self.headers)
#             response.raise_for_status()
#             soup = BeautifulSoup(response.content, "html.parser")

#             articles = []
#             news_items = soup.select(".view-content .views-row")

#             for article in news_items:
#                 try:
#                     title_elem = article.select_one("h3")
#                     link_elem = article.select_one("a")
#                     date_elem = article.select_one(".date-display-single")

#                     if title_elem and link_elem:
#                         article_data = {
#                             "title": title_elem.get_text(strip=True),
#                             "link": f"https://www.epa.gov{link_elem['href']}" if not link_elem['href'].startswith('http') else link_elem['href'],
#                             "source": "EPA",
#                             "date": date_elem.get_text(strip=True) if date_elem else datetime.now(timezone.utc).strftime("%Y-%m-%d"),
#                             "scraped_at": datetime.now(timezone.utc),
#                             "category": "Government News",
#                             "author": "EPA",
#                             "summary": self._extract_epa_summary(article)
#                         }
#                         articles.append(article_data)
#                         logger.info(f"Successfully scraped EPA article: {article_data['title']}")
#                 except Exception as e:
#                     logger.error(f"Error processing EPA article: {str(e)}")
#                     continue

#             return articles
#         except Exception as e:
#             logger.error(f"Error scraping EPA news: {str(e)}")
#             return []

#     def scrape_un_news(self) -> List[Dict[str, Any]]:
#         url = "https://www.unep.org/news-and-stories"
#         try:
#             response = self.session.get(url, headers=self.headers)
#             response.raise_for_status()
#             soup = BeautifulSoup(response.content, "html.parser")

#             articles = []
#             news_items = soup.select(".item-list li")

#             for article in news_items:
#                 try:
#                     title_elem = article.select_one("a")
#                     if not title_elem:
#                         continue
#                     article_data = {
#                         "title": title_elem.get_text(strip=True),
#                         "link": "https://www.unep.org" + title_elem['href'],
#                         "source": "UNEP",
#                         "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
#                         "scraped_at": datetime.now(timezone.utc),
#                         "category": "Environmental News",
#                         "author": "UNEP",
#                         "summary": [title_elem.get_text(strip=True)]
#                     }
#                     articles.append(article_data)
#                     logger.info(f"Successfully scraped UNEP article: {article_data['title']}")
#                 except Exception as e:
#                     logger.error(f"Error processing UNEP article: {str(e)}")
#                     continue

#             return articles
#         except Exception as e:
#             logger.error(f"Error scraping UNEP news: {str(e)}")
#             return []

#     def _extract_author(self, soup: BeautifulSoup) -> str:
#         author_elem = soup.select_one(".author-name, .author")
#         return author_elem.get_text(strip=True) if author_elem else "Unknown"

#     def _estimate_reading_time(self, soup: BeautifulSoup) -> int:
#         content = soup.select("main article p, .article-content p")
#         total_words = sum(len(p.get_text().split()) for p in content)
#         return max(1, round(total_words / 200))

#     def _extract_summary(self, soup: BeautifulSoup) -> List[str]:
#         content_blocks = soup.select("main article p, .article-content p, article p, p")
#         summary = []
#         for p in content_blocks[:10]:
#             text = p.get_text(strip=True)
#             if text:
#                 summary.append(text)
#         if not summary:
#             meta_desc = soup.find('meta', attrs={'name': 'description'})
#             if meta_desc and meta_desc.get('content'):
#                 summary.append(meta_desc['content'])
#         if not summary:
#             summary.append("No summary available for this article.")
#         return summary

#     def _extract_epa_summary(self, article: BeautifulSoup) -> List[str]:
#         summary_elem = article.select_one(".summary, .description")
#         if summary_elem:
#             return [summary_elem.get_text(strip=True)]
#         return []

#     def save_to_mongodb(self, articles: List[Dict[str, Any]]):
#         if self.collection is None:
#             self.connect_to_mongodb()

#         saved_count = 0
#         for article in articles:
#             try:
#                 if not self.collection.find_one({"link": article["link"]}):
#                     self.collection.insert_one(article)
#                     saved_count += 1
#                     logger.info(f"Saved article: {article['title']}")
#                 else:
#                     logger.info(f"Article already exists: {article['title']}")
#             except Exception as e:
#                 logger.error(f"Error saving article to MongoDB: {str(e)}")

#         return saved_count

#     def run_scraper(self):
#         try:
#             self.connect_to_mongodb()
#             all_articles = []
#             all_articles.extend(self.scrape_greenly_article())
#             all_articles.extend(self.scrape_epa_news())
#             all_articles.extend(self.scrape_un_news())
#             saved_count = self.save_to_mongodb(all_articles)
#             logger.info(f"Scraping completed. Found {len(all_articles)} articles, saved {saved_count} new articles.")
#         except Exception as e:
#             logger.error(f"Error in scraper execution: {str(e)}")
#         finally:
#             if self.client:
#                 self.client.close()

# if __name__ == "__main__":
#     scraper = NewsScraper()
#     scraper.run_scraper()

# Updated news_scraper.py with Emissions Analytics integration

# Fixed indentation and structure for scrape_emissions_analytics()

# Updated with Green NCAP scraper
# Finalized script with only Green NCAP scraper enabled

# Finalized news_scraper.py using UNEP and EPA

import requests
from bs4 import BeautifulSoup
from pymongo import MongoClient
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
import logging
from typing import List, Dict, Any
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv()

class NewsScraper:
    def __init__(self):
        self.mongo_uri = os.getenv('MONGODB_URI')
        self.db_name = os.getenv('MONGODB_DB', 'emission')
        self.collection_name = os.getenv('MONGODB_COLLECTION', 'news_articles')
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        self.client = None
        self.db = None
        self.collection = None

        self.session = requests.Session()
        retries = Retry(total=3, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
        self.session.mount('http://', HTTPAdapter(max_retries=retries))
        self.session.mount('https://', HTTPAdapter(max_retries=retries))

    def connect_to_mongodb(self):
        try:
            self.client = MongoClient(self.mongo_uri)
            self.db = self.client[self.db_name]
            self.collection = self.db[self.collection_name]
            logger.info("Successfully connected to MongoDB")
        except Exception as e:
            logger.error(f"Failed to connect to MongoDB: {str(e)}")
            raise

    def scrape_unep_news(self) -> List[Dict[str, Any]]:
        url = "https://www.unep.org/news-and-stories"
        try:
            response = self.session.get(url, headers=self.headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, "html.parser")

            articles = []
            news_items = soup.select("div.card.card--news")

            print(f"Found {len(news_items)} UNEP cards")


            for item in news_items[:5]:
                try:
                    title_elem = item.select_one(".card__title a")
                    title = title_elem.get_text(strip=True)
                    link = "https://www.unep.org" + title_elem["href"]

                    img_elem = item.select_one("img")
                    image_url = img_elem["src"] if img_elem else None
                    if image_url and image_url.startswith("/"):
                        image_url = "https://www.unep.org" + image_url

                    excerpt_elem = item.select_one(".card__summary p")
                    summary = [excerpt_elem.get_text(strip=True)] if excerpt_elem else []

                    articles.append({
                        "title": title,
                        "link": link,
                        "source": "UNEP",
                        "date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                        "scraped_at": datetime.now(timezone.utc),
                        "category": "Environmental News",
                        "author": "UNEP",
                        "summary": summary,
                        "image_url": image_url
                    })
                    logger.info(f"Scraped UNEP: {title}")
                except Exception as e:
                    logger.error(f"Error parsing UNEP article: {str(e)}")
                    continue

            return articles
        except Exception as e:
            logger.error(f"Failed to scrape UNEP: {str(e)}")
            return []

    def scrape_epa_news(self) -> List[Dict[str, Any]]:
        url = "https://www.epa.gov/newsreleases"
        try:
            response = self.session.get(url, headers=self.headers)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, "html.parser")
            


            articles = []
            news_items = soup.select(".view-content .views-row")
            print(f"Found {len(news_items)} EPA items")

            for article in news_items[:5]:
                try:
                    title_elem = article.select_one("h3")
                    link_elem = article.select_one("a")
                    date_elem = article.select_one(".date-display-single")

                    if title_elem and link_elem:
                        article_data = {
                            "title": title_elem.get_text(strip=True),
                            "link": f"https://www.epa.gov{link_elem['href']}" if not link_elem['href'].startswith('http') else link_elem['href'],
                            "source": "EPA",
                            "date": date_elem.get_text(strip=True) if date_elem else datetime.now(timezone.utc).strftime("%Y-%m-%d"),
                            "scraped_at": datetime.now(timezone.utc),
                            "category": "Government News",
                            "author": "EPA",
                            "summary": [title_elem.get_text(strip=True)],
                            "image_url": None
                        }
                        articles.append(article_data)
                        logger.info(f"Scraped EPA: {article_data['title']}")
                except Exception as e:
                    logger.error(f"Error parsing EPA article: {str(e)}")
                    continue

            return articles
        except Exception as e:
            logger.error(f"Failed to scrape EPA: {str(e)}")
            return []

    def save_to_mongodb(self, articles: List[Dict[str, Any]]):
        if self.collection is None:
            self.connect_to_mongodb()

        saved_count = 0
        for article in articles:
            try:
                if not self.collection.find_one({"link": article["link"]}):
                    self.collection.insert_one(article)
                    saved_count += 1
                    logger.info(f"Saved article: {article['title']}")
                else:
                    logger.info(f"Article already exists: {article['title']}")
            except Exception as e:
                logger.error(f"Error saving article to MongoDB: {str(e)}")

        return saved_count

    def run_scraper(self):
        try:
            self.connect_to_mongodb()
            all_articles = []
            all_articles.extend(self.scrape_unep_news())
            all_articles.extend(self.scrape_epa_news())
            saved_count = self.save_to_mongodb(all_articles)
            logger.info(f"Scraping completed. Found {len(all_articles)} articles, saved {saved_count} new articles.")
        except Exception as e:
            logger.error(f"Error in scraper execution: {str(e)}")
        finally:
            if self.client:
                self.client.close()

if __name__ == "__main__":
    scraper = NewsScraper()
    scraper.run_scraper()
