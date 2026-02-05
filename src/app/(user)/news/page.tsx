import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NewsCard, NewsListItem } from '@/components/user';
import { Newspaper } from 'lucide-react';
import type { NewsOfTheDay } from '@/lib/database.types';

async function getNews() {
  const supabase = await createServerSupabaseClient();

  const { data: news } = await supabase
    .from('news_of_the_day')
    .select('*')
    .eq('is_published', true)
    .order('publish_date', { ascending: false })
    .order('created_at', { ascending: false });

  return (news || []) as NewsOfTheDay[];
}

export default async function NewsPage() {
  const news = await getNews();

  const featuredNews = news[0];
  const restNews = news.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Newspaper className="h-8 w-8 text-green-500" />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">News of the Day</h1>
          <p className="text-sm text-gray-500">
            Daily updates, highlights, and announcements
          </p>
        </div>
      </div>

      {news.length > 0 ? (
        <div className="space-y-8">
          {/* Featured News */}
          {featuredNews && (
            <section>
              <NewsCard news={featuredNews} featured />
            </section>
          )}

          {/* Rest of News */}
          {restNews.length > 0 && (
            <section>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">More Updates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {restNews.map((item) => (
                  <NewsCard key={item.id} news={item} />
                ))}
              </div>
            </section>
          )}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
          <Newspaper className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No News Yet</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            News and updates will appear here. Check back later!
          </p>
        </div>
      )}
    </div>
  );
}
