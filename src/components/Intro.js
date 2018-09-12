//	intro page for the site. The user is required to sign in to Spotify, as a Spotify app is required to be able to pull info from the API

// 	NODE MODULES
import React, { Component } from 'react';

class Intro extends Component {
	constructor() {
		super();
		//	set the initial state
		this.state = {
			accessToken: ''
		}
	}
	spotifyLogin = () => {
		//	get the hash from the address bar to parse out the authorization token
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

		// 	set the clientId for the app that was created in Spotify Developer Dashboard, set the address that is to be re-directed to after the user is authorized through Spotify, also select the scopes of the account that the app has access to
		const clientId = 'e8b4314cba2c4979b9a3813d7c2524a0';
		const redirectUri = 'http://localhost:3000/main';
		const scopes = [
			'user-read-birthdate',
			'user-read-email',
			'user-read-private'
		];

		// 	If there is no token / user is not logged in, redirect to Spotify authorization, otherwise set the state for the authrorization token
		if (!_token) {
			window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
		} else {
			this.setState({
				accessToken: _token
			}, () => {
			});
		}
	}
	render() {
		//	Render the header and log in button for the intro page
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