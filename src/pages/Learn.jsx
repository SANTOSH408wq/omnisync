import React, { useEffect, useState } from 'react';
import { Search, BookOpen, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './Learn.css';

export default function Learn({ user, setSyncedUser }) {
    const [resolved, setResolved] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from('beacon')
                .select('*')
                .eq('status', 'resolved');

            const normalized = (data || []).map(b => {
                let tagsArr = [];
                if (Array.isArray(b.tags)) tagsArr = b.tags;
                else if (typeof b.tags === 'string') {
                    try { tagsArr = JSON.parse(b.tags); } 
                    catch(e) { tagsArr = b.tags.replace(/^{|}$/g, '').split(',').map(s => s.trim()).filter(Boolean); }
                }
                return { ...b, tags: tagsArr };
            });
            setResolved(normalized);
        }
        load();
    }, []);

    return (<div className="learn-layout">
          <div className="learn-header">
              <div>
                  <h1 className="learn-title">Knowledge Base</h1>
                  <p className="learn-subtitle">Learn from previously solved request beacons.</p>
              </div>
              <div className="learn-search-wrapper">
                 <Search className="learn-search-icon"/>
                 <input type="text" placeholder="Search solved beacons..." className="learn-search-input"/>
              </div>
          </div>

          <div className="learn-grid">
              {resolved.length === 0 ? (<div className="learn-empty">
                      <BookOpen className="icon"/>
                      <p className="learn-empty-title">No solved beacons yet.</p>
                      <p className="learn-empty-sub">Once requests are resolved, they appear here for educational purposes.</p>
                  </div>) : (resolved.map(b => (<div key={b.id} onClick={() => navigate(`/?beacon=${b.id}`)} className="learn-card" style={{ cursor: 'pointer' }}>
                          <div className="learn-card-badge-row">
                              <CheckCircle2 className="icon"/>
                              <span className="learn-resolved-badge">Resolved</span>
                          </div>
                          <h3 className="learn-card-title truncate">{b.title}</h3>
                          <p className="learn-card-desc line-clamp-2">{b.description}</p>
                          <div className="learn-card-tags">
                             {b.tags?.map((t) => (<span key={t} className="learn-tag">{t}</span>))}
                          </div>
                      </div>)))}
          </div>
      </div>);
}
