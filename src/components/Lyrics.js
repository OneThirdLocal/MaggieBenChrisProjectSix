import React, { Component, Fragment } from 'react';

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
            <Fragment>
                <button className='lyricsButton' onClick={this.hideLyrics}>Hide / Show Lyrics</button>
                <section className='lyricsContainer show' id='lyricsPane'>
                        <h3>{this.props.currentSong}</h3>
                        <p className='lyrics'>{this.props.lyrics}</p>
                </section>
            </Fragment>
        );
    }
}

export default Lyrics;