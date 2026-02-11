import Image from 'next/image';
import Link from 'next/link';
import { Trophy } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black dark:bg-slate-800 text-gray-300 dark:text-slate-300 border-t border-orange-500 dark:border-orange-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image 
                src="/logo.svg" 
                alt="Groundshunt Arena" 
                width={32} 
                height={32} 
                className="h-8 w-auto"
              />
              <div>
                <span className="font-bold text-white dark:text-slate-50">Groundshunt</span>
                <span className="font-light text-orange-400 ml-1">Arena</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 dark:text-slate-400 max-w-md">
              GROUNDSHUNT x SPORTIKON 4.0 - Your one-stop destination for live sports 
              scores, fixtures, and tournament tracking across Table Tennis, Football, 
              Basketball, Badminton, and Volleyball.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white dark:text-slate-100 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/live" className="text-sm hover:text-orange-400 transition-colors">
                  Live Scores
                </Link>
              </li>
              <li>
                <Link href="/fixtures" className="text-sm hover:text-orange-400 transition-colors">
                  Fixtures
                </Link>
              </li>
              <li>
                <Link href="/standings" className="text-sm hover:text-orange-400 transition-colors">
                  Standings
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-sm hover:text-orange-400 transition-colors">
                  News
                </Link>
              </li>
            </ul>
          </div>

          {/* Sports */}
          <div>
            <h3 className="text-sm font-semibold text-orange-400 dark:text-orange-300 uppercase tracking-wider mb-4">
              Sports
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href="/fixtures?sport=tabletennis" className="text-sm hover:text-orange-400 transition-colors">
                  Table Tennis
                </Link>
              </li>
              <li>
                <Link href="/fixtures?sport=football" className="text-sm hover:text-orange-400 transition-colors">
                  Football
                </Link>
              </li>
              <li>
                <Link href="/fixtures?sport=basketball" className="text-sm hover:text-orange-400 transition-colors">
                  Basketball
                </Link>
              </li>
              <li>
                <Link href="/fixtures?sport=badminton" className="text-sm hover:text-orange-400 transition-colors">
                  Badminton
                </Link>
              </li>
              <li>
                <Link href="/fixtures?sport=volleyball" className="text-sm hover:text-orange-400 transition-colors">
                  Volleyball
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800">
          <p className="text-sm text-gray-400 text-center">
            © {currentYear} Groundshunt Arena. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
