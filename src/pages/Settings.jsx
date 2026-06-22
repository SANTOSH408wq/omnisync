import React, { useState } from 'react';
import { Settings as SettingsIcon, Palette, Bell, Wallet } from 'lucide-react';
import './Settings.css';
export default function Settings({ user, setSyncedUser }) {
    const [activeTab, setActiveTab] = useState('appearance');
    const [fontSize, setFontSize] = useState(user.settings?.fontSize || 'medium');
    const [accentColor, setAccentColor] = useState(user.settings?.accentColor || 'blue');
    const [saving, setSaving] = useState(false);
    const saveSettings = async () => {
        setSaving(true);
        setTimeout(() => {
             setSyncedUser({ ...user, settings: { fontSize, accentColor }});
             setSaving(false);
        }, 500);
    };
    return (<div className="settings-layout">
          <div>
              <h1 className="settings-title">Settings</h1>
              <p className="settings-subtitle">Manage your preferences, appearance, and account.</p>
          </div>

          <div className="settings-panel">
             <div className="settings-panel-grid">
                <div className="settings-sidebar">
                    <button onClick={() => setActiveTab('appearance')} className={`settings-tab-btn ${activeTab === 'appearance' ? 'active' : ''}`}>
                        <Palette className="icon"/> Appearance
                    </button>
                    <button onClick={() => setActiveTab('profile')} className={`settings-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}>
                        <SettingsIcon className="icon"/> Profile
                    </button>
                    <button onClick={() => setActiveTab('payments')} className={`settings-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}>
                        <Wallet className="icon"/> Payments
                    </button>
                    <button onClick={() => setActiveTab('notifications')} className={`settings-tab-btn ${activeTab === 'notifications' ? 'active' : ''}`}>
                        <Bell className="icon"/> Notifications
                    </button>
                </div>
                
                <div className="settings-content">
                   {activeTab === 'appearance' && (<>
                       <h2 className="settings-section-title">Appearance</h2>
                       <div className="settings-section-body">
                           <div>
                               <label className="settings-label">Accent Color</label>
                               <div className="color-picker-row">
                                   {['blue', 'red', 'green', 'purple'].map(c => {
                const colorMap = { blue: '#3b82f6', red: '#ef4444', green: '#22c55e', purple: '#a855f7' };
                return (<button key={c} onClick={() => setAccentColor(c)} className={`color-swatch ${accentColor === c ? 'selected' : ''}`} style={{ backgroundColor: colorMap[c] }}/>);
            })}
                                   <div className={`color-custom-wrapper ${accentColor?.startsWith('#') ? 'selected' : ''}`}>
                                       <div className="color-custom-gradient"/>
                                       <input type="color" className="color-custom-input" value={accentColor?.startsWith('#') ? accentColor : '#1a73e8'} onChange={e => setAccentColor(e.target.value)}/>
                                   </div>
                               </div>
                           </div>

                           <div>
                               <label className="settings-label">Font Size</label>
                               <div className="font-size-row">
                                   {['small', 'medium', 'large'].map(s => (<button key={s} onClick={() => setFontSize(s)} className={`font-size-btn ${fontSize === s ? 'selected' : ''}`}>
                                           {s}
                                       </button>))}
                               </div>
                           </div>
                           
                           <div className="settings-save-divider">
                              <button onClick={saveSettings} disabled={saving || (fontSize === user.settings?.fontSize && accentColor === user.settings?.accentColor)} className="settings-save-btn">
                                 {saving ? 'Saving...' : 'Save Settings'}
                              </button>
                           </div>
                       </div>
                     </>)}

                   {activeTab === 'profile' && (<>
                           <h2 className="settings-section-title">Profile Settings</h2>
                           <div className="settings-section-body">
                               <div className="profile-avatar-row">
                                   <div className="profile-avatar-circle">
                                       {user.name?.substring(0, 2).toUpperCase() || 'US'}
                                   </div>
                                   <button className="btn btn-ghost">Change Avatar</button>
                               </div>
                               <div>
                                   <label className="settings-label">Display Name</label>
                                   <input type="text" className="glass-input settings-input" defaultValue={user.name || ''}/>
                               </div>
                               <div>
                                   <label className="settings-label">Email Address</label>
                                   <input type="email" readOnly disabled className="glass-input settings-input" defaultValue={user.email || ''}/>
                               </div>
                               <div>
                                   <label className="settings-label">Change Password</label>
                                   <div className="password-fields">
                                       <input type="password" placeholder="Current Password" className="glass-input settings-input"/>
                                       <input type="password" placeholder="New Password" className="glass-input settings-input"/>
                                   </div>
                               </div>
                               <button className="btn btn-primary settings-profile-save">Save Profile</button>
                           </div>
                       </>)}

                   {activeTab === 'payments' && (<>
                           <h2 className="settings-section-title">Payment Methods</h2>
                           <div className="settings-section-body">
                               <div className="payment-card primary">
                                   <div className="payment-card-left">
                                       <Wallet className="icon primary"/>
                                       <div>
                                           <div className="payment-card-name">Visa ending in **** 4242</div>
                                           <div className="payment-card-sub">Primary Payment Method</div>
                                       </div>
                                   </div>
                                   <span className="payment-primary-badge">Primary</span>
                               </div>
                               <div className="payment-card">
                                   <div className="payment-card-left">
                                       <Wallet className="icon secondary"/>
                                       <div>
                                           <div className="payment-card-name">Mastercard ending in **** 1234</div>
                                           <div className="payment-card-sub">Expires 12/28</div>
                                       </div>
                                   </div>
                                   <button className="payment-set-primary-btn">Set Primary</button>
                               </div>
                               <button className="btn btn-ghost add-payment-btn">Add Payment Method</button>
                           </div>
                       </>)}

                   {activeTab === 'notifications' && (<>
                           <h2 className="settings-section-title">Notification Preferences</h2>
                           <div className="notification-list">
                               {[
                { title: 'Email Notifications', desc: 'Receive daily digests and system updates.' },
                { title: 'Push Notifications', desc: 'Get real-time alerts when your requests are solved.' },
                { title: 'Marketing Emails', desc: 'Promotions, tips, and new feature announcements.' }
            ].map(opt => (<div key={opt.title} className="notification-item">
                                       <div>
                                           <div className="notification-item-title">{opt.title}</div>
                                           <div className="notification-item-desc">{opt.desc}</div>
                                       </div>
                                       <input type="checkbox" defaultChecked className="notification-checkbox"/>
                                   </div>))}
                           </div>
                       </>)}
                </div>
             </div>
          </div>
      </div>);
}
