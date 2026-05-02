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
      console.log("AuthStore: Login successful. Raw Data:", userData);
      
      // Handle both flat and nested responses
      const actualUser = userData.user ? { ...userData.user } : { ...userData };
      const actualToken = token || userData.token;

      // Ensure we don't save the token inside the user object
      if (actualUser.token) delete actualUser.token;

      localStorage.setItem('user', JSON.stringify(actualUser));
      localStorage.setItem('token', actualToken);
      set({ user: actualUser, token: actualToken });
    },
    
    logout: () => {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      set({ user: null, token: null });
    }
  };
});

export default useAuthStore;
