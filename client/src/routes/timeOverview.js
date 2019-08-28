import React from 'react';
import { makeStyles } from '@material-ui/styles';
import {Store} from '../components/context';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import moment from 'moment';

import {Bar} from 'react-chartjs-2';

import api from '../api';
import { Typography, Button } from '@material-ui/core';
import Loading from '../components/loading';

const colors = ['4363d8','3cb44b','f58231','911eb4','ffe119','000075','008080','bcf60c'];

const useStyles = makeStyles(theme => ({
    root:{
        height: 'calc(100vh - '+theme.mixins.toolbar.minHeight+'px)',
        padding: '16px 0',
        boxSizing: 'border-box',
        maxWidth: (theme.props.sizing * 3),
        margin:'auto'
    },
    paper:{
        padding:32,
        marginBottom:16
    },
    row:{
        display:'flex',
        justifyContent:'space-between',
        alignItems:'baseline',
        padding:'16px 0'        
    },
    highlightContent:{
        display:"flex",
        justifyContent:'space-around',
        padding:16
    },
    highlight:{
        'div&':{
            background:theme.palette.primary.main,
            color:"#fff",
            padding:'12px 32px'
        },
        '& h3':{
            fontSize:'1.35em',
            margin:'.4em 0'
        },
        '& h4':{
            fontWeight:500,
            fontSize:'1em',
            margin:'.4em 0'
        }
    },
    chartPaper:{
        marginBottom:16,
        padding: '8px 16px',
        position:'relative'
    },
    chartSelect:{
        'div&':{
            position:'absolute',
            left:64,
            top:32
        }
    }
}));

const TotalChartStyles = {
    backgroundColor: `#00000000`,
    borderColor: `#4363d8bb`,
    hoverBackgroundColor: `#00000000`,
    hoverBorderColor: `#4363d888`,
    borderWidth: 2,
}

const CreateChartColors = color => {
    return{
        backgroundColor: `#${color}aa`,
        borderColor: `#${color}bb`,
        hoverBackgroundColor: `#${color}dd`,
        hoverBorderColor: `#${color}ff`,
    }
}
  
const options = labels => {return{
    responsive: true,
    tooltips: {
      mode: 'label'
    },
    elements: {
      line: {
        fill: false
      }
    },
    scales: {
      xAxes: [
        {
            labels,
            display: true,
            gridLines: {
                display: false
            },
        }
      ],
      yAxes: [
        {
          type: 'linear',
          display: true,
          position: 'left',
          id: 'y-axis-bar',
          gridLines: {
            display: false
          },
          labels: {
            show: true
          }
        },
        {
          type: 'linear',
          display: true,
          position: 'right',
          id: 'y-axis-line',
          gridLines: {
            display: false
          },
          labels: {
            show: true
          }
        }
      ]
    }
}};

