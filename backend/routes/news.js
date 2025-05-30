const express = require('express');
const router = express.Router();
const { MongoClient } = require('mongodb');
require('dotenv').config();

// MongoDB connection
const mongoUri = process.env.MONGO_URI;

const dbName = process.env.MONGODB_DB || 'emission';
const collectionName = process.env.MONGODB_COLLECTION || 'news_articles';

// Get all news articles with pagination
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    try {
        const client = await MongoClient.connect(mongoUri);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        // Get total count for pagination
        const total = await collection.countDocuments();
        
        // Get articles with pagination
        const articles = await collection
            .find({})
            .sort({ scraped_at: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
        
        await client.close();
        
        res.json({
            articles,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching news:', error);
        res.status(500).json({ message: 'Error fetching news articles' });
    }
});

// Get news by category
router.get('/category/:category', async (req, res) => {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    try {
        const client = await MongoClient.connect(mongoUri);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        // Get total count for pagination
        const total = await collection.countDocuments({ category });
        
        // Get articles with pagination
        const articles = await collection
            .find({ category })
            .sort({ scraped_at: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
        
        await client.close();
        
        res.json({
            articles,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching news by category:', error);
        res.status(500).json({ message: 'Error fetching news articles' });
    }
});

// Search news articles
router.get('/search', async (req, res) => {
    const { query } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    if (!query) {
        return res.status(400).json({ message: 'Search query is required' });
    }
    
    try {
        const client = await MongoClient.connect(mongoUri);
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        
        // Create text search query
        const searchQuery = {
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { summary: { $regex: query, $options: 'i' } }
            ]
        };
        
        // Get total count for pagination
        const total = await collection.countDocuments(searchQuery);
        
        // Get articles with pagination
        const articles = await collection
            .find(searchQuery)
            .sort({ scraped_at: -1 })
            .skip(skip)
            .limit(limit)
            .toArray();
        
        await client.close();
        
        res.json({
            articles,
            pagination: {
                total,
                page,
                limit,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error searching news:', error);
        res.status(500).json({ message: 'Error searching news articles' });
    }
});

module.exports = router; 