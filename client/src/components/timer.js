import React from 'react';
import { Paper, Typography, Button, Fab } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import TimerIcon from '@material-ui/icons/Timer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import IconButton from '@material-ui/core/IconButton';

import AddIcon from '@material-ui/icons/Add';
import PlayIcon from '@material-ui/icons/PlayArrow';
import StopIcon from '@material-ui/icons/Stop';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import baseStyle from '../styles';
import {encrypt,decrypt} from './encryption';
import moment, { min } from 'moment';
import {Store} from './context';
import api from '../api';

import {FormatTime, FormatTimeStacked} from './timerFormatting';

import SingleInput from './dialogs/singleInput';
import TimerDialog from './dialogs/timerDialog';
import TimerDisplay from './dialogs/display';
import ConfirmDialog from './dialogs/confirmDialog';

const useStyles = makeStyles(theme => ({
  ...baseStyle(theme),
  root:{
    width: '25%',
    margin:8,
    marginBottom:0,
    background:theme.palette.background.default,
    maxWidth: theme.props.sizing,
    position: 'relative',
    padding: '0 6px',
    overflowY:'auto',
    [theme.breakpoints.down('md')]:{
      width: '33.33%',
    },
    [theme.breakpoints.down('sm')]:{
        width:'100%',
    },
  },
  item:{
    display:'flex',
    padding:"4px 16px",
    width:'100%',
    boxSizing: 'border-box',
    background: theme.palette.background.paper
  },
  itemSecAction:{
    marginRight: theme.spacing.unit * 2,
    '&.disabled p':{
      color: 'rgba(0, 0, 0, 0.3)'
    }
  },
  addBtn:{
    'button&':{
      margin:'6px auto',
      display:'block'
    }
  },
  activeTimer:{
    'div&':{
      border:`2px solid ${theme.palette.primary.main}`,
      borderRadius:8
    }
  },
  displayBottomBorder:{
    borderBottom: '2px solid rgba(0, 0, 0, 0.3)',
    'h5&':{
      marginBottom:'0.5rem',
    }
  }
}));

const TimersInitData = (data,enc) => 
  data.map(e => {
      return {
        ...e,
        name: decrypt(e.name,enc)
      }
  });

const GetTotalTime = (s,e) => (e ? new Date(e) : new Date()).getTime() - new Date(s).getTime();



