import React, { useState, useEffect, useContext, createContext } from "react";
import Directual from 'directual-api';

const api = new Directual({apiHost: '/'});

export const authContext = createContext();

export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [sessionID, setSessionID] = useState(null);
  const [role, setRole] = useState(null);

  const login = (username, password) => {
    return api.auth.login(username, password).then(res=>{
      setUser(res.username)
      setSessionID(res.sessionID)
    })
  };

  const signout = (cb) => {
    return api.auth.logout('').then(res=>{
      setUser(null)
      setSessionID(null)
      cb()
    })
  };

  const isAutorised = () => {
    return !!user
  }

  const hasRole = (roleCheck) => {
    return role === roleCheck
  }

  useEffect(() => {
    api.auth.isAuthorize((status, token)=>{
      if(status === true){
        setUser(token.username)
        setSessionID(token.sessionID)
        setRole(token.role)
      }
    })
  }, []);

  return {
    user,
    sessionID,
    login,
    isAutorised,
    signout,
    hasRole
  };
}