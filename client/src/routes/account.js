import React from 'react';
import {Store} from '../components/context';
import { makeStyles } from '@material-ui/styles';
import { Paper, Typography, TextField } from '@material-ui/core';
import { Button } from '@material-ui/core';
import api from '../api';
import Loading from '../components/loading';
import { getSavedKeys } from '../components/encryption';

const useStyles = makeStyles(theme => ({
  root:{
    height: 'calc(100vh - '+theme.mixins.toolbar.minHeight+'px)',
    padding: '16px 0',
    boxSizing: 'border-box',
    maxWidth: (theme.props.sizing * 2),
    margin:'auto'
  },
  paper:{
    padding:32,
    marginBottom:16
  },
  row:{
    display:'flex',
    justifyContent:'space-between',
    alignItems:'baseline',
    padding:'16px 0'        
  },
  textField:{
    maxWidth:220,
    margin:'8px 0'
  },
  spaceBetween:{
    display: 'flex',
    justifyContent: 'space-between',
    margin:'12px 0'
  }
}));

const Row = ({classes, text, children}) => (
  <div className={classes.row}>
      <div>
        {/* <Typography variant="h6">{title}</Typography> */}
        <Typography variant="subtitle1">{text}</Typography>
      </div>
      {children}
  </div>
)

const Account = props => {
  const classes = useStyles();

  const store = React.useContext(Store);

  const [userData,setUserData] = React.useState(null);
  const [, forceUpdate] = React.useState();

  React.useEffect(() => {
    api.user.fetch().then(res => {
      setUserData(res.data);
    })
  }, []);


  if(!userData){
    return(
      <Loading fill/>
    )
  }

  const DeleteKeys = _ => {
    localStorage.removeItem('exec_save');
    forceUpdate(new Date().getTime());
  }

  const keyCount = Object.keys(getSavedKeys()).length;

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Typography variant="h6">Account</Typography>
        <Typography variant="h6">{userData.name} - {userData.email}</Typography>
      </Paper>

      <ChangePassword classes={classes} />

      <Paper className={classes.paper}>
        <Typography variant="h6">Encryption keys</Typography>
        <Row classes={classes} text={`Delete saved encryption keys`}>
          <Button variant="contained" color="secondary" onClick={DeleteKeys}>Delete {keyCount} {keyCount !== 1 ? 'keys' : ' key'}</Button>
        </Row>
      </Paper>
      
    </div>
  )
}

const ChangePassword = props => {

  const {classes} = props;
  const [isLoading,setIsLoading] = React.useState(false);
  const [wasSuccessful,setSuccessful] = React.useState();
  const [error,setError] = React.useState();
  const [oldPassword,setOldPassword] = React.useState('');
  const [newPassword,setNewPassword] = React.useState('');
  const [newPassword2,setNewPassword2] = React.useState('');

  const onChange = (e,set) => {
    if(error) setError();
    if(wasSuccessful) setSuccessful(false);
    set(e.target.value);
  }

  const onSubmit = e => {
    e.preventDefault();

    setSuccessful(false);
    
    if(!oldPassword.length || !newPassword.length || !newPassword2.length){
      
      return setError('Missing field!')
    }

    if(newPassword !== newPassword2){
      
      return setError('New password do not match!');
    }
    
    setError('')
    setIsLoading(true);

    api.auth.changePassword(oldPassword, newPassword).then(res => {
      setSuccessful(true);
    }).catch(err => {

      if(err.response.status === 400) {
        setOldPassword('');
        return setError('Password incorrect!');
      }
      
      setError('An error occurred!');
    }).finally(_=>{
      setIsLoading(false);
    })
  }

  return (
    <Paper className={classes.paper}>
        <Typography variant="h6">Change Password</Typography>
        <form onSubmit={onSubmit}>
          <div className={classes.spaceBetween}>

            <TextField
              // name="old"
              classes={{root:classes.textField}}
              className={classes.textField}
              label="Old Password"
              type="password" 
              value={oldPassword}
              fullWidth
              error={!!error}
              disabled={isLoading}
              onChange={e => onChange(e,setOldPassword)}
              />
            <TextField
              // name="old"
              className={classes.textField}
              label="New Password"
              type="password" 
              value={newPassword}
              fullWidth
              error={!!error}
              disabled={isLoading}
              onChange={e => onChange(e,setNewPassword)}
              />
            <TextField
              // name="old"
              className={classes.textField}
              label="New Password Again"
              type="password" 
              value={newPassword2}
              fullWidth
              error={!!error}
              disabled={isLoading}
              onChange={e => onChange(e,setNewPassword2)}
              />
            </div>
          <Typography color='error' gutterBottom>{error}</Typography>
          {wasSuccessful && <Typography variant='body1' color='primary' gutterBottom>Success!</Typography>}

          {isLoading && <Loading short />}
          {!isLoading && <Button type="submit" variant="contained" color="primary" onClick={onSubmit} >Change Password</Button>}
        </form>
      </Paper>
  )
}

export default Account;