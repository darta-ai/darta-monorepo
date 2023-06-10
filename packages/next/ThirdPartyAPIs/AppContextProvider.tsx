import React from 'react';

export const AuthContext = React.createContext<{
  user: any | null;
  setUser: (user: any | null) => void;
}>({
  user: null,
  setUser: () => {},
});
