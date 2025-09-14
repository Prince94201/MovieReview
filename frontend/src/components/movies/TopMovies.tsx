import React, { useState } from 'react';
import { TrendingUp, Star, Clock, Award } from 'lucide-react';
import { MovieGrid } from '../movies/MovieGrid';
import { Button } from '../ui/Button';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useTopRatedMovies, useTrendingMovies, useMoviesByCategory } from '../../hooks/useMovies';

type TopMoviesCategory = 'top-rated' | 'trending' | 'latest' | 'most-reviewed';

interface TopMoviesProps {
  defaultCategory?: TopMoviesCategory;
  limit?: number;
  showCategoryTabs?: boolean;
  title?: string;
}

export const TopMovies: React.FC<TopMoviesProps> = ({
  defaultCategory = 'top-rated',
  limit = 12,
  showCategoryTabs = true,
  title,
}) => {
  const [activeCategory, setActiveCategory] = useState<TopMoviesCategory>(defaultCategory);

  // Hook calls for different categories
  const { data: topRatedMovies, isLoading: topRatedLoading } = useTopRatedMovies(limit, 3);
  const { data: trendingMovies, isLoading: trendingLoading } = useTrendingMovies(limit, 30);
  const { data: latestMovies, isLoading: latestLoading } = useMoviesByCategory('latest', limit);
  const { data: mostReviewedMovies, isLoading: mostReviewedLoading } = useMoviesByCategory('most-reviewed', limit);

  // Select current data based on active category
  const getCurrentData = () => {
    switch (activeCategory) {
      case 'top-rated':
        return { movies: topRatedMovies || [], loading: topRatedLoading };
      case 'trending':
        return { movies: trendingMovies || [], loading: trendingLoading };
      case 'latest':
        return { movies: latestMovies || [], loading: latestLoading };
      case 'most-reviewed':
        return { movies: mostReviewedMovies || [], loading: mostReviewedLoading };
      default:
        return { movies: [], loading: false };
    }
  };

  const { movies, loading } = getCurrentData();

  const categories = [
    {
      id: 'top-rated' as TopMoviesCategory,
      label: 'Top Rated',
      icon: Award,
      description: 'Highest rated movies',
    },
    {
      id: 'trending' as TopMoviesCategory,
      label: 'Trending',
      icon: TrendingUp,
      description: 'Popular this month',
    },
    {
      id: 'latest' as TopMoviesCategory,
      label: 'Latest',
      icon: Clock,
      description: 'Recently added',
    },
    {
      id: 'most-reviewed' as TopMoviesCategory,
      label: 'Most Reviewed',
      icon: Star,
      description: 'Community favorites',
    },
  ];

  const getDefaultTitle = () => {
    const category = categories.find(cat => cat.id === activeCategory);
    return category ? `${category.label} Movies` : 'Top Movies';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
            {title || getDefaultTitle()}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {categories.find(cat => cat.id === activeCategory)?.description}
          </p>
        </div>

        {/* Category Tabs */}
        {showCategoryTabs && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={activeCategory === category.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setActiveCategory(category.id)}
                  className="flex items-center gap-2"
                >
                  <IconComponent className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </Button>
              );
            })}
          </div>
        )}
      </div>

      {/* Movies Grid */}
      <div className="relative">
        {loading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        ) : movies.length > 0 ? (
          <MovieGrid movies={movies} />
        ) : (
          <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
              No movies found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {activeCategory === 'top-rated' && 'Movies need at least 3 reviews to appear here.'}
              {activeCategory === 'trending' && 'No movies have received reviews recently.'}
              {activeCategory === 'latest' && 'No movies have been added recently.'}
              {activeCategory === 'most-reviewed' && 'No movies have reviews yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Category Stats */}
      {movies.length > 0 && (
        <div className="text-center text-sm text-gray-500 dark:text-gray-400">
          Showing {movies.length} {activeCategory.replace('-', ' ')} movie{movies.length !== 1 ? 's' : ''}
          {activeCategory === 'top-rated' && ' (minimum 3 reviews)'}
          {activeCategory === 'trending' && ' (from last 30 days)'}
        </div>
      )}
    </div>
  );
};