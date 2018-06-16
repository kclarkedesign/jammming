import React, { Component } from 'react';
import './SearchBar.css';

class SearchBar extends Component {

	constructor(props) {
		super(props);
		this.state = {
			term: ""
		};

		this.search = this.search.bind(this);
		this.handleTermChange = this.handleTermChange.bind(this);
	}

	search() {
		this.props.onSearch(this.state.term);
		console.log(this.props);
	}

	handleTermChange(event) {
		this.setState({
			term: event.target.value
		});
	}

	render() {
		if(this.props.onLogIn === "true") {
			return (
				<div className="SearchBar">
					<input placeholder="Enter A Song Title" onChange={this.handleTermChange} />
					<a onClick={this.search}>SEARCH </a>
				</div>
			);
		} else {
			return (
				<div className="SearchBar">
					<h2 className="SearchBar__intro">Create Spotify playlists at your leisure!</h2>
					<a onClick={this.search}>Sign into Spotify </a>
				</div>
			);
		}
		
	}
}

export default SearchBar;