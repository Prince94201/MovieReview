# 🎬 Movie Review Platform

A modern, full-stack web application for discovering, reviewing, and managing your favorite movies. Built with React, TypeScript, Node.js, and MySQL.

## ✨ Features

### 🎯 Core Functionality
- **Movie Discovery**: Browse and search through a comprehensive movie database
- **User Reviews**: Write, edit, and manage movie reviews with star ratings
- **Personal Watchlist**: Save movies to watch later
- **User Authentication**: Secure registration and login system
- **Admin Panel**: Administrative interface for content management
- **Movie Details**: Comprehensive movie information with trailers and cast details

### 🛡️ Security & Performance
- JWT-based authentication
- Rate limiting protection (1000 requests per 15 minutes)
- Input validation and sanitization
- CORS protection
- Security headers with Helmet.js
- Protected routes and middleware
- Password hashing with bcrypt

### 🎨 User Experience
- Responsive design with Tailwind CSS
- Dark/Light theme support
- Loading states and error handling
- Toast notifications
- Mobile-friendly interface
- Real-time data updates with TanStack Query
- Form validation with React Hook Form

## 🏗️ Tech Stack

### Frontend
- **React 18** - Modern UI library with hooks
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router DOM** - Client-side routing
- **TanStack Query** - Data fetching, caching, and synchronization
- **React Hook Form** - Form management with validation
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful and consistent icons
- **Yup** - Schema validation

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **Sequelize** - SQL ORM with migrations and seeders
- **MySQL** - Relational database
- **JWT** - Stateless authentication tokens
- **bcrypt** - Secure password hashing
- **Express Validator** - Server-side input validation
- **Express Rate Limit** - API rate limiting
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/movie-review-platform.git
   cd Latracal
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```

   Create a `.env` file in the backend directory:
   ```env
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=movie_review_db
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_DIALECT=mysql
   
   # JWT Configuration
   JWT_SECRET=your_super_secret_jwt_key_min_32_characters
   JWT_EXPIRES_IN=7d
   
   # Server Configuration
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   
   # Optional: External API Keys
   TMDB_API_KEY=your_tmdb_api_key
   ```

   Set up the database:
   ```bash
   # Create database
   npm run db:create
   
   # Run migrations to create tables
   npm run db:migrate
   
   # Seed database with sample data
   npm run db:seed
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

   Create a `.env` file in the frontend directory:
   ```env
   VITE_API_BASE_URL=http://localhost:3001/api
   VITE_APP_NAME=Movie Review Platform
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm run dev
   ```
   The backend will be available at http://localhost:3001

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at http://localhost:5173

3. **Access the application**
   - **Frontend**: http://localhost:5173
   - **Backend API**: http://localhost:3001/api
   - **Health Check**: http://localhost:3001/api/health

## 📁 Project Structure

