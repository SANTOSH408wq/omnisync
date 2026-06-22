import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Tiers from './pages/Tiers';
import Learn from './pages/Learn';
import Credits from './pages/Credits';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import './App.css';

export default function App() {
    const [user, setUser] = useState({
        id: '123',
        name: 'Guest User',
        email: 'guest@example.com',
        displayName: 'Guest User',
        skills: ['react', 'javascript'],
        credits: 100,
        tier: 'free',
        settings: { theme: 'system', fontSize: 'medium', accentColor: 'blue' }
    });

    return (
        <Router>
            <div className="app-layout">
                <Navigation />
                <main className="app-main">
                    <Routes>
                        <Route path="/" element={<Dashboard user={user} setSyncedUser={setUser} />} />
                        <Route path="/learn" element={<Learn user={user} setSyncedUser={setUser} />} />
                        <Route path="/credits" element={<Credits user={user} setSyncedUser={setUser} />} />
                        <Route path="/tiers" element={<Tiers user={user} setSyncedUser={setUser} />} />
                        <Route path="/profile" element={<Profile user={user} setSyncedUser={setUser} />} />
                        <Route path="/settings" element={<Settings user={user} setSyncedUser={setUser} />} />
                        <Route path="*" element={<Dashboard user={user} setSyncedUser={setUser} />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
}
