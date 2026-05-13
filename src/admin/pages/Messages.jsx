"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Trash2, CheckCircle, Search, User, Clock, Reply, MoreHorizontal, Filter, AlertCircle } from 'lucide-react';
import { AdminCard, AdminButton, AdminInput, AdminModal } from '../components/AdminShared';
import contactService from '../../services/contactService';
import toast from 'react-hot-toast';

/**
 * Helper to format relative time
 */
const timeAgo = (date) => {
  if (!date) return 'Unknown';
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + "y ago";
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + "mo ago";
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + "d ago";
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + "h ago";
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + "m ago";
  return "Just now";
};

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // all, read, unread
  
  // View Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const data = await contactService.getAll();
      setMessages(data);
    } catch (err) {
      console.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenMessage = async (message) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
    
    // Auto mark as read when opened if it's unread
    if (!message.isRead) {
      try {
        await contactService.markAsRead(message._id);
        // Update local state
        setMessages(prev => prev.map(m => m._id === message._id ? { ...m, isRead: true } : m));
      } catch (err) {
        console.error('Failed to mark as read');
      }
    }
  };

  const handleToggleRead = async (e, id, currentStatus) => {
    e.stopPropagation();
    try {
      await contactService.markAsRead(id);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: !currentStatus } : m));
      toast.success(currentStatus ? 'Marked as Unread' : 'Marked as Read', {
        icon: '📩',
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
          fontSize: '11px'
        }
      });
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (e, id) => {
    if (e) e.stopPropagation();
    if (window.confirm('Delete this message permanently?')) {
      try {
        await toast.promise(contactService.delete(id), {
          loading: 'Deleting Message...',
          success: 'Message Purged',
          error: 'Delete failed'
        });
        setMessages(prev => prev.filter(m => m._id !== id));
        if (selectedMessage?._id === id) setIsModalOpen(false);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const filteredMessages = messages.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          m.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'read') return matchesSearch && m.isRead;
    if (filter === 'unread') return matchesSearch && !m.isRead;
    return matchesSearch;
  });

  const [replyText, setReplyText] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);

  // Group messages by email to show "Full Chat"
  const getFullConversation = (email) => {
    return messages
      .filter(m => m.email === email)
      .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  };

  useEffect(() => {
    if (selectedMessage) {
      setConversationHistory(getFullConversation(selectedMessage.email));
    }
  }, [selectedMessage, messages]);

  const handleSendReply = async () => {
    if (!replyText.trim()) return;
    setIsReplying(true);
    try {
      const response = await contactService.reply(selectedMessage._id, replyText);
      // Update local state with the new reply
      setMessages(prev => prev.map(m => m._id === selectedMessage._id ? response.data : m));
      setReplyText('');
      toast.success('Reply Sent & Stored');
    } catch (err) {
      toast.error('Failed to send reply');
    } finally {
      setIsReplying(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/10 rounded-full border border-primary/20">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Neural Inbox Active</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter leading-none" style={{ color: 'var(--color-heading)' }}>
            Comm<span className="text-primary">s</span>
          </h1>
          <p className="text-xl font-medium opacity-50" style={{ color: 'var(--color-soft-dark)' }}>Managing your global professional inquiries.</p>
        </div>
        <div className="flex items-center gap-4 p-3 bg-white/70 backdrop-blur-xl rounded-[32px] border border-white/40 shadow-xl shadow-gray-100/50">
          <div className="px-6 py-3 flex flex-col items-center border-r border-border/20">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Unread</span>
            <span className="text-sm font-black text-primary uppercase tracking-widest">
              {messages.filter(m => !m.isRead).length}
            </span>
          </div>
          <div className="px-6 py-3 flex flex-col items-center">
            <span className="text-[9px] font-black uppercase tracking-widest opacity-30 mb-1">Total</span>
            <span className="text-sm font-black text-heading uppercase tracking-widest">
              {messages.length}
            </span>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-6 p-4 bg-white/40 backdrop-blur-md rounded-[40px] border border-white/60 shadow-inner">
        <div className="relative w-full md:w-[500px]">
          <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-soft-dark opacity-30" size={22} />
          <input 
            type="text" 
            placeholder="Search by intelligence signature..." 
            className="w-full bg-white/80 backdrop-blur-xl border border-white focus:border-primary/40 p-6 pl-20 rounded-[32px] text-lg font-medium transition-all focus:ring-[15px] focus:ring-primary/5 outline-none shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 p-2 bg-white/50 rounded-[36px] shadow-sm">
          {['all', 'unread', 'read'].map((f) => (
            <button 
              key={f}
              onClick={() => setFilter(f)}
              className={`px-10 py-4 rounded-[30px] text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-700 ${
                filter === f ? 'bg-primary text-white shadow-2xl shadow-primary/40' : 'text-soft-dark hover:bg-white opacity-40 hover:opacity-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-8">
        {loading ? (
          <div className="py-40 text-center flex flex-col items-center gap-6">
            <div className="w-16 h-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
            <p className="font-black text-[12px] uppercase tracking-[0.6em] text-soft-dark opacity-20">Syncing Conversations</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div 
            className="text-center py-40 bg-white/40 backdrop-blur-3xl rounded-[60px] border border-dashed border-white shadow-2xl"
          >
            <div className="w-24 h-24 bg-white shadow-2xl shadow-gray-100 rounded-[40px] flex items-center justify-center mx-auto mb-8">
              <Mail className="text-gray-100" size={48} />
            </div>
            <h3 className="text-3xl font-black text-heading mb-3 tracking-tighter">Zero Traffic</h3>
            <p className="text-[12px] font-black text-soft-dark opacity-30 uppercase tracking-[0.4em]">All communications processed</p>
          </div>
        ) : filteredMessages.map((msg) => (
          <div
            key={msg._id}
            onClick={() => handleOpenMessage(msg)}
            className={`group cursor-pointer rounded-[50px] border p-2 transition-all duration-700 hover:shadow-[0_40px_100px_-20px_rgba(0,0,0,0.1)] ${
              !msg.isRead ? 'bg-white border-primary/30 shadow-2xl shadow-primary/10 ring-1 ring-primary/10' : 'bg-white/40 backdrop-blur-md border-white/60'
            }`}
          >
            <div className="p-10 md:p-12 rounded-[45px] transition-all duration-500 group-hover:bg-white flex flex-col md:flex-row md:items-center justify-between gap-12">
              <div className="flex items-center gap-10">
                <div className={`w-20 h-20 rounded-[32px] flex items-center justify-center transition-all duration-1000 group-hover:rotate-[15deg] group-hover:scale-110 ${
                  !msg.isRead ? 'bg-primary text-white shadow-2xl shadow-primary/50' : 'bg-white/80 shadow-lg text-soft-dark'
                }`}>
                  <User size={36} />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-heading flex items-center gap-4 mb-2 tracking-tighter">
                    {msg.name}
                    {!msg.isRead && <span className="w-3 h-3 rounded-full bg-primary shadow-lg shadow-primary/50"></span>}
                  </h3>
                  <p className="text-base font-medium text-soft-dark opacity-40 tracking-wide uppercase text-[10px] font-black">{msg.email}</p>
                </div>
              </div>

              <div className="flex-1 lg:max-w-2xl">
                <p className="text-heading/80 text-xl font-medium line-clamp-1 group-hover:text-heading transition-colors mb-4 tracking-tight">{msg.message}</p>
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-md rounded-full shadow-sm border border-border/10">
                    <Clock size={12} className="text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-heading opacity-40">{timeAgo(msg.createdAt)}</span>
                  </div>
                  {msg.replies?.length > 0 && (
                    <div className="flex items-center gap-2 px-4 py-2 bg-green-50 rounded-full border border-green-100">
                      <Reply size={12} className="text-green-500" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-green-500">Replied</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-8 group-hover:translate-x-0">
                <button 
                  onClick={(e) => handleToggleRead(e, msg._id, msg.isRead)}
                  className={`w-14 h-14 flex items-center justify-center rounded-[20px] transition-all duration-500 ${
                    msg.isRead ? 'bg-gray-100 text-soft-dark hover:bg-primary/10 hover:text-primary' : 'bg-primary/10 text-primary'
                  }`}
                >
                  <CheckCircle size={28} />
                </button>
                <button 
                  onClick={(e) => handleDelete(e, msg._id)}
                  className="w-14 h-14 flex items-center justify-center bg-red-50 text-soft-dark hover:text-white hover:bg-red-500 rounded-[20px] transition-all duration-500 shadow-sm"
                >
                  <Trash2 size={28} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Conversation Thread Modal */}
      <AdminModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setReplyText('');
        }}
        title="Intelligence Interface"
        className="max-w-6xl !rounded-[80px]"
      >
        {selectedMessage && (
          <div className="space-y-16 p-2">
            {/* Header Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 p-12 bg-heading rounded-[60px] text-white shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative overflow-hidden group">
               <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] group-hover:bg-primary/40 transition-all duration-1000"></div>
               <div className="lg:col-span-2 flex items-center gap-10 relative z-10">
                  <div className="w-24 h-24 rounded-[36px] bg-white/10 backdrop-blur-2xl flex items-center justify-center text-primary text-4xl font-black border border-white/10">
                    {selectedMessage.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="text-5xl font-black mb-2 tracking-tighter leading-none">{selectedMessage.name}</h4>
                    <p className="text-lg font-medium text-white/40 tracking-[0.1em]">{selectedMessage.email}</p>
                    <div className="flex gap-4 mt-6 flex-wrap">
                      <span className="px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/60">Subject: {selectedMessage.subject || 'N/A'}</span>
                      <span className="px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/60">Budget: {selectedMessage.budget || 'N/A'}</span>
                      <span className="px-4 py-1.5 bg-white/5 backdrop-blur-md rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest text-white/60">Phone: {selectedMessage.phone || 'N/A'}</span>
                    </div>
                  </div>
               </div>
               <div className="flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-white/10 pt-10 lg:pt-0 lg:pl-12 relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/20 mb-3">Neural Linkage</p>
                  <p className="text-xl font-bold text-white mb-2">{getFullConversation(selectedMessage.email).length} Previous Interactions</p>
                  <button 
                    onClick={async (e) => {
                      if(window.confirm('Purge entire intelligence history for this entity?')) {
                        const history = getFullConversation(selectedMessage.email);
                        for(const m of history) {
                          await contactService.delete(m._id);
                        }
                        setMessages(prev => prev.filter(m => m.email !== selectedMessage.email));
                        setIsModalOpen(false);
                        toast.success('Thread Purged');
                      }
                    }}
                    className="text-[10px] font-black text-red-400 hover:text-red-300 uppercase tracking-widest text-left mt-2 flex items-center gap-2"
                  >
                    <Trash2 size={12} /> Purge Thread
                  </button>
               </div>
            </div>

            {/* Conversation Feed */}
            <div className="space-y-12">
               <div className="flex items-center gap-6 px-4">
                  <h5 className="text-[12px] font-black uppercase tracking-[0.5em] text-primary">Conversation Stream</h5>
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent"></div>
               </div>

               <div className="space-y-10 max-h-[600px] overflow-y-auto px-4 custom-scrollbar pr-6">
                  {conversationHistory.map((convo, idx) => (
                    <div key={convo._id} className="space-y-8">
                       {/* Client Side */}
                       <div className="flex flex-col items-start space-y-4 max-w-[85%]">
                          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-soft-dark opacity-30 ml-6">
                             <span>{convo.name}</span>
                             <span>•</span>
                             <span>{new Date(convo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                          </div>
                          <div className="p-8 bg-gray-50 rounded-[40px] rounded-tl-[10px] border border-border/30 text-heading text-xl font-medium leading-relaxed shadow-sm">
                             {convo.message}
                          </div>
                       </div>

                       {/* Admin Replies */}
                       {convo.replies?.map((reply, ridx) => (
                         <div key={ridx} className="flex flex-col items-end space-y-4 max-w-[85%] ml-auto">
                            <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-primary opacity-50 mr-6">
                               <span>Navaneet (System Admin)</span>
                               <span>•</span>
                               <span>{new Date(reply.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <div className="p-8 bg-primary text-white rounded-[40px] rounded-tr-[10px] text-xl font-medium leading-relaxed shadow-2xl shadow-primary/20">
                               {reply.text}
                            </div>
                         </div>
                       ))}
                    </div>
                  ))}
               </div>
            </div>

            {/* Response Nexus */}
            <div className="pt-12 border-t border-black/5 space-y-8">
               <div className="flex items-center justify-between px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full bg-primary animate-ping"></div>
                    <h5 className="text-[12px] font-black uppercase tracking-[0.5em] text-heading">Direct Transmission</h5>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-soft-dark opacity-30 italic">Target: {selectedMessage.email}</p>
               </div>

               <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-blue-500/20 rounded-[50px] blur opacity-30 group-hover:opacity-100 transition duration-1000"></div>
                  <textarea 
                    placeholder="Compose your high-impact response..." 
                    className="relative w-full min-h-[220px] p-10 bg-white border border-border/40 focus:border-primary/40 rounded-[48px] text-xl font-medium transition-all focus:ring-[20px] focus:ring-primary/5 outline-none custom-scrollbar"
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  ></textarea>
               </div>

               <div className="flex justify-end gap-6 pb-4">
                  <AdminButton 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    className="!rounded-[30px]"
                  >
                    Close Session
                  </AdminButton>
                  <button 
                    onClick={handleSendReply}
                    disabled={isReplying || !replyText.trim()}
                    className={`btn-picto !rounded-[30px] !py-5 !px-16 flex items-center gap-4 transition-all duration-500 ${
                      isReplying ? 'opacity-50 scale-95' : 'hover:shadow-[0_20px_50px_rgba(153,41,251,0.5)]'
                    }`}
                  >
                    <Reply size={24} className={isReplying ? 'animate-pulse' : ''} />
                    <span className="text-[12px] font-black uppercase tracking-[0.3em]">{isReplying ? 'Transmitting...' : 'Send Transmission'}</span>
                  </button>
               </div>
            </div>
          </div>
        )}
      </AdminModal>
    </div>
  );
};

export default Messages;
