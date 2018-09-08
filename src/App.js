// NODE MODULES
import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase';

// COMPONENTS
import Intro from './components/Intro';
import Form from './components/Form';
import Lyrics from './components/Lyrics';
import SetList from './components/Setlist';
import defaultImage from './assets/default-artwork.png'

const dbRef = firebase.database().ref();


class App extends Component {
	constructor() {
		super();
		//	set the initial state
		this.state = {
			accessToken: '',
			artists: [],
			tracks: [],
			albums: [],
			albumTracks: [],
			setList: [],
			type: '',
			playerURI: 'spotify:track:2GAIycsMaDVtMtdvxzR2xI',
			lyrics: '',
			imagesArray: [],
			artist:'',
			track:''
		};
	}

	sortTracks = (trackObject) => {
		const trackArray = Object.entries(trackObject)
		.map((item) => {
			return({
				key: item[0],
				artist: item[1].artist,
				track: item[1].track
			})
		})
		
		this.setState({
			setList: trackArray
		},()=>{
		},)
		
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

		dbRef.on('value', (snapshot) => {
			if(snapshot.val() !== undefined && snapshot.val() != null) {
				this.sortTracks(snapshot.val())
			}
		})//dbref.on	
	}

	getSearch = (type, query) => {
		this.setState({
			artists: [],
			tracks: [],
			lyrics: '',
			searchResults: ''
		})
		const AuthStr = 'Bearer '.concat(this.state.accessToken);
		axios({
			url: 'https://api.spotify.com/v1/search',
			dataResponse: 'json',
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
				if(res.data.artists.items.length === 0) {
					this.setState({
						searchResults: 'Your search returned no results. Please try again.'
					}, () => {
					})
				} else {
					this.setState({
						searchResults: `Results of your search for - ${query}`,
						artists: res.data.artists.items,
						type
					}, () => {
					})
				}
			} else if(type === 'track') {
				if(res.data.tracks.items.length === 0) {
					this.setState({
						searchResults: 'Your search returned no results. Please try again.'
					}, () => {
					})
				} else {
					this.setState({
						searchResults: `Results of your search for - ${query}`,
						tracks: res.data.tracks.items,
						type
					}, () => {
					})
				}
			} 
		}).catch((error) => {
			if(error) {
				this.setState({
					searchResults: 'Your search was unsuccessful. Please try again.'
				})
			}
		});
	}
	getSong = (songID) => {
		const AuthStr = 'Bearer '.concat(this.state.accessToken);
		axios({
			url: `https://api.spotify.com/v1/tracks/${songID}`,
			dataResponse: 'json',
			headers: {
				Authorization: AuthStr
			},
		}).then((res) => {
			this.getLyrics(res.data.artists[0].name, res.data.name)
		});
	}
	getLyrics = (artist, song) => {
		const tempSong = song.split('-');
		const songName = tempSong[0];
		axios({
			url: `http://lyric-api.herokuapp.com/api/find/${artist}/${songName}`,
			dataResponse: 'json',
		}).then((res) => {
			if (res.data.lyric) {
				this.setState({
					lyrics: res.data.lyric,
				}, () => {
				})
			} else {
				this.setState({
					lyrics: 'No lyrics present'
				}, () => {
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
		if (seconds < 10) {
			seconds = '0' + seconds;
		}
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
			if(res.data.items.length === 0) {
				this.setState({
					searchResults: 'There were no albums for the selected artist'
				})
			} else {
				this.setState({
					albums: res.data.items,
					type: 'albums',
					searchResults: `Album listing for - ${res.data.items[0].artists[0].name}`
				}, () => {
	
				})
			}
		}).catch((error) => {
			if(error) {
				this.setState({
					searchResults: 'Your search was unsuccessful. Please try again.'
				})
			}
		});
	}//getAlbums

	getAlbumTracks = (e) => {
		const albumId = e.target.className
		const AuthStr = 'Bearer '.concat(this.state.accessToken);
		axios({
			url: `https://api.spotify.com/v1/albums/${albumId}/`,
			dataResponse: 'json',
			headers: {
				Authorization: AuthStr
			},
		}).then((res) => {
			console.log(res);
			if(res.data.tracks.items.length === 0) {
				this.setState({
					searchResults: 'The selected album has no tracks listed'
				})
			} else {
				const albumName = res.data.name;
				const artistName = res.data.artists[0].name;
				this.setState({
					albumTracks: res.data.tracks.items,
					type: 'albumTracks',
					searchResults: `Track listing for ${artistName} - ${albumName}`
				})
			}
		}).catch((error) => {
			if(error) {
				this.setState({
					searchResults: 'Your search was unsuccessful. Please try again.'
				})
			}
		});

	}

	addToSetList = (e) => {
		dbRef.push({
			artist: e.target.className,
			track: e.target.id
		})
	}
	render() {
		return (
			<div className='App'>
				<Form getSearch={this.getSearch} />
				<iframe title='Spotify' className='SpotifyPlayer' src={`https://embed.spotify.com/?uri=${this.state.playerURI}&view=list&theme=black`} width='25%' height='80px' frameBorder='0' allowtransparency='true' allow='encrypted-media' />
				<Lyrics lyrics={this.state.lyrics}/>
				<h3>{this.state.searchResults}</h3>
				<section className='resultsPane'>
					{this.state.type === 'artist' ? this.state.artists.map((artist) => {
						return (
							<figure onClick={this.getAlbums} className={artist.id} key={artist.id} id={artist.uri} >
								<img src={artist.images[2] ? artist.images[2].url : defaultImage} alt='' onClick={this.getAlbums} className={artist.id} />
								<figcaption onClick={this.getAlbums} className={artist.id} >{artist.name}</figcaption>
							</figure>
						)
					}) : this.state.type === 'track' ? this.state.tracks.map((track) => {
						return (
							<figure className={track.id} key={track.uri} id={track.uri}>
								<img src={track.album.images[2] ? track.album.images[2].url : defaultImage} alt='' onClick={this.playLink} className={track.id} />
								<figcaption onClick={this.playLink} className={track.id}>{track.artists[0].name} - {track.name} - {this.convertDuration(track.duration_ms)}</figcaption>
								<button onClick={this.addToSetList} className={track.artists[0].name} id={track.name}>Add To List</button>
							</figure>
						)
					}) : this.state.type === 'albums' ? this.state.albums.map((album) => {
						return (
							<figure onClick={this.getAlbumTracks} className={album.id} key={album.uri} id={album.uri}>
								<img src={album.images[1].url} alt='' className={album.id} onClick={this.getAlbumTracks} />
								<figcaption onClick={this.getAlbumTracks} className={album.id}>{album.name}</figcaption>
							</figure>
						)
					})	: this.state.albumTracks.map((track) => {
							return(
								<div className={track.id} key={track.uri} id={track.uri}>
									<p onClick={this.playLink} className={track.id}>{track.artists[0].name} - {track.name} - {this.convertDuration(track.duration_ms)}</p>
									<button onClick={this.addToSetList} className={track.artists[0].name} id={track.name}>Add To List</button>
								</div>
							)
						})
					}
				</section>
				<SetList setList={this.state.setList} getLyrics={this.getLyrics} />
			</div>
		);
	}
}

export default App;