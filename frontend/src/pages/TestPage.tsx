import React from 'react';

// Simple test component to isolate the white screen issue
export const TestPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white p-8">
      <h1 className="text-4xl font-bold text-black mb-4">Frontend Test Page</h1>
      <p className="text-lg text-gray-600 mb-4">
        If you can see this, your React app is working!
      </p>
      <div className="bg-blue-100 p-4 rounded-lg mb-4">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Backend Connection Test</h2>
        <p className="text-blue-600">
          Backend API is running on: <strong>http://localhost:3001/api</strong>
        </p>
      </div>
      <div className="bg-green-100 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-green-800 mb-2">Next Steps</h2>
        <ol className="list-decimal list-inside text-green-700 space-y-2">
          <li>If you see this page, the basic React setup is working</li>
          <li>Check the browser console (F12) for any JavaScript errors</li>
          <li>Once errors are fixed, we can restore the full HomePage</li>
        </ol>
      </div>
    </div>
  );
};