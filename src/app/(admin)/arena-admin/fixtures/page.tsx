'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Card, StatusBadge, PillTabs } from '@/components/ui';
import { FixtureForm } from '@/components/admin';
import { Plus, Edit2, Trash2, Calendar, Search, Radio } from 'lucide-react';
import { formatDate, formatTime } from '@/lib/utils';
import type { FixtureWithDetails, Sport } from '@/lib/database.types';

export default function AdminFixturesPage() {
  const [fixtures, setFixtures] = useState<FixtureWithDetails[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFixture, setEditingFixture] = useState<FixtureWithDetails | null>(null);
  const [activeStatus, setActiveStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      // Fetch sports via API
      const sportsRes = await fetch('/api/sports');
      const sportsData = await sportsRes.json();
      if (Array.isArray(sportsData)) setSports(sportsData);

      // Fetch fixtures via API
      const statusParam = activeStatus !== 'all' ? `?status=${activeStatus}` : '';
      const fixturesRes = await fetch(`/api/fixtures${statusParam}`);
      const fixturesData = await fixturesRes.json();

      if (Array.isArray(fixturesData)) {
        const formatted = fixturesData.map((d: any) => ({
          ...d,
          live_score: Array.isArray(d.live_score) ? d.live_score[0] : d.live_score
        })) as FixtureWithDetails[];
        setFixtures(formatted);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  }, [activeStatus]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fixture?')) return;

    try {
      await fetch(`/api/fixtures/${id}`, { method: 'DELETE' });
      fetchData();
    } catch (error) {
      console.error('Error deleting fixture:', error);
    }
  };

  const filteredFixtures = fixtures.filter(fixture => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      fixture.team_a.name.toLowerCase().includes(query) ||
      fixture.team_b.name.toLowerCase().includes(query) ||
      fixture.sport.name.toLowerCase().includes(query) ||
      fixture.pool?.toLowerCase().includes(query) ||
      fixture.college_name?.toLowerCase().includes(query)
    );
  });

  const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'live', label: 'Live' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fixtures</h1>
          <p className="text-gray-500">Manage matches and fixtures</p>
        </div>
        <Button onClick={() => { setEditingFixture(null); setShowForm(true); }}>
          <Plus className="h-4 w-4" />
          Add Fixture
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <PillTabs
          tabs={statusTabs}
          activeTab={activeStatus}
          onTabChange={setActiveStatus}
        />
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search fixtures..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
      </div>

      {/* Fixtures Table */}
      <Card padding="none">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Match</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Sport</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Date & Time</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-gray-700">Details</th>
                <th className="px-4 py-3 text-center font-semibold text-gray-700">Live Scoring</th>
                <th className="px-4 py-3 text-right font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-gray-100">
                    <td colSpan={7} className="px-4 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  </tr>
                ))
              ) : filteredFixtures.length > 0 ? (
                filteredFixtures.map((fixture) => (
                  <tr key={fixture.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: fixture.team_a.color_primary || '#6b7280' }}
                        >
                          {fixture.team_a.short_name.charAt(0)}
                        </span>
                        <div className="text-sm">
                          <div className="font-medium">
                            {fixture.team_a.short_name} vs {fixture.team_b.short_name}
                          </div>
                          {(fixture.team_a.college_name || fixture.team_b.college_name) && (
                            <div className="text-xs text-gray-500">
                              {fixture.team_a.college_name && fixture.team_b.college_name 
                                ? `${fixture.team_a.college_name} vs ${fixture.team_b.college_name}`
                                : fixture.team_a.college_name || fixture.team_b.college_name
                              }
                            </div>
                          )}
                        </div>
                        <span
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                          style={{ backgroundColor: fixture.team_b.color_primary || '#6b7280' }}
                        >
                          {fixture.team_b.short_name.charAt(0)}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-600">{fixture.sport.name}</td>
                    <td className="px-4 py-4 text-gray-600">
                      <div>
                        <p>{formatDate(fixture.match_date)}</p>
                        <p className="text-xs text-gray-400">{formatTime(fixture.match_time)}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusBadge status={fixture.status} />
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-600">
                      <div className="space-y-1">
                        {fixture.round && <p className="font-medium">{fixture.round}</p>}
                        {fixture.table_number && <p className="text-xs">Table: {fixture.table_number}</p>}
                        {fixture.pool && <p className="text-xs">Pool: {fixture.pool}</p>}
                        {fixture.college_name && <p className="text-xs">College: {fixture.college_name}</p>}
                        {!fixture.round && !fixture.table_number && !fixture.pool && !fixture.college_name && <p>-</p>}
                      </div>
                    </td>
                    <td className="px-4 py-4 text-center">
                      {fixture.enable_live_scoring ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                          <Radio className="h-3 w-3" />
                          Enabled
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                          <span className="h-3 w-3 rounded-full bg-gray-400"></span>
                          Direct
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => { setEditingFixture(fixture); setShowForm(true); }}
                          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(fixture.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                    <p>No fixtures found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Form Modal */}
      {showForm && (
        <FixtureForm
          fixture={editingFixture}
          onClose={() => { setShowForm(false); setEditingFixture(null); }}
          onSave={fetchData}
        />
      )}
    </div>
  );
}
