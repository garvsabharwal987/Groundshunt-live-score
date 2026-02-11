'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MatchCard, SportFilter } from '@/components/user';
import { PillTabs } from '@/components/ui';
import { Calendar, Filter } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import type { FixtureWithDetails, Sport } from '@/lib/database.types';

export function FixturesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [fixtures, setFixtures] = useState<FixtureWithDetails[]>([]);
  const [sports, setSports] = useState<Sport[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [activeStatus, setActiveStatus] = useState(searchParams.get('status') || 'all');
  const [activeSport, setActiveSport] = useState<string | null>(searchParams.get('sport'));
  const [selectedDate, setSelectedDate] = useState<string>(searchParams.get('date') || '');

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      // Fetch sports from API
      const sportsRes = await fetch('/api/sports');
      const sportsData = await sportsRes.json();
      if (Array.isArray(sportsData)) setSports(sportsData);

      // Fetch fixtures from API
      const params = new URLSearchParams();
      if (activeStatus !== 'all') params.append('status', activeStatus);
      if (activeSport) params.append('sport', activeSport);
      
      const fixturesRes = await fetch(`/api/fixtures?${params.toString()}`);
      const fixturesData = await fixturesRes.json();

      if (Array.isArray(fixturesData)) {
        // Filter by date if specified
        let filtered = fixturesData;
        if (selectedDate) {
          filtered = filtered.filter((f: FixtureWithDetails) => f.match_date === selectedDate);
        }
        setFixtures(filtered);
      }
    } catch (error) {
      console.error('Error fetching fixtures:', error);
    }

    setLoading(false);
  }, [activeStatus, activeSport, selectedDate]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Update URL params
  useEffect(() => {
    const params = new URLSearchParams();
    if (activeStatus !== 'all') params.set('status', activeStatus);
    if (activeSport) params.set('sport', activeSport);
    if (selectedDate) params.set('date', selectedDate);
    
    const newUrl = params.toString() ? `?${params.toString()}` : '/fixtures';
    router.replace(newUrl, { scroll: false });
  }, [activeStatus, activeSport, selectedDate, router]);

  // Group fixtures by date
  const groupedFixtures = fixtures.reduce((acc, fixture) => {
    const date = fixture.match_date;
    if (!acc[date]) acc[date] = [];
    acc[date].push(fixture);
    return acc;
  }, {} as Record<string, FixtureWithDetails[]>);

  const statusTabs = [
    { id: 'all', label: 'All' },
    { id: 'live', label: 'Live' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'completed', label: 'Completed' },
  ];

  return (
    <>
      {/* Filters */}
      <div className="space-y-4 mb-6">
        {/* Status Tabs */}
        <PillTabs
          tabs={statusTabs}
          activeTab={activeStatus}
          onTabChange={setActiveStatus}
        />

        {/* Sport Filter + Date */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <SportFilter
              sports={sports}
              activeSport={activeSport}
              onSelect={setActiveSport}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-400" />
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 text-sm border border-gray-300 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
            {selectedDate && (
              <button
                onClick={() => setSelectedDate('')}
                className="text-sm text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-300"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Fixtures List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 p-4 animate-pulse">
              <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-32 mb-4"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
                <div className="h-24 bg-gray-200 dark:bg-slate-700 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : Object.keys(groupedFixtures).length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedFixtures).map(([date, dateFixtures]) => (
            <section key={date}>
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700"></div>
                <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 text-sm font-medium rounded-full">
                  {formatDate(date)}
                </span>
                <div className="h-px flex-1 bg-gray-200 dark:bg-slate-700"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {dateFixtures.map((fixture) => (
                  <MatchCard key={fixture.id} fixture={fixture} />
                ))}
              </div>
            </section>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700">
          <Calendar className="h-16 w-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">No Fixtures Found</h3>
          <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
            No matches found with the selected filters. Try adjusting your filters or check back later.
          </p>
        </div>
      )}
    </>
  );
}
