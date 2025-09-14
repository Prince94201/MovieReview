// Sample movies data for testing
const sampleMovies = [
  {
    id: 1,
    title: "The Godfather",
    genre: "Crime",
    releaseYear: 1972,
    director: "Francis Ford Coppola",
    cast: "Marlon Brando, Al Pacino",
    synopsis: "The aging patriarch of an organized crime dynasty transfers control to his reluctant son.",
    posterUrl: "https://image.tmdb.org/t/p/w500/3bhkrj58Vtu7enYsRolD1fZdja1.jpg"
  },
  {
    id: 2,
    title: "The Dark Knight",
    genre: "Action",
    releaseYear: 2008,
    director: "Christopher Nolan",
    cast: "Christian Bale, Heath Ledger",
    synopsis: "Batman faces the Joker, a criminal mastermind who wants to plunge Gotham City into anarchy.",
    posterUrl: "https://image.tmdb.org/t/p/w500/qJ2tW6WMUDux911r6m7haRef0WH.jpg"
  },
  {
    id: 3,
    title: "Pulp Fiction",
    genre: "Crime",
    releaseYear: 1994,
    director: "Quentin Tarantino",
    cast: "John Travolta, Samuel L. Jackson",
    synopsis: "The lives of two mob hitmen, a boxer, and others intertwine in four tales of violence.",
    posterUrl: "https://image.tmdb.org/t/p/w500/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg"
  },
  {
    id: 4,
    title: "The Shawshank Redemption",
    genre: "Drama", 
    releaseYear: 1994,
    director: "Frank Darabont",
    cast: "Tim Robbins, Morgan Freeman",
    synopsis: "Two imprisoned men bond over years, finding solace through acts of common decency.",
    posterUrl: "https://image.tmdb.org/t/p/w500/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg"
  },
  {
    id: 5,
    title: "Forrest Gump",
    genre: "Drama",
    releaseYear: 1994,
    director: "Robert Zemeckis", 
    cast: "Tom Hanks, Robin Wright",
    synopsis: "A man with low IQ accomplishes great things and influences popular culture.",
    posterUrl: "https://image.tmdb.org/t/p/w500/saHP97rTPS5eLmrLQEcANmKrsFl.jpg"
  },
  {
    id: 6,
    title: "The Matrix",
    genre: "Sci-Fi",
    releaseYear: 1999,
    director: "The Wachowskis",
    cast: "Keanu Reeves, Laurence Fishburne",
    synopsis: "A hacker discovers reality is a simulation and joins a rebellion against machines.",
    posterUrl: "https://image.tmdb.org/t/p/w500/f89U3ADr1oiB1s9GkdPOEpXUk5H.jpg"
  }
];

// Function to add movies via API (requires admin authentication)
export const addSampleMovies = async (adminToken: string) => {
  const results = [];
  
  for (const movie of sampleMovies) {
    try {
      const response = await fetch('http://localhost:3001/api/movies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(movie)
      });
      
      if (response.ok) {
        const result = await response.json();
        results.push({ success: true, movie: movie.title, data: result });
      } else {
        const error = await response.json();
        results.push({ success: false, movie: movie.title, error });
      }
    } catch (error) {
      results.push({ success: false, movie: movie.title, error: error.message });
    }
  }
  
  return results;
};