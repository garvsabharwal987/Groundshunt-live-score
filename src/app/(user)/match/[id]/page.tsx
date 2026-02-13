'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { StatusBadge, Card } from '@/components/ui';
import { cn, formatDate, formatTime, getSportColorClasses } from '@/lib/utils';
import { SPORTS_CONFIG } from '@/lib/constants';
import { ArrowLeft, MapPin, Clock, RefreshCw } from 'lucide-react';
import { SetsTable } from '@/components/user';
import type { FixtureWithDetails } from '@/lib/database.types';

export default function MatchDetailPage() {
  const params = useParams();
  const matchId = params.id as string;

  const [fixture, setFixture] = useState<FixtureWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchMatch = async () => {
    try {
      const res = await fetch(`/api/fixtures/${matchId}`);
      if (res.ok) {
        const data = await res.json();
        const formatted = {
          ...data,
          live_score: Array.isArray(data.live_score) ? data.live_score[0] : data.live_score
        } as FixtureWithDetails;
        setFixture(formatted);
      }
    } catch (error) {
      console.error('Error fetching match:', error);
    }

    setLastUpdated(new Date());
    setLoading(false);
  };

  useEffect(() => {
    fetchMatch();

    // Poll every 3 seconds only for live matches with live scoring enabled
    let pollInterval: NodeJS.Timeout | null = null;
    if (fixture?.status === 'live' && fixture?.enable_live_scoring) {
      pollInterval = setInterval(fetchMatch, 3000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [matchId, fixture?.enable_live_scoring]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-32 bg-gray-200 dark:bg-slate-700 rounded"></div>
          <div className="h-64 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
          <div className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl"></div>
        </div>
      </div>
    );
  }

  if (!fixture) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="text-center py-16">
          <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-2">Match Not Found</h2>
          <p className="text-gray-500 dark:text-slate-400 mb-4">The match you're looking for doesn't exist.</p>
          <Link href="/fixtures" className="text-primary-600 hover:underline">
            View all fixtures
          </Link>
        </div>
      </div>
    );
  }

  const sportConfig = SPORTS_CONFIG[fixture.sport.slug as keyof typeof SPORTS_CONFIG];
  const sportColors = getSportColorClasses(fixture.sport.slug);
  const teamAScore = fixture.live_score?.team_a_score as Record<string, number> || {};
  const teamBScore = fixture.live_score?.team_b_score as Record<string, number> || {};
  const matchInfo = fixture.live_score?.match_info as Record<string, unknown> || {};

  const isLive = fixture.status === 'live';
  const isCompleted = fixture.status === 'completed';

  const formatScore = (score: Record<string, number>) => {
    if (!sportConfig) return '-';
    return sportConfig.displayFormat(score);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <Link
        href="/fixtures"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Fixtures
      </Link>

      {/* Main Match Card */}
      <Card className={cn(
        'overflow-hidden mb-6',
        isLive && 'ring-2 ring-red-500 ring-offset-2'
      )}>
        {/* Header */}
        <div className={cn('px-6 py-4 flex items-center justify-between', sportColors.bg)}>
          <div className="flex items-center gap-3">
            <span className={cn('font-semibold', sportColors.text)}>
              {fixture.sport.name}
            </span>
            {fixture.round && (
              <span className="text-sm font-bold text-black dark:text-slate-50">• {fixture.round}</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isLive && (
              <div className="flex items-center gap-2 text-sm font-medium text-black dark:text-slate-50">
                <RefreshCw className="h-3 w-3 animate-spin" />
                Updated: {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
            )}
            <StatusBadge status={fixture.status} />
          </div>
        </div>

        {/* Score Section */}
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 items-center">
            {/* Team A */}
            <div className="text-center">
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold text-white mb-3"
                style={{ backgroundColor: fixture.team_a.color_primary || '#6b7280' }}
              >
                {fixture.team_a.short_name.charAt(0)}
              </div>
              <h3 className={cn(
                'font-bold text-lg',
                fixture.winner_id === fixture.team_a_id ? 'text-green-600 dark:text-green-400' : 'text-gray-950 dark:text-slate-50'
              )}>
                {fixture.team_a.name}
              </h3>
              <p className="text-sm text-black dark:text-white font-bold">{fixture.team_a.short_name}</p>
              
              {(isLive || isCompleted) && (
                <div className="mt-4">
                  <p className="score-display-lg">{formatScore(teamAScore)}</p>
                </div>
              )}
            </div>

            {/* VS / Match Info */}
            <div className="text-center">
              {isLive && fixture.enable_live_scoring ? (
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-700 dark:bg-red-600 text-white dark:text-red-100 rounded-full">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                    </span>
                    LIVE
                  </div>
                  {fixture.live_score?.current_period && (
                    <p className="text-sm font-medium text-gray-950 dark:text-slate-100">
                      {fixture.live_score.current_period}
                    </p>
                  )}
                  {fixture.live_score?.elapsed_time && (
                    <p className="text-sm font-bold text-black dark:text-slate-100">
                      {fixture.live_score.elapsed_time}
                    </p>
                  )}
                </div>
              ) : isLive && !fixture.enable_live_scoring ? (
                <div className="text-black dark:text-slate-100">
                  <p className="text-lg font-bold">PENDING</p>
                  <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">Results coming</p>
                </div>
              ) : isCompleted ? (
                <div className="text-black dark:text-slate-100">
                  <p className="text-lg font-bold">FT</p>
                  <p className="text-sm font-semibold">Full Time</p>
                </div>
              ) : (
                <div className="text-black dark:text-slate-100">
                  <p className="text-2xl font-bold">VS</p>
                </div>
              )}
            </div>

            {/* Team B */}
            <div className="text-center">
              <div
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center text-3xl font-bold text-white mb-3"
                style={{ backgroundColor: fixture.team_b.color_primary || '#6b7280' }}
              >
                {fixture.team_b.short_name.charAt(0)}
              </div>
              <h3 className={cn(
                'font-bold text-lg',
                fixture.winner_id === fixture.team_b_id ? 'text-green-600 dark:text-green-400' : 'text-gray-950 dark:text-slate-50'
              )}>
                {fixture.team_b.name}
              </h3>
              <p className="text-sm text-black dark:text-white font-bold">{fixture.team_b.short_name}</p>
              
              {(isLive || isCompleted) && (
                <div className="mt-4">
                  <p className="score-display-lg">{formatScore(teamBScore)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Last Event */}
          {isLive && fixture.live_score?.last_event && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg text-center">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                📢 {fixture.live_score.last_event}
              </p>
            </div>
          )}

          {/* Match Summary */}
          {isCompleted && fixture.summary && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
              <p className="text-black dark:text-slate-200">{fixture.summary}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Sets Table for sports with set-based scoring */}
      {(isLive || isCompleted) && Object.keys(teamAScore).length > 0 && (
        <SetsTable
          sport={fixture.sport.slug}
          teamAName={fixture.team_a.name}
          teamAShort={fixture.team_a.short_name}
          teamAScore={teamAScore}
          teamBName={fixture.team_b.name}
          teamBShort={fixture.team_b.short_name}
          teamBScore={teamBScore}
          teamAColor={fixture.team_a.color_primary}
          teamBColor={fixture.team_b.color_primary}
        />
      )}

      {/* Match Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Match Info */}
        <Card>
          <h3 className="font-bold text-gray-900 dark:text-white mb-4">Match Information</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="h-4 w-4 text-gray-900 dark:text-white font-bold" />
              <span className="text-black dark:text-white font-bold">
                {formatDate(fixture.match_date)} at {formatTime(fixture.match_time)}
              </span>
            </div>
            {fixture.venue && (
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-gray-900 dark:text-white font-bold" />
                <span className="text-black dark:text-white font-bold">{fixture.venue.name}</span>
              </div>
            )}
            {fixture.match_number && (
              <div className="flex items-center gap-3 text-sm">
                <span className="text-gray-900 dark:text-white font-bold">#</span>
                <span className="text-black dark:text-white font-bold">Match {fixture.match_number}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Sport-specific details */}
        {Object.keys(matchInfo).length > 0 && (
          <Card>
            <h3 className="font-bold text-gray-900 dark:text-white mb-4">Match Details</h3>
            <div className="space-y-2">
              {Object.entries(matchInfo).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-black dark:text-white capitalize font-medium">{key.replace(/_/g, ' ')}</span>
                  <span className="text-black dark:text-white font-bold">{String(value)}</span>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
