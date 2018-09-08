import React, { Component } from 'react';
//show the artist and track from app.js state 

class setList extends Component {
    constructor() {
        super();
        this.state = {
        }
    }
    handleClick = (e) => {
        this.props.getLyrics(e.target.className, e.target.id)
    }
    render() {
        return (
            <div>
                <h2>Setlist</h2>
                <ul className='setList'>
                    {this.props.setList !== null ? Object.keys(this.props.setList).map((key) => {                        
                        return (
                            <div className='setListItem' key={key}>
                                <li key={key} className={this.props.setList[key].artist} id={this.props.setList[key].track} onClick={this.handleClick}>
                                    {this.props.setList[key].artist} - {this.props.setList[key].track}
                                </li>
                            <button className='deleteFromListButton' onClick={() => this.props.deleteFromList(this.props.setList[key].key)}>Delete</button>
                            </div>
                        )
                    })//map
                        : 'You have no saved songs.'
                    }
                </ul>
            </div>
        );
    }
};

export default setList;