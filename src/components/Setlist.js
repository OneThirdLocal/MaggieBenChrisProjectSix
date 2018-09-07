import React, { Component } from 'react';

//show the artist and track from app.js state 


const SetList = (props) => {
        return (
            <div>
                <h2>Setlist</h2>
                <ul className="setList">
                    {props.setList !== null ? Object.keys(props.setList).map((key) => {
                        return <div className="setListItem" key={key}>
                            <li key={key} onClick={()=> this.props.getLyrics(props.setList[key].artist, props.setList[key].track)}>
                                {props.setList[key].artist} {props.setList[key].track}
                            </li>
                            {/* <button className="deleteGameButton" onClick={() => this.props.removeFromList(key)}>Delete</button> */}
                        </div>
                    }//return 
                    )//map
                        : "You have no saved songs."}
                </ul>
            </div>
        );
    }


export default SetList;