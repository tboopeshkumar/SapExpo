import React, { Component } from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import * as _ from 'lodash';
import HighchartsReact from 'highcharts-react-official';
import Button from '@material-ui/core/Button';
import coursesInTech from './mockData';
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
    // const distinctDates = getDistinctCourses(data);
    const sortedData = data;
    let colorIndex =0;
    let prevDateValue;
    const series =  sortedData.map((value,index)=>{
                            const key  = value.tech;
                            if(!colorData[key])
                            {
                                colorData[key] = getRandomColors(colorIndex);
                                colorIndex++;
                            }
                            const data =  {
                                name: key,
                                x: index,
                                y: value.totalCourse
                            };
                            return data;
                        })

    const allSeries = [{ name: "Courses", data: series }];
    return allSeries;
}

const getDistinctCourses = (data) => {
    return data.map(x=>x.tech);
    // return _.uniqBy(data, "tech").map(x=> x.tech);
}

export default class CoursesInTechnology extends Component {
    constructor(props){
        super(props);
        this.state = {courseData: []};
    }
    componentWillMount(){
        this.setState({courseData: coursesInTech});
    }

    getChartOptions(chartData){
        return {
            chart: {
                type: 'pie'
            },
            title: {
                text: `Courses in Different Technologies`
            },
            xAxis: {
                categories: getDistinctCourses(chartData),
                },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    animation: {
                        duration: 2000
                    },
                    events: {
                        click: function (event) {
                            console.log(event);
                        },
                        legendItemClick : function(event){
                            console.log(event);
                        }
                    },
                    showInLegend: true
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
                    options={this.getChartOptions(this.state.courseData)}
                />
            </div>
        );
    }
}
    
    