'use client';

import { useState, useEffect } from 'react';
import { Button, Card, Input, Badge, Modal } from '@/components/ui';
import { Plus, Search, Edit2, Trash2, Trophy, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Sport } from '@/lib/database.types';

export default function SportsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState<Sport | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    icon: 'Trophy',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const fetchSports = async () => {
    try {
      const res = await fetch('/api/sports');
      const data = await res.json();
      if (Array.isArray(data)) {
        setSports(data);
      }
    } catch (error) {
      console.error('Error fetching sports:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSports();
  }, []);

  const handleCreateClick = () => {
    setSelectedSport(null);
    setFormData({ name: '', slug: '', icon: 'Trophy', is_active: true });
    setIsFormOpen(true);
  };

  const handleEditClick = (sport: Sport) => {
    setSelectedSport(sport);
    setFormData({
      name: sport.name,
      slug: sport.slug,
      icon: sport.icon || 'Trophy',
      is_active: sport.is_active,
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (sport: Sport) => {
    setSelectedSport(sport);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const sportData = {
      name: formData.name,
      slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
      icon: formData.icon,
      is_active: formData.is_active,
    };

    try {
      let res;
      if (selectedSport) {
        res = await fetch('/api/sports', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: selectedSport.id, ...sportData }),
        });
      } else {
        res = await fetch('/api/sports', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(sportData),
        });
      }

      const result = await res.json();
      
      if (!res.ok) {
        throw new Error(result.error || 'Failed to save');
      }

      setIsFormOpen(false);
      setSelectedSport(null);
      fetchSports();
    } catch (error: any) {
      console.error('Error saving sport:', error);
      alert(`Error: ${error.message}`);
    }
    
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!selectedSport) return;
    
    try {
      const res = await fetch(`/api/sports?id=${selectedSport.id}`, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        const result = await res.json();
        throw new Error(result.error || 'Failed to delete');
      }
    } catch (error: any) {
      console.error('Error deleting sport:', error);
      alert(`Error: ${error.message}`);
    }
    
    setIsDeleteOpen(false);
    setSelectedSport(null);
    fetchSports();
  };

  const filteredSports = sports.filter(sport =>
    sport.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sport.slug.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSportColor = (slug: string) => {
    const colors: Record<string, string> = {
      tabletennis: 'bg-amber-100 text-amber-800 border-amber-200',
      football: 'bg-blue-100 text-blue-800 border-blue-200',
      basketball: 'bg-orange-100 text-orange-800 border-orange-200',
      badminton: 'bg-purple-100 text-purple-800 border-purple-200',
      volleyball: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    };
    return colors[slug] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sports</h1>
          <p className="text-gray-500">Manage sports categories</p>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4 mr-2" />
          Add Sport
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search sports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </Card>

      {/* Sports List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}>
              <div className="p-6 animate-pulse">
                <div className="h-12 w-12 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-5 bg-gray-200 rounded w-24 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-16"></div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredSports.length === 0 ? (
        <Card>
          <div className="p-12 text-center">
            <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No sports found</h3>
            <p className="text-gray-500 mb-4">
              {searchQuery ? 'Try adjusting your search' : 'Get started by adding a sport'}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateClick}>
                <Plus className="h-4 w-4 mr-2" />
                Add Sport
              </Button>
            )}
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSports.map((sport) => (
            <Card key={sport.id} className="hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={cn(
                    'p-3 rounded-lg border',
                    getSportColor(sport.slug)
                  )}>
                    <Trophy className="h-6 w-6" />
                  </div>
                  <Badge variant={sport.is_active ? 'success' : 'default'}>
                    {sport.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                  {sport.name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">/{sport.slug}</p>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditClick(sport)}
                    className="flex-1"
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteClick(sport)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedSport ? 'Edit Sport' : 'Add Sport'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name *
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Table Tennis"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug
            </label>
            <Input
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              placeholder="e.g., tabletennis (auto-generated if empty)"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <Input
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              placeholder="Trophy"
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">
              Active
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsFormOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={saving} className="flex-1">
              {selectedSport ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Sport"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to delete <strong>{selectedSport?.name}</strong>?
            This will also delete all associated teams and fixtures.
          </p>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              className="flex-1"
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
