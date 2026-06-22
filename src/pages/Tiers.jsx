import React from 'react';
import { Sparkles, Check } from 'lucide-react';
import './Tiers.css';
export default function Tiers({ user, setSyncedUser }) {
    const handleSubscribe = async (tier) => {
        setSyncedUser({ ...user, tier });
    };
    const tiers = [
        { name: 'Free', id: 'free', price: '₹0', credits: '15 credits per ₹1', features: ['Basic solving', 'Standard rate'] },
        { name: 'Premium', id: 'premium', price: '₹49/mo', credits: '20 credits per ₹1', features: ['Priority matching', 'Discounted credits', 'AI Solver access'] },
        { name: 'Special', id: 'special', price: '₹99/mo', credits: '25 credits per ₹1', features: ['Elite matcher', 'Max discount credits', 'Infinite AI access'] }
    ];
    return (<div className="tiers-layout">
          <div>
              <h1 className="tiers-title">Upgrade your experience</h1>
              <p className="tiers-subtitle">Get more out of OmniSync with discounted credits and priority matchmaking.</p>
          </div>

          <div className="tiers-grid">
             {tiers.map(t => {
            const isActive = user.tier === t.id;
            return (<div key={t.id} className={`tier-card ${isActive ? 'active' : ''}`}>
                         <div className="tier-card-header">
                             <div>
                                 <h2 className="tier-name">{t.name}</h2>
                                 <div className="tier-plan-label">{t.id === 'special' ? <span className="tier-special-label"><Sparkles className="icon"/> Ultimate</span> : 'Plan'}</div>
                             </div>
                             {isActive && <span className="tier-current-badge">CURRENT</span>}
                         </div>
                         <div className="tier-price">
                            <span className="tier-price-text">{t.price}</span>
                         </div>
                         <ul className="tier-features">
                            <li className="tier-feature">
                                <Check className="icon"/> {t.credits}
                            </li>
                            {t.features.map(f => (<li key={f} className="tier-sub-feature">
                                    <Check className="icon"/> {f}
                                </li>))}
                         </ul>
                         <button disabled={isActive} onClick={() => handleSubscribe(t.id)} className={`tier-subscribe-btn ${isActive ? 'active-plan' : 'available'}`}>
                             {isActive ? 'Active Plan' : 'Subscribe Now'}
                         </button>
                     </div>);
        })}
          </div>
      </div>);
}
