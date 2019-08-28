import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {Store} from '../components/context';
import Paper from '@material-ui/core/Paper';
import EncryptionDialog from '../components/dialogs/encryptionDialog';

import api from '../api';
import { Typography, Button } from '@material-ui/core';
import Loading from '../components/loading';

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
    }
}));

const Row = ({classes, text,children}) => (
    <div className={classes.row}>
        <Typography variant="subtitle1">{text}</Typography>
        {children}
    </div>
)

const App = props => {
    const classes = useStyles();
    const store = React.useContext(Store);
    const [data,setData] = React.useState(null);

    React.useEffect(() => {
        api.project.fetchSettings(store.projectId).then(res => {
            const {data} = res;
            setData(data);
            store.set({projectName:data.name});
        })
    },[store.projectId]);

    if(!data){
        return <Loading fill />
    }

    const OpenActiveEncryption = _ => {
        store.setDialog(EncryptionDialog);
    }

    return(
        <div className={classes.root}>
            <Paper className={classes.paper}>
                <Typography variant="h6">{data.name}</Typography>
                <Typography>Created {new Date(data.created).toISOString().substring(0, 10)}</Typography>
            </Paper>
            <Paper className={classes.paper}>
                <Typography variant="h6">Encryption</Typography>
                <Typography>Status: {data.cipher ? 'Encrypted' : 'No encryption'}</Typography>
                <Row classes={classes} text="Active encryption">
                    <Button variant="contained" color="primary" onClick={OpenActiveEncryption}>Active</Button>
                </Row>
            </Paper>
        </div>
    )
}

export default App;
