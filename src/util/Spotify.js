let accessToken;
let expiresIn;
const clientID = "6b086cffcede44c69f78fa6d63854a28";
const redirectURI = "http://localhost:3000/"

const Spotify = {
	getAccessToken() {
		if(accessToken) {
			return accessToken;
		} 
		const pageUrl = window.location.href;
		const accessTokenFromURL = pageUrl.match(/access_token=([^&]*)/);
		const expirationTimeFromURL = pageUrl.match(/expires_in=([^&]*)/);

		if(accessTokenFromURL && expirationTimeFromURL) {
			accessToken = accessTokenFromURL[1];
			expiresIn = Number(expirationTimeFromURL[1]);

			window.setTimeout(() => accessToken = '', expiresIn * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
		}
	},

	search(searchTerm) {
		accessToken = Spotify.getAccessToken();
		return fetch(`https://api.spotify.com/v1/search?q=${searchTerm}&type=track`, {
			headers: { Authorization: `Bearer ${accessToken}` }
		}).then(response => {
			return response.json();
		}).then(jsonResponse => {
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
		if(!playlistName || !trackURIs) {
			return;
		} else {
			let currentUserAccessToken = accessToken;
			const headers = { Authorization: `Bearer ${currentUserAccessToken}` };
			let userID = "";

			fetch(`https://api.spotify.com/v1/me`, {
				headers: headers
			}).then(response => {
				console.log(response);
				return response.json();
			}).then(jsonResponse => {
				if(jsonResponse.id) {
					//Post request to create new playlist
					userID = jsonResponse.id;
					let responseBody = {"name": playlistName};
					fetch(`/v1/users/${userID}/playlists`, {
						headers: headers,
						method: 'POST',
						body: JSON.stringify({responseBody})
					}).then(response => {
						response.json();
					}).then(jsonResponse => {
						if(jsonResponse.id) {
							//Post request to add tracks to playlist
							let playlistID = jsonResponse.id;
							fetch(`/v1/users/${userID}/playlists/${playlistID}/tracks`, {
								headers: headers,
								method: 'POST',
								body: JSON.stringify({uri: trackURIs})
							}).then(response => {
								console.log(response);
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