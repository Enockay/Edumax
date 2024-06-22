import React, { createContext, useContext, useState, ReactNode } from 'react';

interface HeaderContextType {
  title: string;
  backgroundColor: string;
  setHeader: (title: string, backgroundColor: string) => void;
}

const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

export const HeaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [title, setTitle] = useState<string>('Default Title');
  const [backgroundColor, setBackgroundColor] = useState<string>('#000000');

  const setHeader = (title: string, backgroundColor: string) => {
    setTitle(title);
    setBackgroundColor(backgroundColor);
  };

  return (
    <HeaderContext.Provider value={{ title, backgroundColor, setHeader }}>
      {children}
    </HeaderContext.Provider>
  );
};

export const useHeader = () => {
  const context = useContext(HeaderContext);
  if (context === undefined) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
};
