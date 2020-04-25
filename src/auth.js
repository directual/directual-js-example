import React, { useState, useEffect, useContext, createContext } from "react";
import Directual from 'directual-api';
const config = {
  appID: '050e77bb-b0e6-4685-8712-a85774fad272',
  apiHost: '/',
}
const api = new Directual(config);

const authContext = createContext();

// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function ProvideAuth({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => {
  return useContext(authContext);
};

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const [user, setUser] = useState(null);
  const [sessionID, setSessionID] = useState(null);

  // Wrap any Firebase methods we want to use making sure ...
  // ... to save the user to state.
  const login = (username, password) => {
    return api.auth.login(username, password).then(res=>{
      // authModule.isAuthenticated = true;
      // authModule.username = res.username;
      // authModule.sessionID = res.sessionID;
      setUser(res.username)
      setSessionID(res.sessionID)
    })

    // return firebase
    //   .auth()
    //   .signInWithEmailAndPassword(email, password)
    //   .then(response => {
    //     setUser(response.user);
    //     return response.user;
    //   });
  };

  const signout = (cb) => {
    return api.auth.logout('').then(res=>{
      setUser(null)
      setSessionID(null)
      cb()
    })
  };

  // Subscribe to user on mount
  // Because this sets state in the callback it will cause any ...
  // ... component that utilizes this hook to re-render with the ...
  // ... latest auth object.
  useEffect(() => {
    api.auth.isAuthorize((status, token)=>{
      if(status === true){
        setUser(token.username)
        setSessionID(token.sessionID)
      }
    })
    // const unsubscribe = firebase.auth().onAuthStateChanged(user => {
    //   if (user) {
    //     setUser(user);
    //   } else {
    //     setUser(false);
    //   }
    // });
    //
    // // Cleanup subscription on unmount
    // return () => unsubscribe();
  }, []);

  // Return the user object and auth methods
  return {
    user,
    sessionID,
    login,
    signout
  };
}