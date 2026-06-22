import React, { useEffect, useState } from 'react';
import OriginalDashboard from '../components/Dashboard';
import BeaconView from '../components/BeaconView';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../supabase';
import './Dashboard.css';

export default function Dashboard({ user, setSyncedUser }) {
    const [beacons, setBeacons] = useState([]);
    const [activeBeaconId, setActiveBeaconId] = useState(null);
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const beacon = searchParams.get('beacon');
        if (beacon) {
            setActiveBeaconId(beacon);
        }
    }, [searchParams]);

    async function fetchBeacons() {
        const { data } = await supabase.from('beacon').select('*');
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

    useEffect(() => { fetchBeacons(); }, []);

    function refreshBeacons() {
        fetchBeacons();
    }

    async function handleCreateBeacon(title, desc, medium, tags) {
        const newBeacon = {
            seekerId: user.id || '123',
            title,
            description: desc,
            medium,
            tags: tags || [],
            status: 'open'
        };

        await supabase.from('beacon').insert([newBeacon]);
        refreshBeacons();
    }

    async function handleAcceptBeacon(id) {
        await supabase
            .from('beacon')
            .update({ status: 'accepted', solverId: user.id })
            .eq('id', id);

        refreshBeacons();
        setActiveBeaconId(id);
    }

    async function handleResolve(id) {
        await supabase
            .from('beacon')
            .update({ status: 'resolved' })
            .eq('id', id);

        refreshBeacons();
    }

    async function handleSolveAI(id) {
        await supabase
            .from('beacon')
            .update({ status: 'ai-solving', solverId: 'ai' })
            .eq('id', id);

        refreshBeacons();
    }

    async function handleUpdateSkills(skills) {
        setSyncedUser({ ...user, skills });
    }

    if (activeBeaconId) {
        const b = beacons.find(b => b.id.toString() === activeBeaconId.toString());
        if (b) {
            return (<div className="dashboard-page-wrapper">
                <BeaconView user={user} beacon={b} onBack={() => {
                    setActiveBeaconId(null);
                    setSearchParams({});
                }} onResolve={handleResolve} onSolveAI={handleSolveAI} />
            </div>);
        }
    }

    return (<OriginalDashboard user={user} beacons={beacons} onCreateBeacon={handleCreateBeacon} onAcceptBeacon={handleAcceptBeacon} onBuyCredits={() => { }}
        onViewBeacon={(id) => setActiveBeaconId(id)} onUpdateSkills={handleUpdateSkills} />);
}