```
Latracal/
├── backend/                 # Node.js/Express API server
│   ├── config/             # Database and application configuration
│   │   ├── config.js       # Sequelize configuration
│   │   └── database.js     # Database connection setup
│   ├── controllers/        # Request handlers and business logic
│   │   ├── authController.js
│   │   ├── movieController.js
│   │   ├── reviewController.js
│   │   └── watchlistController.js
│   ├── middleware/         # Express middleware
│   │   ├── auth.js         # JWT authentication middleware
│   │   ├── errorHandler.js # Global error handling
│   │   └── validation.js   # Input validation middleware
│   ├── models/             # Sequelize database models
│   │   ├── index.js        # Models index and associations
│   │   ├── Movie.js        # Movie model
│   │   ├── Review.js       # Review model
│   │   ├── User.js         # User model
│   │   └── Watchlist.js    # Watchlist model
│   ├── routes/             # API route definitions
│   │   ├── auth.js         # Authentication routes
│   │   ├── movies.js       # Movie CRUD routes
│   │   ├── reviews.js      # Review CRUD routes
│   │   └── watchlist.js    # Watchlist routes
│   ├── package.json        # Backend dependencies and scripts
│   └── server.js           # Application entry point
│
└── frontend/               # React/TypeScript client application
    ├── src/
    │   ├── components/     # Reusable UI components
    │   │   ├── admin/      # Admin-specific components
    │   │   ├── auth/       # Authentication components
    │   │   ├── layout/     # Layout components (Header, Footer)
    │   │   ├── movies/     # Movie-related components
    │   │   ├── reviews/    # Review components
    │   │   └── ui/         # Generic UI components
    │   ├── contexts/       # React context providers
    │   │   ├── AuthContext.tsx    # Authentication state
    │   │   └── ThemeContext.tsx   # Theme management
    │   ├── hooks/          # Custom React hooks
    │   │   ├── useAuth.ts
    │   │   ├── useMovies.ts
    │   │   ├── useReviews.ts
    │   │   └── useWatchlist.ts
    │   ├── lib/            # Utilities and services
    │   │   ├── api.ts      # Axios configuration
    │   │   ├── queryClient.ts   # TanStack Query setup
    │   │   ├── sampleData.ts    # Sample data for development
    │   │   └── services.ts      # API service functions
    │   ├── pages/          # Page components
    │   │   ├── HomePage.tsx
    │   │   ├── LoginPage.tsx
    │   │   ├── MovieDetailPage.tsx
    │   │   ├── MoviesPage.tsx
    │   │   ├── ProfilePage.tsx
    │   │   ├── RegisterPage.tsx
    │   │   └── WatchlistPage.tsx
    │   ├── types/          # TypeScript type definitions
    │   │   └── index.ts
    │   ├── App.tsx         # Main application component
    │   └── main.tsx        # Application entry point
    ├── public/             # Static assets
    ├── package.json        # Frontend dependencies and scripts
    └── vite.config.ts      # Vite configuration
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get current user profile
- `PUT /api/auth/profile` - Update user profile

### Movies
- `GET /api/movies` - Get all movies (with pagination and filters)
- `GET /api/movies/:id` - Get specific movie details
- `POST /api/movies` - Create new movie (admin only)
- `PUT /api/movies/:id` - Update movie (admin only)
- `DELETE /api/movies/:id` - Delete movie (admin only)
- `GET /api/movies/search?q=query` - Search movies

### Reviews
- `GET /api/reviews` - Get all reviews
- `GET /api/reviews/movie/:movieId` - Get reviews for specific movie
- `POST /api/reviews` - Create new review (authenticated)
- `PUT /api/reviews/:id` - Update own review
- `DELETE /api/reviews/:id` - Delete own review
- `GET /api/reviews/user/:userId` - Get reviews by user

### Watchlist
- `GET /api/watchlist` - Get user's watchlist
- `POST /api/watchlist` - Add movie to watchlist
- `DELETE /api/watchlist/:movieId` - Remove movie from watchlist

### System
- `GET /api/health` - Health check endpoint

## 🧪 Available Scripts

### Backend Scripts
```bash
npm start          # Start production server
npm run dev        # Start development server with nodemon
npm run db:create  # Create database
npm run db:migrate # Run database migrations
npm run db:seed    # Seed database with sample data
npm run db:reset   # Reset database (drop, create, migrate, seed)
```

### Frontend Scripts
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint linter
```

## 🌟 Key Features Explained

### Authentication System
- Secure JWT-based authentication
- Password hashing with bcrypt
- Protected routes on both frontend and backend
- Persistent login state with React Context

### Movie Management
- CRUD operations for movies
- Advanced search and filtering
- Movie ratings and reviews integration
- Admin panel for content management

### Review System
- Star-based rating system (1-5 stars)
- Rich text reviews
- User can edit/delete their own reviews
- Review aggregation and statistics

### Watchlist Functionality
- Personal movie watchlist for each user
- Easy add/remove functionality
- Watchlist page with movie details

## 🔐 Environment Variables

### Backend (.env)
```env
# Required
DB_HOST=localhost
DB_PORT=3306
DB_NAME=movie_review_db
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your-super-secret-key-at-least-32-characters

# Optional
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_BASE_URL=http://localhost:3001/api
VITE_APP_NAME=Movie Review Platform
```

## 🚀 Deployment

### Backend Deployment
1. Set production environment variables
2. Run database migrations on production database
3. Build and deploy to your hosting service (Heroku, AWS, etc.)

### Frontend Deployment
1. Update `VITE_API_BASE_URL` to production API URL
2. Run `npm run build`
3. Deploy the `dist` folder to hosting service (Vercel, Netlify, etc.)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Follow the existing code style

## 🐛 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if MySQL is running
brew services start mysql

# Verify database exists
mysql -u root -p
CREATE DATABASE movie_review_db;
```

**Port Already in Use**
```bash
# Kill process on port 3001
lsof -ti:3001 | xargs kill -9

# Or use different port in .env
PORT=3002
```

**CORS Issues**
- Ensure `FRONTEND_URL` in backend `.env` matches your frontend URL
- Check CORS configuration in `server.js`

## 🚀 Future Enhancements

- [ ] Social features (follow users, share reviews)
- [ ] Advanced movie recommendations
- [ ] Movie trailer integration
- [ ] Email notifications
- [ ] Mobile app development
- [ ] Integration with external movie APIs
- [ ] Advanced analytics dashboard

---
