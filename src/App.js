// NODE MODULES
import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import axios from 'axios';

// COMPONENTS
import Intro from './components/Intro';
import Form from './components/Form';
import Lyrics from './components/Lyrics';
import Player from './components/Player';
import Setlist from './components/Setlist';

class App extends Component {
	render() {
		return (
			<div>
				<h2>App</h2>
			</div>
		);
	}
}

export default App;