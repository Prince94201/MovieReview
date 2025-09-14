import React from 'react';
import { Search, Filter, X } from 'lucide-react';
import { MovieFilters as MovieFiltersType } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface MovieFiltersProps {
  filters: MovieFiltersType;
  onFiltersChange: (filters: MovieFiltersType) => void;
  onClearFilters: () => void;
}

const genres = [
  'All',
  'Action',
  'Comedy',
  'Drama',
  'Horror',
  'Sci-Fi',
  'Romance',
  'Thriller',
  'Adventure',
  'Animation',
  'Crime',
  'Fantasy',
];

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 50 }, (_, i) => currentYear - i);

export const MovieFilters: React.FC<MovieFiltersProps> = ({
  filters,
  onFiltersChange,
  onClearFilters,
}) => {
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({ ...filters, search: e.target.value });
  };

  const handleGenreChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onFiltersChange({ ...filters, genre: e.target.value === 'All' ? '' : e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [sortBy, sortOrder] = e.target.value.split('-') as [string, 'asc' | 'desc'];
    onFiltersChange({ ...filters, sortBy: sortBy as any, sortOrder });
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    onFiltersChange({ ...filters, rating: value });
  };

  const hasActiveFilters = filters.search || filters.genre || filters.rating > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearFilters}
            className="ml-auto"
          >
            <X className="w-4 h-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search movies..."
            value={filters.search}
            onChange={handleSearchChange}
            className="pl-10"
          />
        </div>

        {/* Genre */}
        <select
          value={filters.genre || 'All'}
          onChange={handleGenreChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        {/* Sort */}
        <select
          value={`${filters.sortBy}-${filters.sortOrder}`}
          onChange={handleSortChange}
          className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="title-asc">Title A-Z</option>
          <option value="title-desc">Title Z-A</option>
          <option value="releaseYear-desc">Newest First</option>
          <option value="releaseYear-asc">Oldest First</option>
          <option value="avgRating-desc">Highest Rated</option>
          <option value="avgRating-asc">Lowest Rated</option>
        </select>

        {/* Rating Filter */}
        <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
            Min Rating:
          </label>
          <div className="flex-1 flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.rating}
              onChange={handleRatingChange}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-600 slider"
              style={{
                background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${(filters.rating / 5) * 100}%, #D1D5DB ${(filters.rating / 5) * 100}%, #D1D5DB 100%)`
              }}
            />
            <div className="flex items-center gap-1 min-w-[3rem]">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {filters.rating === 0 ? 'Any' : `${filters.rating}+`}
              </span>
              {filters.rating > 0 && (
                <div className="flex">
                  {[...Array(Math.floor(filters.rating))].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xs">★</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};