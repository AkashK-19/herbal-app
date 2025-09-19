import React, { createContext, useState, useEffect } from 'react';

export const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []); 

  return (
    <LoadingContext.Provider value={{ isInitialLoading }}>
      {children}
    </LoadingContext.Provider>
  );
};