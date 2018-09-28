import React, { Component } from 'react';
import Highcharts from 'highcharts';
import { render } from 'react-dom';
import * as _ from 'lodash';
import HighchartsReact from 'highcharts-react-official';
import * as Config from '../../../utils/config';

require('highcharts-3d')(Highcharts);


export default class StackOverflow extends Component {
    colorData ={};
    constructor(){
        super();
        this.state={};
    }
    componentDidMount(){
        if(Config.IsMockDataEnabled){
            const mockData = require('./mockdata.json');
            this.setState({options : this.getChartOptions(mockData.records)});     
        }
        else{
        fetch(Config.INDUSTRY_TREND_API + Config.STACK_OVERFLOW_QUERY)
            .then(response => response.json())
            .then(data => 
                 this.setState({options : this.getChartOptions(data.records)})
                 );
            }        
    }

    render() {
        if(!this.state.options)
            return (<span>Loading...</span>)
        return (
            <div className="RootContainer">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.state.options}
                />
            </div>
        );
    }

    getChartOptions(records){
        const options = {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie',
                options3d: {
                    enabled: false,
                    alpha: 45,
                    beta: 0
                }
            },
            title: {
                text: 'StackOverflow Technology Shares'
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    depth: 35,
                    dataLabels: {
                        enabled: true,
                        format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    }
                }
            },
            series: [{
                name: 'Technology',
                colorByPoint: true,
                data : records.map(record=>{
                    return{
                        name : record.keyword,
                        y : record.totalJobs + record.totalQues,
                        //sliced : true,
                        jobs: record.totalJobs,
                        questions : record.totalQues
                    }
                })
            }]
        }
        return options;
    }
}