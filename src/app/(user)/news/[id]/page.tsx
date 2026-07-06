import { createServerSupabaseClient } from '@/lib/supabase/server';
import { formatDate } from '@/lib/utils';
import { Calendar, ArrowLeft, User } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { NewsOfTheDay } from '@/lib/database.types';

interface PageProps {
  params: { id: string };
}

async function getNewsById(id: string) {
  const supabase = await createServerSupabaseClient();

  const { data } = await supabase
    .from('news_of_the_day')
    .select('*')
    .eq('id', id)
   
    .single();

  return data as NewsOfTheDay | null;
}

export default async function NewsDetailPage({ params }: PageProps) {
  const news = await getNewsById(params.id);

  if (!news) {
    notFound();
  }

  const highlights = (news.highlights as { type: string; text: string }[]) || [];
  const performances = (news.notable_performances as { player: string; team: string; achievement: string }[]) || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Back Button */}
      <Link
        href="/news"
        className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-slate-200 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to News
      </Link>

      <article className="bg-white dark:bg-slate-800 rounded-xl border border-gray-100 dark:border-slate-700 overflow-hidden">
        {/* Featured Image */}
        {news.featured_image_url ? (
          <div className="aspect-video bg-gray-100 dark:bg-slate-700">
            <img
              src={news.featured_image_url}
              alt={news.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
            <span className="text-8xl opacity-30">📰</span>
          </div>
        )}

        <div className="p-6 md:p-8">
          {/* Meta */}
          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-400 mb-4">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              {formatDate(news.publish_date)}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-slate-50 mb-4">{news.title}</h1>

          {/* Summary */}
          {news.summary && (
            <p className="text-lg text-gray-600 dark:text-slate-300 mb-6 leading-relaxed">
              {news.summary}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-gray dark:prose-invert max-w-none mb-8">
            {news.content.split('\n').map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 dark:text-slate-300 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          {/* Highlights */}
          {highlights.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-4">Highlights</h2>
              <ul className="space-y-2">
                {highlights.map((highlight, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
                  >
                    <span className="text-lg">
                      {highlight.type === 'performance' ? '⭐' : 
                       highlight.type === 'result' ? '🏆' : '📌'}
                    </span>
                    <span className="text-gray-700 dark:text-slate-300">{highlight.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Notable Performances */}
          {performances.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-slate-50 mb-4">Notable Performances</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {performances.map((perf, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/30 dark:to-orange-950/30 border border-yellow-100 dark:border-yellow-800 rounded-lg"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                      <span className="font-semibold text-gray-900 dark:text-slate-50">{perf.player}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400">{perf.team}</p>
                    <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400 mt-1">{perf.achievement}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </article>
    </div>
  );
}
