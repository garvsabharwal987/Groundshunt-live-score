'use client';

import { useState, useEffect } from 'react';
// import { getSupabaseClient } from '@/lib/supabase/client';
import { Button, Card, Input, Badge, Modal } from '@/components/ui';
import { TeamForm } from '@/components/admin';
import { Plus, Search, Edit2, Trash2, Users, Shield } from 'lucide-react';
import { cn, capitalize } from '@/lib/utils';
import type { Team, Sport } from '@/lib/database.types';

type TeamWithSport = Team & { sport: Sport };

export default function TeamsPage() {
  const [teams, setTeams] = useState<TeamWithSport[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sportFilter, setSportFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<TeamWithSport | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch sports
      const sportsRes = await fetch('/api/sports');
      const sportsJson = await sportsRes.json();
      setSports(sportsJson || []);

      // Fetch teams
      const teamsRes = await fetch('/api/teams');
      const teamsJson = await teamsRes.json();
      setTeams(teamsJson || []);
    } catch (err) {
      // Optionally handle error
      setSports([]);
      setTeams([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateClick = () => {
    setSelectedTeam(null);
    setIsFormOpen(true);
  };

  const handleEditClick = (team: TeamWithSport) => {
    setSelectedTeam(team);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (team: TeamWithSport) => {
    setSelectedTeam(team);
    setIsDeleteOpen(true);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setSelectedTeam(null);
    fetchData();
  };

  const handleDelete = async () => {
    if (!selectedTeam) return;
    await fetch(`/api/teams/${selectedTeam.id}`, {
      method: 'DELETE',
    });
    setIsDeleteOpen(false);
    setSelectedTeam(null);
    fetchData();
  };

  const filteredTeams = teams.filter(team => {
    const matchesSearch = 
      team.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      team.short_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSport = !sportFilter || team.sport_id === sportFilter;
    return matchesSearch && matchesSport;
  });

  const getSportColor = (sportSlug: string) => {
    const colors: Record<string, string> = {
      tabletennis: 'bg-tabletennis/10 text-tabletennis border-tabletennis/20',
      football: 'bg-football/10 text-football border-football/20',
      basketball: 'bg-basketball/10 text-basketball border-basketball/20',
      badminton: 'bg-badminton/10 text-badminton border-badminton/20',
      volleyball: 'bg-volleyball/10 text-volleyball border-volleyball/20',
    };
    return colors[sportSlug] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Shield className="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teams</h1>
            <p className="text-gray-500">Manage participating teams</p>
          </div>
        </div>
        <Button onClick={handleCreateClick}>
          <Plus className="h-4 w-4" />
          Add Team
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search teams..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
            <button
              onClick={() => setSportFilter('')}
              className={cn(
                'px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
                !sportFilter
                  ? 'bg-gray-900 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              All Sports
            </button>
            {sports.map((sport) => (
              <button
                key={sport.id}
                onClick={() => setSportFilter(sport.id)}
                className={cn(
                  'px-3 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors',
                  sportFilter === sport.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {sport.name}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Teams Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 w-20 bg-gray-200 rounded"></div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredTeams.length === 0 ? (
        <Card className="text-center py-12">
          <Users className="h-12 w-12 mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">No teams found</p>
          <Button onClick={handleCreateClick} className="mt-4">
            <Plus className="h-4 w-4" />
            Add First Team
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTeams.map((team) => (
            <Card key={team.id} className="hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  {team.logo_url ? (
                    <img
                      src={team.logo_url}
                      alt={team.name}
                      className="h-16 w-16 object-contain bg-gray-50 rounded-lg border"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl font-bold text-gray-400">
                        {team.short_name.charAt(0)}
                      </span>
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-900">{team.name}</h3>
                    <p className="text-sm text-gray-500">{team.short_name}</p>
                    <Badge 
                      variant="default" 
                      className={cn('mt-1', getSportColor(team.sport.slug))}
                    >
                      {team.sport.name}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleEditClick(team)}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(team)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
              {(team as any).primary_color && (
                <div className="mt-3 flex items-center gap-2">
                  <div 
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: (team as any).primary_color }}
                  />
                  <div 
                    className="h-4 w-4 rounded-full border"
                    style={{ backgroundColor: (team as any).secondary_color || '#ffffff' }}
                  />
                  <span className="text-xs text-gray-400">Team Colors</span>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {sports.map((sport) => {
          const count = teams.filter(t => t.sport_id === sport.id).length;
          return (
            <Card key={sport.id} className="text-center">
              <p className="text-2xl font-bold text-gray-900">{count}</p>
              <p className="text-sm text-gray-500">{sport.name}</p>
            </Card>
          );
        })}
      </div>

      {/* Team Form Modal */}
      <Modal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={selectedTeam ? 'Edit Team' : 'Add Team'}
        size="lg"
      >
        <TeamForm
          team={selectedTeam || undefined}
          onSave={fetchData}
          onClose={() => setIsFormOpen(false)}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Delete Team"
      >
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete <strong>{selectedTeam?.name}</strong>? 
          This action cannot be undone.
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
