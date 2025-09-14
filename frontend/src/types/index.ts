export interface User {
  id: number;
  username: string;
  email: string;
  profilePic?: string;
  joinDate: string;
  isAdmin: boolean;
}

export interface Movie {
  id: number;
  title: string;
  genre: string;
  releaseYear: number;
  director: string;
  cast?: string;
  synopsis?: string;
  posterUrl?: string;
  avgRating: number;
  reviewCount?: number;
  reviews?: Review[];
}

export interface Review {
  id: number;
  userId: number;
  movieId: number;
  rating: number;
  reviewText?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
  user?: Pick<User, 'id' | 'username' | 'profilePic'>;
  movie?: Pick<Movie, 'id' | 'title' | 'posterUrl'>;
}

export interface Watchlist {
  id: number;
  userId: number;
  movieId: number;
  addedAt: string;
  movie?: Movie;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

export interface MovieFilters {
  search: string;
  genre: string;
  releaseYear: [number, number];
  rating: number;
  sortBy: 'title' | 'releaseYear' | 'avgRating' | 'createdAt';
  sortOrder: 'asc' | 'desc' | 'ASC' | 'DESC';
}

export interface PaginationParams {
  page: number;
  limit: number;
}

// Backend API response structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedApiResponse<T> {
  success: boolean;
  data: {
    movies: T[];
    pagination: {
      currentPage: number;
      totalPages: number;
      totalItems: number;
      itemsPerPage: number;
    };
  };
}

export interface WatchlistStats {
  totalMovies: number;
  genres: { [genre: string]: number };
  averageRating: number;
}

// Login/Register request types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface CreateReviewRequest {
  rating: number;
  reviewText?: string;
}