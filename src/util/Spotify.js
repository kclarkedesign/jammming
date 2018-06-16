let accessToken;
let expiresIn;
let loggedIn;
//let keepSearchTerm;

const clientID = "6b086cffcede44c69f78fa6d63854a28";
const redirectURI = "http://localhost:3000/";;
const spotifyBaseURL = "https://api.spotify.com/v1";

const Spotify = {
	getAccessToken() {
		if(accessToken) {
			if(accessToken) {
				localStorage.setItem('isLoggedin', true);
			}
			return accessToken;
		} 
		const pageUrl = window.location.href;
		const accessTokenFromURL = pageUrl.match(/access_token=([^&]*)/);
		const expirationTimeFromURL = pageUrl.match(/expires_in=([^&]*)/);

		//If access token and expiration time exist in URL, if not refresh and load them in the address bar
		if(accessTokenFromURL && expirationTimeFromURL) {
			accessToken = accessTokenFromURL[1];
			expiresIn = Number(expirationTimeFromURL[1]);
			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			setTimeout(function () {
				if(accessToken) {
					localStorage.removeItem('isLoggedin');
				}
			}, expiresIn * 1000)
			window.history.pushState('Access Token', null, '/');
			if(accessToken) {
				localStorage.setItem('isLoggedin', true);
			}
			return accessToken;
		} else {
			if(!accessToken) {
				localStorage.setItem('isLoggedin', true);
			}
			window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
		}
	},

	search(searchTerm) {
		accessToken = Spotify.getAccessToken();
		return fetch(`${spotifyBaseURL}/search?q=${searchTerm}&type=track`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		}).then(response => {
			return response.json();
		}).then(jsonResponse => {
			//Check for tracks
			if(!jsonResponse.tracks) {
				return [];
			} else {
				return jsonResponse.tracks.items.map(track => ({
					id: track.id,
					name: track.name,
					artist: track.artists[0].name,
					album: track.album.name,
					uri: track.uri
				}));
			}
		});
	},

	savePlaylist(playlistName, trackURIs) {
		if(!playlistName || !trackURIs.length) {
			return;
		} else {
			let currentUserAccessToken = accessToken;
			const headers = { Authorization: `Bearer ${currentUserAccessToken}` };
			let userID = "";

			fetch(`${spotifyBaseURL}/me`, {
				headers: headers
			}).then(response => {
				return response.json();
			}).then(jsonResponse => {
				//If ok, post request to create new playlist, grab UserID
				if(jsonResponse) {
					userID = jsonResponse.id;
					fetch(`${spotifyBaseURL}/users/${userID}/playlists`, {
						headers: headers,
						method: 'POST',
						body: JSON.stringify({ name: playlistName })
					}).then(response => {
						return response.json();
					}).then(jsonResponse => {
						//if ok, post request to add tracks to playlist
						if(jsonResponse) {
							let playlistID = jsonResponse.id;
							fetch(`${spotifyBaseURL}/users/${userID}/playlists/${playlistID}/tracks`, {
								headers: headers,
								method: 'POST',
								body: JSON.stringify({ "uris": trackURIs})
							});
						}
					});
				} else {
					return [];
				}
			});
		}
	}
};

export default Spotify;