import React, { Component } from 'react';
import SpotifyPlayer from 'react-spotify-player';
 
// size may also be a plain string using the presets 'large' or 'compact'
const size = {
  width: '75%',
  height: 300,
};
const view = 'coverart'; // or 'coverart'
const theme = 'white'; // or 'white'

class Player extends Component {
    render() {
        return (
            <div>
                <h2>Spotify Player</h2>
                <SpotifyPlayer uri={this.props.playerURI} size={size} view={view} theme={theme} />
            </div>
        );
    }
}

export default Player;