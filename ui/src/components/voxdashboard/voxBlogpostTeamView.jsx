import React, { Component } from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import * as _ from 'lodash';
import HighchartsReact from 'highcharts-react-official';
import mockdata from '../mockdata';
import Button from '@material-ui/core/Button';
import getRandomColors from '../../utils/colorutils';
import './voxdashboard.css';
import * as Config from '../../utils/config'
//require('highcharts-3d')(Highcharts);

export default class VoxBlogpostTeamView extends Component {
    colorData = {};
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        if (Config.IsMockDataEnabled) {
            const sortedData = mockdata.sort((a, b) => {
                let b_likesCount = _.sumBy(b.wholiked, 'likes');
                b_likesCount = !b_likesCount ? 0 : b_likesCount;
                let b_commentsCount = _.sumBy(b.wholiked, 'comments');
                b_commentsCount = !b_commentsCount ? 0 : b_commentsCount;

                let a_likesCount = _.sumBy(a.wholiked, 'likes');
                a_likesCount = !a_likesCount ? 0 : a_likesCount;
                let a_commentsCount = _.sumBy(a.wholiked, 'comments');
                a_commentsCount = !a_commentsCount ? 0 : a_commentsCount;

                return (b_commentsCount + b_likesCount) - (a_commentsCount + a_likesCount);

            });
            this.setState({ options: this.getChartOptions(sortedData), data: mockdata });
        }
        else{
            fetch(Config.VOX_API + Config.VOX_BLOG_TEAM_QUERY)
            .then(response => response.json())
            .then(data => {
                //this.setState({ options: this.getChartOptions(data.records) })
                console.log(data);
                const sortedData = data.sort((a,b)=> {
                    const totalA = (a.likes ? a.likes : 0) + (a.comments ? a.comments : 0);
                    const totalB = (a.likes ? a.likes : 0) + (a.comments ? a.comments : 0);
                    return totalB - totalA;
                });
                const topBlogs = sortedData.slice(0,9);
                this.setState({ options: this.getChartOptions(topBlogs), data: topBlogs });
            }
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
                            style={{ background: value, margin: '3px', color: 'white', minHeight: '5px', height: '25px', padding: '4px', fontSize : '0.65rem', textTransform:'none' }} >{key}</Button>
                    })
                }
            </div>
        );
    }

    getChartOptions(sortedData) {
        const options = {
            chart: {
                type: 'bar'
            },
            title: {
                text: 'VOX Data'
            },
            xAxis: {
                categories: sortedData.map(data => data.BlogPost),
                labels: {
                    useHTML: true,//Set to true
                    style: {
                        width: '150px',
                        whiteSpace: 'no-wrap'//set to normal
                    },
                    step: 1,
                    formatter: function () {//use formatter to break word.
                        return `<div align="center" title="${this.value}" style="overflow:hidden;"> ${this.value} </div>`;
                    }
                },
            },
            yAxis: {
                min: 0,
                title: {
                    text: 'Likes & Comments'
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
                pointFormat: 'Likes: <b>{point.likesCount}</b> Comments: <b>{point.commentsCount}</b>',
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
                    events: {
                        click: (event) => {
                            const clickedPost = this.state.data.find(item => item.BlogPost == event.point.category);
                            window.open(clickedPost.BlogUrl, '_blank');
                        },
                        legendItemClick: function (event) {
                            console.log(event);
                        }
                    }
                }
            },

            series: Config.IsMockDataEnabled? this.generateMockSeries(mockdata) : this.generateSeries(sortedData)
        };
        return options;
    }

    generateMockSeries(data) {

        let colorIndex = 0;
        return data.map((data, index) => {
            const sortedWholiked = data.wholiked.sort((a, b) => b.likes - a.likes);
            return {
                data: sortedWholiked.map(likeData => {
                    if (!this.colorData[likeData.project]) {
                        this.colorData[likeData.project] = getRandomColors(colorIndex);
                        colorIndex++;
                    }
                    let countOfActivity = (likeData.likes ? likeData.likes : 0) + (likeData.comments ? likeData.comments : 0);
                    return {
                        x: index,
                        y: countOfActivity,
                        name: likeData.project,
                        color: this.colorData[likeData.project],
                        likesCount: likeData.likes ? likeData.likes : 0,
                        commentsCount: likeData.comments ? likeData.comments : 0
                    }
                },
                )
            }
        })

    }
    generateSeries(data){

        let colorIndex = 0;
        return data.map((data, index) => {
            const sortedProjectActivity = data.ProjectActivity.sort((a, b) => { 
                    const totalA = (a.likes ? a.likes : 0) + (a.comments ? a.comments : 0);
                    const totalB = (a.likes ? a.likes : 0) + (a.comments ? a.comments : 0);
                    return totalB - totalA;
            });
            return {
                data: sortedProjectActivity.map(projectData => {
                    if (!this.colorData[projectData.project]) {
                        this.colorData[projectData.project] = getRandomColors(colorIndex);
                        colorIndex++;
                    }
                    let countOfActivity = (projectData.likes ? projectData.likes : 0) + (projectData.comments ? projectData.comments : 0);
                    return {
                        x: index,
                        y: countOfActivity,
                        name: projectData.project,
                        color: this.colorData[projectData.project],
                        likesCount: projectData.likes ? projectData.likes : 0,
                        commentsCount: projectData.comments ? projectData.comments : 0
                    }
                })
            }
        })
    }

}

