import React, { Component } from 'react';
import { render } from 'react-dom';
import StackOverflow from './stackoverflow/stackoverflow';
import NaukriView from './naukri/naukri';

export default class IndustryTrendsDashBoard extends Component {

    constructor(){
        super();
        this.state={};
    }

    render(){
        return(
            <div className="RootContainer">
                <StackOverflow/>
                <NaukriView/>
            </div>
        )
    }
}