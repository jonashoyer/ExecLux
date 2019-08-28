import React from 'react';

import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider  } from '@material-ui/styles';
import { BrowserRouter as Router, Route, Switch, Redirect} from "react-router-dom";


import Nav from './components/nav';
import Project from './routes/project';
import Login from './routes/login';
import ProjectSettings from './routes/projectSettings';
import performance from './routes/timeOverview';
import guid from './components/guid';
import Account from './routes/account';
// import {Store} from '../components/context';

import { Provider, Store } from './components/context';

const theme = createMuiTheme({
  typography: {
    useNextVariants: true,
  },
  props:{
    sizing: 400
  }
});

const App = props => {
  const {location} = props;
  
  return(
    <Provider>
      <Router>
        <ThemeProvider theme={theme}>
        
          <Dialog />
          <Nav />

          <Switch>

            <Route exact location={location} path='/' component={Project} />
            <PrivateRoute location={location} path='/project/settings' component={ProjectSettings} />
            <PrivateRoute location={location} path='/performance' component={performance} />
            <PrivateRoute location={location} path='/account' component={Account} />
            
            <PublicRoute location={location} path='/login' component={Login} />

          </Switch>

        </ThemeProvider>
      </Router>
    </Provider>
  )
}

const Dialog = props => {
  const store = React.useContext(Store);
  if(!(store && store.dialog && store.dialog.Component)) return null;
  return <store.dialog.Component {...store.dialog.props} close={_=>store.setDialog()} />;
}



export default App;

const PrivateRoute = ({ component : Component, ...rest }) => {
  const store = React.useContext(Store);

  const isAuthenticated = store.hasAuth;
  
  return  <Route
    {...rest}
    render = {props =>
      isAuthenticated ? <Component props={props} /> : <Redirect to='/' />}
    />
}

const PublicRoute = ({ component : Component, ...rest }) => {
  const store = React.useContext(Store);

  const isAuthenticated = store.hasAuth;
  
  return  <Route
    {...rest}
    render = {props =>
      !isAuthenticated ? <Component props={props} /> : <Redirect to='/' />}
    />
}