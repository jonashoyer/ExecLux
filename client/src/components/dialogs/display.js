import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Typography } from '@material-ui/core';
import moment from 'moment';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {FormatTime} from '../timerFormatting';

const useStyles = makeStyles(theme => ({
    content:{
        '& h5':{
            fontSize: 16,
            lineHeight: 2
        }
    }
}));

function FormDialog(props) {
    const classes = useStyles();
    const [anchorEl,setAnchorEl] = React.useState(null);
  
    return (
        <Dialog fullWidth={true} maxWidth='sm' open={true} onClose={props.onClose}>
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent className={classes.content}>
                {props.content}
            </DialogContent>
            <DialogActions>
                {!props.hideContinue && <Button
                 onClick={props.onContinue} color="secondary"
                >
                    Continue
                </Button>}
                {!props.hideMenu && <Button
                aria-owns={anchorEl ? 'display-option-menu' : undefined}
                aria-haspopup="true"
                onClick={e=>setAnchorEl(e.currentTarget)} color="secondary">
                    Options
                </Button>}
                <Menu anchorEl={anchorEl} id="display-option-menu" open={!!anchorEl} onClose={e=>setAnchorEl(null)}>
                    <MenuItem onClick={props.onEdit}>Edit</MenuItem>
                    <MenuItem onClick={props.onDelete}>Delete</MenuItem>
                </Menu>
                <Button onClick={props.onClose} color="primary">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
  }
  
  export default FormDialog;