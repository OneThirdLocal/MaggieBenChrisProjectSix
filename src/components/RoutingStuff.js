import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import Intro from './Intro';
import App from '../App';

class RoutingStuff extends Component {
    render() {
        return (
            <Router>
                <div>
                    <Route exact path="/" component={Intro} />
                    <Route path="/main" component={App}/>
                </div>
            </Router>
        );
    }
}

export default RoutingStuff;