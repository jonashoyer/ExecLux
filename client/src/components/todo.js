import React from 'react';
import { Paper, Typography, Checkbox, Button } from '@material-ui/core';
import { makeStyles, useTheme  } from '@material-ui/styles';
import EditIcon from '@material-ui/icons/Edit';
import AddIcon from '@material-ui/icons/Add';
import baseStyle from '../styles';
import TextField from '@material-ui/core/TextField';

import SaveIcon from '@material-ui/icons/Save';
import MoveIcon from '@material-ui/icons/OpenWith';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

import DisplayDialog from './dialogs/display';
import ConfirmDialog from './dialogs/confirmDialog';

import { Store } from '../components/context';

import api from '../api';
import { decrypt, encrypt } from './encryption';

const nav = window.navigator;
console.log(nav);

const useStyles = makeStyles(theme => ({
   ...baseStyle(theme),
   root: {
      width: '50%',
      margin: 8,
      marginBottom: 0,
      background: theme.palette.background.default,
      maxWidth: (theme.props.sizing * 2 + 17),
      flexFlow: 'column',
      display: 'flex',
      overflowY: 'auto',
      overflowX: 'hidden',
      [theme.breakpoints.down('md')]:{
         width: '66.66%',
      },
      [theme.breakpoints.down('sm')]:{
         width:'100%',
     },
     
   },
   fullscreenTracker:{
      position:'fixed',
      top:0,
      right:0,
      bottom:0,
      left:0,
      zIndex:500,
   },
   colums:{
      height: '100%',
      display:'flex',
   },
   content: {
      display: 'flex',
      alignContent: 'flex-start',
      flexFlow: 'column',
      width:'50%',
      height: '100%',
   },
   item: {
      maxWidth: theme.props.sizing,
      width: '100%',
      boxSizing: 'border-box',
   },
   itemPaper: {
      position: 'relative',
      margin: 8,
      minHeight: 34,
      padding: "8px 16px",
      '& .checkbox': {
         padding: 6,
         paddingLeft: 0
      },
      '&:hover .actionBtn': {
         display: 'block'
      },
      '& .actionBtn': {
         display: 'none',
         fontSize: 21,
         position: 'absolute',
         cursor: 'pointer',
         '&.br':{
            bottom: 4,
            right: 4,
         },
         '&.tr':{
            top: 4,
            right: 4,
         },
         '&.drag':{
            cursor:'move'
         },
         '& .mr':{
            marginRight:8
         }
      },
      '&.shadow':{
         background:'#ccc',
         '& *':{
            visibility: 'hidden'
         }
      },
      '& h6':{
         wordBreak: 'break-word'
      }
   },
   textarea:{  
      lineHeight: 1.5,
      width:'100%'
   }
}));

// todo:
// {text,checks:[true,false]}

const colCount = 2;


const ConvertData = (d,enc) => {
   let arr = [];

   let unsorted = d.map(e => {
      return{
         ...e,
         text: decrypt(e.data,enc) || '',
         checks:[],
         col: e.column || 0,
      }
   })

   unsorted.filter(e=>e.before == null).forEach(e => {

      let item = e;
      for (let i = 0; i < unsorted.length; i++) {
         arr.push(item);
         unsorted = unsorted.filter(x=>x !== item);

         const index = unsorted.findIndex(x => item._id === x.before);
         item = unsorted[index];
         if(item === undefined) break;
      }
   })

   return [...arr,...unsorted];  
} 

const swapItems = (arr,a, b) =>{
   arr[a] = arr.splice(b, 1, arr[a])[0];
   return arr;
}

