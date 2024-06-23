import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserContextType {
  userName: string;
  admissionNumber: string;
  stream: string;
  isAuthenticated: boolean;
  setUserName: (name: string) => void;
  setAdmissionNumber: (admission: string) => void;
  setStream: (stream: string) => void;
  login: (name: string, admission: string, stream: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string>(() => localStorage.getItem('userName') || '');
  const [stream, setStream] = useState<string>(() => localStorage.getItem('stream') || '');
  const [admissionNumber, setAdmissionNumber] = useState<string>(() => localStorage.getItem('admissionNumber') || '');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => localStorage.getItem('isAuthenticated') === 'true');

  useEffect(() => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('stream', stream);
    localStorage.setItem('admissionNumber', admissionNumber);
    localStorage.setItem('isAuthenticated', isAuthenticated ? 'true' : '');
  }, [userName, stream, admissionNumber, isAuthenticated]);

  const login = (name: string, admission: string, stream: string) => {
    setUserName(name);
    setAdmissionNumber(admission);
    setStream(stream);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserName('');
    setAdmissionNumber('');
    setStream('');
    setIsAuthenticated(false);
    localStorage.clear();
  };

  return (
    <UserContext.Provider value={{ userName, admissionNumber, stream, isAuthenticated, setUserName, setAdmissionNumber, setStream, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
