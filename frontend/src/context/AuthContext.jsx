import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('examace-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    // TODO: connect to backend API
    await new Promise(r => setTimeout(r, 800));
    const mockUser = {
      id: '1',
      email,
      name: email.split('@')[0],
      plan: 'free',
      class: null,
      stream: null,
      onboarded: false,
    };
    setUser(mockUser);
    localStorage.setItem('examace-user', JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const mockUser = {
      id: '2',
      email: 'student@gmail.com',
      name: 'Rahul Sharma',
      avatar: null,
      plan: 'free',
      class: null,
      stream: null,
      onboarded: false,
    };
    setUser(mockUser);
    localStorage.setItem('examace-user', JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  const signup = async (name, email, password) => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    const mockUser = {
      id: '3',
      email,
      name,
      plan: 'free',
      class: null,
      stream: null,
      onboarded: false,
    };
    setUser(mockUser);
    localStorage.setItem('examace-user', JSON.stringify(mockUser));
    setLoading(false);
    return mockUser;
  };

  const updateUser = (updates) => {
    const updated = { ...user, ...updates };
    setUser(updated);
    localStorage.setItem('examace-user', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('examace-user');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, signup, updateUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
