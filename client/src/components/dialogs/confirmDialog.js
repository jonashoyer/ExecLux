import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import {Store} from '../context';

function FormDialog(props) {
    function handleClose() {
        props.onClose();
    }

    const confirm = e => {
        e.preventDefault();
        props.onConfirm();
        // handleClose();
    }
  
    return (
    <Dialog fullWidth={true} maxWidth='sm' open={true} onClose={handleClose}>
        <form onSubmit={confirm}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.text}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={confirm} variant="contained" color="primary">
                    {props.submitText}
                </Button>
            </DialogActions>
        </form>
    </Dialog>
    );
  }
  
  export default FormDialog;