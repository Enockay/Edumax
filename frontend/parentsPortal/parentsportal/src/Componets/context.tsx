import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UserContextType {
  userName: string;
  admissionNumber: string;
  isAuthenticated: boolean;
  setUserName: (name: string) => void;
  setAdmissionNumber: (admission: string) => void;
  login: (name: string, admission: string) => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userName, setUserName] = useState<string>('');
  const [admissionNumber, setAdmissionNumber] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (name: string, admission: string) => {
    setUserName(name);
    setAdmissionNumber(admission);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserName('');
    setAdmissionNumber('');
    setIsAuthenticated(false);
  };

  return (
    <UserContext.Provider value={{ userName, admissionNumber, isAuthenticated, setUserName, setAdmissionNumber, login, logout }}>
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
