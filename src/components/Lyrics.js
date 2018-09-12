//  lyrics component where the lyrics for the selected song is shown. If there are no lyrics present for the selected song then an appropriate message will be shown in its place

//  NODE MODULES
import React, { Component } from 'react';

class Lyrics extends Component {
    //  hideLyrics toggles the class of the lyricsPane from the hide / show button to show or hide the element
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
        //  Render the lyrics container to the page, along with the hide / show button and lyrics for the selected song
        return (
            <section className="lyricsSection">
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