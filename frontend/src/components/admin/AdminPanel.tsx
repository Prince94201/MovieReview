import React, { useState } from 'react';
import { Plus, Trash2, Edit, Shield } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { useCreateMovie, useUpdateMovie, useDeleteMovie } from '../../hooks/useMovies';
import { toast } from '../ui/Toast';

interface MovieFormData {
  title: string;
  genre: string;
  releaseYear: number;
  director: string;
  cast: string;
  synopsis: string;
  posterUrl: string;
}

export const AdminPanel: React.FC = () => {
  const { user } = useAuth();
  const [showAddMovieModal, setShowAddMovieModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any>(null);
  const [movieForm, setMovieForm] = useState<MovieFormData>({
    title: '',
    genre: '',
    releaseYear: new Date().getFullYear(),
    director: '',
    cast: '',
    synopsis: '',
    posterUrl: ''
  });

  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();
  const deleteMovie = useDeleteMovie();

  if (!user?.isAdmin) {
    return null;
  }

  const handleSubmitMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await updateMovie.mutateAsync({ id: editingMovie.id, data: movieForm });
        toast.success('Movie updated successfully!');
        setEditingMovie(null);
      } else {
        await createMovie.mutateAsync(movieForm);
        toast.success('Movie added successfully!');
      }
      setShowAddMovieModal(false);
      setMovieForm({
        title: '',
        genre: '',
        releaseYear: new Date().getFullYear(),
        director: '',
        cast: '',
        synopsis: '',
        posterUrl: ''
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save movie');
    }
  };

  const handleDeleteMovie = async (movieId: number) => {
    if (window.confirm('Are you sure you want to delete this movie? This action cannot be undone.')) {
      try {
        await deleteMovie.mutateAsync(movieId);
        toast.success('Movie deleted successfully!');
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to delete movie');
      }
    }
  };

  const openEditModal = (movie: any) => {
    setEditingMovie(movie);
    setMovieForm({
      title: movie.title,
      genre: movie.genre,
      releaseYear: movie.releaseYear,
      director: movie.director,
      cast: movie.cast,
      synopsis: movie.synopsis,
      posterUrl: movie.posterUrl
    });
    setShowAddMovieModal(true);
  };

  return (
    <>
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-4 rounded-lg mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-5 h-5" />
          <h2 className="text-lg font-semibold">Admin Panel</h2>
        </div>
        <p className="text-red-100 text-sm">You have administrative privileges to manage movies and reviews</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Movie Management</h3>
          <Button
            onClick={() => {
              setEditingMovie(null);
              setMovieForm({
                title: '',
                genre: '',
                releaseYear: new Date().getFullYear(),
                director: '',
                cast: '',
                synopsis: '',
                posterUrl: ''
              });
              setShowAddMovieModal(true);
            }}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Movie
          </Button>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          As an admin, you can add new movies, edit existing ones, and delete movies from the platform.
          You also have the ability to delete any user's review.
        </p>
      </div>

      {/* Add/Edit Movie Modal */}
      <Modal
        isOpen={showAddMovieModal}
        onClose={() => {
          setShowAddMovieModal(false);
          setEditingMovie(null);
        }}
        title={editingMovie ? 'Edit Movie' : 'Add New Movie'}
      >
        <form onSubmit={handleSubmitMovie} className="space-y-4">
          <Input
            label="Title"
            value={movieForm.title}
            onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
            required
          />
          <Input
            label="Genre"
            value={movieForm.genre}
            onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
            required
          />
          <Input
            label="Release Year"
            type="number"
            value={movieForm.releaseYear}
            onChange={(e) => setMovieForm({ ...movieForm, releaseYear: parseInt(e.target.value) })}
            required
          />
          <Input
            label="Director"
            value={movieForm.director}
            onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
            required
          />
          <Input
            label="Cast"
            value={movieForm.cast}
            onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
          />
          <Input
            label="Synopsis"
            value={movieForm.synopsis}
            onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })}
            required
          />
          <Input
            label="Poster URL"
            value={movieForm.posterUrl}
            onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              loading={createMovie.isPending || updateMovie.isPending}
              className="flex-1"
            >
              {editingMovie ? 'Update Movie' : 'Add Movie'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setShowAddMovieModal(false);
                setEditingMovie(null);
              }}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
};