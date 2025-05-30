from news_scraper import NewsScraper

scraper = NewsScraper()
articles = scraper.scrape_emissions_analytics()

print(f"Found {len(articles)} articles.")
for article in articles:
    print(article['title'], article.get('image_url'), sep=" | ")
