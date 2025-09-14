import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Watchlist, PaginationParams, ApiResponse, WatchlistStats } from '../types';
import api from '../lib/api';
import { toast } from '../components/ui/Toast';

export const useWatchlist = (pagination: PaginationParams) => {
  return useQuery({
    queryKey: ['watchlist', pagination],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await api.get<ApiResponse<{
        watchlist: Watchlist[];
        pagination: {
          currentPage: number;
          totalPages: number;
          totalItems: number;
          itemsPerPage: number;
        };
      }>>(`/watchlist?${params}`);
      return response.data.data.watchlist;
    },
    staleTime: 2 * 60 * 1000,
  });
};

export const useWatchlistStats = () => {
  return useQuery({
    queryKey: ['watchlist', 'stats'],
    queryFn: async () => {
      const response = await api.get<ApiResponse<WatchlistStats>>('/watchlist/stats');
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useWatchlistStatus = (movieId: string) => {
  return useQuery({
    queryKey: ['watchlist', 'status', movieId],
    queryFn: async () => {
      const response = await api.get<ApiResponse<{ inWatchlist: boolean }>>(`/watchlist/check/${movieId}`);
      return response.data.data.inWatchlist;
    },
    enabled: !!movieId,
    staleTime: 1 * 60 * 1000,
  });
};

export const useAddToWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movieId: number) => {
      const response = await api.post<ApiResponse<Watchlist>>(`/watchlist/${movieId}`);
      return response.data.data;
    },
    onSuccess: (_, movieId) => {
      toast.success('Movie added to watchlist!');
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      queryClient.invalidateQueries({ queryKey: ['watchlist', 'status', movieId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['watchlist', 'stats'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to add movie to watchlist';
      toast.error(message);
    },
  });
};

export const useRemoveFromWatchlist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movieId: number) => {
      await api.delete(`/watchlist/${movieId}`);
    },
    onSuccess: (_, movieId) => {
      toast.success('Movie removed from watchlist!');
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['watchlist'] });
      queryClient.invalidateQueries({ queryKey: ['watchlist', 'status', movieId.toString()] });
      queryClient.invalidateQueries({ queryKey: ['watchlist', 'stats'] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || 'Failed to remove movie from watchlist';
      toast.error(message);
    },
  });
};

// Custom hook to toggle watchlist status
export const useToggleWatchlist = () => {
  const addToWatchlist = useAddToWatchlist();
  const removeFromWatchlist = useRemoveFromWatchlist();

  return useMutation({
    mutationFn: async ({ movieId, isInWatchlist }: { movieId: number; isInWatchlist: boolean }) => {
      if (isInWatchlist) {
        return removeFromWatchlist.mutateAsync(movieId);
      } else {
        return addToWatchlist.mutateAsync(movieId);
      }
    },
  });
};