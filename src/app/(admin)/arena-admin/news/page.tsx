'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Input, Modal, Badge } from '@/components/ui';
import { Plus, Search, Edit2, Trash2, Newspaper, Eye, EyeOff, Clock } from 'lucide-react';
import { formatDate, getRelativeTime, cn } from '@/lib/utils';
import type { NewsOfTheDay } from '@/lib/database.types';

export default function NewsPage() {
  const [news, setNews] = useState<NewsOfTheDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedNews, setSelectedNews] = useState<NewsOfTheDay | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    featured_image_url: '',
    is_published: true,
    publish_date: new Date().toISOString().slice(0, 10),
  });

  const fetchData = async () => {
    try {
      const res = await fetch('/api/news?all=true');
      const data = await res.json();
      if (Array.isArray(data)) setNews(data);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClick = () => {
    setSelectedNews(null);
    setFormData({
      title: '',
      content: '',
      featured_image_url: '',
      is_published: true,
      publish_date: new Date().toISOString().slice(0, 10),
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (item: NewsOfTheDay) => {
    setSelectedNews(item);
    setFormData({
      title: item.title,
      content: item.content,
      featured_image_url: item.featured_image_url || '',
      is_published: item.is_published,
      publish_date: item.publish_date || new Date().toISOString().slice(0, 10),
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (item: NewsOfTheDay) => {
    setSelectedNews(item);
    setIsDeleteOpen(true);
  };

  const handleToggleActive = async (item: NewsOfTheDay) => {
    try {
      await fetch(`/api/news/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_published: !item.is_published }),
      });
      fetchData();
    } catch (error) {
      console.error('Error toggling news:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      ...formData,
      featured_image_url: formData.featured_image_url || null,
      publish_date: formData.publish_date,
    };

    try {
      if (selectedNews) {
        await fetch(`/api/news/${selectedNews.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch('/api/news', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error saving news:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedNews) return;
    
    try {
      await fetch(`/api/news/${selectedNews.id}`, {
        method: 'DELETE',
      });
      setIsDeleteOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error deleting news:', error);
    }
  };

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Newspaper className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">News</h1>
            <p className="text-gray-500">Manage news and announcements</p>
          </div>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Add News
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search news..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* News List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex gap-4">
                <div className="h-24 w-32 bg-gray-200 rounded-lg flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredNews.length === 0 ? (
        <Card className="text-center py-12">
          <Newspaper className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No news articles</p>
          <Button onClick={handleCreateClick} className="mt-4">
            <Plus className="h-4 w-4" />
            Add First Article
          </Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNews.map((item) => (
            <Card key={item.id} className={cn(!item.is_published && 'opacity-60')}>
              <div className="flex gap-4">
                {item.featured_image_url && (
                  <img
                    src={item.featured_image_url}
                    alt=""
                    className="h-24 w-32 object-cover rounded-lg flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mt-1">
                        {item.content}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => handleToggleActive(item)}
                        className={cn(
                          'p-2 rounded-lg transition-colors',
                          item.is_published
                            ? 'text-green-600 hover:bg-green-50'
                            : 'text-gray-400 hover:bg-gray-100'
                        )}
                        title={item.is_published ? 'Published' : 'Hidden'}
                      >
                        {item.is_published ? (
                          <Eye className="h-4 w-4" />
                        ) : (
                          <EyeOff className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(item)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mt-3">
                    <Badge variant={item.is_published ? 'success' : 'default'}>
                      {item.is_published ? 'Published' : 'Hidden'}
                    </Badge>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {getRelativeTime(item.created_at)}
                    </span>
                    {/* Priority removed: not present in NewsOfTheDay */}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedNews ? 'Edit News' : 'Add News'}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            placeholder="Enter news title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={5}
              placeholder="Enter news content..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>
          <Input
            label="Image URL"
            type="url"
            placeholder="https://..."
            value={formData.featured_image_url}
            onChange={(e) => setFormData({ ...formData, featured_image_url: e.target.value })}
          />
          <Input
            label="Publish Date"
            type="date"
            value={formData.publish_date}
            onChange={(e) => setFormData({ ...formData, publish_date: e.target.value })}
          />
          {formData.featured_image_url && (
            <div className="relative">
              <img
                src={formData.featured_image_url}
                alt="Preview"
                className="h-32 w-full object-cover rounded-lg"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            {/* Priority input removed: not present in NewsOfTheDay */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <label className="flex items-center gap-2 h-10">
                <input
                  type="checkbox"
                  checked={formData.is_published}
                  onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                  className="h-4 w-4 text-blue-600 rounded border-gray-300"
                />
                <span className="text-sm text-gray-600">Published</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedNews ? 'Update' : 'Publish'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete News"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>"{selectedNews?.title}"</strong>?
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
