import React from 'react';
import { NavLink } from 'react-router-dom';
import { Network, CreditCard, BookOpen, Settings, UserCircle, Shield, LogOut } from 'lucide-react';
import './Navigation.css';

export default function Navigation() {
    const links = [
        { to: '/', icon: <Network className="nav-icon"/>, label: 'Network' },
        { to: '/learn', icon: <BookOpen className="nav-icon"/>, label: 'Learn' },
        { to: '/credits', icon: <CreditCard className="nav-icon"/>, label: 'Credits' },
        { to: '/tiers', icon: <Shield className="nav-icon"/>, label: 'Tiers' },
        { to: '/profile', icon: <UserCircle className="nav-icon"/>, label: 'Profile' },
        { to: '/settings', icon: <Settings className="nav-icon"/>, label: 'Settings' },
    ];
    return (<nav className="nav-sidebar">
      <div className="nav-brand">
          <div className="nav-logo">
              <span className="nav-logo-text">O</span>
          </div>
          <h1 className="nav-title">OmniSync</h1>
      </div>
      
      <div className="nav-links">
        {links.map(l => (<NavLink key={l.to} to={l.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {l.icon}
            <span className="nav-link-label">{l.label}</span>
          </NavLink>))}
      </div>
      
      <div className="nav-footer">
        <button onClick={() => window.location.reload()} className="nav-logout-btn">
          <LogOut className="nav-icon"/>
          <span className="nav-link-label">Reset</span>
        </button>
      </div>
    </nav>);
}
