import React, { useState, useMemo } from 'react';
import { Layout } from '../components/layout/Layout';
import { MovieGrid } from '../components/movies/MovieGrid';
import { MovieFilters } from '../components/movies/MovieFilters';
import { Button } from '../components/ui/Button';
import { useMovies } from '../hooks/useMovies';
import { MovieFilters as MovieFiltersType } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const initialFilters: MovieFiltersType = {
  search: '',
  genre: '',
  releaseYear: [1900, new Date().getFullYear()],
  rating: 0,
  sortBy: 'title',
  sortOrder: 'asc',
};

export const MoviesPage: React.FC = () => {
  const [filters, setFilters] = useState<MovieFiltersType>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 20;

  // Debounce search to avoid too many API calls
  const [debouncedFilters, setDebouncedFilters] = useState(filters);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedFilters(filters);
      setCurrentPage(1); // Reset to first page when filters change
    }, 300);

    return () => clearTimeout(timer);
  }, [filters]);

  const { data, isLoading, error } = useMovies(debouncedFilters, {
    page: currentPage,
    limit,
  });

  const handleFiltersChange = (newFilters: MovieFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const totalPages = data?.data?.pagination?.totalPages || 0;
  const currentMovies = data?.data?.movies || [];

  // Generate pagination numbers
  const paginationNumbers = useMemo(() => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  }, [currentPage, totalPages]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Movies
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Discover and explore our collection of movies
          </p>
        </div>

        <MovieFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />

        {data?.data && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Showing {((currentPage - 1) * limit) + 1}-{Math.min(currentPage * limit, data.data.pagination.totalItems)} of {data.data.pagination.totalItems} movies
            </p>
          </div>
        )}

        <MovieGrid
          movies={currentMovies}
          loading={isLoading}
          error={error?.message}
        />

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {paginationNumbers.map((page, index) => (
              <React.Fragment key={index}>
                {page === '...' ? (
                  <span className="px-3 py-2 text-gray-500">...</span>
                ) : (
                  <Button
                    variant={currentPage === page ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => handlePageChange(page as number)}
                  >
                    {page}
                  </Button>
                )}
              </React.Fragment>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};