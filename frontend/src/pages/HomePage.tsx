import React from 'react';
import { Link } from 'react-router-dom';
import { TrendingUp, Star, Users, Film } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { TopMovies } from '../components/movies/TopMovies';
import { useMovieStats } from '../hooks/useMovies';
import { useAuth } from '../contexts/AuthContext';

export const HomePage: React.FC = () => {
  const { data: stats, isLoading: statsLoading } = useMovieStats();
  const { user } = useAuth();

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Movies
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              {user 
                ? `Welcome back, ${user.username}! Explore and discover your next favorite film.`
                : "Join our community of movie enthusiasts. Rate, review, and discover your next favorite film."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Link to="/movies">Browse Movies</Link>
              </Button>
              {!user && (
                <Button size="lg" variant="secondary">
                  <Link to="/register">Join Community</Link>
                </Button>
              )}
              {user && (
                <Button size="lg" variant="secondary">
                  <Link to="/watchlist">My Watchlist</Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {statsLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : stats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="bg-blue-100 dark:bg-blue-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Film className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {stats.totalMovies.toLocaleString()}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Movies Available</p>
              </div>

              <div className="text-center">
                <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {stats.totalReviews?.toLocaleString() || '1,200+'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Reviews Written</p>
              </div>

              <div className="text-center">
                <div className="bg-purple-100 dark:bg-purple-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  10K+
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Active Users</p>
              </div>

              <div className="text-center">
                <div className="bg-orange-100 dark:bg-orange-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                </div>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  4.8
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Average Rating</p>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      {/* Top Movies Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TopMovies 
            defaultCategory="top-rated"
            limit={8}
            showCategoryTabs={true}
          />
          
          <div className="text-center mt-12">
            <Button size="lg">
              <Link to="/movies">View All Movies</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!user && (
        <section className="py-16 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Start Your Movie Journey?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of movie lovers sharing their passion for cinema.
            </p>
            <Button size="lg" variant="secondary">
              <Link to="/register">Get Started Today</Link>
            </Button>
          </div>
        </section>
      )}
      
      {user && (
        <section className="py-16 bg-blue-600">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Discover More Movies?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Explore our collection and add movies to your watchlist.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary">
                <Link to="/movies">Explore Movies</Link>
              </Button>
              <Button size="lg" variant="secondary">
                <Link to="/profile">View Profile</Link>
              </Button>
            </div>
          </div>
        </section>
      )}
    </Layout>
  );
};