'use client';

import { useEffect, useState } from 'react';
import { MatchCardMini } from './MatchCard';
import { MatchCardSkeleton } from '@/components/ui';
import { Radio } from 'lucide-react';
import type { FixtureWithDetails } from '@/lib/database.types';

export function LiveMatchTicker() {
  const [liveMatches, setLiveMatches] = useState<FixtureWithDetails[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLiveMatches = async () => {
    try {
      const res = await fetch('/api/live');
      const data = await res.json();

      if (Array.isArray(data)) {
        const formatted = data.map((d: any) => ({
          ...d,
          live_score: Array.isArray(d.live_score) ? d.live_score[0] : d.live_score
        })) as FixtureWithDetails[];
        setLiveMatches(formatted);
      }
    } catch (error) {
      console.error('Error fetching live matches:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLiveMatches();

    // Poll for updates every 3 seconds
    const interval = setInterval(fetchLiveMatches, 3000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (loading) {
    return (
    <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-300">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <Radio className="h-4 w-4 text-orange-600" />
          <span className="text-sm font-semibold text-orange-600">Live Now</span>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <MatchCardSkeleton />
          </div>
        </div>
      </div>
    );
  }

  if (liveMatches.length === 0) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-red-50 to-orange-50 border-b border-red-100">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 mb-3">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
          </div>
          <span className="text-sm font-semibold text-orange-600">Live Now</span>
          <span className="text-xs text-orange-400">({liveMatches.length} matches)</span>
        </div>
        
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {liveMatches.map((match) => (
            <MatchCardMini key={match.id} fixture={match} />
          ))}
        </div>
      </div>
    </div>
  );
}
