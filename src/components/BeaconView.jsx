import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Send, Sparkles, AlertCircle, Coins, Tag } from 'lucide-react';
import { motion } from 'motion/react';
import { formatTime } from '../lib/utils';
import { supabase } from '../supabase';
import { groq } from '../groq';
import './BeaconView.css';

export default function BeaconView({ user, beacon, onBack, onResolve, onSolveAI }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef(null);

  const isSeeker = user.id === beacon.seekerId;
  const isSolver = user.id === beacon.solverId;
  const isAI = beacon.solverId === 'ai';

  useEffect(() => {
    let subscription;


    async function loadMessages() {
      const { data } = await supabase
        .from('beacon_chats')
        .select('*')
        .eq('beaconId', beacon.id);

      setMessages(data || []);
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }

    loadMessages();

    subscription = supabase
      .channel(`beacon_chat_${beacon.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'beacon_chats',
          filter: `beaconId=eq.${beacon.id}`,
        },
        (payload) => {
          setMessages((prev) => {
            if (prev.some(m => m.id === payload.new.id)) return prev;
            return [...prev, payload.new];
          });
          setTimeout(() => {
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
          }, 100);
        }
      )
      .subscribe();

    return () => {
      if (subscription) {
        supabase.removeChannel(subscription);
      }
    };
  }, [beacon.id]);

  async function handleSend(e) {
    e.preventDefault();
    if (!inputText.trim()) return;

    const msgText = inputText;
    setInputText('');

    const msg = {
      beaconId: beacon.id,
      senderId: user.id,
      senderName: user.name,
      text: msgText
    };

    const { data } = await supabase.from('beacon_chats').insert([msg]).select();

    if (data && data[0]) {
      setMessages((prev) => {
        if (prev.some(m => m.id === data[0].id)) return prev;
        return [...prev, data[0]];
      });
      setTimeout(() => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
      }, 100);
    }

    if (isAI) {
      try {
        const groqData = await groq.chat.completions.create({
          messages: [{ role: "user", content: msgText }],
          model: "openai/gpt-oss-20b"
        });

        const replyText = groqData.choices[0]?.message?.content || "Sorry, I couldn't process that.";

        const aiMsg = {
          beaconId: beacon.id,
          senderId: 'ai',
          senderName: 'Groq AI',
          text: replyText
        };
        const { data: aiData } = await supabase.from('beacon_chats').insert([aiMsg]).select();
        if (aiData && aiData[0]) {
          setMessages((prev) => {
            if (prev.some(m => m.id === aiData[0].id)) return prev;
            return [...prev, aiData[0]];
          });
          setTimeout(() => {
            scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
          }, 100);
        }
      } catch (err) {
        console.error("AI Error:", err);
      }
    }
  }

  return (<div className="beacon-view-layout">
    <div className="glass-card beacon-header">
      <div className="beacon-header-left">
        <button onClick={onBack} className="beacon-back-btn">
          <ArrowLeft className="icon" />
        </button>
        <div>
          <h2 className="beacon-header-title">{beacon.title}</h2>
          <div className="beacon-header-badges">
            <span className="beacon-status-badge">{beacon.status}</span>
            {beacon.status === 'accepted' && <span className="beacon-cost-badge"><Coins className="icon" /> Costing 1 credit / 30s</span>}
            {beacon.tags?.length > 0 && (<span className="beacon-tags-badge"><Tag className="icon" /> {beacon.tags?.join(', ')}</span>)}
          </div>
        </div>
      </div>

      <div className="beacon-header-actions">
        {beacon.status === 'open' && isSeeker && (<button onClick={() => onSolveAI(beacon.id)} className="ai-solver-btn">
          <Sparkles className="icon" /> Use AI Solver
        </button>)}

        {(isSeeker && (beacon.status === 'accepted' || beacon.status === 'ai-solving')) && (<button onClick={() => onResolve(beacon.id)} className="btn btn-primary resolve-btn">
          Mark as Resolved
        </button>)}
      </div>
    </div>

    <div className="glass-card beacon-chat-container">
      {(beacon.medium === 'voice' || beacon.medium === 'video') && (<div className="media-placeholder">
        <AlertCircle className="icon" />
        <p className="media-placeholder-title">WebRTC {beacon.medium} stream placeholder</p>
        <p className="media-placeholder-desc">Due to environment constraints, actual peer-to-peer media is simulated as a chat interface below.</p>
      </div>)}

      <div ref={scrollRef} className="chat-area">

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="original-request">
          <p className="original-request-label">Original Request</p>
          <p className="original-request-text">{beacon.description}</p>
        </motion.div>

        {beacon.status === 'open' && (<div className="waiting-state">
          <div className="waiting-spinner" />
          <p className="waiting-text">Waiting for a human solver to accept...</p>
        </div>)}

        {messages.map(msg => {
          const isMe = msg.senderId === user.id;
          const isAiMsg = msg.senderId === 'ai';
          return (<motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} key={msg.id} className={`message-wrapper ${isMe ? 'own' : 'other'}`}>
            <div className="message-header">
              <span className={`message-sender ${isMe ? 'own' : isAiMsg ? 'ai' : 'other'}`}>
                {isMe ? 'You' : isAiMsg ? 'Groq AI' : msg.senderName}
                {isAiMsg && <Sparkles className="icon" />}
              </span>
            </div>
            <div className={`message-bubble ${isMe ? 'own' : isAiMsg ? 'ai' : 'other'}`}>
              {msg.text}
            </div>
          </motion.div>);
        })}
      </div>

      {(beacon.status === 'accepted' || beacon.status === 'ai-solving') && (<form onSubmit={handleSend} className="chat-input-form">
        <input type="text" className="glass-input" placeholder={isAI && isSeeker ? "Ask AI a follow up..." : "Type a message..."} value={inputText} onChange={e => setInputText(e.target.value)} />
        <button type="submit" disabled={!inputText.trim()} className="btn btn-primary chat-send-btn">
          <Send className="icon" />
        </button>
      </form>)}
    </div>
  </div>);
}
