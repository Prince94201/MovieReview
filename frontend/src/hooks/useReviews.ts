import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Review, PaginationParams, ApiResponse, CreateReviewRequest } from '../types';
import api from '../lib/api';
import { toast } from '../components/ui/Toast';

export const useMovieReviews = (movieId: string, pagination: PaginationParams) => {
  return useQuery({
    queryKey: ['reviews', 'movie', movieId, pagination],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await api.get<ApiResponse<{
        reviews: Review[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
      }>>(`/reviews/movies/${movieId}/reviews?${params}`);
      return response.data.data;
    },
    enabled: !!movieId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useUserReviews = (userId: string, pagination: PaginationParams) => {
  return useQuery({
    queryKey: ['reviews', 'user', userId, pagination],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await api.get<ApiResponse<{
        reviews: Review[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
      }>>(`/reviews/users/${userId}/reviews?${params}`);
      return response.data.data;
    },
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
};

export const useMyReviews = (pagination: PaginationParams) => {
  return useQuery({
    queryKey: ['reviews', 'my-reviews', pagination],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await api.get<ApiResponse<{
        reviews: Review[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
      }>>(`/reviews/my-reviews?${params}`);
      return response.data.data;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useCreateOrUpdateReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ movieId, reviewData }: { movieId: number; reviewData: CreateReviewRequest }) => {
      const response = await api.post<ApiResponse<Review>>(`/reviews/movies/${movieId}`, reviewData);
      return response.data.data;
    },
    onSuccess: (data, { movieId }) => {
      toast.success('Review submitted successfully!');
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['reviews', 'movie', movieId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['reviews', 'my-reviews'] });
      queryClient.invalidateQueries({ queryKey: ['movie', movieId.toString()] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to submit review';
      toast.error(message);
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reviewId: number) => {
      await api.delete(`/reviews/${reviewId}`);
    },
    onSuccess: () => {
      toast.success('Review deleted successfully!');
      // Invalidate all review queries
      queryClient.invalidateQueries({ queryKey: ['reviews'] });
      queryClient.invalidateQueries({ queryKey: ['movies'] }); // To update movie ratings
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to delete review';
      toast.error(message);
    },
  });
};