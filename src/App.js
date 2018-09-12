//	NODE MODULES
import React, { Component } from 'react';
import axios from 'axios';
import firebase from './firebase';

//	COMPONENTS
import Form from './components/Form';
import Lyrics from './components/Lyrics';
import SetList from './components/Setlist';
import defaultImage from './assets/default-artwork.png'
import Footer from './components/Footer';

//	setup the reference to the firebase database
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
			track: '',
			currentSong: ''
		};
	}
	//	take the passed setlist from the firebase datase, parse it down into an array and set it to the state. If it is empty, then set the state to an empty string
	sortTracks = (trackObject) => {
		if (trackObject) {
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
			}),()=>{}
		} else {
			this.setState({
				setList:'',
			}), () => {}
		}
	}
	//	when the componentDidMount, take the hash from the address bar and parse it down to get the authorization token from it, then set it to the state. Next, listen for any changes to the firebase database and send the value of the database snapshot to the sortTracks method
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
			this.sortTracks(snapshot.val())
		})	
	}
	//	getSearch takes in the query string and the type of search from the Form component. It then makes a call to the Spotify API to gather the results from the specified type of search (either by artist or by song)
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
			//	if the search type was for an artist, parse the results and set the state. If the results are empty, display the appropriate message
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
			//	if the search type was for a song, parse the results and set the state. If the results are empty, display the appropriate message
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
			//	listens to see if there was an error passed back in the API call and then displays a message to try the search again
		}).catch((error) => {
			if(error) {
				this.setState({
					searchResults: 'Your search was unsuccessful. Please try again.'
				})
			}
		});
	}
	//	the playLink method listens for when a song is clicked on in the search results. It then takes the passed in songID to generate a SpotifyURI which is then set to the state so that it can be passed to the player to be played. 
	playLink = (e) => {
		const songID = e.target.className
		this.setState({
			playerURI: 'spotify:track:' + songID
		}, () => {
			this.getSong(songID);
		})
	}
	//	getSong take in an ID for a specific song and makes a call to the Spotify API to get the appropriate song name & artist and is then passed to getLyrics so the lyrics can be grabbed from the Lyric API
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
	//	getLyrics takes in an artst name and song title and makes a call to the Lyric API to gather the accompanying lyrics and sets the state so it is displayed in the Lyrics component. If no lyrics are present then an appropraite message is then displayed
	getLyrics = (artist, song) => {
		const tempSong = song.split('-');
		const songName = tempSong[0];
		axios({
			url: `https://lyric-api.herokuapp.com/api/find/${artist}/${songName}`,
			dataResponse: 'json',
		}).then((res) => {
			if (res.data.lyric) {
				this.setState({
					lyrics: res.data.lyric,
					currentSong: song
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
	//	convertDuration takes in the length of a song in ms and then converts it to minutes and seconds to be displayed in the search results
	convertDuration = (timeInMs) => {
		const minutes = ((timeInMs / 1000) / 60).toFixed(0);
		let seconds = ((timeInMs / 1000) % 60).toFixed(0);
		if (seconds < 10) {
			seconds = '0' + seconds;
		}
		return `${minutes}:${seconds}`;
	}
	//	getAlbums makes a call to the Spotify API to gather all the albums for a selected artist. The results are parsed and set to the state so they can be displayed in the updated search results. If there are no albums found, then the appropriate message is displayed
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
			//	listens to see if there was an error passed back in the API call and then displays a message to try the search again
		}).catch((error) => {
			if(error) {
				this.setState({
					searchResults: 'Your search was unsuccessful. Please try again.'
				})
			}
		});
	}
	//	getAlbumTracks makes a call to the Spotify API to gather all the tracks for a selected album. The results are parsed and set to the state so they can be displayed in the updated search results. If there are no albums found, then the appropriate message is displayed
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
					tracks : res.data.tracks.items,
					type: 'track',
					searchResults: `Track listing for ${artistName} - ${albumName}`
				})
			}
			//	listens to see if there was an error passed back in the API call and then displays a message to try the search again
		}).catch((error) => {
			if(error) {
				this.setState({
					searchResults: 'Your search was unsuccessful. Please try again.'
				})
			}
		});
	}
	//	addToSetList listens for when a button is clicked on the song / track search results to add a song to the setlist. The selected song is then pushed to the database
	addToSetList = (e) => {
		dbRef.push({
			artist: e.target.className,
			track: e.target.id
		})
	}
	//	deleteFromList listens for when a button is clicked on the setlist to remove a song from the setlist. The selected song is then removed from the database
	deleteFromList = (key) => {
		dbRef.child(key).remove();
	}
	//  hideResults toggles the class of the resultsPane from the hide / show button to show or hide the element
	hideResults = () => {
		if (document.getElementById('resultsPane').classList.contains('show')) {
			document.getElementById('resultsPane').classList.remove('show');
			document.getElementById('resultsPane').classList.add('hide');
		} else {
			document.getElementById('resultsPane').classList.remove('hide');
			document.getElementById('resultsPane').classList.add('show');
		}
	}
	render() {
		return (
			<div className='App'>
				<div className='mainHeader'>
					<div className='wrapper clearfix'>
						<div className='mainHeadingContainer'>
							<div className='mainHeading'>
								<h1>Karaoke!</h1>
								<h3>Search your favourite band or song below and start singing!</h3>
							</div>

							{/* Render the Form component */}
							<Form getSearch={this.getSearch} />

							{/* Embedded Spotify Player */}
							<iframe title='Spotify' className='SpotifyPlayer' src={`https://embed.spotify.com/?uri=${this.state.playerURI}&view=list&theme=black`} width='100%' height='80px' frameBorder='0' allowtransparency='true' allow='encrypted-media' />
							
							
							{/* Ternary statement to determine wheteher to display the Lyrics component or not, based on if there are any lyrics to display */}
							{this.state.lyrics ?
								<Lyrics lyrics={this.state.lyrics} currentSong={this.state.currentSong} />
								: ''}
						</div>
						<div className='content'>
							<div>
								<button tabindex='5' className='button' onClick={this.hideResults}>Hide / Show Results</button>
							</div>
							<section className='resultsPane show' id='resultsPane'>
								<div className='resultsContainer clearfix'>
									<h2 className='resultsHeading'>{this.state.searchResults}</h2>

									{/* Ternary statements to select what to display in the results area based on the state (either artist results, tranck / song results or albums results) */}
									{this.state.type === 'artist' ? this.state.artists.map((artist) => {
										return (
											<figure tabindex='6' onKeyPress={this.getAlbums} onClick={this.getAlbums} className={artist.id} key={artist.id} id={artist.uri} >
												<img src={artist.images[2] ? artist.images[2].url : defaultImage} alt='' onClick={this.getAlbums} className={artist.id} />
												<figcaption onClick={this.getAlbums} className={artist.id} >{artist.name}</figcaption>
											</figure>
										)
									}) : this.state.type === 'track' ? this.state.tracks.map((track) => {
										return (
											<div className={track.id} key={track.uri} id={track.uri}>
												<button tabindex='6' onClick={this.addToSetList} className={track.artists[0].name} id={track.name}><a href='#setList' className={track.artists[0].name} id={track.name}>+</a></button>
												<p tabindex='7' onKeyPress={this.playLink} onClick={this.playLink} className={track.id}>{track.artists[0].name} - {track.name} - {this.convertDuration(track.duration_ms)}</p>
											</div>
										)
									}) : this.state.type === 'albums' ? this.state.albums.map((album) => {
										return (
											<figure tabindex='6' onKeyPress={this.getAlbumTracks} onClick={this.getAlbumTracks} className={album.id} key={album.uri} id={album.uri}>
												<img src={album.images[1].url} alt='' className={album.id} onClick={this.getAlbumTracks} />
												<figcaption onClick={this.getAlbumTracks} className={album.id}>{album.name}</figcaption>
											</figure>
										)
									}) : ''
									}
								</div>
							</section>

							{/* Render the Setlist component */}
							<SetList setList={this.state.setList} getLyrics={this.getLyrics} deleteFromList={this.deleteFromList} />
						</div>
					</div>

					{/* Render the Footer component */}
					<Footer />
				</div>
			</div>
		);
	}
}

export default App;