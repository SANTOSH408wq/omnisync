import React, { useState } from 'react';
import { Plus, Coins, Search, Video, Mic, MessageSquare, Tag, Check, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import './Dashboard.css';
export default function Dashboard({ user, beacons, onCreateBeacon, onAcceptBeacon, onBuyCredits, onViewBeacon, onUpdateSkills }) {
    const [showCreate, setShowCreate] = useState(false);
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [medium, setMedium] = useState('chat');
    const [tagsStr, setTagsStr] = useState('');
    const [buyAmount, setBuyAmount] = useState('');
    const [skillInput, setSkillInput] = useState('');
    const handleCreate = (e) => {
        e.preventDefault();
        if (!title)
            return;
        const tags = tagsStr.split(',').map(s => s.trim()).filter(Boolean);
        onCreateBeacon(title, desc, medium, tags);
        setShowCreate(false);
        setTitle('');
        setDesc('');
        setTagsStr('');
    };
    const handleAddSkill = () => {
        if (!skillInput.trim())
            return;
        const newSkill = skillInput.trim().toLowerCase();
        if (!user.skills.includes(newSkill)) {
            onUpdateSkills([...user.skills, newSkill]);
        }
        setSkillInput('');
    };
    const handleRemoveSkill = (s) => {
        onUpdateSkills(user.skills.filter(sk => sk !== s));
    };
    const myActiveBeacons = beacons.filter(b => b.seekerId === user.id && b.status !== 'resolved');
    const openBeacons = beacons.filter(b => b.status === 'open');
    const iAmSolving = beacons.filter(b => b.solverId === user.id && b.status !== 'resolved');
    // Sort open beacons: ones matching user skills first
    const sortedBeacons = [...openBeacons].sort((a, b) => {
        const aMatch = a.tags?.some(t => user.skills.includes(t.toLowerCase())) ? 1 : 0;
        const bMatch = b.tags?.some(t => user.skills.includes(t.toLowerCase())) ? 1 : 0;
        return bMatch - aMatch;
    });
    return (<div className="dashboard-layout">
      <div className="dashboard-grid">
        
        {/* Left Column - Actions & Profile */}
        <div className="dashboard-left">
          
          <button onClick={() => setShowCreate(!showCreate)} className="create-beacon-btn">
            <Plus className="icon"/>
            Create Request Beacon
          </button>

          {showCreate && (<motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} onSubmit={handleCreate} className="create-form">
              <div>
                <span className="tag">Problem Title</span>
                <input type="text" className="glass-input" value={title} onChange={e => setTitle(e.target.value)} required placeholder="What do you need help with?"/>
              </div>
              <div>
                <span className="tag">Details (Optional)</span>
                <textarea className="glass-input" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the issue..."/>
              </div>
              <div>
                <span className="tag">Tags (Comma Separated)</span>
                <input type="text" className="glass-input" value={tagsStr} onChange={e => setTagsStr(e.target.value)} placeholder="e.g. React, Python, Math"/>
              </div>
              <div>
                <span className="tag">Response Method</span>
                <div className="medium-grid">
                  {['chat', 'voice', 'video'].map(m => (<button key={m} type="button" onClick={() => setMedium(m)} className={`medium-btn ${medium === m ? 'selected' : ''}`}>
                      {m === 'chat' && <MessageSquare className="icon"/>}
                      {m === 'voice' && <Mic className="icon"/>}
                      {m === 'video' && <Video className="icon"/>}
                      <span>{m}</span>
                    </button>))}
                </div>
              </div>
              <button type="submit" className="form-submit-btn">
                Broadcast Beacon
              </button>
            </motion.form>)}

          {/* User Skills Profile */}
          <div className="skills-card">
            <span className="tag">My Skills & Interests</span>
            <p className="skills-desc">Add skills to get matched with relevant requests.</p>
            <div className="skills-list">
              {user.skills.map(s => (<span key={s} className="skill-tag" onClick={() => handleRemoveSkill(s)}>
                  {s} &times;
                </span>))}
            </div>
            <div className="skill-input-row">
               <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddSkill()} className="glass-input" placeholder="Add a skill..."/>
               <button onClick={handleAddSkill} className="btn btn-ghost skill-add-btn">+</button>
            </div>
          </div>

          {(myActiveBeacons.length > 0 || iAmSolving.length > 0) && (<div className="active-beacons-section">
              {myActiveBeacons.length > 0 && (<div className="glass-card my-beacons-card">
                  <span className="tag">My Active Beacons</span>
                  <div className="beacon-list">
                    {myActiveBeacons.map(b => (<div key={b.id} onClick={() => onViewBeacon(b.id)} className="beacon-mini-card">
                        <div className="beacon-mini-header">
                          <div className="beacon-mini-title">{b.title}</div>
                          <span className="beacon-mini-badge">Wait</span>
                        </div>
                        <div className="beacon-mini-desc">{b.description}</div>
                      </div>))}
                  </div>
                </div>)}
              
              {iAmSolving.length > 0 && (<div className="glass-card solving-card">
                  <span className="tag">Currently Solving</span>
                  <div className="beacon-list">
                    {iAmSolving.map(b => (<div key={b.id} onClick={() => onViewBeacon(b.id)} className="beacon-mini-card">
                        <div className="beacon-mini-title">{b.title}</div>
                        <div className="beacon-mini-desc">{b.description}</div>
                      </div>))}
                  </div>
                </div>)}
            </div>)}
        </div>

        {/* Right Column - Global Feed */}
        <div className="dashboard-right">
          
          <div className="feed-header">
            <div>
              <h2 className="feed-title">Network Beacons</h2>
              <p className="feed-subtitle">Live requests matched with your skills</p>
            </div>
            <div className="live-badge">
              <span className="live-dot"></span>
              Live Sync
            </div>
          </div>
          
          <div className="feed-list">
            {sortedBeacons.length === 0 ? (<div className="feed-empty">
                <Search className="icon"/>
                <p className="feed-empty-title">No active request beacons right now.</p>
                <p className="feed-empty-sub">When someone broadcasts a beacon, it will appear here.</p>
              </div>) : (sortedBeacons.map(b => {
            const isMatch = b.tags?.some(t => user.skills.includes(t.toLowerCase()));
            return (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={b.id} className={`beacon-card ${isMatch ? 'match' : ''}`}>
                    <div className="beacon-card-content">
                      <div className="beacon-card-title-row">
                         <h3 className="beacon-card-title">{b.title}</h3>
                         {isMatch && <span className="match-badge"><Check className="icon"/> Match</span>}
                      </div>
                      <p className="beacon-card-desc line-clamp-2">{b.description}</p>
                      
                      <div className="beacon-card-meta">
                        <span className="beacon-meta-medium">
                          {b.medium === 'chat' && <MessageSquare className="icon"/>}
                          {b.medium === 'voice' && <Mic className="icon"/>}
                          {b.medium === 'video' && <Video className="icon"/>}
                          {b.medium}
                        </span>
                        
                        <span className="beacon-meta-credits">
                          <Coins className="icon"/> +20 CR / 10m
                        </span>

                        {b.tags?.length > 0 && (<span className="beacon-meta-tags">
                            <Tag className="icon"/>
                            {b.tags?.join(', ')}
                          </span>)}
                        
                        <span className="beacon-meta-time">• {new Date(b.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                    </div>
                    
                    <button onClick={(e) => { e.stopPropagation(); onAcceptBeacon(b.id); }} className="beacon-accept-btn">
                      Accept <ArrowRight className="icon"/>
                    </button>
                  </motion.div>);
        }))}
          </div>
        </div>
      </div>
    </div>);
}
