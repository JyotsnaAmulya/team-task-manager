import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import useAuthStore from '../store/authStore';
import { motion } from 'framer-motion';
import { Plus, Calendar, User as UserIcon } from 'lucide-react';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [newTask, setNewTask] = useState({ title: '', description: '', status: 'Todo', dueDate: '', project: '', assignee: '' });
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'Admin';

  useEffect(() => {
    fetchTasks();
    if (isAdmin) {
      fetchProjects();
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchProjects = async () => {
    try {
      const res = await api.get('/projects');
      setProjects(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await api.post('/tasks', newTask);
      setShowModal(false);
      setNewTask({ title: '', description: '', status: 'Todo', dueDate: '', project: '', assignee: '' });
      fetchTasks();
    } catch (err) { 
      setError(err.response?.data?.message || 'Failed to create task');
      console.error(err); 
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/${taskId}`, { status: newStatus });
      fetchTasks();
    } catch (err) { console.error(err); }
  };

  const columns = ['Todo', 'In Progress', 'Done'];

  return (
    <>
      <div className="animate-fade-in" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <h1 className="page-title" style={{ margin: 0 }}>Tasks</h1>
        {isAdmin && (
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => setShowModal(true)}>
            <Plus size={18} /> New Task
          </button>
        )}
      </div>

      <div style={{ display: 'flex', gap: '24px', flex: 1, overflowX: 'auto', paddingBottom: '16px' }}>
        {columns.map((col, i) => (
          <div key={col} style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <div style={{ 
                width: '8px', height: '8px', borderRadius: '50%',
                background: col === 'Todo' ? 'var(--status-todo)' : col === 'In Progress' ? 'var(--status-in-progress)' : 'var(--status-done)'
              }}></div>
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-secondary)' }}>{col}</h3>
              <span style={{ background: 'var(--bg-tertiary)', padding: '2px 8px', borderRadius: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                {tasks.filter(t => t.status === col).length}
              </span>
            </div>
            
            {tasks.filter(t => t.status === col).map((task, idx) => (
              <motion.div 
                key={task._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="glass-panel"
                style={{ padding: '16px', background: 'var(--bg-secondary)', cursor: 'grab' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <h4 style={{ fontWeight: '500', fontSize: '15px' }}>{task.title}</h4>
                  <select 
                    value={task.status} 
                    onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    style={{ padding: '4px 8px', fontSize: '12px', background: 'var(--bg-tertiary)', border: 'none', color: 'var(--text-muted)' }}
                  >
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {task.description && <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{task.description}</p>}
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--glass-border)', paddingTop: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                    <Calendar size={14} />
                    {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}
                  </div>
                  {task.assignee && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '12px', background: 'rgba(0,0,0,0.05)', padding: '4px 8px', borderRadius: '12px' }}>
                      <UserIcon size={12} /> {task.assignee.name.split(' ')[0]}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '32px', background: '#ffffff', borderRadius: '16px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h2 style={{ fontSize: '20px', marginBottom: '24px' }}>Create New Task</h2>
            {error && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>}
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Title</label>
                <input type="text" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#111827', border: '1px solid #d1d5db', padding: '8px', borderRadius: '8px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Description</label>
                <textarea rows={2} value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Due Date</label>
                  <input type="date" value={newTask.dueDate} onChange={e => setNewTask({...newTask, dueDate: e.target.value})} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                  <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Status</label>
                  <select value={newTask.status} onChange={e => setNewTask({...newTask, status: e.target.value})}>
                    {columns.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Project</label>
                <select value={newTask.project} onChange={e => setNewTask({...newTask, project: e.target.value})} style={{ background: 'rgba(255, 255, 255, 0.1)', color: '#111827', border: '1px solid #d1d5db', padding: '8px', borderRadius: '8px' }}>
                  <option value="">Select Project</option>
                  {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Assignee</label>
                <select value={newTask.assignee} onChange={e => setNewTask({...newTask, assignee: e.target.value})}>
                  <option value="">Unassigned</option>
                  {users.map(u => <option key={u._id} value={u._id}>{u.name}</option>)}
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

export default Tasks;
