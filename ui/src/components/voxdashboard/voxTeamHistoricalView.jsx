import React, { Component } from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import * as _ from 'lodash';
import HighchartsReact from 'highcharts-react-official';
import Button from '@material-ui/core/Button';
import {historicalData} from '../mockdata';
import moment from "moment";
import getRandomColors from '../../utils/colorutils';

require('highcharts-3d')(Highcharts);

// const colorData ={
//     "Citadel" : "rgba(255,0,0,0.2)",
//     "HSBC" : "rgba(0,255,0,0.2)",
//     "Wells Fargo" : "rgba(0,0,255,0.2)",
// }
const colorData ={
}  

const generateSeries = (data) => {
    const distinctDates = getDistinctDates(data);
    const sortedData = data;
    const grps = _(sortedData).groupBy(x=>x.team);
    let colorIndex =0;
    let prevDateValue;
    const series =  grps.map((value,key)=>{
                            if(!colorData[key])
                            {
                                colorData[key] = getRandomColors(colorIndex);
                                colorIndex++;
                            }
                            const teamSeries = {
                                name: key,
                                data: distinctDates.map((x, index)=> {
                                    const valuesOnDate = value.find(y=>moment(y.date).valueOf() === x.valueOf());
                                    const data =  {
                                        name: key,
                                        x: index,
                                        y: valuesOnDate
                                            ? valuesOnDate.likes + valuesOnDate.comments : prevDateValue.likes + prevDateValue.comments,
                                        likes: valuesOnDate ? valuesOnDate.likes : prevDateValue.likes,
                                        comments: valuesOnDate ? valuesOnDate.comments : prevDateValue.comments
                                    };
                                    prevDateValue = valuesOnDate;
                                    return data;
                                }),
                                color : colorData[key]
                            };
                            return teamSeries;
                        }).value();
    return series;
}

const getMinDate = () => {
    const dates = historicalData.map(x=>moment(x.date).valueOf());
    const min = Math.min.apply(null, dates);
    // const prevdate = moment(min).add(-1,"d");
    const value = new Date(min);
    return value;
}

const getDistinctDates = (data) => {
    return _.uniqBy(data, "date").map(x=>{
        const newdate = new Date(moment(x.date).valueOf());
        return newdate;
    });
}

const sortData = (data) => { 
    return data
        .sort((a,b)=> moment(a.date).valueOf() - moment(b.date).valueOf());
}

export default class VoxTeamHistoricalView extends Component {
    constructor(props){
        super(props);
        this.state = {historicalData: []};
    }
    componentWillMount(){
        this.setState({historicalData: sortData(historicalData)});
    }

    getChartOptions(chartData){
        return {
            chart: {
                type: 'area'
            },
            title: {
                text: 'VOX Team Wise Historical Data'
            },
            xAxis: {
                type: 'datetime',
                categories: getDistinctDates(chartData),
                labels: {
                    formatter: function () {
                      return this.value ? moment(this.value).format("DD-MMM") : this.value;
                    }
                  }
              },
            yAxis: {
                title: {
                    text: 'Likes & Comments'
                },
                labels: {
                  formatter: function () {
                    return this.value > 1000 ? `${this.value / 1000}k` : this.value;
                  }
                }
              },
            legend: {
                enabled : true,
            },
            tooltip: {
                pointFormat: 'Likes: <b>{point.likes}</b> Comments: <b>{point.comments}</b>',
            },
            plotOptions: {
                area: {
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 4,
                        states: {
                        hover: { enabled: true }
                        }
                    }
                },
                series: {
                    allowPointSelect: true,
                    animation: {
                        duration: 2000
                    },
                    cursor: 'pointer',
                    events: {
                        click: function (event) {
                            console.log(event);
                        },
                        legendItemClick : function(event){
                            console.log(event);
                        }
                    }
                }
            },
            series: generateSeries(chartData)
        };
    }
    render() {
        return (
            <div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.getChartOptions(this.state.historicalData)}
                />
                {/*
                    _.map(colorData,(value,key)=>{
                        return <Button disabled={true} key={key}
                            style={{background:value, margin:'3px',color:'white', minHeight:'5px',height:'25px', padding:'4px'}}>{key}</Button>
                    })
                */}
            </div>
        );
    }
}

