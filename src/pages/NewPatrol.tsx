import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const NewPatrol = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    location: '',
    teamLeader: '',
    teamMembers: '',
    startTime: new Date().toISOString().slice(0, 16),
    policeCadNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create a patrol');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const patrolId = uuidv4();
      
      const { error } = await supabase.from('patrols').insert({
        id: patrolId,
        user_id: user.id,
        location: formData.location,
        team_leader: formData.teamLeader,
        team_members: formData.teamMembers,
        start_time: formData.startTime,
        police_cad_number: formData.policeCadNumber,
        notified_police: !!formData.policeCadNumber,
        status: 'active',
        statistics: {
          conversations: 0,
          prayers: 0,
          water_bottles: 0,
          first_aid: 0,
          directions: 0,
          transport_assistance: 0,
          vulnerable_people: 0,
          bottles_glass_collected: 0,
          cans_collected: 0
        },
        contact_statistics: {
          whiteMaleUnder13: 0,
          whiteFemaleUnder13: 0,
          whiteMale13To17: 0,
          whiteFemale13To17: 0,
          whiteMale18To25: 0,
          whiteFemale18To25: 0,
          whiteMaleOver25: 0,
          whiteFemaleOver25: 0,
          afroCaribbeanMaleUnder13: 0,
          afroCaribbeanFemaleUnder13: 0,
          afroCaribbeanMale13To17: 0,
          afroCaribbeanFemale13To17: 0,
          afroCaribbeanMale18To25: 0,
          afroCaribbeanFemale18To25: 0,
          afroCaribbeanMaleOver25: 0,
          afroCaribbeanFemaleOver25: 0,
          asianMaleUnder13: 0,
          asianFemaleUnder13: 0,
          asianMale13To17: 0,
          asianFemale13To17: 0,
          asianMale18To25: 0,
          asianFemale18To25: 0,
          asianMaleOver25: 0,
          asianFemaleOver25: 0,
          easternEuropeanMaleUnder13: 0,
          easternEuropeanFemaleUnder13: 0,
          easternEuropeanMale13To17: 0,
          easternEuropeanFemale13To17: 0,
          easternEuropeanMale18To25: 0,
          easternEuropeanFemale18To25: 0,
          easternEuropeanMaleOver25: 0,
          easternEuropeanFemaleOver25: 0
        }
      });

      if (error) throw error;
      
      navigate(`/active-patrol/${patrolId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create patrol');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Start New Patrol</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
            Patrol Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="teamLeader" className="block text-gray-700 font-medium mb-2">
            Team Leader
          </label>
          <input
            type="text"
            id="teamLeader"
            name="teamLeader"
            value={formData.teamLeader}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="teamMembers" className="block text-gray-700 font-medium mb-2">
            Team Members
          </label>
          <textarea
            id="teamMembers"
            name="teamMembers"
            value={formData.teamMembers}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
            placeholder="Enter team member names, separated by commas"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="startTime" className="block text-gray-700 font-medium mb-2">
            Start Time
          </label>
          <input
            type="datetime-local"
            id="startTime"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="policeCadNumber" className="block text-gray-700 font-medium mb-2">
            Police CAD Number
          </label>
          <input
            type="text"
            id="policeCadNumber"
            name="policeCadNumber"
            value={formData.policeCadNumber}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter CAD number if police have been notified"
          />
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Start Patrol'}
          </button>
        </div>
      </form>
    </div>
  );
};