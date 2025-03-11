import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Clock, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface ActivePatrol {
  id: string;
  location: string;
  start_time: string;
}

export const ActivePatrolBanner = () => {
  const { user } = useAuth();
  const [activePatrols, setActivePatrols] = useState<ActivePatrol[]>([]);
  const [dismissed, setDismissed] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivePatrols = async () => {
      if (!user) {
        setActivePatrols([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('patrols')
          .select('id, location, start_time')
          .eq('user_id', user.id)
          .eq('status', 'active');

        if (error) throw error;
        setActivePatrols(data as ActivePatrol[]);
      } catch (err) {
        console.error('Error fetching active patrols:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchActivePatrols();

    // Set up a subscription to listen for changes
    const subscription = supabase
      .channel('public:patrols')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'patrols',
        filter: `user_id=eq.${user?.id}`
      }, () => {
        fetchActivePatrols();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  if (loading || activePatrols.length === 0 || Object.keys(dismissed).length === activePatrols.length) {
    return null;
  }

  return (
    <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-6">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-medium text-blue-800 mb-2">Active Patrols</h3>
          <div className="space-y-2">
            {activePatrols.map(patrol => (
              !dismissed[patrol.id] && (
                <div key={patrol.id} className="flex items-center">
                  <Clock className="h-4 w-4 text-blue-600 mr-2" />
                  <span className="text-blue-700 mr-2">{patrol.location}</span>
                  <Link 
                    to={`/active-patrol/${patrol.id}`}
                    className="text-blue-600 hover:text-blue-800 underline text-sm font-medium"
                  >
                    Continue Patrol
                  </Link>
                </div>
              )
            ))}
          </div>
        </div>
        <button 
          onClick={() => setDismissed({})} 
          className="text-blue-600 hover:text-blue-800"
          aria-label="Dismiss"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};