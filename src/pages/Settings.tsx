import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { User, Settings as SettingsIcon, LogOut } from 'lucide-react';

export const Settings = () => {
  const { user, signOut } = useAuth();
  const [changePasswordSuccess, setChangePasswordSuccess] = useState(false);
  const [changePasswordError, setChangePasswordError] = useState<string | null>(null);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value,
    });
  };
  
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setChangePasswordSuccess(false);
    setChangePasswordError(null);
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setChangePasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setChangePasswordError('Password must be at least 6 characters');
      return;
    }
    
    // In a real app, you would call the Supabase API to update the password
    // For this demo, we'll just simulate success
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setChangePasswordSuccess(true);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (error) {
      setChangePasswordError('Failed to change password');
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <User className="h-8 w-8 text-blue-700" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-900">Account Information</h2>
            <p className="text-gray-600">{user?.email}</p>
          </div>
        </div>
        
        <button
          onClick={signOut}
          className="flex items-center text-red-600 hover:text-red-800 transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Sign Out
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <SettingsIcon className="h-8 w-8 text-blue-700" />
          </div>
          <h2 className="text-xl font-semibold text-blue-900">Change Password</h2>
        </div>
        
        {changePasswordSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            Password changed successfully
          </div>
        )}
        
        {changePasswordError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {changePasswordError}
          </div>
        )}
        
        <form onSubmit={handleChangePassword}>
          <div className="mb-4">
            <label htmlFor="currentPassword" className="block text-gray-700 font-medium mb-2">
              Current Password
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={passwordData.currentPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="newPassword" className="block text-gray-700 font-medium mb-2">
              New Password
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={passwordData.newPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
              Confirm New Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={passwordData.confirmPassword}
              onChange={handlePasswordChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
          >
            Change Password
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center mb-6">
          <div className="bg-blue-100 p-3 rounded-full mr-4">
            <SettingsIcon className="h-8 w-8 text-blue-700" />
          </div>
          <h2 className="text-xl font-semibold text-blue-900">Application Settings</h2>
        </div>
        
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Enable notifications</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Auto-save patrol data</span>
            </label>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-gray-700">Dark mode</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};