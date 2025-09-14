import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Movie, MovieFilters, PaginationParams, PaginatedApiResponse, ApiResponse } from '../types';
import api from '../lib/api';
import { movieService } from '../lib/services';

export const useMovies = (filters: MovieFilters, pagination: PaginationParams) => {
  return useQuery({
    queryKey: ['movies', filters, pagination],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      // Add search parameter if provided
      if (filters.search) {
        params.append('search', filters.search);
      }

      // Add genre filter if provided
      if (filters.genre) {
        params.append('genre', filters.genre);
      }

      // Add sorting
      if (filters.sortBy) {
        params.append('sortBy', filters.sortBy);
        params.append('sortOrder', filters.sortOrder.toUpperCase());
      }

      const response = await api.get<PaginatedApiResponse<Movie>>(`/movies?${params}`);
      return response.data;
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useMovie = (id: string) => {
  return useQuery({
    queryKey: ['movie', id],
    queryFn: async () => {
      const response = await api.get<ApiResponse<Movie>>(`/movies/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
};

export const useTopRatedMovies = (limit = 10, minReviews = 3) => {
  return useQuery({
    queryKey: ['movies', 'top-rated', limit, minReviews],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        minReviews: minReviews.toString(),
      });

      const response = await api.get<ApiResponse<Movie[]>>(`/movies/top-rated?${params}`);
      return response.data.data;
    },
    staleTime: 10 * 60 * 1000,
  });
};

export const useTrendingMovies = (limit = 10, days = 30) => {
  return useQuery({
    queryKey: ['movies', 'trending', limit, days],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        days: days.toString(),
      });

      const response = await api.get<ApiResponse<Movie[]>>(`/movies/trending?${params}`);
      return response.data.data;
    },
    staleTime: 5 * 60 * 1000, // Shorter cache for trending content
  });
};

export const useMoviesByCategory = (category: 'latest' | 'highest-rated' | 'most-reviewed', limit = 10) => {
  return useQuery({
    queryKey: ['movies', 'category', category, limit],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
      });

      const response = await api.get<ApiResponse<Movie[]>>(`/movies/category/${category}?${params}`);
      return response.data.data;
    },
    enabled: !!category,
    staleTime: 8 * 60 * 1000,
  });
};

export const useMoviesByGenre = (genre: string, pagination: PaginationParams) => {
  return useQuery({
    queryKey: ['movies', 'genre', genre, pagination],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      const response = await api.get<PaginatedApiResponse<Movie>>(`/movies/genre/${genre}?${params}`);
      return response.data;
    },
    enabled: !!genre,
    staleTime: 5 * 60 * 1000,
  });
};

export const useMovieStats = () => {
  return useQuery({
    queryKey: ['movie-stats'],
    queryFn: async () => {
      try {
        // Get total movies count from the movies endpoint
        const moviesResponse = await api.get<PaginatedApiResponse<Movie>>('/movies?limit=1');
        const totalMovies = moviesResponse.data.data.pagination.totalItems;
        
        // For now, return basic stats - you can enhance this later
        return {
          totalMovies,
          totalReviews: 0, // You can add this endpoint to your backend later
        };
      } catch (error) {
        console.error('Failed to fetch movie stats:', error);
        return {
          totalMovies: 0,
          totalReviews: 0,
        };
      }
    },
    staleTime: 15 * 60 * 1000,
  });
};

// Admin only mutations
export const useCreateMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (movieData: Partial<Movie>) => {
      const response = await api.post<ApiResponse<Movie>>('/movies', movieData);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
};

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<Movie> }) => {
      const response = await api.put<ApiResponse<Movie>>(`/movies/${id}`, data);
      return response.data.data;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
      queryClient.invalidateQueries({ queryKey: ['movie', id.toString()] });
    },
  });
};

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/movies/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
};