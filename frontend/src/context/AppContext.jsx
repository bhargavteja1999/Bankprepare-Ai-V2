import React, { createContext, useState } from 'react';

export const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeDeck, setActiveDeck] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const addNotification = (message, type = 'info') => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  };

  return (
    <AppContext.Provider
      value={{
        activeQuiz,
        setActiveQuiz,
        activeDeck,
        setActiveDeck,
        notifications,
        addNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
