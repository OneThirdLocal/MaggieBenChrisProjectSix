import React, { Component } from 'react';

class Form extends Component {
    constructor(){
        super();
        this.state={
            artist:{},
            track:{},
            searchOption:"artist",
            searchQuery:""
        }
    }

    //user selects search artist or song title from radio buttons
    //grab the value of the selected option
    //user inputs search item
    //grab the value of the search item and set in state
    //on submit, pass states to parent

    handleChange = (e) => {
        e.target.type === "radio" ? 
        this.setState({
            searchOption: e.target.value
        }) :
        this.setState({
            searchQuery: e.target.value
        })
        
    }

    handleSubmit = (e) => {
        console.log(this.state.searchOption, this.state.searchQuery);
        e.preventDefault();
        this.props.getSearch(this.state.searchOption, this.state.searchQuery);
        this.setState({
            searchOption: "",
            searchQuery: ""
        });

    }

    render() {
        return (
            <div>
                <form className="searchForm"onSubmit={this.handleSubmit}>
                    <div className="searchRadioButtonsContainer">
                        <input className="artistRadioButton"type="radio"
                            id="artistSearch"
                            value="artist"
                            checked={this.state.searchOption === "artist"}
                            onChange={this.handleChange} />
                        <label htmlFor="artist">Artist</label>

                        <input className="trackRadioButton" type="radio"
                            id="trackSearch"
                            value="track"
                            checked={this.state.searchOption === "track"}
                            onChange={this.handleChange} />
                        <label htmlFor="track">Song Title</label>
                    </div>
                    <input className="searchQueryContainer" required type="search"
                        id="searchQuery"
                        value={this.state.searchQuery}
                        placeholder="Enter an artist or song"
                        onChange={this.handleChange} />
                    <input className="searchSubmitButton" type="submit" value="Search"/>
                </form>

            </div>
        );
    }
}

export default Form;