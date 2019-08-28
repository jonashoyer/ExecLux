import React from 'react';
import { Paper, Typography, Checkbox, Button } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import KeyIcon from '@material-ui/icons/VpnKey';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AddIcon from '@material-ui/icons/Add';
import LockIcon from '@material-ui/icons/Lock';
import baseStyle from '../styles';
import {Store} from './context';
import {encrypt,decrypt} from './encryption';

import PasswordDialog from './dialogs/passwordDialog';
import PasswordDisplay from './dialogs/passwordDisplay';
import ConfirmDialog from './dialogs/confirmDialog';
import api from '../api';

const useStyles = makeStyles(theme => ({
  ...baseStyle(theme),
  root:{
    width: '25%',
    margin:8,
    marginBottom:0,
    background:theme.palette.background.default,
    maxWidth: theme.props.sizing,
    position: 'relative',
    padding: '0 6px',
    overflowY:'auto',
    [theme.breakpoints.down('md')]:{
      width: '33.33%',
    },
    [theme.breakpoints.down('sm')]:{
        width:'100%',
    },
  },
  item:{
    // backgroundColor: theme.palette.background.paper,
    display:'flex',
    padding:"4px 16px",
    width:'100%',
    boxSizing: 'border-box',
  },
  addBtn:{
    'button&':{
      margin:'6px auto',
      display:'block'
    }
  }
}));

const DecryptPasswordData = (data,encryption) => {
  return data.map(e => {
    const arr = e.data.split(';');
    return {
      ...e,
      data: undefined,
      name: decrypt(arr[0],encryption),
      username: decrypt(arr[1],encryption),
      password: decrypt(arr[2],encryption),
    }
  })
}

const App = props => {

  const {data,encryption} = props;
  const store = React.useContext(Store);
  const [passwords,setPasswords] = React.useState(DecryptPasswordData(data.reverse(),encryption));
  const classes = useStyles();

  const CreateNewPassword = (name,username,password) => {
    if(!encryption.useEncryption) return Promise.reject();
    const data = [encrypt(name,encryption),encrypt(username,encryption),encrypt(password,encryption)].join(';');
    return api.password.create(data,store.projectId).then(res => {
      const {_id,projectId,creater,created} = res.data;
      setPasswords([{_id,name,username,password,projectId,creater,created},...passwords]);
    })
  }

  const EditPassword = (id,name,username,password) => {
    if(!encryption.useEncryption) return Promise.reject();
    const data = [encrypt(name,encryption),encrypt(username,encryption),encrypt(password,encryption)].join(';');
    return api.password.edit(id,data,store.projectId).then(res => {
      setPasswords(passwords.map(e =>{
        if(e._id !== id) return e;
        return {
          ...e,
          name,
          username,
          password
        }
      }))
    })
  }

  const DeletePassword = (id) => {
    return api.password.delete(id,store.projectId).then(res => {
      setPasswords(passwords.filter(e => e._id !== id));
    });
  }

  const ShowCreateDialog = e => {
    store.setDialog(PasswordDialog,{CreateNewPassword});
  }

  const ShowPassword = item => {
    const onClose = e => {
      store.setDialog();
    }
    const onEditPassword = e => {
      const {name,username,password,_id: id} = item;
      store.setDialog(PasswordDialog,{name,username,password,id,EditPassword})
    }

    const onDelete = e => {
      const {_id: id} = item;
      store.setDialog(ConfirmDialog,{title:'Delete password',text:'Are you sure you want to delete this password?',onClose,submitText:"delete",onConfirm:()=>DeletePassword(id)});
    }

    store.setDialog(PasswordDisplay,{...item,onClose,onEditPassword,onDelete})
  }
  
  return(
    <div className={classes.root}>
      <List component="nav">
        {encryption.useEncryption && <div className={classes.topBtnContent}>
          <Button
            onClick={ShowCreateDialog}
            size="small"
            variant="contained"
            color="primary"
            ><AddIcon />Add password</Button>
        </div>}
        {!encryption.useEncryption && 
          <div className={classes.infoHeader}>
            <Typography variant="subtitle1">Project must use encryption to use passwords!</Typography>
            <Button
              size="large"
              variant="contained"
              color="primary"
              ><LockIcon />Create encryption</Button>
          </div>
        }
        {encryption.useEncryption && passwords.map(e =>
          <ListItem key={e._id} button className={classes.item} onClick={_ => ShowPassword(e)}>
            <ListItemIcon>
              <KeyIcon />
            </ListItemIcon>
            <ListItemText inset primary={e.name} />
          </ListItem>
        )}
      </List>
    </div>
  )
}


export default App;
