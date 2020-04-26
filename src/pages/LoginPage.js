import { useHistory, useLocation } from 'react-router-dom'
import React, { useState, useEffect } from 'react';
import { ProvideAuth, useAuth } from "./../auth";

export function AccessDenied () {
  return <div>AccessDenied</div>
}

export function ProfileBlock () {
  let history = useHistory()
  const auth = useAuth();
  return auth.user ? (
    <p>
      Welcome, {auth.user}!
      <button
        onClick={() => {
          auth.signout(() => history.push('/'))
        }}
      >
        Sign out
      </button>
    </p>
  ) : (
    <p>You are not logged in.</p>
  )
}

export default function LoginPage ({ authModule }) {
  let history = useHistory()
  let location = useLocation()

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  let { from } = location.state || { from: { pathname: '/' } }
  const auth = useAuth();

  let login = () => {
    auth.login(username, password).then(()=>{
      history.replace(from);
    }).catch(e=>{
      setError("You login or password incorrect")
    })
  }

  useEffect(() => {
    if(auth.isAutorised()){
      history.replace(from);
    }
  })

  return (
    <div>
      <p>You must log in to view the page at {from.pathname}</p>
      <input onChange={(e)=> {
        setUsername(e.target.value)
      }}/>
      <input onChange={(e)=> {
        setPassword(e.target.value)
      }}/>
      {error}
      <button onClick={login}>Log in</button>
    </div>
  )
}
