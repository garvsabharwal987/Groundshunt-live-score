import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui';
import { Calendar, Radio, Trophy, Users, Newspaper, FileText } from 'lucide-react';
import Link from 'next/link';
import { ADMIN_PATH } from '@/lib/constants';

async function getDashboardStats() {
  const supabase = await createServerSupabaseClient();

  const [
    { count: fixturesCount },
    { count: liveCount },
    { count: teamsCount },
    { count: sportsCount },
    { count: newsCount },
    { data: recentFixtures },
    { data: recentLogs },
  ] = await Promise.all([
    supabase.from('fixtures').select('*', { count: 'exact', head: true }),
    supabase.from('fixtures').select('*', { count: 'exact', head: true }).eq('status', 'live'),
    supabase.from('teams').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('sports').select('*', { count: 'exact', head: true }).eq('is_active', true),
    supabase.from('news_of_the_day').select('*', { count: 'exact', head: true }),
    supabase.from('fixtures').select(`
      *,
      sport:sports(name),
      team_a:teams!fixtures_team_a_id_fkey(name, short_name),
      team_b:teams!fixtures_team_b_id_fkey(name, short_name)
    `).order('created_at', { ascending: false }).limit(5),
    supabase.from('audit_logs').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  return {
    stats: {
      fixtures: fixturesCount || 0,
      live: liveCount || 0,
      teams: teamsCount || 0,
      sports: sportsCount || 0,
      news: newsCount || 0,
    },
    recentFixtures: recentFixtures || [],
    recentLogs: recentLogs || [],
  };
}

export default async function AdminDashboard() {
  const { stats, recentFixtures, recentLogs } = await getDashboardStats();

  const statCards = [
    { label: 'Total Fixtures', value: stats.fixtures, icon: Calendar, color: 'bg-blue-500', href: '/fixtures' },
    { label: 'Live Matches', value: stats.live, icon: Radio, color: 'bg-red-500', href: '/live-scoring' },
    { label: 'Teams', value: stats.teams, icon: Users, color: 'bg-green-500', href: '/teams' },
    { label: 'Sports', value: stats.sports, icon: Trophy, color: 'bg-yellow-500', href: '/sports' },
    { label: 'News Articles', value: stats.news, icon: Newspaper, color: 'bg-purple-500', href: '/news' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500">Welcome to SPORTIKON Arena Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {statCards.map((stat) => (
          <Link key={stat.label} href={`/${ADMIN_PATH}${stat.href}`}>
            <Card hover className="relative overflow-hidden">
              <div className={`absolute top-0 right-0 w-20 h-20 ${stat.color} opacity-10 rounded-bl-full`}></div>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 ${stat.color} rounded-lg`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Fixtures */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Fixtures</CardTitle>
            <Link href={`/${ADMIN_PATH}/fixtures`} className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentFixtures.length > 0 ? (
              <div className="space-y-3">
                {recentFixtures.map((fixture: Record<string, unknown>) => (
                  <div key={fixture.id as string} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {(fixture.team_a as { short_name: string })?.short_name} vs {(fixture.team_b as { short_name: string })?.short_name}
                      </p>
                      <p className="text-sm text-gray-500">{(fixture.sport as { name: string })?.name}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      fixture.status === 'live' ? 'bg-red-100 text-red-700' :
                      fixture.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {(fixture.status as string).charAt(0).toUpperCase() + (fixture.status as string).slice(1)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No fixtures yet</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Audit Logs */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <Link href={`/${ADMIN_PATH}/audit-logs`} className="text-sm text-primary-600 hover:underline">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            {recentLogs.length > 0 ? (
              <div className="space-y-3">
                {recentLogs.map((log: Record<string, unknown>) => (
                  <div key={log.id as string} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {(log.action as string)} {(log.entity_type as string)}
                      </p>
                      <p className="text-xs text-gray-500">
                        {log.user_email as string} • {new Date(log.created_at as string).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No activity yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