let interval;
const App = props => {
  const classes = useStyles();
  const store = React.useContext(Store);
  const {data,encryption} = props;
  const [timers,setTimers] = React.useState(TimersInitData(data,encryption));
  const [update,setUpdate] = React.useState();

  const onClose = e => {
    store.setDialog();
  }

  const StartTimer = name => {
    const now = new Date();
    const m_name = encrypt(name,encryption);
    api.timer.start(m_name,now,store.projectId).then(res => {
      const item = {
        ...res.data,
        name
      }
      setTimers([item,...timers]);
    })
  }

  const onStart = () => {
    store.setDialog(SingleInput,
      {
        title:'Start timer',
        text:'Start a timer with a name',
        label:'Name',
        submitText:'Start',
        onSubmit: StartTimer,
        onClose
      });
  }

  const onStop = () => {
    const item = timers.find(e => e.end === undefined);
    if(!item) return;
    const id = item._id;
    const now = new Date();
    api.timer.end(id,now,store.projectId).then(res => {

      setTimers(timers.map( e => {
        if(e._id !== id) return e;
        return{
          ...e,
          end: now.toISOString()
        }
      }));

    });
  }

  const onAdd = () => {
    const onSubmit = (name,start,end) => {
      return api.timer.create(encrypt(name,encryption),start,end,store.projectId).then(({data}) => {
        setTimers([{
          ...data,
          name
        },...timers])
      })
    }
    store.setDialog(TimerDialog,{onClose,onSubmit});
  }

  const DeleteTimer = id => {
    return api.timer.delete(id,store.projectId).then(res => {
      setTimers(timers.filter(e=>e._id !== id));
      onClose();
    })
  }

  const EditTimer = id => (name,start,end) => {
    return api.timer.edit(id,encrypt(name, encryption),start,end,store.projectId).then(res => {
      setTimers(timers.map(e =>{
        if(e._id !== id) return e;
        return {
          ...e,
          name,
          start,
          end
        }
      }))
    })
  }

  const hasActiveTimer = timers.some(x => !x.end);

  const onShow = obj => e => {

    const onEdit = item => () => {
      const {name,start,end,_id: id} = item;
      store.setDialog(TimerDialog,{name,start,end,id, onSubmit:EditTimer(id),onClose})
    }
    const onDelete = item => () => {
      const {_id: id} = item;
      store.setDialog(ConfirmDialog,{title:'Delete timer',text:'Are you sure you want to delete this timer?',onClose,submitText:"delete",onConfirm:()=>DeleteTimer(id)});
    }

    const onContinue = () => {
      StartTimer(obj.name)
    }

    if(obj.ids){

      const items = obj.ids.map(e =>
        timers.find(x => x._id === e))

      const content = (
        <List>
          {items.map(e => {
            const {text,time} = FormatTime(e.start,e.end);
            return (
              <ListItem>
                <ListItemText primary={'Timespan: '+text} secondary={'Total time: ' + time} />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Edit" onClick={onEdit(e)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="Delete" onClick={onDelete(e)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            )
          })}
        </List>
      )
      store.setDialog(TimerDisplay,{title:obj.name,content,onClose,onContinue,hideContinue:hasActiveTimer,hideMenu:true});

    }else{

      const {text,time} = FormatTime(obj.start,obj.end);
      const content = (
        <List>
          <ListItem>
            <ListItemText primary={'Timespan: '+text} secondary={'Total time: ' + time} />
          </ListItem>
        </List>
      )
  
      store.setDialog(TimerDisplay,{title:obj.name,content,onClose,onContinue,hideContinue:hasActiveTimer,onDelete:onDelete(obj),onEdit:onEdit(obj)});
    }
  }

  let totalTime = 0, totalItems = timers.length;
  const timersSort = timers.sort((a,b)=>a.start > b.start ? -1 : a.start < b.start ? 1 : 0);      
  const min_timer = [];
  for(let i = 0;i<timers.length;i++){
    let obj = {...timers[i]};
    obj.totalTime = GetTotalTime(obj.start,obj.end);
    while(i < timers.length - 1 && timersSort[i+1].name === timersSort[i].name){
      const item = timersSort[i + 1];
      if(!obj.ids) obj.ids = [obj._id];
      obj.ids.push(item._id);
      obj.start = item.start;
      obj.totalTime += GetTotalTime(item.start,item.end);
      i++;
    }
    min_timer.push(obj);
  }

  const jsx = min_timer.map(e => {
    const {text,time} = e.ids ? FormatTimeStacked(e.start,e.end,e.totalTime) : FormatTime(e.start,e.end,e.totalTime);

    totalTime += e.totalTime || 0;
    return (
      <ListItem key={e._id} button className={classes.item + (!e.end ? ` ${classes.activeTimer}` : '')} onClick={onShow(e)} >
        <ListItemIcon>
          <TimerIcon color={!e.end ? 'primary' : 'inherit'} />
        </ListItemIcon>

        <ListItemText inset primary={e.name+ (e.ids ? ` (${e.ids.length})` : '')} secondary={text} />
        <ListItemSecondaryAction className={classes.itemSecAction}>
          <Typography>{time}</Typography>
        </ListItemSecondaryAction>

      </ListItem>
    )
  });



  React.useEffect(() => () => {
      if(interval) clearInterval(interval);
  });
  
  if(hasActiveTimer){
    interval = setInterval(()=>{
      setUpdate(new Date().getTime());
    },30000);
  }

  return(
    <div className={classes.root}>
      <List component="nav">
        <div className={classes.topBtnContent}>
          {hasActiveTimer ?
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={onStop}
              ><StopIcon />Stop timer</Button>
            :
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={onStart}
              ><PlayIcon />Start timer</Button>
          }
          <Button
            size="small"
            variant="contained"
            color='secondary'
            onClick={onAdd}
            ><AddIcon />Add timer</Button>
        </div>

        {jsx}

        <ListItem button disabled className={classes.item}>
          <ListItemText inset primary={`Total time ${ totalTime ? moment.duration(totalTime,'ms').humanize() : '-'}`} secondary="Start date 03/01 - 2019" />
          <ListItemSecondaryAction className={classes.itemSecAction + ' disabled'}>
            <Typography>{totalItems} items</Typography>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    </div>
  )
}


export default App;
