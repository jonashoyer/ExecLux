import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Store} from '../context';
import crypto from 'crypto';
import api from '../../api';

const keySalt = "83zpN8nxTXGRWZ6r";

function FormDialog(props) {
    const store = React.useContext(Store);
    const [error,setError] = React.useState(undefined);
    const [input,setInput] = React.useState('');
    const [input2,setInput2] = React.useState('');
    
    function handleClose() {
        store.setDialog();
    }

    const submit = e => {
        e.preventDefault();
        if(input !== input2){
            return setError("Don't match!");
        }
        const {projectId} = store;
        const hash = crypto.createHash('sha256').update(keySalt+input).digest('hex');
        api.project.setEncryption(hash,projectId).then(res => {
            const cipher = res.data;
            console.log(cipher);
            handleClose();
        });
    }
  
    return (
    <Dialog fullWidth={true} maxWidth='sm' open={true} onClose={handleClose}>
        <form onSubmit={submit}>
            <DialogTitle>Active encryption</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Enter a encryption phrase to active project encryption.
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Phrase"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    type="password"
                    error={!!error}
                    helperText={error}
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Confirm phrase"
                    value={input2}
                    onChange={e => setInput2(e.target.value)}
                    type="password"
                    error={!!error}
                    fullWidth
                />
                </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
                <Button onClick={submit} variant="contained" color="primary">
                    Active encryption
                </Button>
            </DialogActions>
        </form>
    </Dialog>
    );
  }
  
  export default FormDialog;