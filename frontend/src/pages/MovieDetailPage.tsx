import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, User, Heart, ArrowLeft, Users } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { StarRating } from '../components/ui/StarRating';
import { Button } from '../components/ui/Button';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ReviewCard } from '../components/reviews/ReviewCard';
import { ReviewForm } from '../components/reviews/ReviewForm';
import { Modal } from '../components/ui/Modal';
import { useMovie } from '../hooks/useMovies';
import { useMovieReviews } from '../hooks/useReviews';
import { useWatchlistStatus, useToggleWatchlist } from '../hooks/useWatchlist';
import { useAuth } from '../contexts/AuthContext';

export const MovieDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: movie, isLoading: movieLoading, error: movieError } = useMovie(id!);
  const { data: reviewsData, isLoading: reviewsLoading } = useMovieReviews(id!, { 
    page: currentPage, 
    limit: 10 
  });
  const { data: inWatchlist = false } = useWatchlistStatus(id!);
  const toggleWatchlist = useToggleWatchlist();

  const reviews = reviewsData?.reviews || [];

  const handleWatchlistToggle = () => {
    if (!user) return;
    
    toggleWatchlist.mutate({
      movieId: parseInt(id!),
      isInWatchlist: inWatchlist,
    });
  };

  const handleReviewSuccess = () => {
    setShowReviewForm(false);
  };

  if (movieLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (movieError || !movie) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              Movie Not Found
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              The movie you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/movies"
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Back to Movies
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  const userReview = reviews.find(review => review.userId === user?.id);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Button variant="ghost" size="sm" className="mb-6">
          <Link to="/movies">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Movies
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Movie Poster */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <div className="aspect-[2/3] bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-6">
                {movie.posterUrl ? (
                  <img
                    src={movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span>No Image Available</span>
                  </div>
                )}
              </div>

              {/* Watchlist Button */}
              {user && (
                <Button
                  onClick={handleWatchlistToggle}
                  loading={toggleWatchlist.isPending}
                  variant={inWatchlist ? 'danger' : 'primary'}
                  className="w-full mb-4"
                >
                  <Heart className={`w-4 h-4 mr-2 ${inWatchlist ? 'fill-current' : ''}`} />
                  {inWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                </Button>
              )}

              {/* Review Button */}
              {user && !userReview && (
                <Button
                  onClick={() => setShowReviewForm(true)}
                  variant="outline"
                  className="w-full"
                >
                  Write a Review
                </Button>
              )}
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-2">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {movie.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">{movie.releaseYear}</span>
                </div>
                
                <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
                  {movie.genre}
                </span>

                <div className="flex items-center gap-2">
                  <StarRating rating={movie.avgRating} readonly />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    ({reviews.length} reviews)
                  </span>
                </div>
              </div>

              {movie.director && (
                <div className="flex items-center gap-2 mb-4">
                  <User className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700 dark:text-gray-300">
                    Directed by {movie.director}
                  </span>
                </div>
              )}

              {movie.cast && (
                <div className="flex items-start gap-2 mb-6">
                  <Users className="w-5 h-5 text-gray-500 mt-0.5" />
                  <div>
                    <span className="text-gray-700 dark:text-gray-300">Cast: </span>
                    <span className="text-gray-600 dark:text-gray-400">{movie.cast}</span>
                  </div>
                </div>
              )}

              {movie.synopsis && (
                <div className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                    Synopsis
                  </h2>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {movie.synopsis}
                  </p>
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                Reviews ({reviews.length})
              </h2>

              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    No reviews yet. Be the first to review this movie!
                  </p>
                  {user && (
                    <Button onClick={() => setShowReviewForm(true)}>
                      Write First Review
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Review Form Modal */}
        <Modal
          isOpen={showReviewForm}
          onClose={() => setShowReviewForm(false)}
          title="Write a Review"
          size="md"
        >
          <ReviewForm movieId={id!} onSuccess={handleReviewSuccess} />
        </Modal>
      </div>
    </Layout>
  );
};