import React, { Component } from 'react';

class Lyrics extends Component {
    render() {
        return (
            <div className='lyricsPane'>
                <p className='lyrics'>{this.props.lyrics}</p>
            </div>
        );
    }
}

export default Lyrics;