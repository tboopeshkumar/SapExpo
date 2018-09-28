import React, { Component } from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import * as _ from 'lodash';
import HighchartsReact from 'highcharts-react-official';
import Button from '@material-ui/core/Button';
import {coursesInSites} from './mockData';
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

let colorIndex =0;
const getSeriesFor = (siteGroupedData, field, name) => {
    const series =  siteGroupedData.map((value, key, index)=>{
        // TODO: Add ranking cal here
        const valueOfName= value[field];
        if(!colorData[field])
        {
            colorData[field] = getRandomColors(colorIndex);
            colorIndex++;
        }
        const pointData =  {
                name,
                x: index,
                y: valueOfName
            };
        return pointData;
    });
    return series;
}

// const generateSeries = (data) => {
    
//     const grps = _(data).groupBy(x=>x.site);
//     const allSeries = [
//         { data: getSeriesFor(grps, "totalCourses") },
//         { data: getSeriesFor(grps, "avgReview") },
//         { data: getSeriesFor(grps, "users") }
//     ];
//     return allSeries;
// }

const generateSeries = (data) => {
    // const distinctDates = getDistinctCourses(data);
    const sortedData = data;
    let colorIndex =0;
    let prevDateValue;
    const series =  sortedData.map((value,index)=>{
                            const key  = value.site;
                            if(!colorData[key])
                            {
                                colorData[key] = getRandomColors(colorIndex);
                                colorIndex++;
                            }
                            const {avgReview, users, totalCourses} = value;
                            const pointdata =  Object.assign({
                                name: key,
                                x: index,
                                y: avgReview + users + totalCourses
                            },
                            {avgReview, users, totalCourses}
                            );
                            return pointdata;
                        })

    const allSeries = [{ data: series }];
    return allSeries;
}

// const generateSeries = (data) => {
//     const grps = _(data).groupBy(x=>x.site);
//     const allSeries = [
//         { data: getSeriesFor(grps, "totalCourses") },
//         { data: getSeriesFor(grps, "avgReview") },
//         { data: getSeriesFor(grps, "users") }
//     ];
//     return allSeries;
// }

const getDistinctSites = (data) => {
    return _.uniqBy(data, "site").map(x=> x.site);
}

const sortData = (data) => { 
    return data
        .sort((a,b)=>('' + a.site).localeCompare(b.site));
}

export default class CoursesInSitesView extends Component {
    constructor(props){
        super(props);
        this.state = {coursesInSites: []};
    }
    componentWillMount(){
        this.setState({coursesInSites: sortData(coursesInSites.filter(x => x.tech === this.props.selectedTech))});
    }

    getChartOptions(chartData, technology){
        return {
            chart: {
                type: 'column'
            },
            title: {
                text: `Site-Wise comparison of ${technology}`
            },
            xAxis: {
                categories: getDistinctSites(chartData),
              },
            yAxis: {
                min: 0,
                title: {
                    text: 'Rank'
                },
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },
                labels: {
                  formatter: function () {
                    return this.value > 1000 ? `${this.value / 1000}k` : this.value;
                  }
                }
              },
            legend: {
                enabled: false
            },
            tooltip: {
                pointFormat: 'Avg Review: <b>{point.avgReview}</b> Users: <b>{point.users}</b> Total Courses: <b>{point.totalCourses}</b>',
            },
            plotOptions: {
                column: {
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
                    stacking: "normal",
                    allowPointSelect: true,
                    animation: {
                        duration: 2000
                    },
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    },
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
                    options={this.getChartOptions(this.state.coursesInSites, this.props.selectedTech)}
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

