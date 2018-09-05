// NODE MODULES
import React, { Component } from 'react';
import axios from 'axios';

// COMPONENTS
import Intro from './components/Intro';
import Form from './components/Form';
import Lyrics from './components/Lyrics';
import Player from './components/Player';
import Setlist from './components/Setlist';

class App extends Component {
	constructor() {
		super();
		this.state = {
			accessToken: '',
			artists: []
		};
	}
	componentDidMount() {
		console.log(window.location.hash);
		const hash = window.location.hash
		.substring(1)
		.split('&')
		.reduce(function (initial, item) {
			if (item) {
				var parts = item.split('=');
				initial[parts[0]] = decodeURIComponent(parts[1]);
			}
			return initial;
		}, {});

		if (hash.access_token != null) {
			console.log('There is a token');
			this.setState({
				accessToken: hash.access_token
			}, () => {
				this.getArtist(hash.access_token);
			});
		}
	}

	getArtist = (token) => {
		const AuthStr = 'Bearer '.concat(token);
		axios({
			url: 'https://api.spotify.com/v1/search',
			dataResponse:'json',
			headers: { 
				Authorization: AuthStr 
			},
			params: {
				q: 'elton john',
				type: 'artist'
			},  
		}).then((res) => {
			console.log(this.state.accessToken);
			console.log(res);
			this.setState({
				artists: res.data.artists.items
			}, () => {
				console.log(this.state.artists);
			})
		});
	}
	render() {
		return (
			<div className="App">
				<h2>Main Page!!!</h2>
				{this.state.artists.map((artist) => {
					return (
						<a href={artist.external_urls.spotify} key={artist.id} id={artist.id} target="top"><p>{artist.name}</p></a>
					)
				})}
			</div>
		);
	}
}

export default App;