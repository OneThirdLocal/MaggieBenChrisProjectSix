//  NODE MODULES
import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

//  COMPONENTS
import Intro from './Intro';
import App from '../App';

class RoutingStuff extends Component {
    render() {
        //  Routing path for the site
        return (
            <Router>
                <div>
                    <Route exact path='/' component={Intro} />
                    <Route path='/main' component={App}/>
                </div>
            </Router>
        );
    }
}

export default RoutingStuff;