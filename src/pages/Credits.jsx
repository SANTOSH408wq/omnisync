import React, { useEffect, useState } from 'react';
import { Coins, History, ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react';
import './Credits.css';
export default function Credits({ user, setSyncedUser }) {
    const [tx, setTx] = useState([]);
    const [buyAmount, setBuyAmount] = useState('');
    const [cashoutAmount, setCashoutAmount] = useState('');
    const [processing, setProcessing] = useState(false);
    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem('mockTx') || '[]');
        setTx(stored);
    }, []);
    const handleBuy = async () => {
        if (!buyAmount || buyAmount <= 0)
            return;
        setProcessing(true);
        
        let multiplier = 15;
        if (user.tier === 'premium') multiplier = 20;
        if (user.tier === 'special') multiplier = 25;
        
        const gainedCredits = Number(buyAmount) * multiplier;
        
        const newTx = {
            id: Math.random().toString(),
            amount: gainedCredits,
            costInr: Number(buyAmount),
            description: `Purchased ${gainedCredits} credits for ₹${buyAmount}`,
            createdAt: Date.now()
        };
        
        setSyncedUser({ ...user, credits: (user.credits || 0) + gainedCredits });
        
        const updatedTx = [newTx, ...tx];
        setTx(updatedTx);
        localStorage.setItem('mockTx', JSON.stringify(updatedTx));
        
        setBuyAmount('');
        setProcessing(false);
    };

    const handleCashout = async () => {
        if (!cashoutAmount || cashoutAmount < 400 || user.credits < cashoutAmount) return;
        setProcessing(true);
        
        const rupees = Math.floor(Number(cashoutAmount) / 50);
        
        const newTx = {
            id: Math.random().toString(),
            amount: -Number(cashoutAmount),
            costInr: 0,
            description: `Cashed out ${cashoutAmount} credits for ₹${rupees} (UPI)`,
            createdAt: Date.now()
        };
        
        setSyncedUser({ ...user, credits: user.credits - Number(cashoutAmount) });
        
        const updatedTx = [newTx, ...tx];
        setTx(updatedTx);
        localStorage.setItem('mockTx', JSON.stringify(updatedTx));
        
        setCashoutAmount('');
        setProcessing(false);
    };

    return (<div className="credits-layout">
            <div>
                <h1 className="credits-title">Credits</h1>
                <p className="credits-subtitle">Manage your balance and view transaction history.</p>
            </div>


            <div className="credits-grid">
                <div className="balance-card">
                    <div className="balance-label">
                        <Coins className="icon"/> Available Balance
                    </div>
                    <div className="balance-amount">{user.credits} <span className="balance-unit">CR</span></div>
                    
                    <div className="balance-sections">
                        <div className="balance-section">
                            <label>Purchase Credits (₹)</label>
                            <div className="balance-input-row">
                                <input type="number" value={buyAmount} onChange={e => setBuyAmount(Number(e.target.value) || '')} placeholder="e.g. 50" className="balance-input"/>
                                <button onClick={handleBuy} disabled={processing || !buyAmount} className="balance-action-btn">
                                    Buy
                                </button>
                            </div>
                            <p className="balance-rate">
                                Rate: {user.tier === 'special' ? '25' : user.tier === 'premium' ? '20' : '15'} CR / ₹1 (Based on {user.tier} tier)
                            </p>
                        </div>
                        
                        <div className="balance-section">
                            <label>Cashout to UPI (Credits)</label>
                            <div className="balance-input-row">
                                <input type="number" value={cashoutAmount} onChange={e => setCashoutAmount(Number(e.target.value) || '')} placeholder="Min 400" className="balance-input"/>
                                <button onClick={handleCashout} disabled={processing || !cashoutAmount || cashoutAmount < 400 || user.credits < cashoutAmount} className="balance-action-btn">
                                    Cashout
                                </button>
                            </div>
                            <p className="balance-rate">
                                Rate: 50 CR = ₹1. Transferred to last used UPI.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="tx-card">
                    <div className="tx-header">
                        <History className="icon"/>
                        <h2>Transaction History</h2>
                    </div>

                    <div className="tx-list">
                        {tx.length === 0 ? (<p className="tx-empty">No previous transactions.</p>) : (tx.map(t => {
            const isPos = t.amount > 0;
            return (<div key={t.id} className="tx-item">
                                        <div className="tx-item-left">
                                            <div className={`tx-icon ${isPos ? 'positive' : 'negative'}`}>
                                                {isPos ? <ArrowUpRight className="icon"/> : <ArrowDownRight className="icon"/>}
                                            </div>
                                            <div>
                                                <p className="tx-desc">{t.description}</p>
                                                <p className="tx-date">{new Date(t.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className={`tx-amount ${isPos ? 'positive' : 'negative'}`}>
                                            {isPos ? '+' : ''}{t.amount}
                                        </div>
                                    </div>);
        }))}
                    </div>
                </div>
            </div>
        </div>);
}
