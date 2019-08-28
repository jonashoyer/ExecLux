import React from 'react';
import { makeStyles } from '@material-ui/styles';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import {Store} from '../context';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';
import Popper from '@material-ui/core/Popper';
import Slider from '@material-ui/lab/Slider';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';

const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const charsetPlus = "!@#$%^&*";
const charsetPlus2 = "()_+~`'|}{[]\\:;?><,./-=";

const GeneratePassword = (length,usePlus,usePlus2) => {
  const pool = charset + (usePlus ? charsetPlus : '') + (usePlus2 ? charsetPlus2 : '');
  const poolSize = pool.length;
  let str = '';
  for(let i = 0;i<length;i++){
    str += pool.charAt(Math.floor(Math.random() * poolSize));
  }
  return str;
}

const useStylesPopper = makeStyles(theme => ({
    root:{
        padding:"24px 48px",
        width:300
    },
    header:{
        'h6&':{   
            marginBottom:8,
            fontSize:"1.15rem"
        }
    },
    row:{
        display:'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding:'6px 0',
        borderBottom:"2px solid #ddd",
        '& b':{
            letterSpacing:2
        },
        '&.no-border':{
            border:'none',
            paddingBottom:0
        }
    },
    slider:{
        width:160,
        margin:'0 24px'
    }
}));

let SaveFunction = null;
const GenraterPopover = ({handleClose,anchorEl,generatePassword}) => {
    const classes = useStylesPopper();
    const [length,setLength] = React.useState(24);
    const [plus,setPlus] = React.useState(true);
    const [plus2,setPlus2] = React.useState(true);
        

    const onCreate = e => {
        generatePassword(length,plus,plus2);
    }

    React.useEffect(()=>{
        const str = localStorage.getItem('pg');

        if(str){
            const settings = JSON.parse(atob(str))
            setLength(settings.l);
            setPlus(settings.p);
            setPlus2(settings.pp);
        }

        return () => {
            if(SaveFunction) SaveFunction();
        }
    },[])

    React.useEffect(()=>{
        SaveFunction = () => {
            const data = btoa(JSON.stringify({l:length,p:plus,pp:plus}))
            localStorage.setItem('pg',data);
        }
    }, [length,plus,plus2])

    return(
        <Popper 
          id="generater-popper"
          open={!!anchorEl}
          anchorEl={anchorEl}
          onClose={handleClose}
          placement="top"
          style={{zIndex:1500}}
        >
            <Paper className={classes.root}>
                <Typography className={classes.header} variant="h6">Password Generater</Typography>
                <div className={classes.row}>
                    <Typography>Length</Typography>
                    <Slider
                        className={classes.slider}
                        value={length}
                        min={16}
                        max={64}
                        step={1}
                        onChange={(e,value)=>setLength(value)}
                        />
                    <Typography className={classes.sliderValue}>{length}</Typography>
                </div>
                <div className={classes.row}>
                    <Typography>Use <b>!@#$%^&*</b></Typography>
                    <Checkbox checked={plus} onChange={e=>setPlus(e.target.checked)} />
                </div>
                <div className={classes.row}>
                    <Typography>Use <b>{"()_+~`'|}{[]\\:;?><,./-="}</b></Typography>
                    <Checkbox checked={plus2} onChange={e=>setPlus2(e.target.checked)}/>
                </div>
                <div className={classes.row+" no-border"}>
                    <Button variant="contained" color="secondary" onClick={handleClose}>Close</Button>
                    <Button variant="contained" color="primary" onClick={onCreate}>Generate</Button>
                </div>

            </Paper>
        </Popper>
    )
}

function FormDialog(props) {
    const [name,setName] = React.useState(props.name || '');
    const [username,setUsername] = React.useState(props.username || '');
    const [password,setPassword] = React.useState(props.password || '');
    const [anchorEl, setAnchorEl] = React.useState();
    const editMode = !!props.name;

    const {CreateNewPassword} = props;

    function handleClose() {
        props.close();
    }

    const submit = e => {
        e.preventDefault();
        
        if(editMode){
            props.EditPassword(props.id,name,username,password).then(()=>{
            handleClose();

            }).catch(err => {
                console.log(err);
            })
            return;
        }

        CreateNewPassword(name,username,password).then(()=>{
            handleClose();
        }).catch(err => {
            console.log(err);
        })
    }

    const handlePopoverClose = () => {
        setAnchorEl(null);
    }

    const togglePopover = e => {
        setAnchorEl(anchorEl ? null : e.currentTarget);
    }

    const generatePassword = (length,usePlus,usePlus2) => {
        const pass = GeneratePassword(length,usePlus,usePlus2);
        setPassword(pass);
    }
  
    return (
    <Dialog fullWidth={true} maxWidth='sm' open={true} onClose={handleClose}>
        <DialogTitle>{editMode ? "Edit password" : "Create new password"}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {editMode ? "Edit the passwords name, username or/and password." : "Create a new password with a name, username and password."}
            </DialogContentText>
            <form onSubmit={submit}>
                <TextField
                    autoFocus
                    margin="dense"
                    label="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    type="text"
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    type="text"
                    fullWidth
                />
                <TextField
                    margin="dense"
                    label="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    type="text"
                    fullWidth
                    InputProps={{
                        endAdornment: (
                        <InputAdornment position="end">
                            <IconButton
                                aria-describedby={anchorEl ? 'generater-popper' : undefined}
                                aria-haspopup="true"
                                onClick={togglePopover}
                                >
                                <MoreHorizIcon color="primary" />
                            </IconButton>
                        </InputAdornment>
                        ),
                    }}
                />
            </form>
            <GenraterPopover handleClose={handlePopoverClose} anchorEl={anchorEl} generatePassword={generatePassword} />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={submit} variant="contained" color="primary">
                {editMode ? "Save" : "Create"}
            </Button>
        </DialogActions>
    </Dialog>
    );
  }
  
  export default FormDialog;