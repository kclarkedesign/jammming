import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [],
      playlistName : "New Playlist",
      playlistTracks: []
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }


  addTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let tracks = this.state.playlistTracks;
      tracks.push(track);
      this.setState({playlistTracks: tracks});
    }
  }

  removeTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      let tracks = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
      this.setState({
        playlistTracks: tracks
      });
    } else {
      return;
    }
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  savePlaylist() {
  	const URIarray = this.state.playlistTracks.map(playlistTrack => playlistTrack.uri);
  	Spotify.savePlaylist(this.state.playlistName, URIarray);
  	this.setState({
  		playlistName : "New Playlist",
      	playlistTracks: []
  	})
  }

  search(searchTerm) {
  	Spotify.search(searchTerm).then(track => {
		this.setState({searchResults: track});
	});
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch={this.search} />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist 
            	playlistTracks={this.state.playlistTracks}
            	onRemove={this.removeTrack}
            	onNameChange={this.updatePlaylistName}
            	onSave={this.savePlaylist}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
