import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Clock, Tag, ExternalLink } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  link: string;
  source: string;
  date: string;
  category: string;
  author: string;
  reading_time: number;
  summary: string[];
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

const News: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0
  });

  const fetchArticles = async (page: number = 1, category?: string | null, search?: string) => {
    try {
      setLoading(true);
      let url = `http://localhost:5000/api/news?page=${page}&limit=10`;

      if (category) {
        url = `http://localhost:5000/api/news/category/${category}?page=${page}&limit=10`;
      } else if (search) {
        url = `http://localhost:5000/api/news/search?query=${search}&page=${page}&limit=10`;
      }

      const response = await axios.get(url);
      setArticles(response.data.articles);
      setPagination(response.data.pagination);
      setError(null);
    } catch (err) {
      setError('Failed to fetch news articles');
      console.error('Error fetching news:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchArticles(1, null, searchQuery);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handleCategoryChange = (category: string | null) => {
    setSelectedCategory(category);
    fetchArticles(1, category);
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    fetchArticles(newPage, selectedCategory, searchQuery);
  };

  if (loading && articles.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search and Filter Section */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search news articles..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Search
          </button>
        </form>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => handleCategoryChange(null)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              !selectedCategory
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          <button
            onClick={() => handleCategoryChange('Pollution')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === 'Pollution'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Pollution
          </button>
          <button
            onClick={() => handleCategoryChange('Government News')}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              selectedCategory === 'Government News'
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Government News
          </button>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <div
            key={article._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                <Tag className="h-4 w-4" />
                <span>{article.category}</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>{article.reading_time} min read</span>
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {article.title}
              </h3>

              <p className="text-gray-600 mb-4">
                {article.summary[0]?.substring(0, 150)}...
              </p>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  By {article.author} • {new Date(article.date).toLocaleDateString()}
                </div>
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-600 hover:text-green-700 flex items-center gap-1"
                >
                  Read more
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex flex-col items-center mt-8 gap-4">
          <div className="flex gap-4">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Prev
            </button>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.pages}
              className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200 disabled:opacity-50"
            >
              Next
            </button>
          </div>

          <div className="flex gap-2 flex-wrap justify-center">
            {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                disabled={page === pagination.page}
                className={`px-4 py-2 rounded ${
                  page === pagination.page
                    ? 'bg-green-600 text-white cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default News;
