'use client';

import { Card } from '@/components/ui';
import { SPORTS_CONFIG } from '@/lib/constants';

interface SetsTableProps {
  sport: string;
  teamAName: string;
  teamAShort: string;
  teamAScore: Record<string, number>;
  teamBName: string;
  teamBShort: string;
  teamBScore: Record<string, number>;
  teamAColor?: string;
  teamBColor?: string;
}

export function SetsTable({
  sport,
  teamAName,
  teamAShort,
  teamAScore,
  teamBName,
  teamBShort,
  teamBScore,
  teamAColor = '#6b7280',
  teamBColor = '#6b7280',
}: SetsTableProps) {
  const sportConfig = SPORTS_CONFIG[sport as keyof typeof SPORTS_CONFIG];

  // Get set fields for this sport (excluding summary fields)
  const fields = sportConfig?.scoreFields.filter((field: any) => 
    field.type !== 'summary'
  ) || [];

  const summaryField = sportConfig?.scoreFields.find((field: any) => 
    field.type === 'summary'
  );

  // If no fields found or sport doesn't use sets format
  if (fields.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="px-6 py-4 text-left">
                <span className="text-sm font-semibold text-gray-900 dark:text-slate-200">Team</span>
              </th>
              {fields.map((field: any) => (
                <th key={field.key} className="px-4 py-4 text-center">
                  <span className="text-sm font-semibold text-gray-900 dark:text-slate-200">
                    {field.label}
                  </span>
                </th>
              ))}
              {summaryField && (
                <th className="px-4 py-4 text-center">
                  <span className="text-sm font-semibold text-gray-900 dark:text-slate-200">
                    {summaryField.label}
                  </span>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {/* Team A Row */}
            <tr className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: teamAColor }}
                    title={teamAName}
                  >
                    {teamAShort.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-200">
                      {teamAName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{teamAShort}</p>
                  </div>
                </div>
              </td>
              {fields.map((field: any) => (
                <td key={field.key} className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 text-sm font-bold text-gray-900 dark:text-slate-200">
                    {teamAScore[field.key] ?? '-'}
                  </span>
                </td>
              ))}
              {summaryField && (
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-sm font-bold text-blue-700 dark:text-blue-300">
                    {teamAScore[summaryField.key] ?? 0}
                  </span>
                </td>
              )}
            </tr>

            {/* Team B Row */}
            <tr className="hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                    style={{ backgroundColor: teamBColor }}
                    title={teamBName}
                  >
                    {teamBShort.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-slate-200">
                      {teamBName}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">{teamBShort}</p>
                  </div>
                </div>
              </td>
              {fields.map((field: any) => (
                <td key={field.key} className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100 dark:bg-slate-700 text-sm font-bold text-gray-900 dark:text-slate-200">
                    {teamBScore[field.key] ?? '-'}
                  </span>
                </td>
              ))}
              {summaryField && (
                <td className="px-4 py-4 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-sm font-bold text-blue-700 dark:text-blue-300">
                    {teamBScore[summaryField.key] ?? 0}
                  </span>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>
    </Card>
  );
}
