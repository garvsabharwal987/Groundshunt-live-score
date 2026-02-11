'use client';

import { useEffect, useState } from 'react';
import { PointsTable as PointsTableComponent } from '@/components/user';
import { Tabs } from '@/components/ui';
import { Trophy } from 'lucide-react';
import type { PointsTableWithTeam, Sport } from '@/lib/database.types';

export default function StandingsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [standings, setStandings] = useState<Record<string, PointsTableWithTeam[]>>({});
  const [activeSport, setActiveSport] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch sports
        const sportsRes = await fetch('/api/sports');
        const sportsData = await sportsRes.json();

        if (Array.isArray(sportsData) && sportsData.length > 0) {
          setSports(sportsData);
          setActiveSport(sportsData[0].slug);

          // Fetch standings for all sports
          const standingsMap: Record<string, PointsTableWithTeam[]> = {};

          for (const sport of sportsData) {
            const res = await fetch(`/api/standings?sport_id=${sport.id}`);
            const pointsData = await res.json();
            if (Array.isArray(pointsData)) {
              standingsMap[sport.slug] = pointsData;
            }
          }

          setStandings(standingsMap);
        }
      } catch (error) {
        console.error('Error fetching standings:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  const currentSport = sports.find(s => s.slug === activeSport);
  const currentStandings = standings[activeSport] || [];

  const tabs = sports.map(sport => ({
    id: sport.slug,
    label: sport.name,
    count: standings[sport.slug]?.length || 0,
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Trophy className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-50">Standings</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400">
            Tournament standings and points table
          </p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="flex gap-4 border-b border-gray-200 dark:border-slate-700 pb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-8 w-24 bg-gray-200 dark:bg-slate-700 rounded animate-pulse"></div>
            ))}
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 animate-pulse">
            <div className="h-6 bg-gray-200 dark:bg-slate-700 rounded w-40 mb-4"></div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 bg-gray-200 dark:bg-slate-700 rounded mb-2"></div>
            ))}
          </div>
        </div>
      ) : sports.length > 0 ? (
        <div className="space-y-6">
          {/* Sport Tabs */}
          <Tabs
            tabs={tabs}
            activeTab={activeSport}
            onTabChange={setActiveSport}
          />

          {/* Points Table */}
          {currentSport && (
            <PointsTableComponent
              standings={currentStandings}
              sportSlug={currentSport.slug}
              sportName={currentSport.name}
            />
          )}

          {/* Legend */}
          <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Qualification Zone</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Elimination Zone</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
          <Trophy className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-50 mb-2">No Standings Available</h3>
          <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
            Standings will appear here once matches have been completed.
          </p>
        </div>
      )}
    </div>
  );
}
