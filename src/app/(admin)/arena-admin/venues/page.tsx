'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Button, Card, Input, Modal, Badge } from '@/components/ui';
import { Plus, Search, Edit2, Trash2, MapPin, Building } from 'lucide-react';
import type { Venue } from '@/lib/database.types';

export default function VenuesPage() {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState<Venue | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: 0,
  });

  const fetchData = async () => {
    const supabase = getSupabaseClient();
    const { data } = await supabase
      .from('venues')
      .select('*')
      .order('name');

    if (data) setVenues(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClick = () => {
    setSelectedVenue(null);
    setFormData({ name: '', location: '', capacity: 0 });
    setIsFormOpen(true);
  };

  const handleEditClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setFormData({
      name: venue.name,
      location: venue.location || '',
      capacity: venue.capacity || 0,
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (venue: Venue) => {
    setSelectedVenue(venue);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      name: formData.name,
      location: formData.location || null,
      capacity: formData.capacity || null,
    };

    try {
      if (selectedVenue) {
        const res = await fetch(`/api/venues/${selectedVenue.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to update venue');
      } else {
        const res = await fetch('/api/venues', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error('Failed to create venue');
      }

      setIsFormOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedVenue) return;
    
    try {
      const res = await fetch(`/api/venues/${selectedVenue.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete venue');
      setIsDeleteOpen(false);
      fetchData();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const filteredVenues = venues.filter(venue =>
    venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (venue.location || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-teal-100 rounded-lg">
            <MapPin className="h-6 w-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Venues</h1>
            <p className="text-gray-500">Manage match venues</p>
          </div>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Add Venue
        </Button>
      </div>

      {/* Search */}
      <Card>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search venues..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Venues Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 w-24 bg-gray-200 rounded"></div>
            </Card>
          ))}
        </div>
      ) : filteredVenues.length === 0 ? (
        <Card className="text-center py-12">
          <Building className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No venues found</p>
          <Button onClick={handleCreateClick} className="mt-4">
            <Plus className="h-4 w-4" />
            Add First Venue
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredVenues.map((venue) => (
            <Card key={venue.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">{venue.name}</h3>
                  {venue.location && (
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3" />
                      {venue.location}
                    </p>
                  )}
                  {venue.capacity && venue.capacity > 0 && (
                    <Badge variant="default" className="mt-2">
                      Capacity: {venue.capacity.toLocaleString()}
                    </Badge>
                  )}
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditClick(venue)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(venue)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
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
        title={selectedVenue ? 'Edit Venue' : 'Add Venue'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Venue Name"
            placeholder="Enter venue name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Location"
            placeholder="e.g., Main Campus, Sports Complex"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />
          <Input
            label="Capacity"
            type="number"
            min={0}
            placeholder="Seating capacity"
            value={formData.capacity || ''}
            onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedVenue ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Venue"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{selectedVenue?.name}</strong>?
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
