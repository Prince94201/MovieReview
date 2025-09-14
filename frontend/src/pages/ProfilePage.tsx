import React, { useState } from 'react';
import { User, Calendar, Star, Film, Edit3 } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { AdminPanel } from '../components/admin/AdminPanel';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useMyReviews } from '../hooks/useReviews';
import { useWatchlistStats } from '../hooks/useWatchlist';

export const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [showEditModal, setShowEditModal] = useState(false);
  const { data: reviewsData, isLoading: reviewsLoading } = useMyReviews({ page: 1, limit: 50 });
  const { data: watchlistStats } = useWatchlistStats();

  const reviews = reviewsData?.reviews || [];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
    : 0;

  if (!user) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-96">
          <p className="text-gray-600 dark:text-gray-400">Please log in to view your profile.</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Admin Panel - Only shown to admins */}
        {user.isAdmin && <AdminPanel />}

        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.profilePic ? (
                <img
                  src={user.profilePic}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover"
                />
              ) : (
                user.username.charAt(0).toUpperCase()
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{user.username}</h1>
                {user.isAdmin && (
                  <span className="bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 text-sm px-2 py-1 rounded-full font-medium">
                    Admin
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-gray-600 dark:text-gray-400 mb-2">{user.email}</p>
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>Joined {formatDate(user.joinDate)}</span>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowEditModal(true)}
                className="self-start mt-4"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {reviews.length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Reviews Written
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {averageRating.toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Average Rating
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <Film className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {watchlistStats?.totalMovies || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Watchlist Movies
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 text-center">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {user.isAdmin ? 'Admin' : 'Member'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Account Type
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
            My Reviews ({reviews.length})
          </h2>

          {reviewsLoading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} showMovieTitle />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Star className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                No reviews yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Start reviewing movies to share your thoughts with the community
              </p>
              <Button>
                <a href="/movies">Browse Movies</a>
              </Button>
            </div>
          )}
        </div>

        {/* Edit Profile Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          title="Edit Profile"
        >
          <form className="space-y-4">
            <Input
              label="Username"
              defaultValue={user.username}
              placeholder="Enter your username"
            />
            <Input
              label="Email"
              type="email"
              defaultValue={user.email}
              placeholder="Enter your email"
            />
            <Input
              label="Profile Picture URL"
              defaultValue={user.profilePic || ''}
              placeholder="Enter image URL"
            />
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                Save Changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};