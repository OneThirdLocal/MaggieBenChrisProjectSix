import React, { Component } from 'react';

class Lyrics extends Component {
    render() {
        return (
            <div className='lyricsContainer'>
                <h3>{this.props.currentSong}</h3>
                <p className='lyrics'>{this.props.lyrics}</p>
            </div>
        );
    }
}

export default Lyrics;