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
            <h2 className="text-xl font-semib
  )
}