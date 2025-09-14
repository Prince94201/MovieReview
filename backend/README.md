# Movie Review Platform Backend

A RESTful API for a movie review platform built with Node.js, Express, Sequelize, and MySQL.

## Features

- **User Authentication**: JWT-based registration and login
- **Movie Management**: CRUD operations for movies (admin only)
- **Review System**: Users can create, update, and delete reviews
- **Watchlist**: Personal movie watchlist for each user
- **Search & Filter**: Movie search by title, director, cast, and genre
- **Rating System**: Automatic average rating calculation
- **Security**: Rate limiting, CORS, helmet, input validation

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/password` - Change password

### Movies
- `GET /api/movies` - Get all movies (with search, filter, pagination)
- `GET /api/movies/:id` - Get single movie with reviews
- `GET /api/movies/top-rated` - Get top-rated movies
- `GET /api/movies/genre/:genre` - Get movies by genre
- `POST /api/movies` - Create movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)

### Reviews
- `GET /api/reviews/movies/:movieId/reviews` - Get movie reviews
- `GET /api/reviews/users/:userId/reviews` - Get user reviews
- `GET /api/reviews/my-reviews` - Get current user's reviews
- `POST /api/reviews/movies/:movieId` - Create/update review
- `DELETE /api/reviews/:id` - Delete review

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `GET /api/watchlist/stats` - Get watchlist statistics
- `GET /api/watchlist/check/:movieId` - Check if movie is in watchlist
- `POST /api/watchlist/:movieId` - Add movie to watchlist
- `DELETE /api/watchlist/:movieId` - Remove movie from watchlist

## Setup Instructions

### 1. Environment Variables
Update the `.env` file with your database credentials:
```env
PORT=5000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASS=your_mysql_password
DB_NAME=movie_review
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=development
```

### 2. Database Setup
Make sure MySQL is installed and running, then create the database:
```sql
CREATE DATABASE movie_review;
```

### 3. Install Dependencies & Start
```bash
npm install
npm run dev
```

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run db:create` - Create database
- `npm run db:migrate` - Run migrations
- `npm run db:seed` - Run seeders
- `npm run db:reset` - Reset database (drop, create, migrate, seed)

## Database Schema

### Users
- id, username, email, password, profilePic, joinDate, isAdmin

### Movies
- id, title, genre, releaseYear, director, cast, synopsis, posterUrl, avgRating

### Reviews
- id, userId, movieId, rating, reviewText, timestamp

### Watchlists
- id, userId, movieId, addedAt

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting (100 requests per 15 minutes)
- Input validation and sanitization
- CORS configuration
- Helmet for security headers
- SQL injection prevention with Sequelize ORM

## Response Format

All API responses follow this format:
```json
{
  "success": true|false,
  "message": "Response message",
  "data": { ... },
  "errors": [ ... ] // Only for validation errors
}
```

## Testing

Test the API using tools like Postman or curl. The server includes a health check endpoint:
```
GET /api/health
```