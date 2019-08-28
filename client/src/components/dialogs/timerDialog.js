import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const useStyles = makeStyles(theme => ({
    textFields:{
        margin:'16px 0',
        '& > div':{
            marginRight:32
        }
    }
}));
// 2017-05-24
const num = n => n > 9 ? n : '0'+n;
function FormDialog(props) {
    const classes = useStyles();
    const now = new Date();
    const formatTime = date => `${num(date.getHours())}:${num(date.getMinutes())}`;
    const formatDate = date => `${date.getFullYear()}-${num(date.getMonth()+1)}-${num(date.getDate())}`;
    const [name,setName] = React.useState(props.name || '');
    const [date,setDate] = React.useState(props.start ? formatDate(new Date(props.start)) : formatDate(now));
    const [start,setStart] = React.useState(props.start ? formatTime(new Date(props.start)) : formatTime(now) );
    const [end,setEnd] = React.useState(props.end ? formatTime(new Date(props.end)) : formatTime(now));
    
    const editMode = !!props.name;

    function handleClose() {
        props.onClose();
    }

    const submit = e => {
        e.preventDefault();
        const d = new Date(date);
        const [sH,sM] = start.split(':');
        const [eH,eM] = end.split(':');
        let s_d = new Date(d.getFullYear(),d.getMonth(),d.getDate(),Number(sH),Number(sM));
        let e_d = new Date(d.getFullYear(),d.getMonth(),d.getDate(),Number(eH),Number(eM));
        if(s_d.getTime() > e_d.getTime()){
            e_d.setDate(d.getDate() + 1);
        }
        props.onSubmit(name,s_d,e_d);
        handleClose();
    }
  
    return (
    <Dialog fullWidth={true} maxWidth='sm' open={true} onClose={handleClose}>
        <form onSubmit={submit}>
            <DialogTitle>{editMode ? 'Edit timer' : "Add timer"}</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    {editMode ? 'Edit the timer name, start or/and end time.' : "Create a new timer with a name, date, start and end time"}
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    type="text"
                    value={name}
                    onChange={e=>setName(e.target.value)}
                    fullWidth
                />
                <div className={classes.textFields}>
                    <TextField
                        id="date"
                        label="Date"
                        type="date"
                        value={date}
                        onChange={e=>setDate(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                    />
                    <TextField
                        id="time"
                        label="Start time"
                        type="time"
                        value={start}
                        onChange={e=>setStart(e.target.value)}
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                        step: 300,
                        }}
                    />
                    <TextField
                        id="time"
                        label="End time"
                        type="time"
                        value={end}
                        onChange={e=>setEnd(e.target.value)}
                        InputLabelProps={{
                        shrink: true,
                        }}
                        inputProps={{
                            step: 300,
                        }}
                    />
                </div>

                
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">
                    Cancel
                </Button>
                <Button onClick={submit} variant="contained" color="primary">
                    {editMode ? 'Save' : "Create"}
                </Button>
            </DialogActions>
        </form>
    </Dialog>
    );
  }
  
  export default FormDialog;