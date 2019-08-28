import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

const useStyles = makeStyles(theme => ({
    textField:{
        '& input':{
            color: 'transparent',
            textShadow:` 0 0 0 ${theme.palette.text.primary}`
        },
        '& input:foucs':{
            outline: 'none'
        }
    }
}));

function FormDialog(props) {
    const classes = useStyles();
    const [clipboarded, setClipboarded] = React.useState([false,false]);
    const [anchorEl,setAnchorEl] = React.useState(null);
    const usernameEl = React.useRef(null);
    const passwordEl = React.useRef(null);

    const copyToClipboard = index => e => {
        (!index ? usernameEl : passwordEl).current.select();
        document.execCommand('copy');
        e.target.focus();
        setClipboarded([!index && true, !!index && true]);
    }
  
    return (
        <Dialog fullWidth={true} maxWidth='sm' open={true} onClose={props.onClose}>
            <DialogTitle>{props.name}</DialogTitle>
            <DialogContent>
                {/* <DialogContentText>
                    {props.text}
                </DialogContentText> */}
                <TextField
                    className={classes.textField}
                    inputRef={usernameEl}
                    margin="dense"
                    label="Username"
                    value={props.username}
                    onClick={copyToClipboard(0)}
                    type="text"
                    helperText={clipboarded[0] && 'Copied to clipboard!'}
                    fullWidth
                />
                <TextField
                    className={classes.textField}
                    inputRef={passwordEl}
                    margin="dense"
                    label="Password"
                    value={props.password}
                    onClick={copyToClipboard(1)}
                    type="text"
                    helperText={clipboarded[1] && 'Copied to clipboard!'}
                    fullWidth
                />
                </DialogContent>
            <DialogActions>
                <Button
                aria-owns={anchorEl ? 'password-option-menu' : undefined}
                aria-haspopup="true"
                onClick={e=>setAnchorEl(e.currentTarget)} color="primary">
                    Options
                </Button>
                <Menu anchorEl={anchorEl} id="password-option-menu" open={!!anchorEl} onClose={e=>setAnchorEl(null)}>
                    <MenuItem onClick={props.onEditPassword}>Edit</MenuItem>
                    <MenuItem onClick={props.onDelete}>Delete</MenuItem>
                </Menu>
                <Button onClick={props.onClose} color="secondary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
  }
  
  export default FormDialog;