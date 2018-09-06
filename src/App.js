// NODE MODULES
import React, { Component } from 'react';
import axios from 'axios';

// COMPONENTS
import Intro from './components/Intro';
import Form from './components/Form';
import Lyrics from './components/Lyrics';
import Setlist from './components/Setlist';
import defaultImage from './assets/default-artwork.png'

class App extends Component {
	constructor() {
		super();
		this.state = {
			accessToken: '',
			artists: [],
			tracks: [],
			albums: [],
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
				window.location.hash = '';
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
				type,
				limit: 50
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
	getSong = (songID) => {
		const AuthStr = 'Bearer '.concat(this.state.accessToken);
			axios({
				url: `https://api.spotify.com/v1/tracks/${songID}`,
				dataResponse:'json',
				headers: { 
					Authorization: AuthStr 
				},
			}).then((res) => {
				const tempSong = res.data.name.split('-');
				const songName = tempSong[0];
				const songArtist = res.data.artists[0].name;
				this.getLyrics(songArtist, songName)
			});	
	}
	getLyrics = (artist, song) => {
		axios({
			url: `http://lyric-api.herokuapp.com/api/find/${artist}/${song}`,
			dataResponse: 'json',
		}).then((res) => {
			if(res.data.lyric) {
				this.setState({
					lyrics: res.data.lyric,
				})
			} else {
				this.setState({
					lyrics: 'No lyrics present'
				})
			}
		})
	}
	playLink = (e) => {
		const songID = e.target.className
		this.setState({
			playerURI: 'spotify:track:' + songID
		}, () => {
			this.getSong(songID);
		})
		
	}
	convertDuration = (timeInMs) => {
		const minutes = ((timeInMs / 1000) / 60).toFixed(0);
		let seconds = ((timeInMs / 1000) % 60).toFixed(0);
		seconds < 10 ? seconds = '0' + seconds : '';
		return `${minutes}:${seconds}`;
	}

	getAlbums = (e) => {
		const artistId = e.target.className
		const AuthStr = 'Bearer '.concat(this.state.accessToken);
		axios({
			url: `https://api.spotify.com/v1/artists/${artistId}/albums`,
			dataResponse: 'json',
			headers: {
				Authorization: AuthStr
			},
			params: {
				include_groups: 'album',
			},  
		}).then((res) => {
			this.setState({
				albums: res.data.items,
				type: 'album'
			})
			
		});	
		
	}
	render() {
		return (
			<div className='App'>
				<Form getSearch={this.getSearch}/>
				<iframe title='Spotify' className='SpotifyPlayer' src={`https://embed.spotify.com/?uri=${this.state.playerURI}&view=list&theme=black`} width='25%' height='80px' frameBorder='0' allowtransparency='true' allow='encrypted-media' />
				{this.state.type === 'artist' ? this.state.artists.map((artist) => {
					console.log(artist);
					return (
						<div onClick={this.playLink} className={artist.uri} key={artist.id} id={artist.uri} >
							<img src={artist.images[1] ? artist.images[1].url : defaultImage} alt='' onClick={this.playLink} className={artist.uri} />
							<p onClick={this.playLink} className={artist.uri} >{artist.name}</p>
						</div>
					)	
				}) : this.state.type === 'track' ? this.state.tracks.map((track) => {
					return (
							<div onClick={this.playLink} className={track.id} key={track.uri} id={track.uri}>
								<img src={track.album.images[2] ? track.album.images[2].url : defaultImage} alt='' onClick={this.playLink} className={track.id} />	
								<p onClick={this.playLink} className={track.id}>{track.artists[0].name} - {track.name} - {this.convertDuration(track.duration_ms)}</p>
							</div>
					)
				}): this.state.albums.map((album) => {
					return (
						<div className={album.id} key={album.uri} id={album.uri}>
							<img src={album.images[1].url} alt='' className={album.id}></img>
							<p>{album.name}</p>

						</div>
					)
				})}
				<p>{this.state.lyrics}</p>
			</div>
		);
	}
}

export default App;