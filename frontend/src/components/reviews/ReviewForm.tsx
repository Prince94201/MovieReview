import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';
import { useCreateOrUpdateReview } from '../../hooks/useReviews';

interface ReviewFormProps {
  movieId: string;
  onSuccess?: () => void;
}

interface ReviewFormData {
  rating: number;
  reviewText?: string;
}

const schema = yup.object({
  rating: yup.number().min(1, 'Please select a rating').max(5).required('Rating is required'),
  reviewText: yup.string().optional().max(1000, 'Review must be less than 1000 characters'),
});

export const ReviewForm: React.FC<ReviewFormProps> = ({ movieId, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const createOrUpdateReview = useCreateOrUpdateReview();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<ReviewFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      rating: 0,
      reviewText: '',
    },
  });

  // Watch the rating value to keep it in sync
  const watchedRating = watch('rating');

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
    setValue('rating', newRating, { shouldValidate: true });
  };

  const onSubmit = async (data: ReviewFormData) => {
    try {
      await createOrUpdateReview.mutateAsync({
        movieId: parseInt(movieId),
        reviewData: {
          rating: data.rating,
          reviewText: data.reviewText || undefined,
        },
      });
      
      reset();
      setRating(0);
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Rating *
        </label>
        <StarRating
          rating={rating || watchedRating}
          onRatingChange={handleRatingChange}
          size="lg"
        />
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.rating.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Your Review (Optional)
        </label>
        <textarea
          {...register('reviewText')}
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Share your thoughts about this movie..."
        />
        {errors.reviewText && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.reviewText.message}
          </p>
        )}
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          Maximum 1000 characters
        </p>
      </div>

      <Button
        type="submit"
        loading={createOrUpdateReview.isPending}
        disabled={rating === 0 && watchedRating === 0}
        className="w-full"
      >
        Submit Review
      </Button>
    </form>
  );
};