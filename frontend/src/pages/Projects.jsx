import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';
import { Plus, Users } from 'lucide-react';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [newProject, setNewProject] = useState({ name: '', description: '', members: [] });
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    fetchProjects();
    if (isAdmin) fetchUsers();
  }, [isAdmin]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(Array.isArray(res.data) ? res.data : []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load projects. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/projects', newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '', members: [] });
      fetchProjects();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create project');
      console.error(err);
    }
  };

  const handleMemberSelect = (e) => {
    const value = Array.from(e.target.selectedOptions, option => option.value);
    setNewProject({ ...newProject, members: value });
  };

  return (
    <>
      <div className="animate-fade-in">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Projects</h1>
        {isAdmin && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Project
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
        {loading ? (
          <div style={{ color: 'var(--text-muted)' }}>Loading projects...</div>
        ) : (
          <>
            {projects.map((project, idx) => (
              <motion.div 
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="glass-panel"
                style={{ padding: '24px' }}
              >
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>{project.name}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '24px', minHeight: '40px' }}>
                  {project.description || 'No description provided.'}
                </p>
                
                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={16} color="var(--text-muted)" />
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                    {project.members.length} {project.members.length === 1 ? 'member' : 'members'}
                  </span>
                </div>
              </motion.div>
            ))}
            {projects.length === 0 && (
              <div style={{ color: 'var(--text-muted)' }}>No projects found.</div>
            )}
          </>
        )}
      </div>
    </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '32px', background: '#ffffff', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Create New Project</h2>
            {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Project Name</label>
                <input type="text" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#111827', border: '1px solid #d1d5db', padding: '8px', borderRadius: '8px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Description</label>
                <textarea rows={3} value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Assign Members (Hold Ctrl/Cmd to select multiple)</label>
                <select multiple value={newProject.members} onChange={handleMemberSelect} style={{ height: '100px' }}>
                  {users.map(u => (
                    <option key={u._id} value={u._id}>{u.name} ({u.email})</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button type="button" className="btn-secondary" onClick={() => { setShowModal(false); setError(''); }}>Cancel</button>
                <button type="submit" className="btn-primary">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Projects;
