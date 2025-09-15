import React, { useState } from 'react';
import { Plus, Trash2, Edit, Shield, X } from 'lucide-react';
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

const MOVIE_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Biography',
  'Comedy',
  'Crime',
  'Documentary',
  'Drama',
  'Family',
  'Fantasy',
  'Horror',
  'Music',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Sport',
  'Thriller',
  'War',
  'Western'
];

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

  // Cast management state
  const [castMembers, setCastMembers] = useState<string[]>([]);
  const [newCastMember, setNewCastMember] = useState('');

  const createMovie = useCreateMovie();
  const updateMovie = useUpdateMovie();
  const deleteMovie = useDeleteMovie();

  if (!user?.isAdmin) {
    return null;
  }

  const handleSubmitMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Combine cast members into a comma-separated string
      const formData = {
        ...movieForm,
        cast: castMembers.join(', ')
      };

      if (editingMovie) {
        await updateMovie.mutateAsync({ id: editingMovie.id, data: formData });
        toast.success('Movie updated successfully!');
        setEditingMovie(null);
      } else {
        await createMovie.mutateAsync(formData);
        toast.success('Movie added successfully!');
      }
      setShowAddMovieModal(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save movie');
    }
  };

  const resetForm = () => {
    setMovieForm({
      title: '',
      genre: '',
      releaseYear: new Date().getFullYear(),
      director: '',
      cast: '',
      synopsis: '',
      posterUrl: ''
    });
    setCastMembers([]);
    setNewCastMember('');
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
    
    // Parse existing cast into array
    const existingCast = movie.cast ? movie.cast.split(', ').map((name: string) => name.trim()).filter(Boolean) : [];
    setCastMembers(existingCast);
    setNewCastMember('');
    
    setShowAddMovieModal(true);
  };

  const addCastMember = () => {
    if (newCastMember.trim() && !castMembers.includes(newCastMember.trim())) {
      setCastMembers([...castMembers, newCastMember.trim()]);
      setNewCastMember('');
    }
  };

  const removeCastMember = (index: number) => {
    setCastMembers(castMembers.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCastMember();
    }
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
              resetForm();
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
          resetForm();
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
          
          {/* Genre Dropdown */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Genre <span className="text-red-500">*</span>
            </label>
            <select
              value={movieForm.genre}
              onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
              required
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a genre</option>
              {MOVIE_GENRES.map((genre) => (
                <option key={genre} value={genre}>
                  {genre}
                </option>
              ))}
            </select>
          </div>

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
          
          {/* Dynamic Cast Input */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Cast
            </label>
            
            {/* Add Cast Member Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Add cast member name"
                value={newCastMember}
                onChange={(e) => setNewCastMember(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                onClick={addCastMember}
                disabled={!newCastMember.trim()}
                size="sm"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Cast Members Display */}
            {castMembers.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {castMembers.map((member, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm"
                    >
                      <span>{member}</span>
                      <button
                        type="button"
                        onClick={() => removeCastMember(index)}
                        className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Show comma-separated preview */}
                <div className="text-sm text-gray-600 dark:text-gray-400 p-2 bg-gray-50 dark:bg-gray-700 rounded border">
                  <strong>Preview:</strong> {castMembers.join(', ')}
                </div>
              </div>
            )}
            
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Add cast members one by one. Press Enter or click + to add each member.
            </p>
          </div>
          
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Synopsis <span className="text-red-500">*</span>
            </label>
            <textarea
              value={movieForm.synopsis}
              onChange={(e) => setMovieForm({ ...movieForm, synopsis: e.target.value })}
              required
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter movie synopsis..."
            />
          </div>
          
          <Input
            label="Poster URL"
            value={movieForm.posterUrl}
            onChange={(e) => setMovieForm({ ...movieForm, posterUrl: e.target.value })}
            placeholder="https://example.com/poster.jpg"
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
                resetForm();
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