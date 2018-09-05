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
        // window.location.hash = '';
        
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
          console.log('There is no token');
          window.location = `${authEndpoint}?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scopes.join('%20')}&response_type=token`;
        } else {
          console.log('There is a token');
          this.setState({
            accessToken: _token
          }, () => {
            this.getArtist(_token);
          });
        }
      }
    render() {
        return (
            <div>
                <button onClick={this.spotifyLogin}>Log In Here</button>
            </div>
        );
    }
}

export default Intro;