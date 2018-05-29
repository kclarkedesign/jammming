import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      searchResults: [
        {
          name: "name",
          artist: "artist",
          album: "album",
          id: 1 
        },
        {
          name: "name",
          artist: "artist",
          album: "album",
          id: 2 
        },
        {
          name: "name",
          artist: "artist",
          album: "album",
          id: 3 
        }
      ],
      playlistTracks: [],
      playlistName : ""
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
  }


  addTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      let newTrack = track.id;
      this.state.playlistTracks.push(newTrack);
      // console.log(this.state.playlistTracks);
    }
  }

  removeTrack(track) {
    if(this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      const updatedPlaylist = this.state.playlistTracks.filter(savedTrack => savedTrack.id !== track.id);
      this.setState({
        playlistTracks: updatedPlaylist
      });
      // console.log(this.state.playlistTracks);
    } else {
      return;
    }
  }

  updatePlaylistName(name) {
    this.setState({
      playlistName: name
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar />
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack} />
            <Playlist playlistTracks={this.state.playlistTracks} onRemove={this.removeTrack} onNameChange={this.updatePlaylistName}/>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
