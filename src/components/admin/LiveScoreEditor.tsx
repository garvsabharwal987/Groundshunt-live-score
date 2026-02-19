'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Card } from '@/components/ui';
import { cn, getSportColorClasses, getBaseSportSlug } from '@/lib/utils';
import { SPORTS_CONFIG } from '@/lib/constants';
import { Save, RefreshCw, Plus, Minus, Radio } from 'lucide-react';
import type { FixtureWithDetails, LiveScore } from '@/lib/database.types';

interface LiveScoreEditorProps {
  fixture: FixtureWithDetails;
  onUpdate: () => void;
}

export function LiveScoreEditor({ fixture, onUpdate }: LiveScoreEditorProps) {
  const [loading, setLoading] = useState(false);
  const [teamAScore, setTeamAScore] = useState<Record<string, number>>({});
  const [teamBScore, setTeamBScore] = useState<Record<string, number>>({});
  const [currentPeriod, setCurrentPeriod] = useState('');
  const [elapsedTime, setElapsedTime] = useState('');
  const [lastEvent, setLastEvent] = useState('');

  const sportSlug = fixture.sport?.slug || '';
  const baseSportSlug = getBaseSportSlug(sportSlug) as keyof typeof SPORTS_CONFIG;
  const sportConfig = SPORTS_CONFIG[baseSportSlug];
  const sportColors = getSportColorClasses(sportSlug);

  useEffect(() => {
    if (fixture.live_score) {
      setTeamAScore(fixture.live_score.team_a_score as Record<string, number> || {});
      setTeamBScore(fixture.live_score.team_b_score as Record<string, number> || {});
      setCurrentPeriod(fixture.live_score.current_period || '');
      setElapsedTime(fixture.live_score.elapsed_time || '');
      setLastEvent(fixture.live_score.last_event || '');
    }
  }, [fixture]);

  const handleSave = async () => {
    setLoading(true);

    try {
      await fetch(`/api/live/${fixture.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_a_score: teamAScore,
          team_b_score: teamBScore,
          current_period: currentPeriod,
          elapsed_time: elapsedTime,
          last_event: lastEvent,
        }),
      });
      onUpdate();
    } catch (error) {
      console.error('Error saving score:', error);
    }

    setLoading(false);
  };

  const updateScore = (team: 'a' | 'b', field: string, delta: number) => {
    if (team === 'a') {
      setTeamAScore(prev => ({
        ...prev,
        [field]: Math.max(0, (prev[field] || 0) + delta)
      }));
    } else {
      setTeamBScore(prev => ({
        ...prev,
        [field]: Math.max(0, (prev[field] || 0) + delta)
      }));
    }
  };

  const setScoreValue = (team: 'a' | 'b', field: string, value: number) => {
    if (team === 'a') {
      setTeamAScore(prev => ({ ...prev, [field]: value }));
    } else {
      setTeamBScore(prev => ({ ...prev, [field]: value }));
    }
  };

  // Show all score fields including summary fields
  const scoreFields = sportConfig?.scoreFields || [];

  const renderScoreField = (team: 'a' | 'b', fieldObj: any) => {
    const fieldKey = fieldObj.key || fieldObj;
    const fieldLabel = fieldObj.label || fieldObj.replace(/_/g, ' ');
    const score = team === 'a' ? teamAScore : teamBScore;
    const value = score[fieldKey] || 0;

    return (
      <div key={fieldKey} className="flex items-center gap-2">
        <label className="text-sm font-medium text-gray-600 capitalize w-20">
          {fieldLabel}
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => updateScore(team, fieldKey, -1)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            value={value}
            onChange={(e) => setScoreValue(team, fieldKey, parseInt(e.target.value) || 0)}
            className="w-16 text-center font-mono font-bold text-lg border border-gray-300 rounded-lg py-1"
          />
          <button
            type="button"
            onClick={() => updateScore(team, fieldKey, 1)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <div className={cn('px-4 py-3 flex items-center justify-between', sportColors.bg)}>
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-red-500" />
          <span className={cn('font-semibold', sportColors.text)}>
            Live Score Editor - {fixture.sport?.name}
          </span>
        </div>
        {fixture.status === 'live' && (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            LIVE
          </span>
        )}
      </div>

      <div className="p-6">
        {/* Teams Header */}
        <div className="grid grid-cols-2 gap-8 mb-6">
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2"
              style={{ backgroundColor: fixture.team_a?.color_primary || '#6b7280' }}
            >
              {fixture.team_a?.short_name?.charAt(0)}
            </div>
            <h3 className="font-semibold text-gray-900">{fixture.team_a?.name}</h3>
          </div>
          <div className="text-center">
            <div
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center text-2xl font-bold text-white mb-2"
              style={{ backgroundColor: fixture.team_b?.color_primary || '#6b7280' }}
            >
              {fixture.team_b?.short_name?.charAt(0)}
            </div>
            <h3 className="font-semibold text-gray-900">{fixture.team_b?.name}</h3>
          </div>
        </div>

        {/* Score Fields */}
        {scoreFields.length > 0 && (
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div className="space-y-3">
              {scoreFields.map((field: any) => renderScoreField('a', field))}
            </div>
            <div className="space-y-3">
              {scoreFields.map((field: any) => renderScoreField('b', field))}
            </div>
          </div>
        )}

        {/* Match Info */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Input
            label="Current Period"
            value={currentPeriod}
            onChange={(e) => setCurrentPeriod(e.target.value)}
            placeholder="e.g., 1st Innings, 2nd Half"
          />
          <Input
            label="Elapsed Time"
            value={elapsedTime}
            onChange={(e) => setElapsedTime(e.target.value)}
            placeholder="e.g., 45:00, 15.3 overs"
          />
        </div>

        {/* Last Event */}
        <div className="mb-6">
          <Input
            label="Last Event"
            value={lastEvent}
            onChange={(e) => setLastEvent(e.target.value)}
            placeholder="e.g., GOAL! Player X scores from 20 yards"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onUpdate}>
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button onClick={handleSave} isLoading={loading} variant="primary" size="lg">
            <Save className="h-5 w-5 mr-2" />
            <span className="font-bold">Update Score</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}

interface QuickScoreButtonsProps {
  sportSlug: string;
  onQuickScore: (team: 'a' | 'b', action: string, value: number) => void;
}

export function QuickScoreButtons({ sportSlug, onQuickScore }: QuickScoreButtonsProps) {
  const baseSportSlug = getBaseSportSlug(sportSlug);
  
  const quickActions: Record<string, { label: string; actions: { name: string; field: string; value: number }[] }> = {
    tabletennis: {
      label: 'Table Tennis',
      actions: [
        { name: '+1', field: 'set1', value: 1 },
        { name: '+2', field: 'set1', value: 2 },
        { name: '+3', field: 'set1', value: 3 },
        { name: 'Set Won', field: 'sets_won', value: 1 },
      ],
    },
    football: {
      label: 'Football',
      actions: [
        { name: 'Goal', field: 'goals', value: 1 },
      ],
    },
    basketball: {
      label: 'Basketball',
      actions: [
        { name: '1pt', field: 'total', value: 1 },
        { name: '2pt', field: 'total', value: 2 },
        { name: '3pt', field: 'total', value: 3 },
      ],
    },
    badminton: {
      label: 'Badminton',
      actions: [
        { name: '+1', field: 'set1', value: 1 },
      ],
    },
    volleyball: {
      label: 'Volleyball',
      actions: [
        { name: '+1', field: 'set1', value: 1 },
      ],
    },
  };

  const config = quickActions[baseSportSlug];
  if (!config) return null;

  return (
    <div className="space-y-4">
      <h4 className="font-medium text-gray-700">Quick Score</h4>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Team A</p>
          <div className="flex flex-wrap gap-2">
            {config.actions.map((action) => (
              <button
                key={action.name}
                onClick={() => onQuickScore('a', action.field, action.value)}
                className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition-colors"
              >
                {action.name}
              </button>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-500">Team B</p>
          <div className="flex flex-wrap gap-2">
            {config.actions.map((action) => (
              <button
                key={action.name}
                onClick={() => onQuickScore('b', action.field, action.value)}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 font-medium transition-colors"
              >
                {action.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
