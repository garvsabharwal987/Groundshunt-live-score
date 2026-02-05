import Link from 'next/link';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { MatchCard, SportNavPills, PointsTable, NewsCard } from '@/components/user';
import { ChevronRight, Radio, Calendar, Trophy, Newspaper } from 'lucide-react';
import type { FixtureWithDetails, PointsTableWithTeam, Sport, NewsOfTheDay } from '@/lib/database.types';

async function getHomePageData() {
  const supabase = await createServerSupabaseClient();

  // Fetch sports
  const { data: sports } = await supabase
    .from('sports')
    .select('*')
    .eq('is_active', true)
    .order('name');

  // Fetch live matches
  const { data: liveMatches } = await supabase
    .from('fixtures')
    .select(`
      *,
      sport:sports(*),
      team_a:teams!fixtures_team_a_id_fkey(*),
      team_b:teams!fixtures_team_b_id_fkey(*),
      venue:venues(*),
      live_score:live_scores(*)
    `)
    .eq('status', 'live')
    .limit(5);

  // Fetch upcoming matches
  const { data: upcomingMatches } = await supabase
    .from('fixtures')
    .select(`
      *,
      sport:sports(*),
      team_a:teams!fixtures_team_a_id_fkey(*),
      team_b:teams!fixtures_team_b_id_fkey(*),
      venue:venues(*),
      live_score:live_scores(*)
    `)
    .eq('status', 'upcoming')
    .order('match_date', { ascending: true })
    .order('match_time', { ascending: true })
    .limit(6);

  // Fetch recent results
  const { data: recentMatches } = await supabase
    .from('fixtures')
    .select(`
      *,
      sport:sports(*),
      team_a:teams!fixtures_team_a_id_fkey(*),
      team_b:teams!fixtures_team_b_id_fkey(*),
      venue:venues(*),
      live_score:live_scores(*)
    `)
    .eq('status', 'completed')
    .order('match_date', { ascending: false })
    .limit(4);

  // Fetch points tables (first sport only for homepage)
  let standings: PointsTableWithTeam[] = [];
  if (sports && sports.length > 0) {
    const { data: pointsData } = await supabase
      .from('points_table')
      .select(`
        *,
        team:teams(*),
        sport:sports(*)
      `)
      .eq('sport_id', sports[0].id)
      .order('points', { ascending: false })
      .order('net_rating', { ascending: false })
      .limit(5);
    
    standings = (pointsData || []) as PointsTableWithTeam[];
  }

  // Fetch latest news
  const { data: latestNews } = await supabase
    .from('news_of_the_day')
    .select('*')
    .eq('is_published', true)
    .order('publish_date', { ascending: false })
    .limit(3);

  // Format fixtures with live scores
  const formatFixtures = (data: unknown[]): FixtureWithDetails[] => {
    return (data || []).map((d: any) => ({
      ...d,
      live_score: Array.isArray(d.live_score) ? d.live_score[0] : d.live_score
    })) as FixtureWithDetails[];
  };

  return {
    sports: (sports || []) as Sport[],
    liveMatches: formatFixtures(liveMatches || []),
    upcomingMatches: formatFixtures(upcomingMatches || []),
    recentMatches: formatFixtures(recentMatches || []),
    standings,
    latestNews: (latestNews || []) as NewsOfTheDay[],
  };
}

export default async function HomePage() {
  const {
    sports,
    liveMatches,
    upcomingMatches,
    recentMatches,
    standings,
    latestNews,
  } = await getHomePageData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Sports Navigation */}
      <section>
        <SportNavPills sports={sports} />
      </section>

      {/* Live Matches Section */}
      {liveMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6 border-b-2 border-orange-500 pb-3">
            <div className="flex items-center gap-2">
              <Radio className="h-5 w-5 text-orange-500" />
              <h2 className="text-2xl font-bold text-black">Live Now</h2>
              <span className="text-sm text-gray-600">({liveMatches.length})</span>
            </div>
            <Link
              href="/live"
              className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveMatches.map((match) => (
              <MatchCard key={match.id} fixture={match} />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Matches */}
      <section>
        <div className="flex items-center justify-between mb-6 border-b-2 border-orange-500 pb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-500" />
            <h2 className="text-2xl font-bold text-black">Upcoming Matches</h2>
          </div>
          <Link
            href="/fixtures?status=upcoming"
            className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
          >
            View all
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {upcomingMatches.length > 0 ? (
            upcomingMatches.map((match) => (
              <MatchCard key={match.id} fixture={match} />
            ))
          ) : (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-gray-100">
              <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No upcoming matches scheduled</p>
            </div>
          )}
        </div>
      </section>

      {/* Two Column Layout: Standings + News */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Standings */}
        <section className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6 border-b-2 border-orange-500 pb-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-orange-500" />
              <h2 className="text-2xl font-bold text-black">Standings</h2>
            </div>
            <Link
              href="/standings"
              className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          {sports.length > 0 && standings.length > 0 ? (
            <PointsTable
              standings={standings}
              sportSlug={sports[0].slug}
              sportName={sports[0].name}
              compact
            />
          ) : (
            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
              <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No standings available yet</p>
            </div>
          )}
        </section>

        {/* Latest News */}
        <section>
          <div className="flex items-center justify-between mb-6 border-b-2 border-orange-500 pb-3">
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-orange-500" />
              <h2 className="text-2xl font-bold text-black">Latest News</h2>
            </div>
            <Link
              href="/news"
              className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="space-y-4">
            {latestNews.length > 0 ? (
              latestNews.map((news, index) => (
                <NewsCard key={news.id} news={news} featured={index === 0} />
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                <Newspaper className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No news published yet</p>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Recent Results */}
      {recentMatches.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-6 border-b-2 border-orange-500 pb-3">
            <h2 className="text-2xl font-bold text-black">Recent Results</h2>
            <Link
              href="/fixtures?status=completed"
              className="flex items-center gap-1 text-sm font-medium text-orange-500 hover:text-orange-600"
            >
              View all
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recentMatches.map((match) => (
              <MatchCard key={match.id} fixture={match} compact />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
