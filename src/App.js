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
			artists: [],
			tracks: [],
			type: '',
			playerURI: 'spotify:track:7lEptt4wbM0yJTvSG5EBof'
		};
	}
	componentDidMount() {
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
			this.setState({
				accessToken: hash.access_token
			}, () => {
			});
		}
	}
	getSearch = (type, query) => {
		this.setState({
			artists: [],
			tracks: []
		})
		const AuthStr = 'Bearer '.concat(this.state.accessToken);
		axios({
			url: 'https://api.spotify.com/v1/search',
			dataResponse:'json',
			headers: { 
				Authorization: AuthStr 
			},
			params: {
				q: query,
				type
			},  
		}).then((res) => {
			if(type === 'artist') {
				this.setState({
					artists: res.data.artists.items,
					type
				}, () => {
				})
			} else if(type === 'track') {
				this.setState({
					tracks: res.data.tracks.items,
					type
				}, () => {
				})
			} 
		});
	}
	playLink = (e) => {
		this.setState({
			playerURI: e.target.id
		}, () => {

		});
	}
	render() {
		return (
			<div className="App">
				<h2>Main Page!!!</h2>
				<Form getSearch={this.getSearch}/>
				<Player accessToken={this.state.accessToken} playerURI={this.state.playerURI} />
				{this.state.type === 'artist' ? this.state.artists.map((artist) => {
					return (
						<p onClick={this.playLink} key={artist.uri} id={artist.uri}>{artist.name}</p>
					)
				}) : this.state.tracks.map((track) => {
					return (
						<p onClick={this.playLink} key={track.uri} id={track.uri}>{track.name}</p>
					)
				})}
			</div>
		);
	}
}

export default App;