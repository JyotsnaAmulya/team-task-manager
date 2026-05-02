import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderKanban, CheckSquare, LogOut, Hexagon } from 'lucide-react';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';

const Sidebar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <motion.aside 
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      style={{
        width: '260px',
        height: 'calc(100vh - 32px)',
        margin: '16px 0 16px 16px',
        display: 'flex',
        flexDirection: 'column',
        padding: '24px 16px',
        background: '#301934',
        borderRadius: '16px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
      }}
    >
      <div style={{ padding: '24px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Hexagon size={32} color="#ffffff" />
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', margin: 0 }}>Team-Task</h2>
        </div>
        <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.3)', marginTop: '8px', letterSpacing: '0.1em' }}>VERSION 1.2</div>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
        <NavLink to="/" style={navLinkStyle}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/projects" style={navLinkStyle}>
          <FolderKanban size={20} /> Projects
        </NavLink>
        <NavLink to="/tasks" style={navLinkStyle}>
          <CheckSquare size={20} /> Tasks
        </NavLink>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '24px', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div style={{ marginBottom: '16px', padding: '0 8px' }}>
          <p style={{ fontSize: '14px', fontWeight: '500', color: '#ffffff', marginBottom: '4px' }}>{user?.name}</p>
          <span style={{ 
            fontSize: '10px', 
            fontWeight: '700', 
            letterSpacing: '0.05em', 
            textTransform: 'uppercase',
            background: user?.role === 'Admin' ? '#22c55e' : 'rgba(255, 255, 255, 0.15)',
            color: '#ffffff',
            padding: '2px 8px',
            borderRadius: '4px'
          }}>
            {user?.role || 'Guest'}
          </span>
        </div>
        <button 
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: '12px 16px',
            background: 'transparent',
            color: 'rgba(255, 255, 255, 0.7)',
            textAlign: 'left',
            borderRadius: '8px',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <LogOut size={20} /> Logout
        </button>
      </div>
    </motion.aside>
  );
};

const navLinkStyle = ({ isActive }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '12px 16px',
  borderRadius: '8px',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: '500',
  color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.7)',
  background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
  transition: 'all 0.2s',
  border: 'none',
});

export default Sidebar;
