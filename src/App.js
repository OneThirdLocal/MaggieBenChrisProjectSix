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
			playerURI: 'spotify:track:7lEptt4wbM0yJTvSG5EBof',
			lyrics: '',
			imagesArray:[]
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
					console.log(this.state.artists);
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
	getLyrics = () => {
		axios({
			url: 'http://lyric-api.herokuapp.com/api/find/Fleetwood%20Mac/The%20Chain',
			dataResponse: 'json',
		}).then((res) => {
			console.log(res.data);
			this.setState({
				lyrics: res.data.lyric,
			})
		})
	}
	playLink = (e) => {
		const songID = e.target.className
		console.log(songID)
		this.setState({
			playerURI: "spotify:track:" + songID
		}, () => {
			const AuthStr = 'Bearer '.concat(this.state.accessToken);
			axios({
				url: `https://api.spotify.com/v1/tracks/${songID}`,
				dataResponse:'json',
				headers: { 
					Authorization: AuthStr 
				},
			}).then((res) => {
				console.log(res)
			});	
		});
	}
	convertDuration = (timeInMs) => {
		const minutes = ((timeInMs / 1000) / 60).toFixed(0);
		let seconds = ((timeInMs / 1000) % 60).toFixed(0);
		seconds < 10 ? seconds = "0" + seconds : '';
		return `${minutes}:${seconds}`;
	}
	render() {
		return (
			<div className="App">
				<h2>Main Page!!!</h2>
				<Form getSearch={this.getSearch}/>
				<Player accessToken={this.state.accessToken} playerURI={this.state.playerURI} />
				{this.state.type === 'artist' ? this.state.artists.map((artist) => {
					console.log(artist);
					return (
						<div onClick={this.playLink} className={artist.uri} key={artist.id} id={artist.uri} >
							<img src={artist.images[1] ? artist.images[1].url : ""} alt="" onClick={this.playLink} className={artist.uri} />
							<p onClick={this.playLink} className={artist.uri} >{artist.name}</p>
						</div>
					)	
				}) : this.state.tracks.map((track) => {
					return (
							<div onClick={this.playLink} className={track.id} key={track.uri} id={track.uri}>
								<img src={track.album.images[2] ? track.album.images[2].url : ""} alt="" onClick={this.playLink} className={track.id} />	
								<p onClick={this.playLink} className={track.id}>{track.artists[0].name} - {track.name} - {this.convertDuration(track.duration_ms)}</p>
							</div>
					)
				})}
				<p>{this.state.lyrics}</p>
			</div>
		);
	}
}

export default App;