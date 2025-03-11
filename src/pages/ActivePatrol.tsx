import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { format } from 'date-fns';
import { MessageCircle, HelpingHand as PrayingHands, Droplets, ChevronFirst as FirstAid, Map, Car, Shield, Plus, Minus, Save, CheckCircle, Wine, Beer } from 'lucide-react';
import { ContactStatistics } from '../components/ContactStatistics';

interface PatrolStatistics {
  conversations: number;
  prayers: number;
  water_bottles: number;
  first_aid: number;
  directions: number;
  transport_assistance: number;
  vulnerable_people: number;
  bottles_glass_collected: number;
  cans_collected: number;
}

interface Patrol {
  id: string;
  user_id: string;
  location: string;
  team_leader: string;
  team_members: string;
  start_time: string;
  end_time: string | null;
  notified_police: boolean;
  police_cad_number: string;
  status: 'active' | 'completed';
  statistics: PatrolStatistics;
  contact_statistics: Record<string, number>;
  notes: string;
}

export const ActivePatrol = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [patrol, setPatrol] = useState<Patrol | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  
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
          // Initialize contact_statistics if it doesn't exist
          if (!data.contact_statistics) {
            data.contact_statistics = {};
          }
          
          setPatrol(data as Patrol);
          setNotes(data.notes || '');
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
  
  const updateStatistic = async (key: keyof PatrolStatistics, increment: boolean) => {
    if (!patrol) return;
    
    const newStatistics = { ...patrol.statistics };
    newStatistics[key] = Math.max(0, newStatistics[key] + (increment ? 1 : -1));
    
    try {
      const { error } = await supabase
        .from('patrols')
        .update({ statistics: newStatistics })
        .eq('id', patrol.id);
        
      if (error) throw error;
      
      setPatrol({ ...patrol, statistics: newStatistics });
    } catch (err) {
      console.error('Failed to update statistic:', err);
    }
  };
  
  const saveNotes = async () => {
    if (!patrol) return;
    
    setSaving(true);
    setSaveSuccess(false);
    
    try {
      const { error } = await supabase
        .from('patrols')
        .update({ notes })
        .eq('id', patrol.id);
        
      if (error) throw error;
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setSaving(false);
    }
  };
  
  const endPatrol = async () => {
    if (!patrol) return;
    
    if (!window.confirm('Are you sure you want to end this patrol? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('patrols')
        .update({
          status: 'completed',
          end_time: new Date().toISOString(),
        })
        .eq('id', patrol.id);
        
      if (error) throw error;
      
      navigate('/history');
    } catch (err) {
      console.error('Failed to end patrol:', err);
    }
  };

  const navigateToEdit = () => {
    if (patrol) {
      navigate(`/edit-patrol/${patrol.id}`);
    }
  };

  const updateContactStatistics = (newStats: Record<string, number>) => {
    if (patrol) {
      setPatrol({ ...patrol, contact_statistics: newStats });
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  if (error || !patrol) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'Patrol not found'}
        </div>
      </div>
    );
  }
  
  const statItems = [
    { key: 'conversations', label: 'Conversations', icon: MessageCircle },
    { key: 'prayers', label: 'Prayers', icon: PrayingHands },
    { key: 'water_bottles', label: 'Water Bottles', icon: Droplets },
    { key: 'first_aid', label: 'First Aid', icon: FirstAid },
    { key: 'directions', label: 'Directions', icon: Map },
    { key: 'transport_assistance', label: 'Transport Help', icon: Car },
    { key: 'vulnerable_people', label: 'Vulnerable People', icon: Shield },
    { key: 'bottles_glass_collected', label: 'Bottles/Glass', icon: Wine },
    { key: 'cans_collected', label: 'Cans Collected', icon: Beer },
  ];
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-blue-900">Active Patrol</h1>
          <div className="flex space-x-3">
            <button
              onClick={navigateToEdit}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors"
            >
              Edit Details
            </button>
            <button
              onClick={endPatrol}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition-colors"
            >
              End Patrol
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-600">
              <strong>Location:</strong> {patrol.location}
            </p>
            <p className="text-gray-600">
              <strong>Team Leader:</strong> {patrol.team_leader}
            </p>
            <p className="text-gray-600">
              <strong>Team Members:</strong> {patrol.team_members}
            </p>
          </div>
          <div>
            <p className="text-gray-600">
              <strong>Start Time:</strong> {format(new Date(patrol.start_time), 'PPp')}
            </p>
            <p className="text-gray-600">
              <strong>Police CAD Number:</strong> {patrol.police_cad_number || 'Not provided'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold text-blue-900 mb-4">Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {statItems.map(({ key, label, icon: Icon }) => (
            <div key={key} className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <Icon className="h-5 w-5 text-blue-700" />
                </div>
                <h3 className="font-medium text-gray-800">{label}</h3>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  onClick={() => updateStatistic(key as keyof PatrolStatistics, false)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 p-1 rounded-full"
                  disabled={patrol.statistics[key as keyof PatrolStatistics] <= 0}
                >
                  <Minus className="h-5 w-5" />
                </button>
                
                <span className="text-2xl font-bold text-blue-900">
                  {patrol.statistics[key as keyof PatrolStatistics] || 0}
                </span>
                
                <button
                  onClick={() => updateStatistic(key as keyof PatrolStatistics, true)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 p-1 rounded-full"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <ContactStatistics 
        patrolId={patrol.id} 
        contactStats={patrol.contact_statistics || {}} 
        onUpdate={updateContactStatistics} 
      />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-blue-900">Notes</h2>
          <div className="flex items-center">
            {saveSuccess && (
              <span className="text-green-600 flex items-center mr-3">
                <CheckCircle className="h-4 w-4 mr-1" />
                Saved
              </span>
            )}
            <button
              onClick={saveNotes}
              className="bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center"
              disabled={saving}
            >
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save Notes'}
            </button>
          </div>
        </div>
        
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={8}
          placeholder="Enter notes about the patrol, significant events, or follow-up items..."
        />
      </div>
    </div>
  );
};