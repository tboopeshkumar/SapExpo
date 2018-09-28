import React, { Component } from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import * as _ from 'lodash';
import CoursesInTechnology from "./coursesInTechView";
import CoursesInSitesView from "./courcesInSitesView";
export default class LearningSiteDashboard extends Component {
    constructor(){
        super();
        this.state={};
    }

    render(){
        return(
            <div>
                <div>
                    <CoursesInTechnology />
                </div>
                <div>
                    <CoursesInSitesView selectedTech="ML" />
                </div>
                <div>
                </div>
            </div>
        )
    }
}