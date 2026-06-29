import { createContext, useContext, useState } from 'react';
import api from '../api/axios';

// FIX: Added 'export' to the context so other files can access it
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    const { token: newToken, user: newUser } = response.data;

    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));

    setToken(newToken);
    setUser(newUser);

    return newUser;
  };

  // NEW: The register function built exactly for your setup!
  const registerUser = async (name, email, password, role) => {
    try {
      // We use your 'api' tool to send the letter
      const response = await api.post('/auth/register', { name, email, password, role });
      const { token: newToken, user: newUser } = response.data;

      // Save the new user's ID card in the browser's storage
      localStorage.setItem('token', newToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Update the global memory so the website knows you are logged in
      setToken(newToken);
      setUser(newUser);

      return { success: true };
    } catch (error) {
      console.error("Registration error:", error);
      // If the backend says no, we grab the exact error message
      const message = error.response?.data?.message || "Server error during registration.";
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  // NEW: We added registerUser to the bottom list so other pages can use it!
  return (
    <AuthContext.Provider value={{ user, token, login, logout, registerUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);