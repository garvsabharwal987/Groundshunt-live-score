'use client';

import Link from 'next/link';
import { cn, getSportColorClasses } from '@/lib/utils';
import type { Sport } from '@/lib/database.types';

interface SportFilterProps {
  sports: Sport[];
  activeSport: string | null;
  onSelect: (sportSlug: string | null) => void;
}

export function SportFilter({ sports, activeSport, onSelect }: SportFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:dark:bg-slate-700 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:dark:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-600">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
          activeSport === null
            ? 'bg-black dark:bg-slate-900 text-orange-400 border-2 border-orange-500'
            : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700 border-2 border-gray-200 dark:border-slate-700'
        )}
      >
        All Sports
      </button>
      
      {sports.map((sport) => {
        const colors = getSportColorClasses(sport.slug);
        const isActive = activeSport === sport.slug;
        
        return (
          <button
            key={sport.id}
            onClick={() => onSelect(sport.slug)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
              isActive
                ? `${colors.bg} ${colors.text} ${colors.border} border-2`
                : 'bg-white dark:bg-slate-800 text-gray-700 dark:text-slate-200 hover:bg-orange-50 dark:hover:bg-slate-700 border-2 border-gray-200 dark:border-slate-700'
            )}
          >
            {sport.name}
          </button>
        );
      })}
    </div>
  );
}

export function SportNavPills({ sports }: { sports: Sport[] }) {
  return (
    <div className="flex gap-2 overflow-x-auto py-3 [&::-webkit-scrollbar]:h-2 [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-track]:dark:bg-slate-700 [&::-webkit-scrollbar-thumb]:bg-gray-400 [&::-webkit-scrollbar-thumb]:dark:bg-slate-600 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-gray-600">
      {sports.map((sport) => {
        const colors = getSportColorClasses(sport.slug);
        
        return (
          <Link
            key={sport.id}
            href={`/fixtures?sport=${sport.slug}`}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              'bg-white dark:bg-slate-800 border-2 border-gray-300 dark:border-slate-700 text-black dark:text-slate-100',
              'hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-slate-700',
              colors.text
            )}
          >
            {sport.name}
          </Link>
        );
      })}
    </div>
  );
}
