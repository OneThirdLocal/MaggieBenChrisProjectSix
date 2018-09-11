import React, { Component } from 'react';

class Lyrics extends Component {
    hideLyrics = () => {
        if (document.getElementById('lyricsPane').classList.contains('show')) {
            document.getElementById('lyricsPane').classList.remove('show');
            document.getElementById('lyricsPane').classList.add('hide');
        } else {
            document.getElementById('lyricsPane').classList.remove('hide');
            document.getElementById('lyricsPane').classList.add('show');
        }
    }
    render() {
        return (
            <section>
                <button className='lyricsButton button' onClick={this.hideLyrics}>Hide / Show Lyrics</button>
                    <div className='lyricsContainer show' id='lyricsPane'>
                        <h3>{this.props.currentSong}</h3>
                        <p className='lyrics'>{this.props.lyrics}</p>
                    </div>
            </section>
        );
    }
}

export default Lyrics;