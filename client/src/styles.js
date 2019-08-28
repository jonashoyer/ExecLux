export default theme => ({
    topBtnContent:{

        display: 'flex',
        justifyContent: 'space-evenly',
        margin: '8px 0',

        '& button':{
            paddingRight: theme.spacing.unit * 2
        }
    },
    infoHeader:{
        margin: '32px 0',
        textAlign:'center',
        lineHeight:4,
    
        '& button':{
            paddingRight: theme.spacing.unit * 2
        }
    }
})