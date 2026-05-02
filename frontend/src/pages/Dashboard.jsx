import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, AlertCircle, ListTodo } from 'lucide-react';
import api from '../api/axios';

const StatCard = ({ title, value, icon: Icon, color, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="glass-panel"
    style={{ padding: '24px', display: 'flex', alignItems: 'flex-start', gap: '16px' }}
  >
    <div style={{ 
      background: `rgba(${color}, 0.1)`, 
      padding: '12px', 
      borderRadius: '12px',
      color: `rgb(${color})`
    }}>
      <Icon size={24} />
    </div>
    <div>
      <h3 style={{ color: 'var(--text-muted)', fontSize: '14px', fontWeight: '500', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '32px', fontWeight: '700', letterSpacing: '-1px' }}>{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await api.get('/tasks');
        const tasks = res.data;
        
        const now = new Date();
        let total = tasks.length;
        let completed = 0;
        let pending = 0;
        let overdue = 0;

        tasks.forEach(task => {
          if (task.status === 'Done') completed++;
          else {
            pending++;
            if (task.dueDate && new Date(task.dueDate) < now) {
              overdue++;
            }
          }
        });

        setStats({ total, completed, pending, overdue });
      } catch (error) {
        console.error("Failed to fetch tasks", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div style={{ padding: '40px' }}>Loading...</div>;

  return (
    <div className="animate-fade-in">
      <h1 className="page-title">Dashboard Overview</h1>
      
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '32px', background: 'linear-gradient(135deg, rgba(48, 25, 52, 0.05), rgba(48, 25, 52, 0.1))' }}>
        <h2 style={{ fontSize: '20px', marginBottom: '16px', color: 'var(--accent-primary)' }}>Welcome to Team-Task-Manager!</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '600px' }}>
          It looks like you're just getting started. Follow these steps to set up your team:
        </p>
        <ul style={{ marginTop: '16px', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
          <li>🚀 <strong>Step 1:</strong> Go to the <strong>Projects</strong> page and create your first project.</li>
          <li>📝 <strong>Step 2:</strong> Go to the <strong>Tasks</strong> page to add tasks to that project.</li>
          <li>👥 <strong>Step 3:</strong> Use the <strong>Dashboard</strong> to track your progress!</li>
        </ul>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '24px',
        marginTop: '32px'
      }}>
        <StatCard title="Total Tasks" value={stats.total} icon={ListTodo} color="99, 102, 241" delay={0.1} />
        <StatCard title="Completed" value={stats.completed} icon={CheckCircle2} color="34, 197, 94" delay={0.2} />
        <StatCard title="Pending" value={stats.pending} icon={Clock} color="234, 179, 8" delay={0.3} />
        <StatCard title="Overdue" value={stats.overdue} icon={AlertCircle} color="239, 68, 68" delay={0.4} />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass-panel"
        style={{ marginTop: '32px', padding: '32px', minHeight: '300px' }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Recent Activity</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Activity feed will appear here. (Coming soon)</p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
