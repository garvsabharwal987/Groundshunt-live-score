'use client';

import { useState, useEffect } from 'react';
import { Button, Input, Card } from '@/components/ui';
import { cn, getSportColorClasses, getBaseSportSlug } from '@/lib/utils';
import { SPORTS_CONFIG } from '@/lib/constants';
import { Save, RefreshCw, Plus, Minus } from 'lucide-react';
import type { FixtureWithDetails } from '@/lib/database.types';

interface FinalScoreInputProps {
  fixture: FixtureWithDetails;
  onUpdate: () => void;
}

export function FinalScoreInput({ fixture, onUpdate }: FinalScoreInputProps) {
  const [loading, setLoading] = useState(false);
  const [teamAScore, setTeamAScore] = useState<Record<string, number>>({});
  const [teamBScore, setTeamBScore] = useState<Record<string, number>>({});

  const sportSlug = fixture.sport?.slug?.toLowerCase() || '';
  const baseSportSlug = getBaseSportSlug(sportSlug) as keyof typeof SPORTS_CONFIG;
  const sportConfig = SPORTS_CONFIG[baseSportSlug];
  const sportColors = getSportColorClasses(sportSlug);

  useEffect(() => {
    if (fixture.live_score) {
      const aScore = fixture.live_score.team_a_score;
      const bScore = fixture.live_score.team_b_score;
      
      // Handle both object and string formats
      if (typeof aScore === 'object' && aScore !== null) {
        setTeamAScore(aScore as Record<string, number>);
      } else if (aScore) {
        setTeamAScore({ goals: parseInt(aScore as any) || 0 });
      }
      
      if (typeof bScore === 'object' && bScore !== null) {
        setTeamBScore(bScore as Record<string, number>);
      } else if (bScore) {
        setTeamBScore({ goals: parseInt(bScore as any) || 0 });
      }
    }
  }, [fixture]);

  const handleSave = async () => {
    setLoading(true);

    try {
      // First, ensure a live_score entry exists
      const liveScoreRes = await fetch(`/api/live/${fixture.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          team_a_score: teamAScore,
          team_b_score: teamBScore,
          current_period: 'Final',
          elapsed_time: '0',
          last_event: 'Final Result',
        }),
      });

      if (liveScoreRes.ok) {
        // Update fixture status to completed if not already
        if (fixture.status !== 'completed') {
          await fetch(`/api/fixtures/${fixture.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              status: 'completed',
            }),
          });
        }
        onUpdate();
      }
    } catch (error) {
      console.error('Error saving final score:', error);
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

  // Get all fields for this sport
  const scoreFields = sportConfig?.scoreFields || [];

  const renderScoreField = (team: 'a' | 'b', fieldObj: any) => {
    const fieldKey = fieldObj.key || fieldObj;
    const fieldLabel = fieldObj.label || fieldObj.replace(/_/g, ' ');
    const score = team === 'a' ? teamAScore : teamBScore;
    const value = score[fieldKey] || 0;

    return (
      <div key={fieldKey} className="flex items-center gap-2 pb-3">
        <label className="text-sm font-medium text-gray-600 w-32">
          {fieldLabel}
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => updateScore(team, fieldKey, -1)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={loading}
          >
            <Minus className="h-4 w-4" />
          </button>
          <input
            type="number"
            value={value}
            onChange={(e) => setScoreValue(team, fieldKey, parseInt(e.target.value) || 0)}
            className="w-20 text-center font-mono font-bold text-lg border border-gray-300 rounded-lg py-2"
            disabled={loading}
          />
          <button
            type="button"
            onClick={() => updateScore(team, fieldKey, 1)}
            className="p-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            disabled={loading}
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
          <span className={cn('font-semibold', sportColors.text)}>
            {fixture.status === 'completed' ? 'Edit Final Score' : 'Enter Final Score'} - {fixture.sport?.name}
          </span>
        </div>
        {fixture.status === 'completed' && (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-green-500 text-white text-xs rounded-full font-medium">
            ✓ COMPLETED
          </span>
        )}
        {fixture.status === 'live' && fixture.enable_live_scoring === false && (
          <span className="flex items-center gap-1.5 px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-medium">
            DIRECT RESULT
          </span>
        )}
      </div>

      <div className="p-6">
        {/* Teams Header */}
        <div className="grid grid-cols-2 gap-8 mb-8">
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
        {scoreFields.length > 0 ? (
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div className="space-y-4">
              {scoreFields.map((field: any) => renderScoreField('a', field))}
            </div>
            <div className="space-y-4">
              {scoreFields.map((field: any) => renderScoreField('b', field))}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
            <p className="text-sm text-yellow-800">
              No scoring fields configured for {fixture.sport?.name}. Please configure the sport in settings.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <Button variant="secondary" onClick={onUpdate} disabled={loading}>
            <RefreshCw className="h-4 w-4" />
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            isLoading={loading} 
            variant="primary" 
            size="lg"
            disabled={loading || !scoreFields?.length}
          >
            <Save className="h-5 w-5 mr-2" />
            <span className="font-bold">Save Final Score</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
