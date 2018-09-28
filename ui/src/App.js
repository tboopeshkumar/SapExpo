import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import VoxDashboard from './components/voxdashboard/voxdashboard';
import VoxBlogpostTeamView from "./components/voxdashboard/voxBlogpostTeamView";
import VoxTeamHistoricalView from "./components/voxdashboard/voxTeamHistoricalView";
import LearningSiteDashboard from './components/learningsites/learningSiteDashboard';
import CoursesInTechnology from './components/learningsites/coursesInTechView';

import IndustryTrendsDashBoard from "./components/industryTrends/industryTrendsDashBoard";

import { BrowserRouter as Router, Route, Switch, Link, withRouter } from 'react-router-dom';
// import { Navbar,NavItem,Nav } from 'react-bootstrap';
import AppBar from '@material-ui/core/AppBar';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import NavTabs from './components/navbar/navbar';

const styles = {
  root: {
    flexGrow: 1,
  },
  grow: {
    flexGrow: 1,
  },
  appBar:{
    flexDirection : 'row'
  },
  appTitle:{
    marginTop: '12px',
    marginLeft: '15px',
    marginRight: '20px'
  }

};

class App extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
    
        <Router>
          <div className={classes.root}>
            <AppBar className={classes.appBar}>
              <Typography variant="title" className={classes.appTitle} color="inherit">
                  Expo 2018
              </Typography>
               <NavTabs/>
          </AppBar>
          <Switch>
                <Route path="/learningsites" component={LearningSiteDashboard} />
                <Route path="/vox" component={VoxDashboard} />
                <Route path="/learningsites" component={CoursesInTechnology} />
                <Route path="/industrytrends" component={IndustryTrendsDashBoard} />
                <Route path="/" />
          </Switch>
          </div>
        </Router>
      </div>
    );
  }
}

export default withStyles(styles)(App);
