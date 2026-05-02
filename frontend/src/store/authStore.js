import { create } from 'zustand';

const useAuthStore = create((set) => {
  let initialUser = null;
  try {
    const savedUser = localStorage.getItem('user');
    initialUser = savedUser ? JSON.parse(savedUser) : null;
  } catch (e) {
    console.error("Error parsing user from localStorage", e);
  }

  return {
    user: initialUser,
    token: localStorage.getItem('token') || null,
    
    login: (userData, token) => {
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      set({ user: userData, token });
    },
    
    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  };
});

export default useAuthStore;
