import React from 'react';
import { makeStyles, useTheme } from '@material-ui/styles';
import {Store} from '../components/context';

import Todo from '../components/todo';
import Password from '../components/password';
import Timer from '../components/timer';

import LockOpenIcon from '@material-ui/icons/LockOpen';
import NoteIcon from '@material-ui/icons/Notes';
import PasswordIcon from '@material-ui/icons/VpnKey';
import TimerIcon from '@material-ui/icons/Timer';
import FormControlLabel from '@material-ui/core/FormControlLabel';


import api from '../api';
import { Typography, TextField, Paper, Button, Checkbox, Fab } from '@material-ui/core';
import crypto from 'crypto';
import {getSavedKeys,saveKey,removeKey} from '../components/encryption';
import Loading from '../components/loading';
import {unstable_useMediaQuery as useMediaQuery} from '@material-ui/core/useMediaQuery';

const keySalt = "83zpN8nxTXGRWZ6r";
const hashSalt = "SD2Mt7wWxXuQucEg";

makeStyles(console.log);

const useStyles = makeStyles(theme => ({
    root:{
        display: 'flex',
        justifyContent: 'center',
        height: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
        boxSizing: 'border-box'
    },
    actionForm:{
        display: 'flex',
        alignItems: 'center',
        marginTop:-theme.mixins.toolbar.minHeight
    },
    actionDialog:{
        padding:32,
        textAlign:'center',
        '& .action-dialog-input':{
            margin:'12px 0 16px 0'
        }
    },
    actionButtons:{
        position: 'absolute',
        bottom: 32,
        right: 32,
    },
    fab:{
        'button&':{
            margin:'0 4px'
        }
    }
}));

const App = props => {
    const classes = useStyles();
    const store = React.useContext(Store);
    const theme = useTheme();
    console.log(theme);

    console.log(useMediaQuery);
    const sm = useMediaQuery(theme.breakpoints.down('sm')); //false;// 
    const md = useMediaQuery(theme.breakpoints.down('md')) && !sm; //false // 

    const [data,setData] = React.useState(null);
    const [encryption,setEncryption] = React.useState({});
    const [tab,setTab] = React.useState('todo');

    React.useEffect(() => {
        setData(null);
        setEncryption({});
        api.project.fetch(store.projectId).then(res => {
            const {data} = res;
            const {project} = data;
            setData(data);
            store.set({projectName:project.name});
            setEncryption({isLocked: !!project.cipherKey, useEncryption: false, cipher: project.cipherKey && Buffer.from(project.cipherKey.data), key: null});
        })
    },[store.projectId]);

    React.useEffect(() => {
        console.log(encryption);
    },[encryption]);

    if(!data || !encryption){
        return(
            <Loading fill/>
        )
    }

    if(encryption.isLocked){
        return <EncryptionDialog classes={classes} useEncryption={[encryption,setEncryption]} data={data} />;
    }

    return(
        <div className={classes.root}>

            {(!sm || tab === 'todo') && <Todo data={data.todos} encryption={encryption} />}
            {((!sm && !md) || tab === 'timer' || (md && tab === 'todo')) && <Timer data={data.timers} encryption={encryption} />}
            {((!sm && !md) || tab === 'password') && <Password data={data.passwords} encryption={encryption} />}

            {(sm || md) && <div className={classes.actionButtons}>
                {sm && <Fab color="primary" disabled={tab === 'todo'} aria-label="note" className={`${classes.fab} ${classes.noteFab}`} onClick={_=>setTab('todo')}>
                    <NoteIcon />
                </Fab>}
                <Fab color="primary" disabled={tab === 'timer'} aria-label="timer" className={classes.fab} onClick={_=>setTab('timer')}>
                    <TimerIcon />
                </Fab> 
                <Fab color="primary" disabled={tab === 'password'} aria-label="password" className={classes.fab} onClick={_=>setTab('password')}>
                    <PasswordIcon />
                </Fab>
            </div>}
        </div>
    )
}

const EncryptionDialog = ({classes, useEncryption,data}) => {
    const [encryption,setEncryption] = useEncryption;
    const [input,setInput] = React.useState('');
    const [error,setError] = React.useState();
    const [save,setSave] = React.useState(false);
    const [isLoading,setIsLoading] = React.useState(false);

    const submit = (e,overrideKey) => {
        if(e) e.preventDefault();
        const key = overrideKey || crypto.createHash('sha256').update(keySalt+input).digest('hex');
        const hash = crypto.createHash('sha256').update(hashSalt+key).digest('hex');

        setIsLoading(true);
        api.project.validateKey(hash,data.project._id).then(res => {
            if(res.data === 'match'){
                if(save && !overrideKey){
                    console.log(data.project._id,key);
                    saveKey(data.project._id,key);
                }
                setEncryption({
                    useEncryption: true,
                    key: Buffer.from(key,'hex')
                });
            }
        }).catch(err => {
            if(err.response){
                if(err.response.status === 400){
                    removeKey(data.project.id);
                }
                setError(err.response.data);
                
            }else{
                setError('An error occurred');
            }
        }).finally(_=>{
            setIsLoading(false);
        })
    }

    React.useEffect(()=>{
        const obj = getSavedKeys();
        const key = obj[data.project._id];
        if(key) submit(null,key);
    },[]);
    
    return(
        <div className={classes.root}>
            <form onSubmit={submit} className={classes.actionForm}>
                <Paper className={classes.actionDialog}>
                        <Typography variant="h6">Project is encrypted</Typography>
                        <Typography variant="subtitle1">Unlock the project with the encryption phrase</Typography>
                        {isLoading && <Loading />}
                        {!isLoading && <>
                        <TextField
                            autoFocus
                            className="action-dialog-input"
                            label="Phrase"
                            type="password"
                            value={input}
                            error={!!error}
                            helperText={error}
                            onChange={e=>setInput(e.target.value)}
                            fullWidth />
                        <Button variant="contained" color="primary" onClick={submit}><LockOpenIcon />Decrypt</Button>
                        <FormControlLabel style={{marginLeft:'auto'}} control={
                            <Checkbox checked={save} onChange={(e,c)=>setSave(c)}/>
                        } label='Save' />
                        </>}
                </Paper>
            </form>
        </div>
    )
}

export default App;
