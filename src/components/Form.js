//  user selects search artist or song title from radio buttons
//  grab the value of the selected option
//  user inputs search item
//  grab the value of the search item and set in state
//  on submit, pass states to parent

//  NODE MODULES
import React, { Component } from 'react';

class Form extends Component {
    constructor(){
        super();
        //  set the initial state
        this.state={
            artist:{},
            track:{},
            searchOption:'artist',
            searchQuery:''
        }
    }
    //  handleChange listens for changes in the radio buttons and text input and updates the state accordingly
    handleChange = (e) => {
        e.target.type === 'radio' ? 
        this.setState({
            searchOption: e.target.value
        }) :
        this.setState({
            searchQuery: e.target.value
        })
        
    }
    //  handleSubmit handles the form submission, sending the selected radio option and search string up to the getSearch method in the App component
    //  the state for searchQuery is then emptied, resetting the search input
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.getSearch(this.state.searchOption, this.state.searchQuery);
        this.setState({
            searchQuery: ''
        });

    }
    render() {
        return (
            <div>
                {/* Rendering the search form onto the page */}
                <form className='searchForm' onSubmit={this.handleSubmit}>
                    <input tabIndex='1' className='searchQueryContainer' required type='search'
                        id='searchQuery'
                        value={this.state.searchQuery}
                        placeholder='Enter an artist or song'
                        onChange={this.handleChange} />
                    <div className='searchRadioButtonsContainer'>
                        <input className='artistRadioButton' type='radio'
                            id='artistSearch'
                            value='artist'
                            checked={this.state.searchOption === 'artist'}
                            onChange={this.handleChange} />
                        <label tabIndex='2' htmlFor='artistSearch'>Artist</label>
                        <input className='trackRadioButton' type='radio'
                            id='trackSearch'
                            value='track'
                            checked={this.state.searchOption === 'track'}
                            onChange={this.handleChange} />
                        <label tabIndex='3' htmlFor='trackSearch'>Track</label>
                        <button tabIndex='4' className='button'>Search</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Form;