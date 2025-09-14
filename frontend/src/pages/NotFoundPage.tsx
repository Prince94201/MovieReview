import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/Button';

export const NotFoundPage: React.FC = () => {
  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <h1 className="text-9xl font-bold text-gray-200 dark:text-gray-700">404</h1>
            <div className="relative -mt-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                Page Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                The page you're looking for doesn't exist or has been moved.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <Button size="lg" className="w-full">
              <Link to="/">
                <Home className="w-5 h-5 mr-2" />
                Go Home
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" className="w-full">
              <Link to="/movies">
                <Search className="w-5 h-5 mr-2" />
                Browse Movies
              </Link>
            </Button>
          </div>

          <div className="mt-12 text-sm text-gray-500 dark:text-gray-400">
            <p>
              If you believe this is an error, please{' '}
              <a href="#" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                contact support
              </a>
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};