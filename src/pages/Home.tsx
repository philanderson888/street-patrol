import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardList, History, Users, Cross, BarChart, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Login } from '../components/Login';

export const Home = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <Users className="h-20 w-20 text-blue-700" />
            <Cross className="h-8 w-8 text-blue-900 absolute bottom-0 right-0" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-blue-900 mb-2">Street Patrol</h1>
        <p className="text-xl text-gray-600">
          Record and track your street patrol activities
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link
          to="/new-patrol"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <ClipboardList className="h-8 w-8 text-blue-700" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-900">New Patrol</h2>
          </div>
          <p className="text-gray-600">
            Start a new patrol session and record interactions and statistics.
          </p>
        </Link>

        <Link
          to="/history"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <History className="h-8 w-8 text-blue-700" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-900">Patrol History</h2>
          </div>
          <p className="text-gray-600">
            View past patrol records, statistics, and generate reports.
          </p>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <Link
          to="/reports"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <BarChart className="h-8 w-8 text-blue-700" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-900">Reports</h2>
          </div>
          <p className="text-gray-600">
            Generate and view reports for different time periods.
          </p>
        </Link>

        <Link
          to="/settings"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <Settings className="h-8 w-8 text-blue-700" />
            </div>
            <h2 className="text-2xl font-semibold text-blue-900">Settings</h2>
          </div>
          <p className="text-gray-600">
            Manage your account settings and preferences.
          </p>
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">About Street Patrol</h2>
        <p className="text-gray-600 mb-4">
          Street Patrol is an application designed to help volunteers record and track their activities
          during night patrols in city centers. The app helps teams document interactions, provide
          assistance, and collect valuable statistics to improve community safety.
        </p>
        <p className="text-gray-600">
          Teams of volunteers use this app to coordinate with local authorities and provide a
          compassionate presence in urban areas, helping those who may be vulnerable or in need of
          assistance.
        </p>
      </div>
    </div>
  );
};