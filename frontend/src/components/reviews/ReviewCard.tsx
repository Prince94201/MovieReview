import React from 'react';
import { Trash2, Calendar, Shield } from 'lucide-react';
import { Review } from '../../types';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useDeleteReview } from '../../hooks/useReviews';

interface ReviewCardProps {
  review: Review;
  showMovieTitle?: boolean;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review, showMovieTitle = false }) => {
  const { user } = useAuth();
  const deleteReview = useDeleteReview();

  const handleDelete = () => {
    const isAdmin = user?.isAdmin;
    const isOwner = user && user.id === review.userId;
    
    if (isAdmin && !isOwner) {
      if (window.confirm('As an admin, you are about to delete another user\'s review. This action cannot be undone. Are you sure?')) {
        deleteReview.mutate(review.id);
      }
    } else if (window.confirm('Are you sure you want to delete this review?')) {
      deleteReview.mutate(review.id);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // User can delete if they own the review OR if they are an admin
  const canDelete = user && (user.id === review.userId || user.isAdmin);
  const isAdminDeletion = user?.isAdmin && user.id !== review.userId;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h4 className="font-semibold text-gray-900 dark:text-gray-100">
              {review.user?.username || 'Anonymous'}
            </h4>
            <StarRating rating={review.rating} readonly size="sm" />
          </div>
          
          {showMovieTitle && review.movie && (
            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
              {review.movie.title}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(review.timestamp)}</span>
          </div>
        </div>

        {canDelete && (
          <div className="flex items-center gap-2">
            {isAdminDeletion && (
              <div className="flex items-center gap-1 text-xs text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/20 px-2 py-1 rounded">
                <Shield className="w-3 h-3" />
                Admin
              </div>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              loading={deleteReview.isPending}
              className={`${isAdminDeletion 
                ? 'text-orange-600 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20' 
                : 'text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20'
              }`}
              title={isAdminDeletion ? 'Delete as admin' : 'Delete your review'}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {review.reviewText && (
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {review.reviewText}
        </p>
      )}
    </div>
  );
};