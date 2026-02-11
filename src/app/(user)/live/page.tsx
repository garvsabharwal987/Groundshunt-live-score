'use client';

import { useEffect, useState, useCallback } from 'react';
import { MatchCard, SportFilter } from '@/components/user';
import { Radio, RefreshCw } from 'lucide-react';
import type { FixtureWithDetails, Sport } from '@/lib/database.types';

export default function LiveScoresPage() {
  const [liveMatches, setLiveMatches] = useState<FixtureWithDetails[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [activeSport, setActiveSport] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    try {
      // Fetch sports via API
      const sportsRes = await fetch('/api/sports');
      const sportsData = await sportsRes.json();
      if (Array.isArray(sportsData)) setSports(sportsData);

      // Fetch live matches via API
      const matchesRes = await fetch('/api/live');
      const matchesData = await matchesRes.json();

      if (Array.isArray(matchesData)) {
        let formatted = matchesData.map((d: any) => ({
          ...d,
          live_score: Array.isArray(d.live_score) ? d.live_score[0] : d.live_score
        })) as FixtureWithDetails[];

        // Filter by sport client-side
        if (activeSport) {
          const sport = sportsData?.find((s: Sport) => s.slug === activeSport);
          if (sport) {
            formatted = formatted.filter(m => m.sport_id === sport.id);
          }
        }

        setLiveMatches(formatted);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }

    setLastUpdated(new Date());
    setLoading(false);
  }, [activeSport]);

  useEffect(() => {
    fetchData();

    // Poll every 3 seconds for updates
    const pollInterval = setInterval(fetchData, 3000);

    return () => {
      clearInterval(pollInterval);
    };
  }, [fetchData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Radio className="h-8 w-8 text-red-500" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Live Scores</h1>
            <p className="text-sm text-gray-500 dark:text-slate-400">
              {liveMatches.length} live match{liveMatches.length !== 1 ? 'es' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-slate-400">
          <RefreshCw className="h-4 w-4" />
          <span>
            Updated: {lastUpdated.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </span>
        </div>
      </div>

      {/* Sport Filter */}
      <div className="mb-6">
        <SportFilter
          sports={sports}
          activeSport={activeSport}
          onSelect={setActiveSport}
        />
      </div>

      {/* Live Matches Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-20 mb-4"></div>
              <div className="space-y-3">
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded"></div>
                <div className="h-10 bg-gray-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : liveMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveMatches.map((match) => (
            <MatchCard key={match.id} fixture={match} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
          <Radio className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">No Live Matches</h3>
          <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
            There are no live matches at the moment. Check back later or browse 
            upcoming fixtures.
          </p>
        </div>
      )}
    </div>
  );
}
