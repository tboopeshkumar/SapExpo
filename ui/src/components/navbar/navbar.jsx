import React, {Component} from "react";
import { withRouter } from "react-router-dom";
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import './navbar.css';

class NavTabs extends Component {

 handleCallToRouter = (event,value) => {
   this.props.history.push(value);
 }

  render () {
     return (
         <div>
             
            <Tabs className="TabsStyle"
                value={this.props.history.location.pathname}
                onChange={this.handleCallToRouter}
                >
                <Tab
                label="Home"
                value="/"
                >
                </Tab>
                <Tab label="VOX" value="/vox" >               
                </Tab>
                <Tab
                label="Learning Sites"
                value="/learningsites"
                    >               
                </Tab>
                <Tab
                label="Industry Trends"
                value="/industryTrends"
                    >               
                </Tab>
            </Tabs> 
      </div>          
    )
  }
}

export default withRouter(NavTabs);