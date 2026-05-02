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
      // Debug log to see exactly what the server is returning
      console.log("AuthStore: Login successful. User Data:", userData);
      
      // Separate token from user data if needed
      const userToSave = { ...userData };
      if (userToSave.token) delete userToSave.token;

      localStorage.setItem('user', JSON.stringify(userToSave));
      localStorage.setItem('token', token);
      set({ user: userToSave, token });
    },
    
    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  };
});

export default useAuthStore;
