import React, { Component } from 'react';
import Highcharts from 'highcharts';
import { render } from 'react-dom';
import * as _ from 'lodash';
import HighchartsReact from 'highcharts-react-official';
import Button from '@material-ui/core/Button';
import getRandomColors from '../../../utils/colorutils';
import './naukri.css';
import * as Config from '../../../utils/config';

//require('highcharts-3d')(Highcharts);

export default class NaukriView extends Component {
    colorData = {};
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        const date = new Date(2018,8,27);
        if (Config.IsMockDataEnabled) {
            const mockData = require('./mockdata.json');
            this.setState({ options: this.getChartOptions(mockData.records) });
        }
        else {
            const dateNumber = ("0" + date.getDate()).slice(-2);
            const monthNumber = ("0" + (date.getMonth() + 1)).slice(-2);
            const dateQuery  = `&insert_date=${monthNumber}/${dateNumber}/${date.getFullYear()}`;
            fetch(Config.INDUSTRY_TREND_API + Config.NAUKRI_QUERY+ dateQuery)
                .then(response => response.json())
                .then(data =>
                    this.setState({ options: this.getChartOptions(data.records) })
                );
        }

    }

    render() {
        if (!this.state.options)
            return (<span>Loading...</span>)
        return (
            <div className="RootContainer">
                <HighchartsReact
                    highcharts={Highcharts}
                    options={this.state.options}
                />
                {
                    _.map(this.colorData, (value, key) => {
                        return <Button disabled={true} key={key}
                        style={{ background: value, margin: '3px', color: 'white', minHeight: '5px', height: '25px', padding: '4px', fontSize : '0.75rem', textTransform:'none' }} >{key}</Button>
                    })
                }
            </div>
        );
    }

    getChartOptions(records) {
        const options = {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Naukri Trend'
            },
            xAxis: {
                categories: records.sort((a, b) => b.total_jobs - a.total_jobs).map(data => data.keyword),
                labels: {
                    useHTML: true,//Set to true
                    style: {
                        width: '150px',
                        whiteSpace: 'no-wrap'//set to normal
                    },
                    step: 1,
                    // formatter: function () {//use formatter to break word.
                    //     return `<div align="center" title="${this.value}" style="overflow:hidden;"> ${this.value} </div>`;
                    // }
                },
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Technology'
                },
                labels: {
                    formatter: function () {
                      return this.value > 1000 ? `${this.value / 1000}k` : this.value;
                    }
                  },
                gridLineWidth: 0,
                minorGridLineWidth: 0,
                stackLabels: {
                    enabled: true,
                    style: {
                        fontWeight: 'bold',
                        color: (Highcharts.theme && Highcharts.theme.textColor) || 'gray'
                    }
                },

            },

            legend: {
                enabled: false,
            },
            tooltip: {
                pointFormat: 'Count: <b>{point.y}</b>',
            },
            plotOptions: {
                series: {
                    stacking: 'normal',
                    cursor: 'pointer',
                    pointWidth: 20,
                    dataLabels: {
                        enabled: true,
                        color: (Highcharts.theme && Highcharts.theme.dataLabelsColor) || 'white',
                    },
                }
            },

            series: this.generateSeries(records)
        };
        return options;
    }

    generateSeries(records) {

        let colorIndex = 0;
        const sortedRecords = records.sort((a, b) => b.total_jobs - a.total_jobs);
        return sortedRecords.map((record, index) => {
            return {
                data: Object.keys(record).filter(item => item.startsWith("jobs_in_") && record[item]).map(key => {
                    const modifiedKey = key.substr(8);
                    if (record[key]) {
                        if (!this.colorData[modifiedKey]) {
                            this.colorData[modifiedKey] = getRandomColors(colorIndex);
                            colorIndex++;
                        }
                        return {
                            x: index,
                            y: record[key],
                            name: modifiedKey,
                            color: this.colorData[modifiedKey],
                        }
                    }

                })
            }
        })

    }

}

