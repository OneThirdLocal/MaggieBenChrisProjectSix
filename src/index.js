import React from 'react';
import ReactDOM from 'react-dom';
import './styles/index.css';
import RoutingStuff from './components/RoutingStuff';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<RoutingStuff />, document.getElementById('root'));
registerServiceWorker();