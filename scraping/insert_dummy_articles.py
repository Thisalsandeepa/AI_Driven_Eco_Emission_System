import os
from pymongo import MongoClient
from datetime import datetime, timezone

# Use environment variables from your .env file
from dotenv import load_dotenv
load_dotenv()

mongo_uri = os.getenv('MONGODB_URI')
db_name = os.getenv('MONGODB_DB', 'emission')
collection_name = os.getenv('MONGODB_COLLECTION', 'news_articles')

client = MongoClient(mongo_uri)
db = client[db_name]
collection = db[collection_name]

dummy_articles = [
    {
        "title": "Sri Lanka’s New Emission Testing Standards Announced",
        "link": "https://example.com/article1",
        "source": "DriveGreen.lk",
        "date": "2025-05-22",
        "scraped_at": datetime.now(timezone.utc),
        "category": "Emissions",
        "author": "Ministry of Environment",
        "summary": [
            "The new vehicle emission standards are expected to reduce pollution by 30% over the next decade."
        ],
        "image_url": "https://www.drivegreen.lk/assets/img/hero.jpg"
    },
    {
        "title": "UNEP Launches Global Clean Air Initiative",
        "link": "https://www.unep.org/clean-air-initiative",
        "source": "UNEP",
        "date": "2025-05-21",
        "scraped_at": datetime.now(timezone.utc),
        "category": "Environmental News",
        "author": "UNEP",
        "summary": [
            "The UNEP has launched a new international initiative to combat urban air pollution through policy reform."
        ],
        "image_url": "https://www.unep.org/sites/default/files/2023-03/clean_air_banner.jpg"
    },
    {
        "title": "How Vehicle Emissions Impact Public Health",
        "link": "https://example.com/article2",
        "source": "Clean Air Fund",
        "date": "2025-05-20",
        "scraped_at": datetime.now(timezone.utc),
        "category": "Health",
        "author": "Clean Air Research Team",
        "summary": [
            "Recent studies show a correlation between emissions and respiratory illness spikes in urban areas."
        ],
        "image_url": "https://www.cleanairfund.org/wp-content/uploads/2024/02/emissions-health.jpg"
    },
    {
        "title": "Electric Vehicles and Their Role in Emission Reduction",
        "link": "https://example.com/article3",
        "source": "Green Future",
        "date": "2025-05-19",
        "scraped_at": datetime.now(timezone.utc),
        "category": "Technology",
        "author": "Green Future Insights",
        "summary": [
            "Electric vehicles are key to reducing transportation-based CO2 emissions, experts say."
        ],
        "image_url": "https://images.unsplash.com/photo-ev.jpg"
    },
    {
        "title": "Sri Lanka to Expand DriveGreen Centers Nationwide",
        "link": "https://www.drivegreen.lk/expansion-plan",
        "source": "DriveGreen.lk",
        "date": "2025-05-18",
        "scraped_at": datetime.now(timezone.utc),
        "category": "Policy",
        "author": "DriveGreen Press",
        "summary": [
            "The DriveGreen program will open 15 new testing centers across the island to improve access to emissions checks."
        ],
        "image_url": "https://www.drivegreen.lk/assets/img/expansion.jpg"
    }
]

inserted = 0
for article in dummy_articles:
    if not collection.find_one({"link": article["link"]}):
        collection.insert_one(article)
        inserted += 1

print(f"Inserted {inserted} new articles.")
