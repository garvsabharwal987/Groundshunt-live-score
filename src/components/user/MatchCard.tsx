'use client';

import Link from 'next/link';
import { StatusBadge } from '@/components/ui';
import { cn, formatTime, getSportColorClasses } from '@/lib/utils';
import { SPORTS_CONFIG } from '@/lib/constants';
import type { FixtureWithDetails } from '@/lib/database.types';

interface MatchCardProps {
  fixture: FixtureWithDetails;
  compact?: boolean;
}

export function MatchCard({ fixture, compact = false }: MatchCardProps) {
  const sportConfig = SPORTS_CONFIG[fixture.sport.slug as keyof typeof SPORTS_CONFIG];
  const sportColors = getSportColorClasses(fixture.sport.slug);
  
  const teamAScore = fixture.live_score?.team_a_score as Record<string, number> || {};
  const teamBScore = fixture.live_score?.team_b_score as Record<string, number> || {};

  const formatScore = (score: Record<string, number>) => {
    if (!sportConfig) return '-';
    return sportConfig.displayFormat(score);
  };

  const isLive = fixture.status === 'live';
  const isCompleted = fixture.status === 'completed';

  return (
    <Link href={`/match/${fixture.id}`}>
      <div
        className={cn(
          'bg-white rounded-xl border transition-all duration-200 hover:shadow-lg hover:border-orange-400',
          isLive ? 'border-orange-500 shadow-md bg-orange-50' : 'border-gray-200',
          compact ? 'p-3' : 'p-4'
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', sportColors.bg, sportColors.text)}>
              {fixture.sport.name}
            </span>
            {fixture.round && (
              <span className="text-xs text-gray-500">{fixture.round}</span>
            )}
          </div>
          <StatusBadge status={fixture.status} />
        </div>

        {/* Teams & Scores */}
        <div className="flex items-center justify-between">
          {/* Team A */}
          <div className="flex items-center gap-3 flex-1">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-lg font-bold text-orange-500">
              {fixture.team_a.short_name.charAt(0)}
            </div>
            <div>
              <p className={cn(
                'font-medium text-sm',
                fixture.winner_id === fixture.team_a_id ? 'text-green-600' : 'text-gray-900'
              )}>
                {compact ? fixture.team_a.short_name : fixture.team_a.name}
              </p>
              {(isLive || isCompleted) && (
                <p className="font-mono font-bold text-lg text-gray-900">
                  {formatScore(teamAScore)}
                </p>
              )}
            </div>
          </div>

          {/* VS / Time */}
          <div className="px-4 text-center">
            {isLive ? (
              <div className="flex flex-col items-center">
                <span className="text-xs text-red-500 font-medium">
                  {fixture.live_score?.current_period || 'Live'}
                </span>
                {fixture.live_score?.elapsed_time && (
                  <span className="text-xs text-gray-500">
                    {fixture.live_score.elapsed_time}
                  </span>
                )}
              </div>
            ) : isCompleted ? (
              <span className="text-xs text-gray-500">FT</span>
            ) : (
              <div className="flex flex-col items-center">
                <span className="text-xs text-gray-500">
                  {formatTime(fixture.match_time)}
                </span>
              </div>
            )}
          </div>

          {/* Team B */}
          <div className="flex items-center gap-3 flex-1 justify-end">
            <div className="text-right">
              <p className={cn(
                'font-medium text-sm',
                fixture.winner_id === fixture.team_b_id ? 'text-green-600' : 'text-gray-900'
              )}>
                {compact ? fixture.team_b.short_name : fixture.team_b.name}
              </p>
              {(isLive || isCompleted) && (
                <p className="font-mono font-bold text-lg text-gray-900">
                  {formatScore(teamBScore)}
                </p>
              )}
            </div>
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
              {fixture.team_b.short_name.charAt(0)}
            </div>
          </div>
        </div>

        {/* Live Event */}
        {isLive && fixture.live_score?.last_event && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 truncate">
              📢 {fixture.live_score.last_event}
            </p>
          </div>
        )}

        {/* Venue */}
        {!compact && fixture.venue && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              📍 {fixture.venue.name}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}

export function MatchCardMini({ fixture }: { fixture: FixtureWithDetails }) {
  const teamAScore = fixture.live_score?.team_a_score as Record<string, number> || {};
  const teamBScore = fixture.live_score?.team_b_score as Record<string, number> || {};
  const sportConfig = SPORTS_CONFIG[fixture.sport.slug as keyof typeof SPORTS_CONFIG];
  
  const formatScore = (score: Record<string, number>) => {
    if (!sportConfig) return '-';
    return sportConfig.displayFormat(score);
  };

  const isLive = fixture.status === 'live';

  return (
    <Link href={`/match/${fixture.id}`}>
      <div className={cn(
        'bg-white rounded-lg border p-3 min-w-[200px] transition-all hover:shadow-sm',
        isLive ? 'border-red-200' : 'border-gray-100'
      )}>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-500">{fixture.sport.name}</span>
          {isLive && (
            <span className="flex items-center gap-1 text-xs text-red-500 font-medium">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
              </span>
              LIVE
            </span>
          )}
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">{fixture.team_a.short_name}</span>
            <span className="font-mono font-bold">{formatScore(teamAScore)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium truncate">{fixture.team_b.short_name}</span>
            <span className="font-mono font-bold">{formatScore(teamBScore)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
