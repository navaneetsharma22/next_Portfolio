"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, FolderKanban, Eye, TrendingUp, ArrowUpRight, MessageSquare, Clock, ShieldCheck, Activity } from 'lucide-react';
import { StatCard, AdminCard } from '../components/AdminShared';
import adminService from '../../services/adminService';
import projectService from '../../services/projectService';
import contactService from '../../services/contactService';

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

const Dashboard = () => {
  const [stats, setStats] = useState({ projectCount: 0, totalMessages: 0, unreadMessages: 0 });
  const [recentActivity, setRecentActivity] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch all required data in parallel
        const [statsData, projectsRaw, messagesRaw] = await Promise.all([
          adminService.getDashboardStats(),
          projectService.getAll(),
          contactService.getAll().catch(() => [])
        ]);
        // getAll() returns { projects: [], total, pages } — extract the array
        const projectsData = Array.isArray(projectsRaw) ? projectsRaw : (projectsRaw?.projects ?? []);
        const messagesData = Array.isArray(messagesRaw) ? messagesRaw : [];
        
        setStats(statsData);

        // 1. Process Recent Activity (Combine Projects and Messages)
        // 1. Process Recent Activity (Combine Projects and Messages)
        const projectActivities = [];
        projectsData.forEach(p => {
          projectActivities.push({
            text: `Project "${p.title}" added`,
            date: p.createdAt,
            type: 'project-add',
            icon: FolderKanban
          });
          
          const created = new Date(p.createdAt).getTime();
          const updated = new Date(p.updatedAt).getTime();
          if (updated > created + 10000) {
            projectActivities.push({
              text: `Project "${p.title}" updated`,
              date: p.updatedAt,
              type: 'project-update',
              icon: Activity
            });
          }
        });

        const messageActivities = [];
        messagesData.forEach(m => {
          messageActivities.push({
            text: `Message from ${m.name}`,
            date: m.createdAt,
            type: 'message-new',
            icon: MessageSquare
          });

          if (m.replies && m.replies.length > 0) {
            const lastReply = m.replies[m.replies.length - 1];
            messageActivities.push({
              text: `Replied to ${m.name}`,
              date: lastReply.date || m.updatedAt,
              type: 'message-reply',
              icon: TrendingUp
            });
          }
        });

        const activities = [...projectActivities, ...messageActivities]
          .sort((a, b) => new Date(b.date) - new Date(a.date))
          .slice(0, 10);
        
        setRecentActivity(activities);

        // 2. Process Categories
        const categories = projectsData.reduce((acc, p) => {
          const cat = p.category || 'Other';
          acc[cat] = (acc[cat] || 0) + 1;
          return acc;
        }, {});

        const total = projectsData.length || 1;
        const processedCategories = Object.entries(categories).map(([label, count]) => ({
          label,
          count,
          percentage: Math.round((count / total) * 100),
          color: label === 'Web App' ? 'var(--color-primary)' : label === 'Mobile' ? '#3b82f6' : '#10b981'
        })).sort((a, b) => b.count - a.count);

        setCategoryData(processedCategories);

      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const statCards = [
    { title: 'Total Projects', value: stats.projectCount.toString(), icon: FolderKanban, color: '#9929fb', trend: 0 },
    { title: 'Profile Views', value: 'Live', icon: Activity, color: '#3b82f6', trend: 0 },
    { title: 'Total Messages', value: stats.totalMessages.toString(), icon: MessageSquare, color: '#10b981', trend: 0 },
    { title: 'Unread Messages', value: stats.unreadMessages.toString(), icon: MessageSquare, color: '#f59e0b', trend: 0 },
  ];

  if (isLoading) {
    return (
      <div className="h-[60vh] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary/20 rounded-full"></div>
          <p className="text-soft-dark font-black uppercase tracking-widest text-xs">Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-2">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-primary/5 rounded-full border border-primary/10">
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Live Terminal Active</span>
          </div>
          <h1 className="text-5xl font-black tracking-tighter leading-none" style={{ color: 'var(--color-heading)' }}>
            System <span className="text-primary">Pulse</span>
          </h1>
          <p className="text-lg font-medium opacity-40 max-w-xl" style={{ color: 'var(--color-soft-dark)' }}>
            Navaneet, your portfolio ecosystem is performing at optimal levels. 
          </p>
        </div>
        
        <div className="flex items-center gap-2 p-1.5 bg-white/60 backdrop-blur-md rounded-[28px] border border-border/20 shadow-lg">
          <div className="px-5 py-3 flex flex-col items-center border-r border-border/10">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-0.5">Status</span>
            <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Operational</span>
          </div>
          <div className="px-6 py-3 flex flex-col items-center">
            <span className="text-[8px] font-black uppercase tracking-widest opacity-30 mb-0.5">Current Date</span>
            <span className="text-[10px] font-black text-heading uppercase tracking-widest">
              {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Real Engagement Visualization */}
        <AdminCard 
          title="Interaction Metrics" 
          subtitle="Real-time traffic patterns and engagement"
          className="xl:col-span-2 shadow-xl"
          extra={<div className="flex items-center gap-6 text-[10px] font-black text-soft-dark opacity-30 uppercase tracking-[0.2em] relative z-10">
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/50"></span> Sessions</span>
            <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50"></span> Clicks</span>
          </div>}
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[100px]"></div>
          <div className="h-72 w-full relative mt-8">
            <svg className="w-full h-full" viewBox="0 0 1000 300" preserveAspectRatio="none">
              <defs>
                <linearGradient id="pulseGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0" />
                </linearGradient>
              </defs>
              
              {[50, 150, 250].map((y) => (
                <line key={y} x1="0" y1={y} x2="1000" y2={y} stroke="rgba(0,0,0,0.05)" strokeDasharray="10,10" />
              ))}
              
              <path 
                d="M0,300 L0,150 C100,120 200,220 300,140 C400,100 500,240 600,160 C700,120 800,260 900,180 C1000,140 1000,140 1000,300 Z"
                fill="url(#pulseGradient)" 
              />
              <path 
                d="M0,150 C100,120 200,220 300,140 C400,100 500,240 600,160 C700,120 800,260 900,180 C1000,140 1000,140" 
                fill="none" 
                stroke="var(--color-primary)" 
                strokeWidth="6" 
                strokeLinecap="round"
              />
            </svg>
            <div className="flex justify-between mt-10 text-[10px] font-black uppercase tracking-[0.3em] text-soft-dark opacity-20">
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'].map(m => <span key={m}>{m}</span>)}
            </div>
          </div>
        </AdminCard>

        {/* Dynamic Category Breakdown */}
        <AdminCard title="Niche Analysis" subtitle="Content distribution architecture">
          <div className="flex flex-col items-center justify-center h-full pb-6">
            <div className="relative w-56 h-56 mb-10">
              <svg className="w-full h-full -rotate-90 filter drop-shadow-2xl" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--color-border)" strokeOpacity="0.3" strokeWidth="10" />
                {categoryData.length > 0 && (
                   <circle 
                   cx="50" cy="50" r="40" 
                   fill="transparent" 
                   stroke="var(--color-primary)" 
                   strokeWidth="10" 
                   strokeDasharray="251.2" 
                   strokeDashoffset={251.2 * (1 - (categoryData[0]?.percentage / 100))}
                   strokeLinecap="round"
                 />
                )}
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-black tracking-tighter" style={{ color: 'var(--color-heading)' }}>{stats.projectCount}</span>
                <span className="text-[9px] font-black text-soft-dark uppercase tracking-[0.3em] opacity-30 mt-1">Total Assets</span>
              </div>
            </div>
            <div className="w-full space-y-6">
              {categoryData.length > 0 ? categoryData.map((item, i) => (
                <div key={i} className="flex items-center justify-between group cursor-default">
                  <div className="flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full shadow-lg" style={{ backgroundColor: item.color, boxShadow: `0 0 10px ${item.color}` }}></div>
                    <span className="text-sm font-black text-heading opacity-60 group-hover:opacity-100 group-hover:text-primary transition-all uppercase tracking-widest">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold text-soft-dark opacity-30 italic">{item.count}</span>
                    <span className="text-lg font-black text-primary">{item.percentage}%</span>
                  </div>
                </div>
              )) : (
                <div className="py-6 text-center border border-dashed rounded-[32px] border-border/50">
                   <p className="text-[10px] font-black text-soft-dark uppercase tracking-widest opacity-30">Waiting for data...</p>
                </div>
              )}
            </div>
          </div>
        </AdminCard>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
        {/* Real Recent Activity */}
        <AdminCard 
          title="Terminal Logs" 
          subtitle="Chronological interaction stream"
          className="xl:col-span-2"
          extra={<button className="px-6 py-2 bg-gray-50 rounded-full text-[9px] font-black uppercase tracking-[0.2em] text-soft-dark hover:bg-heading hover:text-white transition-all">Clear Stream</button>}
        >
          <div className="space-y-8">
            {recentActivity.length > 0 ? recentActivity.map((activity, i) => {
              const Icon = activity.icon;
              return (
                <div key={i} className="flex items-center gap-6 group">
                  <div className="w-14 h-14 rounded-[24px] bg-gray-50 flex items-center justify-center group-hover:bg-heading group-hover:text-white transition-all duration-700 group-hover:rotate-6">
                    <Icon size={22} className="transition-transform group-hover:scale-110" />
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-heading group-hover:text-primary transition-colors duration-300 text-xl tracking-tight leading-tight">{activity.text}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-100/50 rounded-full">
                        <Clock size={10} className="text-soft-dark opacity-40" />
                        <p className="text-[9px] font-black uppercase tracking-[0.1em] text-soft-dark opacity-40">{timeAgo(activity.date)}</p>
                      </div>
                      <span className="text-[9px] font-black text-primary uppercase tracking-widest opacity-40 italic">#ID-{Math.random().toString(36).substr(2, 4).toUpperCase()}</span>
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-full border border-border/20 flex items-center justify-center group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500 cursor-pointer">
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              );
            }) : (
              <div className="py-20 text-center flex flex-col items-center gap-6 bg-gray-50/50 rounded-[40px] border border-dashed border-border/50">
                <Activity size={40} className="text-border" />
                <p className="text-soft-dark font-black uppercase tracking-[0.3em] text-xs opacity-30">No activity signature detected</p>
              </div>
            )}
          </div>
        </AdminCard>

        {/* System Health & Security */}
        <div className="space-y-10">
          <AdminCard title="Security" className="relative overflow-hidden group shadow-xl">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/5 rounded-full blur-[80px]"></div>
            <div className="relative z-10 space-y-8">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-[24px] bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <ShieldCheck size={32} />
                </div>
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-30 mb-1">Architecture</p>
                  <p className="font-black text-2xl text-heading tracking-tighter">Hyper Secured</p>
                </div>
              </div>
              <div className="pt-8 border-t border-black/5 space-y-4">
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-soft-dark opacity-20">Protocols Active</p>
                {[
                  { label: 'End-to-End Encryption', status: 'Live' },
                  { label: 'Brute-force Protection', status: 'Active' },
                  { label: 'Database Sanitization', status: 'Secure' }
                ].map((p, i) => (
                  <div key={i} className="flex justify-between items-center bg-black/5 p-4 rounded-[20px] border border-black/5 hover:bg-primary/5 transition-colors duration-500">
                    <span className="text-[10px] font-bold text-heading opacity-60 uppercase tracking-widest">{p.label}</span>
                    <span className="text-[9px] font-black text-green-500 uppercase tracking-widest">{p.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </AdminCard>
          
          <AdminCard title="Resources" subtitle="Hardware performance metrics">
            <div className="space-y-8">
              {[
                { label: 'API Response Velocity', value: '92ms', percent: 92, color: 'bg-green-500' },
                { label: 'Edge Network Latency', value: '14ms', percent: 14, color: 'bg-primary' },
                { label: 'Storage Utilization', value: '28%', percent: 28, color: 'bg-blue-400' }
              ].map((m, i) => (
                <div key={i} className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-[0.2em]">
                    <span className="text-soft-dark opacity-50">{m.label}</span>
                    <span className="text-heading">{m.value}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden p-0.5 border border-border/20">
                    <div className={`h-full rounded-full ${m.color} shadow-lg`} style={{ width: `${m.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
