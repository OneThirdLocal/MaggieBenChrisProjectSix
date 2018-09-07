import React, { Component } from 'react';

class Setlist extends Component {
    render() {
        return (
            <section className='displayLyrics'>
                <div className='fullLyrics'>
                    <p>{this.props.lyrics}</p>
                </div>
            </section>
        );
    }
}

export default Setlist;