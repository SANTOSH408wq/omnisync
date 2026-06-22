import React, { useEffect, useState } from 'react';
import { Grid, MessageSquare } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabase';
import './Profile.css';

export default function Profile({ user }) {
    const [beacons, setBeacons] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        async function load() {
            const { data } = await supabase
                .from('beacon')
                .select('*')
                .or(`seekerId.eq.${user.id},solverId.eq.${user.id}`);
                
            const normalized = (data || []).map(b => {
                let tagsArr = [];
                if (Array.isArray(b.tags)) tagsArr = b.tags;
                else if (typeof b.tags === 'string') {
                    try { tagsArr = JSON.parse(b.tags); } 
                    catch(e) { tagsArr = b.tags.replace(/^{|}$/g, '').split(',').map(s => s.trim()).filter(Boolean); }
                }
                return { ...b, tags: tagsArr };
            });
            setBeacons(normalized);
        }
        if (user?.id) {
            load();
        }
    }, [user?.id]);

    return (<div className="profile-layout">
          <div className="profile-header-card">
             <div className="profile-avatar-ring">
                 <div className="profile-avatar-inner">
                     {user.name.substring(0, 1).toUpperCase()}
                 </div>
             </div>
             <div className="profile-info">
                 <div className="profile-name-row">
                     <h1 className="profile-name">{user.name}</h1>
                     <div>
                       <span className="profile-tier-badge">{user.tier} Tier</span>
                     </div>
                 </div>
                 
                 <div className="profile-stats">
                     <div className="profile-stat"><span className="profile-stat-value">{beacons.filter(b => b.seekerId === user.id).length}</span> <span className="profile-stat-label">Requested</span></div>
                     <div className="profile-stat"><span className="profile-stat-value">{beacons.filter(b => b.solverId === user.id).length}</span> <span className="profile-stat-label">Solved</span></div>
                     <div className="profile-stat"><span className="profile-stat-value">{user.credits}</span> <span className="profile-stat-label">Credits</span></div>
                 </div>
                 
                 <div>
                     <p className="profile-skills-label">Skills focus:</p>
                     <div className="profile-skills-list">
                         {user.skills.map((s) => <span key={s} className="profile-skill-tag">{s}</span>)}
                     </div>
                 </div>
             </div>
          </div>

          <div>
              <div className="profile-posts-divider">
                 <div className="profile-posts-tabs">
                     <button className="profile-posts-tab">
                        <Grid className="icon"/> Posts
                     </button>
                 </div>
              </div>

              <div className="profile-posts-grid">
                  {beacons.map(b => {
            const isAsker = b.seekerId === user.id;
            return (<div key={b.id} onClick={() => navigate(`/?beacon=${b.id}`)} className="profile-post-card">
                              <div className="profile-post-content">
                                  <div className={`profile-post-type ${isAsker ? 'asked' : 'solved'}`}>{isAsker ? 'Asked' : 'Solved'}</div>
                                  <h3 className="profile-post-title line-clamp-3">{b.title}</h3>
                              </div>
                              <div className="profile-post-overlay">
                                  <div className="profile-post-overlay-stat">
                                      <MessageSquare fill="white" className="icon"/> {b.tags?.length || 0}
                                  </div>
                              </div>
                          </div>);
        })}
              </div>
          </div>
      </div>);
}
