import React, { Component } from 'react';

class Form extends Component {
    constructor(){
        super();
        this.state={
            artist:{},
            track:{},
            searchOption:'artist',
            searchQuery:''
        }
    }

    //user selects search artist or song title from radio buttons
    //grab the value of the selected option
    //user inputs search item
    //grab the value of the search item and set in state
    //on submit, pass states to parent

    handleChange = (e) => {
        e.target.type === 'radio' ? 
        this.setState({
            searchOption: e.target.value
        }) :
        this.setState({
            searchQuery: e.target.value
        })
        
    }

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
                <form className='searchForm' onSubmit={this.handleSubmit}>
                    <input tabindex='1' className='searchQueryContainer' required type='search'
                        id='searchQuery'
                        value={this.state.searchQuery}
                        placeholder='Enter an artist or song'
                        onChange={this.handleChange} />
<<<<<<< HEAD
=======

>>>>>>> 59f0315b1976f25daf325bf393a9ab398432d35d
                    <div className='searchRadioButtonsContainer'>
                        <input className='artistRadioButton' type='radio'
                            id='artistSearch'
                            value='artist'
                            checked={this.state.searchOption === 'artist'}
                            onChange={this.handleChange} />
<<<<<<< HEAD
                        <label htmlFor='artistSearch'>Artist</label>
=======
                        <label tabindex='2' htmlFor='artistSearch'>Artist</label>

>>>>>>> 59f0315b1976f25daf325bf393a9ab398432d35d
                        <input className='trackRadioButton' type='radio'
                            id='trackSearch'
                            value='track'
                            checked={this.state.searchOption === 'track'}
                            onChange={this.handleChange} />
                        <label tabindex='3' htmlFor='trackSearch'>Track</label>
                        <button tabindex='4' className='button'>Search</button>
                    </div>
                </form>
            </div>
        );
    }
}

export default Form;