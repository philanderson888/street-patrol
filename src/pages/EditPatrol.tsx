import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export const EditPatrol = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    location: '',
    teamLeader: '',
    teamMembers: '',
    startTime: '',
    policeCadNumber: '',
  });

  useEffect(() => {
    const fetchPatrol = async () => {
      if (!id || !user) return;
      
      try {
        const { data, error } = await supabase
          .from('patrols')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setFormData({
            location: data.location || '',
            teamLeader: data.team_leader || '',
            teamMembers: data.team_members || '',
            startTime: data.start_time ? new Date(data.start_time).toISOString().slice(0, 16) : '',
            policeCadNumber: data.police_cad_number || '',
          });
        }
      } catch (err) {
        setError('Failed to load patrol data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatrol();
  }, [id, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !user) {
      setError('You must be logged in to update a patrol');
      return;
    }
    
    setSaving(true);
    setError(null);
    setSuccess(false);
    
    try {
      const { error } = await supabase
        .from('patrols')
        .update({
          location: formData.location,
          team_leader: formData.teamLeader,
          team_members: formData.teamMembers,
          start_time: formData.startTime,
          police_cad_number: formData.policeCadNumber,
          notified_police: !!formData.policeCadNumber,
        })
        .eq('id', id);

      if (error) throw error;
      
      setSuccess(true);
      setTimeout(() => {
        navigate(`/active-patrol/${id}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update patrol');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Edit Patrol Details</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          Patrol details updated successfully! Redirecting...
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
        
        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => navigate(`/active-patrol/${id}`)}
            className="bg-gray-300 text-gray-800 py-2 px-6 rounded-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-700 text-white py-2 px-6 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
};