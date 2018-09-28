import React, { Component } from 'react';
import { render } from 'react-dom';
import Highcharts from 'highcharts';
import * as _ from 'lodash';
import HighchartsReact from 'highcharts-react-official';

import Button from '@material-ui/core/Button';
import getRandomColors from '../../utils/colorutils';

import VoxTeamHistoricalView from "./voxTeamHistoricalView";
import VoxBlogpostTeamView from "./voxBlogpostTeamView";

//require('highcharts-3d')(Highcharts);

const VoxDashboard = (props) => {
        return (
            <div>
               
                <div>
                    <VoxBlogpostTeamView />
                </div>
                <div>
                <VoxTeamHistoricalView />
                </div>
            </div>
        );
}

export default VoxDashboard;

