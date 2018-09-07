import React, { Component } from 'react';

class Lyrics extends Component {
    render() {
        return (
            <div>
                <p>{this.props.lyrics}</p>
            </div>
        );
    }
}

export default Lyrics;