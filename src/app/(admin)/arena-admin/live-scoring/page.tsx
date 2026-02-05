'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button, Card, Select } from '@/components/ui';
import { LiveScoreEditor } from '@/components/admin';
import { Radio, Play, Square, CheckCircle } from 'lucide-react';
import { formatDate, formatTime, cn } from '@/lib/utils';
import type { FixtureWithDetails, Sport } from '@/lib/database.types';

export default function LiveScoringPage() {
  const [fixtures, setFixtures] = useState<FixtureWithDetails[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<FixtureWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [sportFilter, setSportFilter] = useState('');

  const fetchData = useCallback(async () => {
    try {
      // Fetch sports via API
      const sportsRes = await fetch('/api/sports');
      const sportsData = await sportsRes.json();
      if (Array.isArray(sportsData)) setSports(sportsData);

      // Fetch live and upcoming fixtures via API
      const fixturesRes = await fetch('/api/live?includeUpcoming=true');
      const fixturesData = await fixturesRes.json();

      if (Array.isArray(fixturesData)) {
        let formatted = fixturesData.map((d: any) => ({
          ...d,
          live_score: Array.isArray(d.live_score) ? d.live_score[0] : d.live_score
        })) as FixtureWithDetails[];
        
        // Apply sport filter client-side
        if (sportFilter) {
          formatted = formatted.filter(f => f.sport_id === sportFilter);
        }
        
        setFixtures(formatted);
        
        // If we have a selected fixture, refresh it
        if (selectedFixture) {
          const updated = formatted.find(f => f.id === selectedFixture.id);
          if (updated) setSelectedFixture(updated);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLoading(false);
  }, [sportFilter, selectedFixture?.id]);

  useEffect(() => {
    fetchData();
    // No auto-refresh. Only manual refresh via button.
  }, [fetchData]);

  const handleStatusChange = async (fixtureId: string, newStatus: string) => {
    const updateData: Record<string, unknown> = { status: newStatus };
    
    if (newStatus === 'completed') {
      updateData.winner_id = null;
    }

    try {
      await fetch(`/api/fixtures/${fixtureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      });
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleSetWinner = async (fixtureId: string, winnerId: string | null, isDraw: boolean) => {
    try {
      await fetch(`/api/fixtures/${fixtureId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          winner_id: winnerId,
          is_draw: isDraw,
          status: 'completed',
        }),
      });
      fetchData();
    } catch (error) {
      console.error('Error setting winner:', error);
    }
  };

  const liveFixtures = fixtures.filter(f => f.status === 'live');
  const upcomingFixtures = fixtures.filter(f => f.status === 'upcoming');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="h-8 w-8 text-red-500" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Live Scoring</h1>
            <p className="text-gray-500">Update scores in real-time</p>
          </div>
        </div>

        <Select
          options={[
            { value: '', label: 'All Sports' },
            ...sports.map(s => ({ value: s.id, label: s.name }))
          ]}
          value={sportFilter}
          onChange={(e) => setSportFilter(e.target.value)}
          className="w-48"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fixtures List */}
        <div className="lg:col-span-1 space-y-4">
          {/* Live Matches */}
          {liveFixtures.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </span>
                Live Now ({liveFixtures.length})
              </h2>
              <div className="space-y-2">
                {liveFixtures.map((fixture) => (
                  <button
                    key={fixture.id}
                    onClick={() => setSelectedFixture(fixture)}
                    className={cn(
                      'w-full p-3 bg-white rounded-lg border text-left transition-all',
                      selectedFixture?.id === fixture.id
                        ? 'border-red-500 ring-2 ring-red-500/20'
                        : 'border-gray-200 hover:border-gray-300'
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{fixture.sport.name}</span>
                      <span className="text-xs px-1.5 py-0.5 bg-red-100 text-red-600 rounded">LIVE</span>
                    </div>
                    <p className="font-medium text-gray-900">
                      {fixture.team_a.short_name} vs {fixture.team_b.short_name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Matches */}
          {upcomingFixtures.length > 0 && (
            <div>
              <h2 className="text-sm font-semibold text-blue-600 mb-2">
                Upcoming ({upcomingFixtures.length})
              </h2>
              <div className="space-y-2">
                {upcomingFixtures.slice(0, 10).map((fixture) => (
                  <div
                    key={fixture.id}
                    className="p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-gray-500">{fixture.sport.name}</span>
                      <span className="text-xs text-gray-400">
                        {formatDate(fixture.match_date)}
                      </span>
                    </div>
                    <p className="font-medium text-gray-900 mb-2">
                      {fixture.team_a.short_name} vs {fixture.team_b.short_name}
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStatusChange(fixture.id, 'live')}
                      className="w-full"
                    >
                      <Play className="h-3 w-3" />
                      Start Match
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {fixtures.length === 0 && !loading && (
            <div className="text-center py-12 text-gray-500">
              <Radio className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p>No matches to score</p>
            </div>
          )}
        </div>

        {/* Score Editor */}
        <div className="lg:col-span-2">
          {selectedFixture ? (
            <div className="space-y-4">
              <LiveScoreEditor
                fixture={selectedFixture}
                onUpdate={fetchData}
              />

              {/* Match Controls */}
              <Card>
                <h3 className="font-semibold text-gray-900 mb-4">Match Controls</h3>
                <div className="flex flex-wrap gap-3">
                  {selectedFixture.status === 'live' && (
                    <>
                      <Button
                        variant="danger"
                        onClick={() => handleStatusChange(selectedFixture.id, 'upcoming')}
                      >
                        <Square className="h-4 w-4" />
                        Pause Match
                      </Button>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const choice = prompt(
                            'Enter winner:\n1 - ' + selectedFixture.team_a.name + 
                            '\n2 - ' + selectedFixture.team_b.name + 
                            '\n3 - Draw'
                          );
                          if (choice === '1') {
                            handleSetWinner(selectedFixture.id, selectedFixture.team_a_id, false);
                          } else if (choice === '2') {
                            handleSetWinner(selectedFixture.id, selectedFixture.team_b_id, false);
                          } else if (choice === '3') {
                            handleSetWinner(selectedFixture.id, null, true);
                          }
                        }}
                      >
                        <CheckCircle className="h-4 w-4" />
                        End Match
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            </div>
          ) : (
            <Card className="flex items-center justify-center h-64">
              <div className="text-center text-gray-500">
                <Radio className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                <p>Select a match to update scores</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
