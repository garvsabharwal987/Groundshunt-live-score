'use client';

import { cn, getSportColorClasses } from '@/lib/utils';
import type { PointsTableWithTeam } from '@/lib/database.types';
import { Trophy } from 'lucide-react';

interface PointsTableProps {
  standings: PointsTableWithTeam[];
  sportSlug: string;
  sportName: string;
  compact?: boolean;
}

export function PointsTable({ standings, sportSlug, sportName, compact = false }: PointsTableProps) {
  const colors = getSportColorClasses(sportSlug);

  if (standings.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <Trophy className="h-12 w-12 text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No standings available yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className={cn('px-4 py-3 border-b border-gray-100', colors.bg)}>
        <h3 className={cn('font-semibold', colors.text)}>{sportName} Standings</h3>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              <th className="px-4 py-3 font-semibold text-gray-600">#</th>
              <th className="px-4 py-3 font-semibold text-gray-600">Team</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-center">P</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-center">W</th>
              <th className="px-4 py-3 font-semibold text-gray-600 text-center">L</th>
              {!compact && (
                <th className="px-4 py-3 font-semibold text-gray-600 text-center">D</th>
              )}
              <th className="px-4 py-3 font-semibold text-gray-600 text-center">Pts</th>
              {!compact && (
                <th className="px-4 py-3 font-semibold text-gray-600 text-center">NRR</th>
              )}
            </tr>
          </thead>
          <tbody>
            {standings.map((entry, index) => (
              <tr
                key={entry.id}
                className={cn(
                  'border-t border-gray-50 hover:bg-gray-50 transition-colors',
                  index < 2 && 'bg-green-50/50',
                  index >= standings.length - 2 && standings.length > 4 && 'bg-red-50/50'
                )}
              >
                <td className="px-4 py-3">
                  <span className={cn(
                    'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold',
                    index === 0 ? 'bg-yellow-100 text-yellow-700' :
                    index === 1 ? 'bg-gray-100 text-gray-700' :
                    index === 2 ? 'bg-orange-100 text-orange-700' :
                    'text-gray-500'
                  )}>
                    {index + 1}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white"
                      style={{ backgroundColor: entry.team?.color_primary || '#6b7280' }}
                    >
                      {entry.team?.short_name?.charAt(0) || 'T'}
                    </div>
                    <span className="font-medium text-gray-900">
                      {compact ? entry.team?.short_name : entry.team?.name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-gray-600">{entry.played}</td>
                <td className="px-4 py-3 text-center text-green-600 font-medium">{entry.won}</td>
                <td className="px-4 py-3 text-center text-red-600 font-medium">{entry.lost}</td>
                {!compact && (
                  <td className="px-4 py-3 text-center text-gray-600">{entry.drawn}</td>
                )}
                <td className="px-4 py-3 text-center">
                  <span className="inline-flex items-center justify-center min-w-[2rem] px-2 py-0.5 bg-primary-50 text-primary-700 rounded font-bold">
                    {entry.points}
                  </span>
                </td>
                {!compact && (
                  <td className="px-4 py-3 text-center font-mono text-sm">
                    {typeof entry.net_rating === 'number' && entry.net_rating > 0 ? '+' : ''}{typeof entry.net_rating === 'number' ? entry.net_rating.toFixed(3) : '—'}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
