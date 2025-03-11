import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, MapPin, Users, FileText, ChevronRight } from 'lucide-react';

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

export const PatrolHistory = () => {
  const { user } = useAuth();
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPatrol, setSelectedPatrol] = useState<Patrol | null>(null);
  
  useEffect(() => {
    const fetchPatrols = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('patrols')
          .select('*')
          .eq('user_id', user.id)
          .order('start_time', { ascending: false });
          
        if (error) throw error;
        
        setPatrols(data as Patrol[]);
      } catch (err) {
        setError('Failed to load patrol history');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatrols();
  }, [user]);
  
  const calculateDuration = (start: string, end: string | null) => {
    if (!end) return 'In progress';
    
    const startDate = new Date(start);
    const endDate = new Date(end);
    const diffMs = endDate.getTime() - startDate.getTime();
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${diffHrs}h ${diffMins}m`;
  };
  
  const getTotalStats = () => {
    if (patrols.length === 0) return null;
    
    const initialStats: PatrolStatistics = {
      conversations: 0,
      prayers: 0,
      water_bottles: 0,
      first_aid: 0,
      directions: 0,
      transport_assistance: 0,
      vulnerable_people: 0,
      bottles_glass_collected: 0,
      cans_collected: 0
    };
    
    return patrols.reduce((acc, patrol) => {
      Object.keys(acc).forEach((key) => {
        const statKey = key as keyof PatrolStatistics;
        acc[statKey] += patrol.statistics[statKey] || 0;
      });
      return acc;
    }, initialStats);
  };

  const renderContactMatrix = (contactStats: Record<string, number>) => {
    if (!contactStats || Object.keys(contactStats).length === 0) {
      return (
        <div className="text-gray-500 italic text-center py-4">
          No contact data recorded for this patrol
        </div>
      );
    }

    const ethnicities = ['white', 'afroCaribbean', 'asian', 'easternEuropean'];
    const ages = ['Under13', '13To17', '18To25', 'Over25'];
    const genders = ['Male', 'Female'];

    const ethnicityLabels = {
      white: 'White',
      afroCaribbean: 'Afro/Caribbean',
      asian: 'Asian',
      easternEuropean: 'Eastern European'
    };

    const ageLabels = {
      Under13: 'Under 13',
      '13To17': '13-17',
      '18To25': '18-25',
      Over25: 'Over 25'
    };

    return (
      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <th className="border border-gray-200 px-4 py-2"></th>
              {ethnicities.map(ethnicity => (
                <th key={ethnicity} className="border border-gray-200 px-4 py-2 text-center" colSpan={2}>
                  {ethnicityLabels[ethnicity as keyof typeof ethnicityLabels]}
                </th>
              ))}
            </tr>
            <tr>
              <th className="border border-gray-200 px-4 py-2"></th>
              {ethnicities.map(ethnicity => (
                <React.Fragment key={`gender-${ethnicity}`}>
                  <th className="border border-gray-200 px-4 py-2 text-center">Male</th>
                  <th className="border border-gray-200 px-4 py-2 text-center">Female</th>
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody>
            {ages.map(age => (
              <tr key={age}>
                <td className="border border-gray-200 px-4 py-2 font-medium">
                  {ageLabels[age as keyof typeof ageLabels]}
                </td>
                {ethnicities.map(ethnicity => (
                  <React.Fragment key={`${ethnicity}-${age}`}>
                    {genders.map(gender => (
                      <td key={`${ethnicity}${gender}${age}`} className="border border-gray-200 px-4 py-2 text-center">
                        {contactStats[`${ethnicity}${gender}${age}`] || 0}
                      </td>
                    ))}
                  </React.Fragment>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-700"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }
  
  const totalStats = getTotalStats();
  
  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">Patrol History</h1>
      
      {patrols.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-600">No patrol records found. Start a new patrol to begin recording data.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Total Statistics</h2>
              
              {totalStats && (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Patrols</span>
                    <span className="font-semibold">{patrols.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversations</span>
                    <span className="font-semibold">{totalStats.conversations}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Prayers</span>
                    <span className="font-semibold">{totalStats.prayers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Water Bottles</span>
                    <span className="font-semibold">{totalStats.water_bottles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">First Aid</span>
                    <span className="font-semibold">{totalStats.first_aid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Directions</span>
                    <span className="font-semibold">{totalStats.directions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transport Help</span>
                    <span className="font-semibold">{totalStats.transport_assistance}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Vulnerable People</span>
                    <span className="font-semibold">{totalStats.vulnerable_people}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bottles/Glass Collected</span>
                    <span className="font-semibold">{totalStats.bottles_glass_collected}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cans Collected</span>
                    <span className="font-semibold">{totalStats.cans_collected}</span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Patrol Records</h2>
              
              <div className="space-y-3">
                {patrols.map((patrol) => (
                  <button
                    key={patrol.id}
                    onClick={() => setSelectedPatrol(patrol)}
                    className={`w-full text-left p-3 rounded-md transition-colors flex justify-between items-center ${
                      selectedPatrol?.id === patrol.id
                        ? 'bg-blue-100 border border-blue-300'
                        : 'hover:bg-gray-100 border border-gray-200'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{patrol.location}</div>
                      <div className="text-sm text-gray-600">
                        {format(new Date(patrol.start_time), 'PP')}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-2">
            {selectedPatrol ? (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-semibold text-blue-900 mb-4">
                  {selectedPatrol.location}
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>
                        {format(new Date(selectedPatrol.start_time), 'PPP')}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>
                        {format(new Date(selectedPatrol.start_time), 'p')} - 
                        {selectedPatrol.end_time 
                          ? ` ${format(new Date(selectedPatrol.end_time), 'p')}`
                          : ' In progress'}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="h-5 w-5 mr-2" />
                      <span>{selectedPatrol.location}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-2" />
                      <span>
                        <strong>Team Leader:</strong> {selectedPatrol.team_leader}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Users className="h-5 w-5 mr-2" />
                      <span>
                        <strong>Team Members:</strong> {selectedPatrol.team_members}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="h-5 w-5 mr-2" />
                      <span>
                        <strong>Duration:</strong> {calculateDuration(selectedPatrol.start_time, selectedPatrol.end_time)}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <span>
                        <strong>Police CAD Number:</strong> {selectedPatrol.police_cad_number || 'Not provided'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">Statistics</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-600">Conversations</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {selectedPatrol.statistics.conversations || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-600">Prayers</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {selectedPatrol.statistics.prayers || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-600">Water Bottles</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {selectedPatrol.statistics.water_bottles || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-600">First Aid</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {selectedPatrol.statistics.first_aid || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-600">Directions</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {selectedPatrol.statistics.directions || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-600">Transport Help</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {selectedPatrol.statistics.transport_assistance || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-600">Vulnerable People</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {selectedPatrol.statistics.vulnerable_people || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-600">Bottles/Glass</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {selectedPatrol.statistics.bottles_glass_collected || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-md">
                      <div className="text-sm text-gray-600">Cans Collected</div>
                      <div className="text-2xl font-bold text-blue-900">
                        {selectedPatrol.statistics.cans_collected || 0}
                      </div>
                    </div>
                  </div>
                </div>
                
                {selectedPatrol.contact_statistics && Object.keys(selectedPatrol.contact_statistics).length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-3">Contact Matrix</h3>
                    {renderContactMatrix(selectedPatrol.contact_statistics)}
                  </div>
                )}
                
                {selectedPatrol.notes && (
                  <div>
                    <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Notes
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md whitespace-pre-wrap">
                      {selectedPatrol.notes}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 flex items-center justify-center h-full">
                <p className="text-gray-500 text-center">
                  Select a patrol from the list to view details
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};