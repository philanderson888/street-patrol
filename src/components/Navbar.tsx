import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Users, ClipboardList, History, Settings, LogOut, Clock, BarChart } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [hasActivePatrol, setHasActivePatrol] = useState(false);
  const [activePatrolId, setActivePatrolId] = useState<string | null>(null);

  useEffect(() => {
    const checkActivePatrols = async () => {
      if (!user) {
        setHasActivePatrol(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('patrols')
          .select('id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1);

        if (error) throw error;
        
        if (data && data.length > 0) {
          setHasActivePatrol(true);
          setActivePatrolId(data[0].id);
        } else {
          setHasActivePatrol(false);
          setActivePatrolId(null);
        }
      } catch (err) {
        console.error('Error checking active patrols:', err);
      }
    };

    checkActivePatrols();

    // Set up a subscription to listen for changes
    const subscription = supabase
      .channel('public:patrols')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'patrols',
        filter: `user_id=eq.${user?.id}`
      }, () => {
        checkActivePatrols();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const goToActivePatrol = () => {
    if (activePatrolId) {
      navigate(`/active-patrol/${activePatrolId}`);
      closeMenu();
    }
  };

  return (
    <nav className="bg-blue-900 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2" onClick={closeMenu}>
            <Users className="h-8 w-8" />
            <span className="font-bold text-xl">Street Patrol</span>
          </Link>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-4 items-center">
            {hasActivePatrol && (
              <button
                onClick={goToActivePatrol}
                className="flex items-center space-x-1 px-3 py-2 rounded bg-green-700 hover:bg-green-800"
              >
                <Clock className="h-5 w-5" />
                <span>Active Patrol</span>
              </button>
            )}
            <Link
              to="/new-patrol"
              className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-blue-800 ${
                isActive('/new-patrol') ? 'bg-blue-800' : ''
              }`}
            >
              <ClipboardList className="h-5 w-5" />
              <span>New Patrol</span>
            </Link>
            <Link
              to="/history"
              className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-blue-800 ${
                isActive('/history') ? 'bg-blue-800' : ''
              }`}
            >
              <History className="h-5 w-5" />
              <span>History</span>
            </Link>
            <Link
              to="/reports"
              className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-blue-800 ${
                isActive('/reports') ? 'bg-blue-800' : ''
              }`}
            >
              <BarChart className="h-5 w-5" />
              <span>Reports</span>
            </Link>
            <Link
              to="/settings"
              className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-blue-800 ${
                isActive('/settings') ? 'bg-blue-800' : ''
              }`}
            >
              <Settings className="h-5 w-5" />
              <span>Settings</span>
            </Link>
            {user && (
              <button
                onClick={signOut}
                className="flex items-center space-x-1 px-3 py-2 rounded hover:bg-blue-800"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="md:hidden pb-4">
            {hasActivePatrol && (
              <button
                onClick={goToActivePatrol}
                className="w-full text-left block px-3 py-2 rounded bg-green-700 hover:bg-green-800 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Active Patrol</span>
                </div>
              </button>
            )}
            <Link
              to="/new-patrol"
              className={`block px-3 py-2 rounded hover:bg-blue-800 ${
                isActive('/new-patrol') ? 'bg-blue-800' : ''
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center space-x-2">
                <ClipboardList className="h-5 w-5" />
                <span>New Patrol</span>
              </div>
            </Link>
            <Link
              to="/history"
              className={`block px-3 py-2 rounded hover:bg-blue-800 ${
                isActive('/history') ? 'bg-blue-800' : ''
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center space-x-2">
                <History className="h-5 w-5" />
                <span>History</span>
              </div>
            </Link>
            <Link
              to="/reports"
              className={`block px-3 py-2 rounded hover:bg-blue-800 ${
                isActive('/reports') ? 'bg-blue-800' : ''
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center space-x-2">
                <BarChart className="h-5 w-5" />
                <span>Reports</span>
              </div>
            </Link>
            <Link
              to="/settings"
              className={`block px-3 py-2 rounded hover:bg-blue-800 ${
                isActive('/settings') ? 'bg-blue-800' : ''
              }`}
              onClick={closeMenu}
            >
              <div className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </div>
            </Link>
            {user && (
              <button
                onClick={() => {
                  signOut();
                  closeMenu();
                }}
                className="w-full text-left px-3 py-2 rounded hover:bg-blue-800"
              >
                <div className="flex items-center space-x-2">
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </div>
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};