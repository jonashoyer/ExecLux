import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

function FormDialog(props) {
    const [input,setInput] = React.useState('');
    
    function handleClose() {
        props.onClose();
    }

    const submit = e => {
        e.preventDefault();
        handleClose();
        props.onSubmit(input);
    }
  
    return (
    <Dialog fullWidth={true} maxWidth='sm' open={true} onClose={handleClose}>
        <form onSubmit={submit}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {props.text}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label={props.label}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    type="text"
                    fullWidth
                />
                </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
                <Button onClick={submit} variant="contained" color="primary">
                    {props.submitText}
                </Button>
            </DialogActions>
        </form>
    </Dialog>
    );
  }
  
  export default FormDialog;