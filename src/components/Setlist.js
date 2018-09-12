//  the setlist component displays songs that have been saved to the setlist (and accompanying firebase datase)

//  NODE MODULES
import React, { Component } from 'react'; 

class setList extends Component {
    constructor() {
        super();
        this.state = {
        }
    }
    //  handleClick listens for when the song title / artist have been clicked on in the setlist and then getLyrics is called in App.js to pull down the corresponding lyrics
    handleClick = (e) => {
        this.props.getLyrics(e.target.className, e.target.id)
    }
    render() {
        return (
            <div id='setList'>
                <h2 className='setListHeading'>Setlist</h2>
                <ul className='setList'>
                    {/* map through the passed in setList from firebase to render the songs that have been saved, also adding in a button to remove a song from the setlist, if there are no songs, then the appropriate message is displayed */}
                    {this.props.setList !== null ? Object.keys(this.props.setList).map((key) => {
                        return (
                            <div className='setListItem' key={key}>
                                <button tabindex='8' className='deleteFromListButton' onClick={() => this.props.deleteFromList(this.props.setList[key].key)}>x</button>
                                <li tabindex='9' onKeyPress={this.handleClick} key={key} className={this.props.setList[key].artist} id={this.props.setList[key].track} onClick={this.handleClick}>
                                    {this.props.setList[key].artist} - {this.props.setList[key].track}
                                </li>
                            </div>
                        )
                    })
                        : 'You have no saved songs.'
                    }
                </ul>
            </div>
        );
    }
};

export default setList;