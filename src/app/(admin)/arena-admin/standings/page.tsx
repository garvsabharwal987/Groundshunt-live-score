'use client';

import { useState, useEffect } from 'react';
import { getSupabaseClient } from '@/lib/supabase/client';
import { Button, Card, Input, Modal, Select } from '@/components/ui';
import { Plus, Search, Edit2, Trash2, Trophy, Medal, TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Sport, Team, PointsTableEntry } from '@/lib/database.types';

type PointsTableWithTeam = PointsTableEntry & { team: Team };

export default function StandingsPage() {
  const [standings, setStandings] = useState<PointsTableWithTeam[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSport, setSelectedSport] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<PointsTableWithTeam | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    team_id: '',
    sport_id: '',
    group_name: '',
    played: 0,
    won: 0,
    lost: 0,
    drawn: 0,
    points: 0,
    net_run_rate: 0,
  });

  const fetchData = async () => {
    try {
      // Fetch sports via API
      const sportsRes = await fetch('/api/sports');
      const sportsData = await sportsRes.json();
      if (Array.isArray(sportsData)) {
        setSports(sportsData);
        if (!selectedSport && sportsData.length > 0) {
          setSelectedSport(sportsData[0].id);
        }
      }

      // Fetch teams via API
      const teamsRes = await fetch('/api/teams');
      const teamsData = await teamsRes.json();
      if (Array.isArray(teamsData)) setTeams(teamsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  };

  const fetchStandings = async () => {
    if (!selectedSport) return;

    try {
      const res = await fetch(`/api/standings?sport_id=${selectedSport}`);
      const data = await res.json();
      if (Array.isArray(data)) setStandings(data as PointsTableWithTeam[]);
    } catch (error) {
      console.error('Error fetching standings:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchStandings();
  }, [selectedSport]);

  const handleCreateClick = () => {
    setSelectedEntry(null);
    setFormData({
      team_id: '',
      sport_id: selectedSport,
      group_name: '',
      played: 0,
      won: 0,
      lost: 0,
      drawn: 0,
      points: 0,
      net_run_rate: 0,
    });
    setIsFormOpen(true);
  };

  const handleEditClick = (entry: PointsTableWithTeam) => {
    setSelectedEntry(entry);
    setFormData({
      team_id: entry.team_id,
      sport_id: entry.sport_id,
      group_name: entry.group_name || '',
      played: entry.played,
      won: entry.won,
      lost: entry.lost,
      drawn: entry.drawn,
      points: entry.points,
      net_run_rate: (entry as any).net_run_rate || 0,
    });
    setIsFormOpen(true);
  };

  const handleDeleteClick = (entry: PointsTableWithTeam) => {
    setSelectedEntry(entry);
    setIsDeleteOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const method = selectedEntry ? 'PUT' : 'POST';
      const endpoint = selectedEntry ? `/api/standings/${selectedEntry.id}` : '/api/standings';
      const payload = selectedEntry ? { id: selectedEntry.id, ...formData } : formData;

      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsFormOpen(false);
        fetchStandings();
      }
    } catch (error) {
      console.error('Error submitting standing:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedEntry) return;
    
    try {
      const res = await fetch(`/api/standings/${selectedEntry.id}`, { method: 'DELETE' });
      if (res.ok) {
        setIsDeleteOpen(false);
        fetchStandings();
      }
    } catch (error) {
      console.error('Error deleting standing:', error);
    }
  };

  const handleRecalculate = async () => {
    // This would normally call an API endpoint to recalculate based on fixtures
    alert('Recalculation would happen on the server. This is a placeholder.');
    fetchStandings();
  };

  // Group standings by group_name
  const groupedStandings = standings.reduce((acc, entry) => {
    const group = entry.group_name || 'All Teams';
    if (!acc[group]) acc[group] = [];
    acc[group].push(entry);
    return acc;
  }, {} as Record<string, PointsTableWithTeam[]>);

  const availableTeams = teams.filter(
    t => t.sport_id === selectedSport && 
    !standings.some(s => s.team_id === t.id && (!selectedEntry || s.id !== selectedEntry.id))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-yellow-100 rounded-lg">
            <Trophy className="h-6 w-6 text-yellow-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Standings</h1>
            <p className="text-gray-500">Manage points tables</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleRecalculate}>
            Recalculate
          </Button>
          <Button onClick={handleCreateClick}>
            <Plus className="h-4 w-4" />
            Add Entry
          </Button>
        </div>
      </div>

      {/* Sport Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {sports.map((sport) => (
          <button
            key={sport.id}
            onClick={() => setSelectedSport(sport.id)}
            className={cn(
              'px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
              selectedSport === sport.id
                ? 'bg-gray-900 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            {sport.name}
          </button>
        ))}
      </div>

      {/* Standings Tables */}
      {loading ? (
        <Card className="animate-pulse">
          <div className="h-64 bg-gray-100 rounded"></div>
        </Card>
      ) : standings.length === 0 ? (
        <Card className="text-center py-12">
          <Medal className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No standings data</p>
          <Button onClick={handleCreateClick} className="mt-4">
            <Plus className="h-4 w-4" />
            Add First Entry
          </Button>
        </Card>
      ) : (
        Object.entries(groupedStandings).map(([group, entries]) => (
          <Card key={group}>
            {Object.keys(groupedStandings).length > 1 && (
              <h3 className="font-semibold text-gray-900 mb-4">{group}</h3>
            )}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs text-gray-500 uppercase border-b">
                    <th className="pb-3 pl-2">#</th>
                    <th className="pb-3">Team</th>
                    <th className="pb-3 text-center">P</th>
                    <th className="pb-3 text-center">W</th>
                    <th className="pb-3 text-center">L</th>
                    <th className="pb-3 text-center">D</th>
                    <th className="pb-3 text-center">Pts</th>
                    <th className="pb-3 text-center">NRR</th>
                    <th className="pb-3 text-right pr-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, index) => (
                    <tr 
                      key={entry.id} 
                      className={cn(
                        'border-b last:border-0',
                        index < 2 && 'bg-green-50',
                        index >= entries.length - 2 && entries.length > 4 && 'bg-red-50'
                      )}
                    >
                      <td className="py-3 pl-2">
                        <span className={cn(
                          'font-medium',
                          index === 0 && 'text-yellow-600',
                          index === 1 && 'text-gray-500',
                          index === 2 && 'text-amber-700'
                        )}>
                          {index + 1}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          {entry.team.logo_url ? (
                            <img 
                              src={entry.team.logo_url} 
                              alt="" 
                              className="h-6 w-6 object-contain"
                            />
                          ) : (
                            <div className="h-6 w-6 bg-gray-100 rounded flex items-center justify-center text-xs font-bold">
                              {entry.team.short_name.charAt(0)}
                            </div>
                          )}
                          <span className="font-medium text-gray-900">
                            {entry.team.short_name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-center text-gray-600">{entry.played}</td>
                      <td className="py-3 text-center text-green-600 font-medium">{entry.won}</td>
                      <td className="py-3 text-center text-red-600">{entry.lost}</td>
                      <td className="py-3 text-center text-gray-600">{entry.drawn}</td>
                      <td className="py-3 text-center font-bold text-gray-900">{entry.points}</td>
                      <td className="py-3 text-center">
                        <span className={cn(
                          'flex items-center justify-center gap-1',
                          ((entry as any).net_run_rate || 0) > 0 ? 'text-green-600' : 'text-red-600'
                        )}>
                          {(((entry as any).net_run_rate || 0) > 0) ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {((entry as any).net_run_rate || 0).toFixed(3)}
                        </span>
                      </td>
                      <td className="py-3 pr-2">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleEditClick(entry)}
                            className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(entry)}
                            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ))
      )}

      {/* Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedEntry ? 'Edit Standing' : 'Add Standing'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Select
            label="Team"
            options={[
              { value: '', label: 'Select team' },
              ...(selectedEntry 
                ? [{ value: selectedEntry.team_id, label: selectedEntry.team.name }]
                : []),
              ...availableTeams.map(t => ({ value: t.id, label: t.name }))
            ]}
            value={formData.team_id}
            onChange={(e) => setFormData({ ...formData, team_id: e.target.value })}
            required
          />
          <Input
            label="Group Name (optional)"
            placeholder="e.g., Group A, Pool 1"
            value={formData.group_name}
            onChange={(e) => setFormData({ ...formData, group_name: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Played"
              type="number"
              min={0}
              value={formData.played}
              onChange={(e) => setFormData({ ...formData, played: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Won"
              type="number"
              min={0}
              value={formData.won}
              onChange={(e) => setFormData({ ...formData, won: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Lost"
              type="number"
              min={0}
              value={formData.lost}
              onChange={(e) => setFormData({ ...formData, lost: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Drawn"
              type="number"
              min={0}
              value={formData.drawn}
              onChange={(e) => setFormData({ ...formData, drawn: parseInt(e.target.value) || 0 })}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Points"
              type="number"
              value={formData.points}
              onChange={(e) => setFormData({ ...formData, points: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Net Run Rate"
              type="number"
              step="0.001"
              value={formData.net_run_rate}
              onChange={(e) => setFormData({ ...formData, net_run_rate: parseFloat(e.target.value) || 0 })}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              {selectedEntry ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Entry"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the standing for{' '}
          <strong>{selectedEntry?.team.name}</strong>?
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
