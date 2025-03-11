import React, { useState, useEffect } from 'react';
import { format, subMonths, startOfYear, endOfYear, startOfMonth, endOfMonth } from 'date-fns';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { Calendar, Clock, Filter, FileText, BarChart, Download, FileDown, FileText as FileText2 } from 'lucide-react';

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

type ReportType = 'lastMonth' | 'last3Months' | 'yearToDate' | 'previousYear' | string;
type ExportType = 'csv' | 'html';

export const Reports = () => {
  const { user } = useAuth();
  const [patrols, setPatrols] = useState<Patrol[]>([]);
  const [filteredPatrols, setFilteredPatrols] = useState<Patrol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reportType, setReportType] = useState<ReportType>('lastMonth');
  const [availableYears, setAvailableYears] = useState<number[]>([]);
  const [reportTitle, setReportTitle] = useState('Last Month Report');
  const [reportDateRange, setReportDateRange] = useState('');
  const [exportLoading, setExportLoading] = useState(false);
  const [exportType, setExportType] = useState<ExportType>('csv');
  const [showExportOptions, setShowExportOptions] = useState(false);
  
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
        
        // Extract available years for reporting
        const years = new Set<number>();
        data.forEach(patrol => {
          const year = new Date(patrol.start_time).getFullYear();
          years.add(year);
        });
        
        const currentYear = new Date().getFullYear();
        const previousYear = currentYear - 1;
        
        // Filter out current and previous year as they have dedicated report types
        const historicalYears = Array.from(years)
          .filter(year => year !== currentYear && year !== previousYear)
          .sort((a, b) => b - a); // Sort descending
        
        setAvailableYears(historicalYears);
      } catch (err) {
        setError('Failed to load patrol data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatrols();
  }, [user]);
  
  useEffect(() => {
    if (patrols.length === 0) return;
    
    const now = new Date();
    const currentYear = now.getFullYear();
    let startDate: Date;
    let endDate: Date;
    let title: string;
    let dateRangeText: string;
    
    switch (reportType) {
      case 'lastMonth':
        const lastMonth = subMonths(now, 1);
        startDate = startOfMonth(lastMonth);
        endDate = endOfMonth(lastMonth);
        title = `${format(lastMonth, 'MMMM yyyy')} Report`;
        dateRangeText = `${format(startDate, 'PPP')} - ${format(endDate, 'PPP')}`;
        break;
        
      case 'last3Months':
        const threeMonthsAgo = subMonths(now, 3);
        startDate = startOfMonth(threeMonthsAgo);
        endDate = endOfMonth(subMonths(now, 1));
        title = 'Last 3 Months Report';
        dateRangeText = `${format(startDate, 'PPP')} - ${format(endDate, 'PPP')}`;
        break;
        
      case 'yearToDate':
        startDate = startOfYear(now);
        endDate = now;
        title = `${currentYear} Year to Date Report`;
        dateRangeText = `${format(startDate, 'PPP')} - ${format(endDate, 'PPP')}`;
        break;
        
      case 'previousYear':
        const prevYear = currentYear - 1;
        startDate = new Date(prevYear, 0, 1); // Jan 1
        endDate = new Date(prevYear, 11, 31); // Dec 31
        title = `${prevYear} Annual Report`;
        dateRangeText = `${format(startDate, 'PPP')} - ${format(endDate, 'PPP')}`;
        break;
        
      default:
        // Handle historical years
        if (!isNaN(Number(reportType))) {
          const year = Number(reportType);
          startDate = new Date(year, 0, 1); // Jan 1
          endDate = new Date(year, 11, 31); // Dec 31
          title = `${year} Annual Report`;
          dateRangeText = `${format(startDate, 'PPP')} - ${format(endDate, 'PPP')}`;
        } else {
          // Default to last month if something goes wrong
          const lastMonth = subMonths(now, 1);
          startDate = startOfMonth(lastMonth);
          endDate = endOfMonth(lastMonth);
          title = `${format(lastMonth, 'MMMM yyyy')} Report`;
          dateRangeText = `${format(startDate, 'PPP')} - ${format(endDate, 'PPP')}`;
        }
    }
    
    setReportTitle(title);
    setReportDateRange(dateRangeText);
    
    // Filter patrols based on date range
    const filtered = patrols.filter(patrol => {
      const patrolDate = new Date(patrol.start_time);
      return patrolDate >= startDate && patrolDate <= endDate;
    });
    
    setFilteredPatrols(filtered);
  }, [reportType, patrols]);
  
  const calculateTotalStats = () => {
    if (filteredPatrols.length === 0) return null;
    
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
    
    return filteredPatrols.reduce((acc, patrol) => {
      Object.keys(acc).forEach((key) => {
        const statKey = key as keyof PatrolStatistics;
        acc[statKey] += patrol.statistics[statKey] || 0;
      });
      return acc;
    }, initialStats);
  };
  
  const calculateTotalContactStats = () => {
    if (filteredPatrols.length === 0) return {};
    
    const totalContactStats: Record<string, number> = {};
    
    filteredPatrols.forEach(patrol => {
      if (patrol.contact_statistics) {
        Object.entries(patrol.contact_statistics).forEach(([key, value]) => {
          totalContactStats[key] = (totalContactStats[key] || 0) + value;
        });
      }
    });
    
    return totalContactStats;
  };
  
  const renderContactMatrix = (contactStats: Record<string, number>) => {
    if (!contactStats || Object.keys(contactStats).length === 0) {
      return (
        <div className="text-gray-500 italic text-center py-4">
          No contact data recorded for this period
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
  
  const renderPatrolNotes = () => {
    if (filteredPatrols.length === 0) {
      return (
        <div className="text-gray-500 italic text-center py-4">
          No patrol data available for this period
        </div>
      );
    }
    
    return (
      <div className="space-y-4 mt-4">
        {filteredPatrols.map(patrol => (
          <div key={patrol.id} className="border border-gray-200 rounded-md p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium text-blue-900">{patrol.location}</h4>
                <p className="text-sm text-gray-600">
                  {format(new Date(patrol.start_time), 'PPP')} • Team Leader: {patrol.team_leader}
                </p>
              </div>
              <div className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                {patrol.status === 'completed' ? 'Completed' : 'Active'}
              </div>
            </div>
            
            {patrol.notes && (
              <div className="mt-2">
                <p className="text-sm text-gray-700 max-h-24 overflow-y-auto whitespace-pre-wrap">
                  {patrol.notes.length > 300 
                    ? `${patrol.notes.substring(0, 300)}...` 
                    : patrol.notes}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  const exportReportCSV = () => {
    if (filteredPatrols.length === 0) return;
    
    setExportLoading(true);
    
    try {
      const totalStats = calculateTotalStats();
      const totalContactStats = calculateTotalContactStats();
      
      // Create CSV content for general statistics
      let csvContent = `"${reportTitle}"\n`;
      csvContent += `"${reportDateRange}"\n\n`;
      csvContent += `"Total Patrols","${filteredPatrols.length}"\n\n`;
      
      csvContent += `"STATISTICS SUMMARY"\n`;
      if (totalStats) {
        csvContent += `"Conversations","${totalStats.conversations}"\n`;
        csvContent += `"Prayers","${totalStats.prayers}"\n`;
        csvContent += `"Water Bottles","${totalStats.water_bottles}"\n`;
        csvContent += `"First Aid","${totalStats.first_aid}"\n`;
        csvContent += `"Directions","${totalStats.directions}"\n`;
        csvContent += `"Transport Help","${totalStats.transport_assistance}"\n`;
        csvContent += `"Vulnerable People","${totalStats.vulnerable_people}"\n`;
        csvContent += `"Bottles/Glass","${totalStats.bottles_glass_collected}"\n`;
        csvContent += `"Cans Collected","${totalStats.cans_collected}"\n\n`;
      }
      
      // Add contact matrix
      csvContent += `"CONTACT MATRIX"\n`;
      
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
      
      // Header row for ethnicities
      csvContent += `"","${ethnicityLabels.white}","","${ethnicityLabels.afroCaribbean}","","${ethnicityLabels.asian}","","${ethnicityLabels.easternEuropean}",""\n`;
      
      // Header row for genders
      csvContent += `"","Male","Female","Male","Female","Male","Female","Male","Female"\n`;
      
      // Data rows
      ages.forEach(age => {
        let row = `"${ageLabels[age as keyof typeof ageLabels]}"`;
        
        ethnicities.forEach(ethnicity => {
          genders.forEach(gender => {
            const value = totalContactStats[`${ethnicity}${gender}${age}`] || 0;
            row += `,"${value}"`;
          });
        });
        
        csvContent += `${row}\n`;
      });
      
      csvContent += `\n"PATROL DETAILS"\n`;
      csvContent += `"Date","Location","Team Leader","Status","Notes"\n`;
      
      filteredPatrols.forEach(patrol => {
        const date = format(new Date(patrol.start_time), 'yyyy-MM-dd');
        const status = patrol.status === 'completed' ? 'Completed' : 'Active';
        // Escape quotes in notes to prevent CSV issues
        const notes = patrol.notes ? patrol.notes.replace(/"/g, '""') : '';
        
        csvContent += `"${date}","${patrol.location}","${patrol.team_leader}","${status}","${notes}"\n`;
      });
      
      // Create a blob and download link
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportTitle.replace(/\s+/g, '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting CSV report:', err);
    } finally {
      setExportLoading(false);
      setShowExportOptions(false);
    }
  };

  const exportReportHTML = () => {
    if (filteredPatrols.length === 0) return;
    
    setExportLoading(true);
    
    try {
      const totalStats = calculateTotalStats();
      const totalContactStats = calculateTotalContactStats();
      
      // Create HTML content
      let htmlContent = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${reportTitle}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 1200px;
              margin: 0 auto;
              padding: 20px;
            }
            h1, h2, h3 {
              color: #1e3a8a;
              margin-top: 1.5em;
            }
            h1 {
              font-size: 28px;
              border-bottom: 2px solid #1e3a8a;
              padding-bottom: 10px;
            }
            h2 {
              font-size: 22px;
              border-bottom: 1px solid #ddd;
              padding-bottom: 5px;
            }
            h3 {
              font-size: 18px;
            }
            .date-range {
              color: #666;
              font-style: italic;
              margin-bottom: 20px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px 12px;
              text-align: center;
            }
            th {
              background-color: #f0f4ff;
              font-weight: bold;
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
              gap: 15px;
              margin: 20px 0;
            }
            .stat-card {
              background-color: #f9fafb;
              border-radius: 8px;
              padding: 15px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .stat-label {
              font-size: 14px;
              color: #666;
              margin-bottom: 5px;
            }
            .stat-value {
              font-size: 24px;
              font-weight: bold;
              color: #1e3a8a;
            }
            .patrol-card {
              border: 1px solid #ddd;
              border-radius: 8px;
              padding: 15px;
              margin-bottom: 15px;
            }
            .patrol-header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
            }
            .patrol-location {
              font-weight: bold;
              color: #1e3a8a;
            }
            .patrol-meta {
              font-size: 14px;
              color: #666;
            }
            .patrol-status {
              background-color: #e0f2fe;
              color: #0369a1;
              font-size: 12px;
              padding: 3px 8px;
              border-radius: 12px;
              font-weight: 500;
            }
            .patrol-notes {
              font-size: 14px;
              white-space: pre-wrap;
              margin-top: 10px;
            }
            .text-center {
              text-align: center;
            }
            .text-italic {
              font-style: italic;
            }
            .text-gray {
              color: #666;
            }
            @media print {
              body {
                padding: 0;
                font-size: 12px;
              }
              h1 {
                font-size: 22px;
              }
              h2 {
                font-size: 18px;
              }
              h3 {
                font-size: 16px;
              }
              .stat-value {
                font-size: 18px;
              }
              .no-break {
                break-inside: avoid;
              }
            }
          </style>
        </head>
        <body>
          <h1>${reportTitle}</h1>
          <div class="date-range">${reportDateRange}</div>
          
          <h2>Statistics Summary</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-label">Total Patrols</div>
              <div class="stat-value">${filteredPatrols.length}</div>
            </div>
      `;
      
      if (totalStats) {
        htmlContent += `
            <div class="stat-card">
              <div class="stat-label">Conversations</div>
              <div class="stat-value">${totalStats.conversations}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Prayers</div>
              <div class="stat-value">${totalStats.prayers}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Water Bottles</div>
              <div class="stat-value">${totalStats.water_bottles}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">First Aid</div>
              <div class="stat-value">${totalStats.first_aid}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Directions</div>
              <div class="stat-value">${totalStats.directions}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Transport Help</div>
              <div class="stat-value">${totalStats.transport_assistance}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Vulnerable People</div>
              <div class="stat-value">${totalStats.vulnerable_people}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Bottles/Glass</div>
              <div class="stat-value">${totalStats.bottles_glass_collected}</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Cans Collected</div>
              <div class="stat-value">${totalStats.cans_collected}</div>
            </div>
        `;
      }
      
      htmlContent += `
          </div>
          
          <h2>Contact Matrix</h2>
      `;
      
      // Add contact matrix
      if (Object.keys(totalContactStats).length === 0) {
        htmlContent += `
          <div class="text-center text-italic text-gray">
            No contact data recorded for this period
          </div>
        `;
      } else {
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
        
        htmlContent += `
          <table>
            <thead>
              <tr>
                <th></th>
        `;
        
        ethnicities.forEach(ethnicity => {
          htmlContent += `<th colspan="2">${ethnicityLabels[ethnicity as keyof typeof ethnicityLabels]}</th>`;
        });
        
        htmlContent += `
              </tr>
              <tr>
                <th></th>
        `;
        
        ethnicities.forEach(() => {
          htmlContent += `<th>Male</th><th>Female</th>`;
        });
        
        htmlContent += `
              </tr>
            </thead>
            <tbody>
        `;
        
        ages.forEach(age => {
          htmlContent += `
              <tr>
                <td><strong>${ageLabels[age as keyof typeof ageLabels]}</strong></td>
          `;
          
          ethnicities.forEach(ethnicity => {
            genders.forEach(gender => {
              const value = totalContactStats[`${ethnicity}${gender}${age}`] || 0;
              htmlContent += `<td>${value}</td>`;
            });
          });
          
          htmlContent += `
              </tr>
          `;
        });
        
        htmlContent += `
            </tbody>
          </table>
        `;
      }
      
      // Add patrol notes
      htmlContent += `
          <h2>Patrol Notes</h2>
      `;
      
      if (filteredPatrols.length === 0) {
        htmlContent += `
          <div class="text-center text-italic text-gray">
            No patrol data available for this period
          </div>
        `;
      } else {
        filteredPatrols.forEach(patrol => {
          const date = format(new Date(patrol.start_time), 'PPP');
          const status = patrol.status === 'completed' ? 'Completed' : 'Active';
          
          htmlContent += `
            <div class="patrol-card no-break">
              <div class="patrol-header">
                <div>
                  <div class="patrol-location">${patrol.location}</div>
                  <div class="patrol-meta">${date} • Team Leader: ${patrol.team_leader}</div>
                </div>
                <div class="patrol-status">${status}</div>
              </div>
              ${patrol.notes ? `<div class="patrol-notes">${patrol.notes}</div>` : ''}
            </div>
          `;
        });
      }
      
      htmlContent += `
        </body>
        </html>
      `;
      
      // Create a blob and download link
      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `${reportTitle.replace(/\s+/g, '_')}.html`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Error exporting HTML report:', err);
    } finally {
      setExportLoading(false);
      setShowExportOptions(false);
    }
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
  
  const totalStats = calculateTotalStats();
  const totalContactStats = calculateTotalContactStats();
  
  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Reports</h1>
        
        <div className="relative">
          <button
            onClick={() => setShowExportOptions(!showExportOptions)}
            className={`bg-blue-700 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors flex items-center ${
              filteredPatrols.length === 0 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={filteredPatrols.length === 0 || exportLoading}
          >
            {exportLoading ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </>
            )}
          </button>
          
          {showExportOptions && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  onClick={exportReportCSV}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Export as CSV
                </button>
                <button
                  onClick={exportReportHTML}
                  className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <FileText2 className="h-4 w-4 mr-2" />
                  Export as HTML
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center mb-4">
          <Filter className="h-5 w-5 text-blue-700 mr-2" />
          <h2 className="text-xl font-semibold text-blue-900">Report Filters</h2>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <button
            onClick={() => setReportType('lastMonth')}
            className={`py-2 px-4 rounded-md border ${
              reportType === 'lastMonth'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Last Month
          </button>
          
          <button
            onClick={() => setReportType('last3Months')}
            className={`py-2 px-4 rounded-md border ${
              reportType === 'last3Months'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Last 3 Months
          </button>
          
          <button
            onClick={() => setReportType('yearToDate')}
            className={`py-2 px-4 rounded-md border ${
              reportType === 'yearToDate'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Year to Date
          </button>
          
          <button
            onClick={() => setReportType('previousYear')}
            className={`py-2 px-4 rounded-md border ${
              reportType === 'previousYear'
                ? 'bg-blue-100 border-blue-500 text-blue-700'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            Previous Year
          </button>
          
          {availableYears.map(year => (
            <button
              key={year}
              onClick={() => setReportType(year.toString())}
              className={`py-2 px-4 rounded-md border ${
                reportType === year.toString()
                  ? 'bg-blue-100 border-blue-500 text-blue-700'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-900">{reportTitle}</h2>
            <div className="flex items-center text-gray-600 mt-1">
              <Calendar className="h-4 w-4 mr-1" />
              <span className="text-sm">{reportDateRange}</span>
            </div>
          </div>
          
          <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {filteredPatrols.length} {filteredPatrols.length === 1 ? 'patrol' : 'patrols'}
          </div>
        </div>
        
        {filteredPatrols.length === 0 ? (
          <div className="text-center py-8">
            <BarChart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No Data Available</h3>
            <p className="text-gray-500">
              There are no patrol records for the selected time period.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <BarChart className="h-5 w-5 mr-2" />
                Statistics Summary
              </h3>
              
              {totalStats && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">Patrols</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {filteredPatrols.length}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">Conversations</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {totalStats.conversations}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">Prayers</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {totalStats.prayers}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">Water Bottles</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {totalStats.water_bottles}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">First Aid</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {totalStats.first_aid}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">Directions</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {totalStats.directions}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">Transport Help</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {totalStats.transport_assistance}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">Vulnerable People</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {totalStats.vulnerable_people}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">Bottles/Glass</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {totalStats.bottles_glass_collected}
                    </div>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <div className="text-sm text-gray-600">Cans Collected</div>
                    <div className="text-2xl font-bold text-blue-900">
                      {totalStats.cans_collected}
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-blue-900 mb-4">Contact Matrix</h3>
              {renderContactMatrix(totalContactStats)}
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-blue-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Patrol Notes
              </h3>
              {renderPatrolNotes()}
            </div>
          </>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-semibold text-blue-900 mb-4">Export Options</h3>
        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">CSV Export</h4>
            <p className="text-gray-600 mb-2">
              Export your report data in CSV format for use in spreadsheet applications like Excel or Google Sheets.
            </p>
            <button
              onClick={exportReportCSV}
              className="text-blue-700 hover:text-blue-800 font-medium flex items-center"
              disabled={filteredPatrols.length === 0 || exportLoading}
            >
              <FileDown className="h-4 w-4 mr-1" />
              Export CSV
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">HTML Report</h4>
            <p className="text-gray-600 mb-2">
              Export a formatted HTML report that can be viewed in any web browser, shared with others, or printed to PDF.
            </p>
            <button
              onClick={exportReportHTML}
              className="text-blue-700 hover:text-blue-800 font-medium flex items-center"
              disabled={filteredPatrols.length === 0 || exportLoading}
            >
              <FileText2 className="h-4 w-4 mr-1" />
              Export HTML
            </button>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <h4 className="font-medium text-gray-800 mb-2">PDF Export (via Browser)</h4>
            <p className="text-gray-600 mb-2">
              To save this report as a PDF, use your browser's print functionality:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-gray-600 ml-4">
              <li>Press <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded">Ctrl+P</kbd> (Windows/Linux) or <kbd className="px-2 py-1 bg-gray-100 border border-gray-300 rounded">⌘+P</kbd> (Mac)</li>
              <li>Select "Save as PDF" from the destination options</li>
              <li>Click "Save" to download the PDF to your device</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};