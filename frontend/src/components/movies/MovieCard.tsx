import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Heart, Edit, Trash2, Shield } from 'lucide-react';
import { Movie } from '../../types';
import { StarRating } from '../ui/StarRating';
import { Button } from '../ui/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useWatchlistStatus, useToggleWatchlist } from '../../hooks/useWatchlist';
import { useDeleteMovie } from '../../hooks/useMovies';

interface MovieCardProps {
  movie: Movie;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const { user } = useAuth();
  const { data: inWatchlist = false } = useWatchlistStatus(movie.id.toString());
  const toggleWatchlist = useToggleWatchlist();
  const deleteMovie = useDeleteMovie();

  const handleWatchlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) return;
    
    toggleWatchlist.mutate({
      movieId: movie.id,
      isInWatchlist: inWatchlist,
    });
  };

  const handleDeleteMovie = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone and will also delete all reviews for this movie.')) {
      deleteMovie.mutate(movie.id);
    }
  };

  return (
    <Link to={`/movies/${movie.id}`} className="group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group-hover:scale-105">
        {/* Movie Poster */}
        <div className="relative aspect-[2/3] bg-gray-200 dark:bg-gray-700">
          {movie.posterUrl ? (
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <span className="text-sm">No Image</span>
            </div>
          )}
          
          {/* Action buttons overlay */}
          <div className="absolute top-2 right-2 flex flex-col gap-2">
            {/* Admin controls */}
            {user?.isAdmin && (
              <div className="flex flex-col gap-1">
                <button
                  onClick={handleDeleteMovie}
                  disabled={deleteMovie.isPending}
                  className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors shadow-md"
                  title="Delete movie (Admin)"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
                <div className="flex items-center gap-1 text-xs text-white bg-red-500/80 px-1.5 py-0.5 rounded">
                  <Shield className="w-2 h-2" />
                  <span>Admin</span>
                </div>
              </div>
            )}
            
            {/* Watchlist button */}
            {user && !user.isAdmin && (
              <button
                onClick={handleWatchlistToggle}
                disabled={toggleWatchlist.isPending}
                className={`
                  p-2 rounded-full transition-all duration-200 shadow-md
                  ${inWatchlist 
                    ? 'bg-red-500 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                  }
                  hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
              >
                <Heart className={`w-4 h-4 ${inWatchlist ? 'fill-current' : ''}`} />
              </button>
            )}

            {/* Combined admin and watchlist for admin users */}
            {user?.isAdmin && (
              <button
                onClick={handleWatchlistToggle}
                disabled={toggleWatchlist.isPending}
                className={`
                  p-2 rounded-full transition-all duration-200 shadow-md
                  ${inWatchlist 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-white/80 text-gray-600 hover:bg-white'
                  }
                  hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
                title="Add to watchlist"
              >
                <Heart className={`w-3 h-3 ${inWatchlist ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>
        </div>

        {/* Movie Info */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-gray-100 mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {movie.title}
          </h3>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
            <Calendar className="w-4 h-4" />
            <span>{movie.releaseYear}</span>
            <span className="text-gray-400">•</span>
            <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
              {movie.genre}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <StarRating rating={Number(movie.avgRating) || 0} readonly size="sm" />
            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
              {Number(movie.avgRating || 0).toFixed(1)}
            </span>
          </div>

          {movie.director && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Dir. {movie.director}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};