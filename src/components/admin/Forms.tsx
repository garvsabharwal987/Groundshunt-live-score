'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Select, Modal } from '@/components/ui';
import { X, Plus, Trash2, AlertCircle } from 'lucide-react';
import { SPORTS_CONFIG } from '@/lib/constants';
import type { Sport, Team, Venue, Fixture } from '@/lib/database.types';

interface FixtureFormProps {
  fixture?: Fixture | null;
  onClose: () => void;
  onSave: () => void;
}

export function FixtureForm({ fixture, onClose, onSave }: FixtureFormProps) {
  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [venues, setVenues] = useState<Venue[]>([]);

  const [formData, setFormData] = useState({
    sport_id: fixture?.sport_id || '',
    team_a_id: fixture?.team_a_id || '',
    team_b_id: fixture?.team_b_id || '',
    venue_id: fixture?.venue_id || '',
    match_date: fixture?.match_date || '',
    match_time: fixture?.match_time || '',
    status: fixture?.status || 'upcoming',
    round: fixture?.round || '',
    match_number: fixture?.match_number?.toString() || '',
    winner_id: fixture?.winner_id || '',
    is_draw: fixture?.is_draw || false,
    enable_live_scoring: fixture?.enable_live_scoring !== undefined ? fixture.enable_live_scoring : true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sportsRes, venuesRes] = await Promise.all([
          fetch('/api/sports'),
          fetch('/api/venues'),
        ]);

        const sportsData = await sportsRes.json();
        const venuesData = await venuesRes.json();

        if (Array.isArray(sportsData)) setSports(sportsData);
        if (Array.isArray(venuesData)) setVenues(venuesData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Fetch teams when sport changes
  useEffect(() => {
    const fetchTeams = async () => {
      if (!formData.sport_id) {
        setTeams([]);
        return;
      }

      try {
        const res = await fetch(`/api/teams?sport_id=${formData.sport_id}`);
        const data = await res.json();
        if (Array.isArray(data)) setTeams(data);
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    fetchTeams();
  }, [formData.sport_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const data = {
      sport_id: formData.sport_id,
      team_a_id: formData.team_a_id,
      team_b_id: formData.team_b_id,
      venue_id: formData.venue_id || null,
      match_date: formData.match_date,
      match_time: formData.match_time,
      status: formData.status,
      round: formData.round || null,
      match_number: formData.match_number ? parseInt(formData.match_number) : null,
      winner_id: formData.winner_id || null,
      is_draw: formData.is_draw,
      enable_live_scoring: formData.enable_live_scoring,
    };

    try {
      if (fixture) {
        await fetch(`/api/fixtures/${fixture.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      } else {
        await fetch('/api/fixtures', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
      }
      onSave();
      onClose();
    } catch (error) {
      console.error('Error saving fixture:', error);
    }

    setLoading(false);
  };

  const filteredTeamsB = teams.filter(t => t.id !== formData.team_a_id);

  return (
    <Modal
      isOpen
      onClose={onClose || (() => {})}
      title={fixture ? 'Edit Fixture' : 'Create Fixture'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Sport"
          options={sports.map(s => ({ value: s.id, label: s.name }))}
          value={formData.sport_id}
          onChange={(e) => setFormData({ ...formData, sport_id: e.target.value, team_a_id: '', team_b_id: '' })}
          placeholder="Select sport"
          required
        />

        {/* Sport Scoring Rules */}
        {formData.sport_id && sports.length > 0 && (() => {
          const selectedSport = sports.find(s => s.id === formData.sport_id);
          const sportConfig = selectedSport ? SPORTS_CONFIG[selectedSport.slug as keyof typeof SPORTS_CONFIG] : null;
          return sportConfig ? (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-200 mb-1">Scoring Rule</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-300">{sportConfig.description}</p>
                  <div className="mt-2 text-xs text-blue-700 dark:text-blue-400">
                    <p className="font-medium mb-1">Score Fields:</p>
                    <div className="flex flex-wrap gap-2">
                      {sportConfig.scoreFields?.map((field: any) => (
                        <span key={field.key} className="bg-white dark:bg-slate-700 px-2 py-1 rounded">
                          {field.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : null;
        })()}

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Team A"
            options={teams.map(t => ({ value: t.id, label: t.name }))}
            value={formData.team_a_id}
            onChange={(e) => setFormData({ ...formData, team_a_id: e.target.value })}
            placeholder="Select team"
            disabled={!formData.sport_id}
            required
          />

          <Select
            label="Team B"
            options={filteredTeamsB.map(t => ({ value: t.id, label: t.name }))}
            value={formData.team_b_id}
            onChange={(e) => setFormData({ ...formData, team_b_id: e.target.value })}
            placeholder="Select team"
            disabled={!formData.sport_id}
            required
          />
        </div>

        <Select
          label="Venue"
          options={venues.map(v => ({ value: v.id, label: v.name }))}
          value={formData.venue_id}
          onChange={(e) => setFormData({ ...formData, venue_id: e.target.value })}
          placeholder="Select venue (optional)"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Date"
            type="date"
            value={formData.match_date}
            onChange={(e) => setFormData({ ...formData, match_date: e.target.value })}
            required
          />

          <Input
            label="Time"
            type="time"
            value={formData.match_time}
            onChange={(e) => setFormData({ ...formData, match_time: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Status"
            options={[
              { value: 'upcoming', label: 'Upcoming' },
              { value: 'live', label: 'Live' },
              { value: 'completed', label: 'Completed' },
              { value: 'cancelled', label: 'Cancelled' },
              { value: 'postponed', label: 'Postponed' },
            ]}
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
          />

          <Input
            label="Round"
            placeholder="e.g., Quarter Final"
            value={formData.round}
            onChange={(e) => setFormData({ ...formData, round: e.target.value })}
          />
        </div>

        <Input
          label="Match Number"
          type="number"
          placeholder="e.g., 1"
          value={formData.match_number}
          onChange={(e) => setFormData({ ...formData, match_number: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-4">
          <Select
            label="Winner"
            options={[
              { value: '', label: 'No winner selected' },
              ...(formData.team_a_id && formData.team_b_id ? [
                { value: formData.team_a_id, label: teams.find(t => t.id === formData.team_a_id)?.name || 'Team A' },
                { value: formData.team_b_id, label: teams.find(t => t.id === formData.team_b_id)?.name || 'Team B' },
              ] : []),
            ]}
            value={formData.winner_id}
            onChange={(e) => setFormData({ ...formData, winner_id: e.target.value, is_draw: false })}
            placeholder="Select winner"
            disabled={!formData.team_a_id || !formData.team_b_id}
          />

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.is_draw}
                onChange={(e) => setFormData({ ...formData, is_draw: e.target.checked, winner_id: '' })}
                className="w-4 h-4 rounded border-gray-300"
              />
              <span className="text-sm font-medium text-gray-700">Draw</span>
            </label>
          </div>
        </div>

        {/* Live Scoring Option */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={formData.enable_live_scoring}
              onChange={(e) => setFormData({ ...formData, enable_live_scoring: e.target.checked })}
              className="w-5 h-5 rounded border-gray-300 mt-0.5"
            />
            <div className="flex-1">
              <p className="font-medium text-gray-900 dark:text-white">Enable Live Scoring</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {formData.enable_live_scoring 
                  ? 'Live score updates will be available during the match' 
                  : 'Only final results will be entered'}
              </p>
            </div>
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading}>
            {fixture ? 'Update' : 'Create'} Fixture
          </Button>
        </div>
      </form>
    </Modal>
  );
}

interface TeamFormProps {
  team?: Team | null;
  onClose: () => void;
  onSave: () => void;
}

export function TeamForm({ team, onClose, onSave }: TeamFormProps) {
  const [loading, setLoading] = useState(false);
  const [sports, setSports] = useState<Sport[]>([]);

  const [formData, setFormData] = useState({
    name: team?.name || '',
    short_name: team?.short_name || '',
    sport_id: team?.sport_id || '',
    color_primary: team?.color_primary || '#000000',
    color_secondary: team?.color_secondary || '#FFFFFF',
    logo_url: team?.logo_url || '',
  });

  useEffect(() => {
    const fetchSports = async () => {
      const res = await fetch('/api/sports');
      const data = await res.json();
      if (Array.isArray(data)) setSports(data);
    };
    fetchSports();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let res;
      if (team) {
        res = await fetch(`/api/teams/${team.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      } else {
        res = await fetch('/api/teams', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
      }
      setLoading(false);
      if (!res.ok) {
        const err = await res.json();
        alert('Error saving team: ' + (err.error || res.statusText));
        return;
      }
      onSave();
      onClose();
    } catch (error) {
      setLoading(false);
      const errorMsg = error instanceof Error ? error.message : String(error);
      alert('Error saving team: ' + errorMsg);
    }
  };

  return (
    <Modal
      isOpen
      onClose={onClose || (() => {})}
      title={team ? 'Edit Team' : 'Create Team'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Select
          label="Sport"
          options={sports.map(s => ({ value: s.id, label: s.name }))}
          value={formData.sport_id}
          onChange={(e) => setFormData({ ...formData, sport_id: e.target.value })}
          placeholder="Select sport"
          required
        />

        <Input
          label="Team Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Mumbai Indians"
          required
        />

        <Input
          label="Short Name"
          value={formData.short_name}
          onChange={(e) => setFormData({ ...formData, short_name: e.target.value.toUpperCase().slice(0, 10) })}
          placeholder="e.g., MI"
          maxLength={10}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Primary Color
            </label>
            <input
              type="color"
              value={formData.color_primary}
              onChange={(e) => setFormData({ ...formData, color_primary: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Secondary Color
            </label>
            <input
              type="color"
              value={formData.color_secondary}
              onChange={(e) => setFormData({ ...formData, color_secondary: e.target.value })}
              className="w-full h-10 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        <Input
          label="Logo URL (optional)"
          value={formData.logo_url}
          onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
          placeholder="https://..."
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={loading} variant="primary">
            {team ? 'Update' : 'Create'} Team
          </Button>
        </div>
      </form>
    </Modal>
  );
}
