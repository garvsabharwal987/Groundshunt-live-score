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
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap',
          activeSport === null
            ? 'bg-black text-orange-400 border-2 border-orange-500'
            : 'bg-white text-gray-700 hover:bg-orange-50 border-2 border-gray-200'
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
                : 'bg-white text-gray-700 hover:bg-orange-50 border-2 border-gray-200'
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
    <div className="flex gap-2 overflow-x-auto py-3 scrollbar-hide">
      {sports.map((sport) => {
        const colors = getSportColorClasses(sport.slug);
        
        return (
          <Link
            key={sport.id}
            href={`/fixtures?sport=${sport.slug}`}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap',
              'bg-white border-2 border-gray-300 text-black',
              'hover:border-orange-500 hover:bg-orange-50',
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
