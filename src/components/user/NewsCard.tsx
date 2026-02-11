import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import type { NewsOfTheDay } from '@/lib/database.types';
import { Calendar, ChevronRight } from 'lucide-react';

interface NewsCardProps {
  news: NewsOfTheDay;
  featured?: boolean;
}

export function NewsCard({ news, featured = false }: NewsCardProps) {
  if (featured) {
    return (
      <Link href={`/news/${news.id}`}>
        <article className="group relative bg-white dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-gray-300 dark:border-slate-700 hover:border-orange-500 hover:shadow-lg transition-all duration-300">
          {/* Featured Image */}
          <div className="aspect-video bg-gradient-to-br from-orange-400 to-orange-600 relative dark:opacity-90">
            {news.featured_image_url ? (
              <img
                src={news.featured_image_url}
                alt={news.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl opacity-30">📰</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {/* Content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <div className="flex items-center gap-2 text-sm opacity-80 mb-2">
                <Calendar className="h-4 w-4" />
                {formatDate(news.publish_date)}
              </div>
              <h2 className="text-2xl font-bold mb-2 group-hover:text-orange-200 transition-colors">
                {news.title}
              </h2>
              {news.summary && (
                <p className="text-sm opacity-90 line-clamp-2">{news.summary}</p>
              )}
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/news/${news.id}`}>
      <article className="group bg-white dark:bg-slate-800 rounded-xl overflow-hidden border-2 border-gray-300 dark:border-slate-700 hover:border-orange-500 hover:shadow-md transition-all duration-200">
        {/* Thumbnail */}
        <div className="aspect-video bg-gray-100 dark:bg-slate-700 relative">
          {news.featured_image_url ? (
            <img
              src={news.featured_image_url}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
              <span className="text-4xl opacity-30">📰</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2 text-xs text-orange-600 dark:text-orange-400 mb-2">
            <Calendar className="h-3.5 w-3.5" />
            {formatDate(news.publish_date)}
          </div>
          <h3 className="font-semibold text-black dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors line-clamp-2 mb-2">
            {news.title}
          </h3>
          {news.summary && (
            <p className="text-sm text-gray-600 dark:text-slate-400 line-clamp-2">{news.summary}</p>
          )}
          <div className="flex items-center gap-1 text-orange-500 text-sm font-medium mt-3 group-hover:gap-2 transition-all">
            Read more
            <ChevronRight className="h-4 w-4" />
          </div>
        </div>
      </article>
    </Link>
  );
}

export function NewsListItem({ news }: { news: NewsOfTheDay }) {
  return (
    <Link href={`/news/${news.id}`}>
      <article className="group flex gap-4 p-4 bg-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200">
        {/* Thumbnail */}
        <div className="w-24 h-24 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
          {news.featured_image_url ? (
            <img
              src={news.featured_image_url}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <span className="text-2xl opacity-30">📰</span>
            </div>
          )}
        </div>
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <Calendar className="h-3 w-3" />
            {formatDate(news.publish_date)}
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2 mb-1">
            {news.title}
          </h3>
          {news.summary && (
            <p className="text-sm text-gray-600 line-clamp-1">{news.summary}</p>
          )}
        </div>
      </article>
    </Link>
  );
}
