import { createContext, useState } from 'react';

const AppContext = createContext();

const AppContextProvider = ({ children }) => {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const value = {
    BACKEND_URL,
    accessToken,
    setAccessToken,
    user,
    setUser,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
