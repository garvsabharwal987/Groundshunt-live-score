'use client';

import { Suspense } from 'react';
import { Calendar } from 'lucide-react';
import { FixturesContent } from './fixtures-content';

export default function FixturesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="h-8 w-8 text-blue-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fixtures</h1>
          <p className="text-sm text-gray-500">
            Browse all matches across sports
          </p>
        </div>
      </div>

      {/* Content with Suspense */}
      <Suspense fallback={<FixturesSkeleton />}>
        <FixturesContent />
      </Suspense>
    </div>
  );
}

function FixturesSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );
}