const App = props => {
    const classes = useStyles();
    const store = React.useContext(Store);
    const [data,setData] = React.useState(null);
    const [timespan,setTimespan] = React.useState(30);
    const [chart,setChart] = React.useState(null);

    React.useEffect(() => {
        const end = new Date().getTime();
        const start =  end - 864e5 * timespan;
        api.user.performance(start,end).then(res => {

            let {projects,times} = res.data;
            let totalTime = 0;

            let charts = [{_id:"__TotalTime__",name:"Total"},...projects].reduce((obj,e,i)=> {
                obj[e._id]={
                    ...CreateChartColors(colors[(i - 1) % colors.length]),
                    label:e.name,
                    type: 'bar',
                    data: new Array(timespan).fill(0),
                    fill: false,

                    yAxisID: 'y-axis-bar'
                }
                return obj
            },{});

            charts['__TotalTime__'] = {
                ...charts['__TotalTime__'],
                ...TotalChartStyles
            }

            let chartLine = {
                label:'This period',
                type:'line',
                data: new Array(timespan).fill(0),
                fill: false,
                borderColor: '#3f51b5aa',
                pointBorderColor: '#3f51b588',
                pointBackgroundColor: '#3f51b588',
                pointHoverBackgroundColor: '#3f51b5cc',
                pointHoverBorderColor: '#3f51b5cc',
                yAxisID: 'y-axis-line'
            }

            const now = new Date();
            const date = new Date(now.getFullYear(),now.getMonth(),now.getDate()+1).getTime();
            const daysFromNow = d => Math.floor((date - d.getTime()) / 864e5);

            times = times.map(e => {
                const start = new Date(e.start);
                const end = e.end ? new Date(e.end) : now;
                const length = end.getTime() - start.getTime();
                totalTime += length;

                const index = (timespan - 1) - daysFromNow(start);
                charts[e.projectId].data[index] += length;
                chartLine.data[index] += length;
                
                return{
                    ...e,
                    start,
                    end,
                    length
                }
            });

            const maxDay = chartLine.data.reduce((a,b)=> Math.max(a,b));

            const msFormat = ms => {
                const h = Math.floor(ms / 36e5);
                const m = Math.round((ms % 36e5) / 6e4);
                return `${h}:${m < 10 ? '0'+m : m}`;
            };
            const avg = msFormat(totalTime / timespan);
            const timeUse = msFormat(totalTime);
            const mostTime = msFormat(maxDay);

            setData({timeUse,mostTime,count:times.length,avg});

            const labels = [];
            for(let i = timespan;i-->0;){
                const formatedDate = moment().subtract(i,'days').format('MM-DD');
                labels.push(formatedDate);
            }

            const msChartFormat = ms => ms ? Math.round(ms / 6e4) : 0;

            for (let i = 0; i < chartLine.data.length; i++) {
                const val = msChartFormat(chartLine.data[i]);
                charts["__TotalTime__"].data[i] = chartLine.data[i];
                chartLine.data[i] = i ? chartLine.data[i - 1] + val : val;
            }


            const datasets = {
                datasets: [
                    chartLine,
                    ...Object.values(charts).map(e => {
                        return{
                            ...e,
                            data: e.data.map(msChartFormat)
                        }
                    })
                ]
            }

            setChart({datasets,labels});
        })
    },[timespan]);


    // if(!data){
    //     return(
    //         <div>
    //             <h3>loading</h3>
    //         </div>
    //     )
    // }

    if(!data || !chart) return <Loading fill />;

    return(
        <div className={classes.root}>
            {/* <Paper className={classes.paper}>
                <Typography variant="h6">{data.name}</Typography>
                <Typography>Account created {new Date(data.created).toISOString().substring(0, 10)}</Typography>
            </Paper> */}
            <Paper className={classes.chartPaper}>
                <Select
                    className={classes.chartSelect}
                    value={timespan}
                    onChange={e=>setTimespan(e.target.value)}
                >
                    <MenuItem value={14}>14 Days</MenuItem>
                    <MenuItem value={30}>Month</MenuItem>
                    <MenuItem value={90}>3 Month</MenuItem>
                    <MenuItem value={180}>6 Month</MenuItem>
                    <MenuItem value={360}>Year</MenuItem>
                    {/* <MenuItem value={288e3}>Lifetime</MenuItem> */}
                </Select>
                <Bar
                    data={chart.datasets}
                    options={options(chart.labels)}
                    />
            </Paper>
            <Paper className={classes.highlightContent}>
                <Paper className={classes.highlight}>
                    <h4>Time used</h4>
                    <h3>{data.timeUse} hours</h3>
                </Paper>
                <Paper className={classes.highlight}>
                    <h4>Sessions</h4>
                    <h3>{data.count}</h3>
                </Paper>
                <Paper className={classes.highlight}>
                    <h4>Avg. time per day</h4>
                    <h3>{data.avg} hours</h3>
                </Paper>
                <Paper className={classes.highlight}>
                    <h4>Most time in a day</h4>
                    <h3>{data.mostTime} hours</h3>
                </Paper>
            </Paper>
        </div>
    )
}

export default App;
