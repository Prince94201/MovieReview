import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, BarChart3 } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { MovieGrid } from '../components/movies/MovieGrid';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { useWatchlist, useWatchlistStats } from '../hooks/useWatchlist';

export const WatchlistPage: React.FC = () => {
  const [currentPage, setCurrentPage] = React.useState(1);
  const { data: watchlistData, isLoading: watchlistLoading, error } = useWatchlist({ 
    page: currentPage, 
    limit: 20 
  });
  const { data: stats, isLoading: statsLoading } = useWatchlistStats();

  const watchlist = watchlistData || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-red-500" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
              My Watchlist
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Movies you've saved to watch later
          </p>
        </div>

        {/* Stats Section */}
        {!statsLoading && stats && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BarChart3 className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Watchlist Stats
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
                  {stats.totalMovies || 0}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Total Movies
                </div>
              </div>

              {stats.genres && Object.entries(stats.genres).length > 0 ? (
                Object.entries(stats.genres).slice(0, 3).map(([genre, count]) => (
                  <div key={genre} className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
                      {count}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {genre}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg col-span-3">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    No genre data available
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Watchlist Grid */}
        {watchlistLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-600 dark:text-red-400 mb-4">
              Failed to load watchlist
            </p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        ) : watchlist.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Your watchlist is empty
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start adding movies you want to watch later
            </p>
            <Button>
              <Link to="/movies" className="text-white">
                Browse Movies
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {watchlist.length} movie{watchlist.length !== 1 ? 's' : ''} in your watchlist
              </p>
            </div>
            <MovieGrid movies={watchlist} />
          </>
        )}
      </div>
    </Layout>
  );
};