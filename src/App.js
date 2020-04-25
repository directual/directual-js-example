import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useHistory,
  useLocation
} from 'react-router-dom'
import './App.css'
import LoginPage, { ProfileBlock } from './pages/LoginPage'
import HomePage from './pages/HomePage'
import DashboardPage from './pages/DashboardPage'
import { ProvideAuth, useAuth, authContext } from "./auth";


function PrivateRoute ({ children, ...rest }) {
  const auth = useAuth();
  return (
    <Route
      {...rest}
      render={({ location }) =>
        auth.user ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: location }
            }}
          />
        )
      }
    />
  )
}

//example how use standart components
class MainMenu extends React.Component{
  render() {
    const authContext = this.context;
    return  <div> 
      user is auth {authContext.isAutorised() ? 'true' : 'false'} 
      user has role admin : {authContext.hasRole('admin') ? 'true' : 'false'}
    </div>
  }
}
MainMenu.contextType = authContext

function App () {
  return ( <ProvideAuth>
    <Router>
      <div>
        <hr />
        <MainMenu />
        <hr />
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/dashboard">Dashboard</Link>
          </li>
        </ul>

        <ProfileBlock />

        <hr/>

        <Switch>
          <Route path="/login">
            <LoginPage />
          </Route>
          <Route exact path="/">
            <HomePage />
          </Route>
          <PrivateRoute path="/dashboard">
            <DashboardPage />
          </PrivateRoute>
        </Switch>
      </div>
    </Router>
    </ProvideAuth>
  )
}

export default App
