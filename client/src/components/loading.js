import React from 'react';
import { makeStyles, useTheme  } from '@material-ui/styles';

const useStyles = makeStyles(theme => ({
  root:{
    minHeight:128,
    width:'100%',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  fill:{
    height:'100%',
    '& .lds-ellipsis':{
      marginBottom: '10%'
    }
  },
  short:{
    minHeight:32
  },
  ldsEllipsisColor:{
    '& div':{
      background: theme.palette.primary.main
    }
  }
}))

const Loading = props => {
  const classes = useStyles();

  return (
    <div className={`${classes.root} ${props.fill ? classes.fill : ''} ${props.short ? classes.short : ''}`}>
      <div className={`lds-ellipsis ${classes.ldsEllipsisColor}`}>
        <div />
        <div />
        <div />
        <div />
      </div>
    </div>
  )
}

export default Loading;