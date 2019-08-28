import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DomainIcon from '@material-ui/icons/Domain';
import AddIcon from '@material-ui/icons/AddCircle';
import singleInput from './singleInput';

import {Store} from '../context';
import api from '../../api';
import Loading from '../loading';
import { makeStyles } from '@material-ui/styles';
import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
    link:{
        textDecoration: 'none',
        color: 'inherit'
    }
}));

function FormDialog() {
    const classes = useStyles();
    
    const store = React.useContext(Store);
    const [projects,setProjects] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    const addProjectDialogProps = {
        title:"New project",
        text:"Enter project name",
        label:"Name",
        submitText:"Create",
        onClose: store.setDialog,
        onSubmit: input => {
            api.project.create(input).then(doc => {
                store.set({
                    dialog:{},
                    projectId: doc._id
                });
            })
        }
    }

    const selectProject = id => {

        store.set({
            dialog:{},
            projectId: id
        });
    }

    React.useEffect(() => {
        api.project.fetchList().then(res => {
            setProjects(res.data);
            setIsLoading(false);
        });
    },[]);
    
    function handleClose() {
        store.setDialog(null);
    }

    return (
    <Dialog
        open={true}
        onClose={handleClose}
        fullWidth={true}
        maxWidth='sm'
        >
        <DialogTitle>Select a project</DialogTitle>
        <DialogContent>
            {isLoading && <Loading />}
            {!isLoading && <>
            <DialogContentText>
                Project list
            </DialogContentText>
            <List component="nav">


                {projects.map(e =>
                    <Link key={e._id} to='/' className={classes.link}>
                        <ListItem button onClick={_ => selectProject(e._id)}>
                            <ListItemIcon>
                                <DomainIcon />
                            </ListItemIcon>
                            <ListItemText inset primary={e.name} />
                        </ListItem>
                    </Link>
                )}
                
                <ListItem button onClick={e => store.setDialog(singleInput, addProjectDialogProps)}>
                    <ListItemIcon>
                        <AddIcon color="primary" />
                    </ListItemIcon>
                    <ListItemText inset primary="Create a new project" />
                </ListItem>

            </List>
            </>}
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
        </DialogActions>
    </Dialog>
    );
  }
  
  export default FormDialog;