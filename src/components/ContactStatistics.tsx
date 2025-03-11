import React, { useState } from 'react';
import { Users, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ContactStatisticsProps {
  patrolId: string;
  contactStats: Record<string, number>;
  onUpdate: (newStats: Record<string, number>) => void;
}

export const ContactStatistics = ({ patrolId, contactStats, onUpdate }: ContactStatisticsProps) => {
  const [selectedGender, setSelectedGender] = useState<'Male' | 'Female' | null>(null);
  const [selectedAge, setSelectedAge] = useState<'Under13' | '13To17' | '18To25' | 'Over25' | null>(null);
  const [selectedEthnicity, setSelectedEthnicity] = useState<'white' | 'afroCaribbean' | 'asian' | 'easternEuropean' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

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

  const resetSelections = () => {
    setSelectedGender(null);
    setSelectedAge(null);
    setSelectedEthnicity(null);
  };

  const handleAddContact = async () => {
    if (!selectedGender || !selectedAge || !selectedEthnicity) {
      setError('Please select all three categories');
      setTimeout(() => setError(null), 3000);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      // Create the key for the statistic to increment
      const statKey = `${selectedEthnicity}${selectedGender}${selectedAge}`;
      
      // Create a copy of the current stats and increment the selected combination
      const updatedStats = { ...contactStats };
      updatedStats[statKey] = (updatedStats[statKey] || 0) + 1;
      
      // Update the database
      const { error } = await supabase
        .from('patrols')
        .update({ contact_statistics: updatedStats })
        .eq('id', patrolId);
        
      if (error) throw error;
      
      // Update the local state
      onUpdate(updatedStats);
      
      // Show success message and reset selections
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      resetSelections();
    } catch (err) {
      console.error('Failed to update contact statistics:', err);
      setError('Failed to save contact data');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContactMatrix = () => {
    const ethnicities = ['white', 'afroCaribbean', 'asian', 'easternEuropean'];
    const ages = ['Under13', '13To17', '18To25', 'Over25'];
    const genders = ['Male', 'Female'];

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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-900 flex items-center">
          <Users className="h-6 w-6 mr-2" />
          Contact Statistics
        </h2>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex items-center">
          <AlertCircle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex items-center">
          <Check className="h-5 w-5 mr-2" />
          Contact added successfully
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-700 mb-3">Add New Contact</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Gender Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Gender</label>
            <div className="flex space-x-2">
              <button
                type="button"
                onClick={() => setSelectedGender('Male')}
                className={`flex-1 py-2 px-4 rounded-md border ${
                  selectedGender === 'Male'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setSelectedGender('Female')}
                className={`flex-1 py-2 px-4 rounded-md border ${
                  selectedGender === 'Female'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Female
              </button>
            </div>
          </div>

          {/* Age Group Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Age Group</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedAge('Under13')}
                className={`py-2 px-3 rounded-md border text-sm ${
                  selectedAge === 'Under13'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Under 13
              </button>
              <button
                type="button"
                onClick={() => setSelectedAge('13To17')}
                className={`py-2 px-3 rounded-md border text-sm ${
                  selectedAge === '13To17'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                13-17
              </button>
              <button
                type="button"
                onClick={() => setSelectedAge('18To25')}
                className={`py-2 px-3 rounded-md border text-sm ${
                  selectedAge === '18To25'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                18-25
              </button>
              <button
                type="button"
                onClick={() => setSelectedAge('Over25')}
                className={`py-2 px-3 rounded-md border text-sm ${
                  selectedAge === 'Over25'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Over 25
              </button>
            </div>
          </div>

          {/* Ethnicity Selection */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">Ethnicity</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedEthnicity('white')}
                className={`py-2 px-3 rounded-md border text-sm ${
                  selectedEthnicity === 'white'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                White
              </button>
              <button
                type="button"
                onClick={() => setSelectedEthnicity('afroCaribbean')}
                className={`py-2 px-3 rounded-md border text-sm ${
                  selectedEthnicity === 'afroCaribbean'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Afro/Caribbean
              </button>
              <button
                type="button"
                onClick={() => setSelectedEthnicity('asian')}
                className={`py-2 px-3 rounded-md border text-sm ${
                  selectedEthnicity === 'asian'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Asian
              </button>
              <button
                type="button"
                onClick={() => setSelectedEthnicity('easternEuropean')}
                className={`py-2 px-3 rounded-md border text-sm ${
                  selectedEthnicity === 'easternEuropean'
                    ? 'bg-blue-100 border-blue-500 text-blue-700'
                    : 'border-gray-300 hover:bg-gray-50'
                }`}
              >
                Eastern European
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleAddContact}
            disabled={!selectedGender || !selectedAge || !selectedEthnicity || isSubmitting}
            className={`py-2 px-6 rounded-md ${
              !selectedGender || !selectedAge || !selectedEthnicity || isSubmitting
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-700 text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors'
            }`}
          >
            {isSubmitting ? 'Adding...' : 'Add Contact'}
          </button>
        </div>
      </div>

      <h3 className="text-lg font-medium text-gray-700 mb-3">Contact Matrix</h3>
      {renderContactMatrix()}
    </div>
  );
};