let timeout, queue = [], orderTimeout, unload = [];
const App = props => {
   const classes = useStyles();
   const theme = useTheme();
   const store = React.useContext(Store);
   const {data,encryption} = props;

   const [todos, setTodos] = React.useState(()=>ConvertData(data, encryption));

   const [oldTodoOrder,setOldTodoOrder] = React.useState(()=>todos.map(e=>{
      return {
         id:e._id,
         column:e.column,
         before:e.before
      }
   }));

   const [edit, setEdit] = React.useState({});
   const [drag, setDrag] = React.useState({});

   const refs = [
                  Array.from(
                     { length: todos.filter(x => x.col === 0).length },
                     () => React.createRef()
                  ),
                  Array.from(
                     { length: todos.filter(x => x.col === 1).length },
                     () => React.createRef()
                  )
               ]

   // const refs = React.useMemo(() =>{

      
   //    return [
   //       Array.from(
   //          { length: todos.filter(x => x.col === 0).length },
   //          () => React.createRef()
   //       ),
   //       Array.from(
   //          { length: todos.filter(x => x.col === 1).length },
   //          () => React.createRef()
   //       )
   //    ]
   //    }
   // )

   // const h = refs.reduce((a,b) => {
   //    if(!b.current) return a;
   //    return b.current.getBoundingClientRect().height + a;
   // }, 0);
   // console.log('height: ' + h);   
   
   const closeDialog = e => {
      store.setDialog();
   }



   const SendTodoOrder = React.useCallback(_ => {

      let newTodoOrder = oldTodoOrder;
      let updatedTodoOrder = [];

      [todos.filter(e=>e.col === 0),todos.filter(e=>e.col === 1)].forEach(arr => {

         for (let i = 0; i < arr.length; i++) {
            const c = arr[i];
            const before = i > 0 ? arr[i - 1] : null;
            const oldOrder = oldTodoOrder.find(x=>x.id === c._id);

            if(oldOrder.before == (before && before._id) && oldOrder.column === c.col) continue;
            
            const obj = {
               id:c._id,
               column: c.col,
               before: before && before._id
            }
            
            updatedTodoOrder.push(obj);
            
            newTodoOrder = newTodoOrder.map(e => {
               if(e.id !== c._id) return e;
               return obj;
            })
         }
      })

      if(updatedTodoOrder.length === 0) return;

      console.log({updatedTodoOrder});

      //TODO submit updatedTodoOrder to server/db
      api.todo.updateOrder(store.projectId, updatedTodoOrder).then(res => {
         setOldTodoOrder(newTodoOrder);
      });
   },[oldTodoOrder,store.projectId,todos])

   const OrderChange = _ => {
      if(orderTimeout) clearTimeout(orderTimeout);
      orderTimeout = setTimeout(SendTodoOrder, 2000);
   }
   

   const SetTodoData = (id,data) => {
      setTodos(todos.map(e => {
         if(id !== e._id) return e;
         return {
            ...e,
            text: data
         }
      }));
   }

   const SaveExit = () => {
      if(!edit) return;
      
      const {index,text} = edit;
      let lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
         const l = lines[i];
         const preIndex = FindPrefix(l);
         if(preIndex === 0) continue;
         lines[i] = '\\u ' + l.slice(preIndex);
      }
      const newText = lines.join('\n');
      const {_id} = todos[index];
      SetTodoData(_id,newText);
      
      queueTodo(_id,newText);

      selectEditItem(-1);
   }

   const selectEditItem = i => {
      if(i === -1){
         return setEdit({});
      }

      const { text } = todos[i];
      let arr = [];

      const lines = text.split('\n');
      for (let i = 0; i < lines.length; i++) {
         const l = lines[i];

         const checkstate = FindPrefixCheckState(l);

         if(checkstate === null) {
            arr[i] = l;
            continue;
         }
         arr[i] = `\\${checkstate ? 'c' : 'u'} ${l.slice(3)}`;
      }

      setEdit({
         index: i,
         text: arr.join('\n')
      })
   }

   const AddTodo = () => {
      api.todo.create(store.projectId).then(({data}) => {
         
         setTodos([{
            ...data,
            col: 0,
            text:'',
            checks:[]
         },...todos]);
         
         OrderChange();
      })
   }

   const SendQueue = React.useCallback(() => {

      console.log('SendQueue');
      for (let i = 0; i < queue.length; i++) {
         const q = queue[i];
         api.todo.edit(q.id,encrypt(q.data, encryption), store.projectId).then(res => {
   
         });
      }
      queue = [];
   },[encryption,store.projectId])

   React.useEffect(() => {

      unload = [
         SendQueue,
         SendTodoOrder
      ];

   }, [SendQueue,SendTodoOrder]);

   React.useEffect(()=>{
      unload = [];
      return () => {
         console.log('unload call');
         unload.forEach(f => {
            if(f) f();
         })
      }
   },[])


   const queueTodo = (id,data,set = false) => {
      if(timeout) clearTimeout(timeout);
      if(!queue.some(e => e.id === id)) queue.push({id,data});
      timeout = setTimeout(SendQueue, 3000);
      if(set) SetTodoData(id,data);
   }

   const showTodo = item => e => {
      const DeleteTodo = () => {
         return api.todo.delete(item._id, store.projectId).then(res => {
            setTodos(todos.filter(e => e._id !== item._id));
            closeDialog();
            OrderChange();
         });
      }

      const onDelete = () => {
         store.setDialog(ConfirmDialog,{title:'Delete todo',text:'Are you sure you want to delete this todo?',onClose:closeDialog,submitText:"delete",onConfirm:DeleteTodo});
      }

      const onEdit = () => {
         selectEditItem(todos.findIndex(e => e === item));
         closeDialog();
      }

      const content = (
         <>
            <Typography variant="h5">Creater: null</Typography>
            <Typography variant="h5">Created: invalid date</Typography>
         </>
      )

      const firstLine = item.text.split('\n')[0];
      const preIndex = FindPrefixAll(firstLine);
      const title = firstLine.slice(preIndex);
      store.setDialog(DisplayDialog,{title,content,onClose: closeDialog,onDelete,onEdit})
   }

   // console.log(drag);

   const onMouseMove = e => {

      setDrag({
         ...drag, 
         x:e.clientX-377,
         y:e.clientY-22
      })

      const index = todos.findIndex(x => x._id === drag.id);
      const item = todos[index];
      const col = item.col;
      const colArr = todos.filter(e => e.col === col);
      const colIndex = colArr.findIndex(e => e._id === drag.id);


      if(colIndex > 0) {
         const {height, top} = refs[col][colIndex - 1].current.getBoundingClientRect();

         if((height / 2) + top > e.clientY){

            const targetIndex = todos.findIndex(e=>e._id === colArr[colIndex - 1]._id);
            setTodos(swapItems(todos,targetIndex,index));
            OrderChange();
         }
      }

      if(colIndex < colArr.length - 1){
         const {height, top} = refs[col][colIndex + 1].current.getBoundingClientRect();

         if((height / 2) + top < e.clientY){

            const targetIndex = todos.findIndex(e=>e._id === colArr[colIndex + 1]._id);
            setTodos(swapItems(todos,index,targetIndex));
            OrderChange();
         }
      }

      if(col > 0){
         const {left} = refs[col][colIndex].current.getBoundingClientRect();
         // console.log(left - (theme.props.sizing / 2), left, e.clientX);
         if(left > e.clientX){

            const newTodos = todos.map((e) => {
               if(e._id !== item._id) return e;
               return {
                  ...e,
                  col: col - 1
               }
            })

            setTodos(newTodos);
            OrderChange();
         }
      }

      if(col < colCount - 1){
         const {left} = refs[col][colIndex].current.getBoundingClientRect();
         if(left + theme.props.sizing < e.clientX){

            const newTodos = todos.map((e) => {
               if(e._id !== item._id) return e;
               return {
                  ...e,
                  col: col + 1
               }
            })

            setTodos(newTodos);
            OrderChange();
         }
      }

      // console.log({index,item,colArr,colIndex});
   }

   const onDragStart = props => e => {
      setDrag({
         ...drag,
         id:props.todo._id,
         props,
         x:e.clientX-377,
         y:e.clientY-22
      });
   }
   
   const onDragEnd = e => {
      setDrag({});
   }

   if(todos == null) return null;

   let todoCols = [[],[]];
   for (let i = 0; i < todos.length; i++) {
      const t = todos[i];
      todoCols[t.col].push(t);
   }

   return (
      <div className={classes.root}>
         {drag.props && <div className={classes.fullscreenTracker} onMouseUp={onDragEnd} onMouseMove={onMouseMove}  />}
         <div className={classes.topBtnContent}>
            <Button
               size="small"
               variant="contained"
               color="primary"
               onClick={AddTodo}
            ><AddIcon />Add note</Button>
         </div>
         <div className={classes.colums}>
            <div className={classes.content}>

               {todoCols[0].map((e,i)=>
                  <TodoItem
                     refs={refs}
                     saveExit={SaveExit}
                     index={todos.findIndex(x=>x._id===e._id)}
                     colIndex={i}
                     edit={{...edit, set: (str) => setEdit({...edit, text:str}) }}
                     showTodo={showTodo}
                     queueTodo={queueTodo}
                     selectEditItem={selectEditItem}
                     onDragStart={onDragStart}
                     key={e._id}
                     classes={classes}
                     state={drag.id === e._id && 'shadow'}
                     todo={e}
                     />)}

            </div>
            <div className={classes.content}>

               {todoCols[1].map((e,i)=>
                  <TodoItem
                     refs={refs}
                     saveExit={SaveExit}
                     index={todos.findIndex(x=>x._id===e._id)}
                     colIndex={i}
                     edit={{...edit, set: (str) => setEdit({...edit, text:str}) }}
                     showTodo={showTodo}
                     queueTodo={queueTodo}
                     selectEditItem={selectEditItem}
                     onDragStart={onDragStart}
                     key={e._id}
                     classes={classes}
                     state={drag.id === e._id && 'shadow'}
                     todo={e}
                     />)}

            </div>
         </div>

         {drag.props && <TodoItem state='ghost' style={{overflow:'hidden',position:'absolute',top:drag.y,left:drag.x}} {...drag.props} />}
      </div>
   )
}

