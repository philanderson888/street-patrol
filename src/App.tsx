import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { NewPatrol } from './pages/NewPatrol';
import { ActivePatrol } from './pages/ActivePatrol';
import { PatrolHistory } from './pages/PatrolHistory';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';
import { EditPatrol } from './pages/EditPatrol';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Navbar />
          <main className="flex-1 container mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/new-patrol" element={<NewPatrol />} />
              <Route path="/active-patrol/:id" element={<ActivePatrol />} />
              <Route path="/edit-patrol/:id" element={<EditPatrol />} />
              <Route path="/history" element={<PatrolHistory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </main>
          <footer className="bg-blue-900 text-white py-4">
            <div className="container mx-auto px-4 text-center">
              <p>© {new Date().getFullYear()} Street Patrol</p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;