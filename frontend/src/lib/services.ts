import { ApiResponse, User, Movie, Review, Watchlist } from '../types';
import api from './api';

// Auth Services
export const authService = {
  // Get current user profile
  getProfile: () => api.get<ApiResponse<User>>('/auth/me'),
  
  // Update user profile
  updateProfile: (data: Partial<User>) => 
    api.put<ApiResponse<User>>('/auth/profile', data),
  
  // Change password
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.put<ApiResponse<{ message: string }>>('/auth/password', data),
};

// Movie Services
export const movieService = {
  // Health check
  healthCheck: () => api.get<ApiResponse<{ message: string; timestamp: string }>>('/health'),
  
  // Get movie statistics (for admin dashboard)
  getStats: async () => {
    const [moviesResponse, topRatedResponse] = await Promise.all([
      api.get<any>('/movies?limit=1'), // Get total count from pagination
      api.get<ApiResponse<Movie[]>>('/movies/top-rated?limit=1'),
    ]);
    
    return {
      totalMovies: moviesResponse.data?.data?.pagination?.totalItems || 0,
      totalReviews: 0, // This would need to be calculated from reviews
    };
  },
};

// Review Services  
export const reviewService = {
  // Get review by ID (for editing)
  getReview: (reviewId: string) => 
    api.get<ApiResponse<Review>>(`/reviews/${reviewId}`),
};

// Watchlist Services
export const watchlistService = {
  // Get full watchlist (all movies)
  getFullWatchlist: () => 
    api.get<ApiResponse<Watchlist[]>>('/watchlist?limit=1000'),
};

// Utility function to handle API errors
export const handleApiError = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  
  if (error.response?.status === 401) {
    return 'Authentication required. Please log in again.';
  }
  
  if (error.response?.status === 403) {
    return 'You do not have permission to perform this action.';
  }
  
  if (error.response?.status === 404) {
    return 'The requested resource was not found.';
  }
  
  if (error.response?.status >= 500) {
    return 'Server error. Please try again later.';
  }
  
  if (error.code === 'NETWORK_ERROR' || !error.response) {
    return 'Network error. Please check your connection and try again.';
  }
  
  return 'An unexpected error occurred. Please try again.';
};