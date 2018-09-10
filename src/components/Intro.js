import React, { Component } from 'react';

class Intro extends Component {
	constructor() {
		super();
		this.state = {
			accessToken: ''
		}
	}
	spotifyLogin = () => {
		// Get the hash of the url
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

		// Set token
		let _token = hash.access_token;
		const authEndpoint = 'https://accounts.spotify.com/authorize';

		// Replace with your app's client ID, redirect URI and desired scopes
		const clientId = 'e8b4314cba2c4979b9a3813d7c2524a0';
		const redirectUri = 'http://localhost:3000/main';
		const scopes = [
			'user-read-birthdate',
			'user-read-email',
			'user-read-private'
		];

		// If there is no token, redirect to Spotify authorization
		if (!_token) {
			window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
		} else {
			this.setState({
				accessToken: _token
			}, () => {
				this.getArtist(_token);
			});
		}
	}
	render() {
		return (
			<header className='header'>
				<div className='wrapper'>
					<div className='headerText'>
						<h1>Nobody Leaves here without singin' the blues...</h1>
						<h3>Click the Log In button to start</h3>
						<button className='button' onClick={this.spotifyLogin}>Log In Here</button>
					</div>
				</div>
			</header>
		);
	}
}

export default Intro;