const todoLine = (e, i, checked, classes, setCheck) => {

   const todoIndex = FindPrefixAll(e);
   
   return (
      <Typography key={i} style={i === 0 ? {fontSize: '1.15rem'} : {minHeight:21}} variant={i === 0 ? 'h6' : 'subtitle2'}>
         {todoIndex !== 0 && <Checkbox checked={checked} onChange={setCheck(i)} classes={{ root: 'checkbox' }} className={classes.checkbox} />}
         {e.slice(todoIndex)}
      </Typography>
   )
}

const TodoItem = props => {
   
   const { todo, classes } = props;
   const { _id, text } = todo;

   let lines = text.split('\n');

   let checkArray = [];
   for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      if(FindPrefix(l) === 0) {

         if(l.slice(0,2) === '\\u'){
            checkArray[i] = false;
         } else if (l.slice(0,2) === '\\c'){
            checkArray[i] = true;
         }

         checkArray.push(null);
         continue;
      }
      checkArray[i] = false;
   }

   const SetCheckbox = i => (e,check) => {
      lines[i] = (check ? '\\c ' : '\\u ') + lines[i].slice(3);
      const data = lines.join('\n'); 
      props.queueTodo(_id,data,true); 
   }


   const inEdit = props.edit.index === props.index;
   const btnProps = {fontSize:'inherit', onClick: e => inEdit ? props.saveExit() : props.selectEditItem(props.index)};

   return (
      <div className={classes.item} style={props.style} ref={props.refs[props.todo.col][props.colIndex]}>
         <Paper className={classes.itemPaper + ' ' + props.state}>
            {!inEdit && lines.length > 0 && lines.map((e, i) => todoLine(e, i, checkArray[i], classes,SetCheckbox))}
            {inEdit && <TextField multiline autoFocus className={classes.textarea} value={props.edit.text} onChange={e => props.edit.set(e.target.value) }/>}
            {!props.state && <div className='actionBtn br'>
               {!inEdit && <MoreHorizIcon className='mr' fontSize='inherit' onClick={props.showTodo(todo)}  />}
               {inEdit ? <SaveIcon {...btnProps} /> : <EditIcon {...btnProps} />}
            </div>}
            {!inEdit && <MoveIcon className='actionBtn tr drag' onMouseDown={props.onDragStart(props)} />}
         </Paper>
      </div>
   )
}

const FindPrefixAll = line => {
   let prefix = FindPrefix(line);
   if(prefix !== 0) return prefix;
   if(line.slice(0,3) === '\\u ') return 3;
   if(line.slice(0,3) === '\\c ') return 3;
   return 0;
}

const FindPrefixCheckState = line => {
   if(line.slice(0,3) === '\\u ') return false;
   if(line.slice(0,3) === '\\c ') return true;
   return null;
}

const FindPrefix = line => {
   const regex = /^(| )- ?/g.exec(line);
   return regex ? regex[0].length : 0;
}


export default App;

