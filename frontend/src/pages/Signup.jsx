import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../api/axios';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Member');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/signup', { name, email, password, role });
      login(res.data, res.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ width: '100%', maxWidth: '400px', padding: '40px', background: '#301934', borderRadius: '16px', boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)' }}
      >
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '32px' }}>
          <Hexagon size={48} color="#ffffff" />
        </div>

        <h2 style={{ textAlign: 'center', fontSize: '24px', marginBottom: '8px', fontWeight: '600', color: '#ffffff' }}>Create an account</h2>
        <p style={{ textAlign: 'center', color: 'rgba(255, 255, 255, 0.7)', marginBottom: '32px', fontSize: '14px' }}>Join Team-Task-Manager today</p>

        {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>Full Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="John Doe" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <label style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.9)' }}>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#ffffff', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
              <option value="Member" style={{ color: '#000' }}>Member</option>
              <option value="Admin" style={{ color: '#000' }}>Admin</option>
            </select>
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: '8px' }}>Sign Up</button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: 'rgba(255, 255, 255, 0.7)' }}>
          Already have an account? <Link to="/login" style={{ color: '#ffffff', textDecoration: 'underline' }}>Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Signup;
