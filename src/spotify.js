import Cookies from "./cookies";

const clientID = '83021feb723f4588968ffa2f55488860';
const redirectURI = 'https://c-bohling.github.io/jammming';
const pageLoadTime = Date.now();

let accessToken;
let userID;
let expiresTime = parseInt(Cookies.get('accessTokenExpiresTime'));

const Spotify = {
    initialize() { // I think this works currently - DON'T TOUCH IT CALEB!
        if (window.location.href.includes('access_token')) {
            const hashParams = this.getHashParams();
            const savedAccessToken = Cookies.get('accessToken');
            const urlAccessToken = hashParams.access_token;
            if ((savedAccessToken === urlAccessToken) && expiresTime ) {    // load while authenticated and initialized.
                // console.log('Breakpoint 1')
                // debugger;
                this.setTokenExpireTimeout(expiresTime);                         
            } else if (savedAccessToken === urlAccessToken) {               // load with expired token
                // console.log('Breakpoint 2')
                // debugger;
                this.authenticate()
            } else if (!savedAccessToken) {                                 // There is no cookie called 'accessToken'
                if (Cookies.getCookiesAllowed()) {
                    Cookies.set('accessToken', urlAccessToken, 1/24);
                    this.authenticate();
                }
            } else {                                                        // just authenticated
                // console.log('Breakpoint 3')
                // debugger;
                Cookies.set('accessToken', urlAccessToken, 1/24);
                expiresTime = pageLoadTime + (parseInt(hashParams.expires_in)) * 1000;
                // console.log('expiresTime = ' + expiresTime);
                // debugger;
                Cookies.set('accessTokenExpiresTime', expiresTime, (1/24/60/60/1000) * expiresTime - Date.now());
                this.setTokenExpireTimeout(expiresTime);
            }
            accessToken = urlAccessToken;
            this.getUserID();
        } else {                                                            // no authentication in url
            // console.log('Breakpoint 4')
            // debugger;
            this.authenticate();
        }
    },

    setTokenExpireTimeout(time) {
        const f = this.authenticate
        setTimeout(
            f,
            time - Date.now()
        );
    },

    authenticate() {
        Cookies.delete('accessTokenExpiresTime');

        let url = 'https://accounts.spotify.com/authorize';
        url += '?response_type=token';
        url += '&client_id=' + encodeURIComponent(clientID);
        url += '&scope=' + encodeURIComponent('playlist-modify-public playlist-modify-private')
        url += '&redirect_uri=' + encodeURIComponent(redirectURI);
        
        window.location = url;
    },

    getHashParams() {
        const hashParamsList = new URL(window.location).hash.split('&')

        const hashParams = {};

        hashParamsList.forEach( param => {
            const split = param.split('=');
            hashParams[split[0].replace('#', '')] = split[1];
        });
        
        return hashParams
    },

    formatRawTracks(tracks) {
        const tracklist = tracks.map( track => {
            return {
                title: track.name, 
                album: track.album.album_type === 'single'? 'Single' : track.album.name, 
                artist: track.artists[0].name, 
                id: track.id,
                uri: track.uri
            }
        })

        return tracklist;
    },
    
    async search(term, maxTracks) {
        // this.authorize(); // Always authorize first.

        const limit = Math.min(50, Math.ceil(maxTracks*1.5));
        const totalTracks = Math.min(50, maxTracks);

        let url = `https://api.spotify.com/v1/search`;    //endpoint
        url += '?q=' + encodeURIComponent(term);            //query term
        url += '&type=track';                               //type
        url += `&limit=${limit}`;

        try {
            const response = await fetch(url, {method: 'GET', headers: {Authorization: `Bearer ${accessToken}`}});            
            const json = await response.json();

            if (!response.ok) throw new Error(json);

            let listLength = 0;
            const filteredTracks = json.tracks.items.filter((track) => {
                if (listLength < totalTracks && track.explicit === false) {
                    listLength++
                    return true;
                } return false;
            })

            // const tracklist = filteredTracks.map( track => {
            //     return {
            //         title: track.name, 
            //         album: track.album.album_type === 'single'? 'Single' : track.album.name, 
            //         artist: track.artists[0].name, 
            //         id: track.id,
            //         uri: track.uri
            //     }
            // })
            const tracklist = this.formatRawTracks(filteredTracks);

            return tracklist;
        } catch (error) {
            console.error('Something went wrong with the API call:\n' + error);
        }
    },

    async getUserID() {
        // this.authorize(); // Always authorize first.

        try {
            const endpoint = 'https://api.spotify.com/v1/me';
            const options = {
                method: 'GET', 
                headers: {
                    Authorization: `Bearer ${accessToken}`, 
                    'Content-Type': 'application/json'
                }
            };
            const response = await fetch(endpoint, options);
            const userData = await response.json();

            if (!response.ok) throw new Error(userData);

            userID = userData.id;
            // console.log('userID:  ' + userID);
            return userID;
        } catch (error) {
            console.error('Something went wrong with the API call:\n' + error);
        }
    },
    
    async createPlaylist(name, trackURIs) {
        // this.authorize(); // Always authorize first.

        try {
            // Create an empty playlist
            const createEndpoint = `https://api.spotify.com/v1/users/${userID}/playlists`;
            const createOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    description: 'Built using Jammming by C Bohling'
                })
            };
            const createPlaylistResponse = await fetch(createEndpoint, createOptions);
            const createPlaylistJson = await createPlaylistResponse.json();

            if (!createPlaylistResponse.ok) throw new Error(createPlaylistJson);

            const playlistID = createPlaylistJson.id;
            
            // Populate playlist
            let populateURL = `https://api.spotify.com/v1/playlists/${playlistID}/tracks`;
            populateURL += `?uris=${trackURIs.join(',')}`

            const populateOptions = {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    // playlist_id: playlistID,
                    uris: trackURIs
                })
            };
            // console.warn(populateOptions);

            const populateResponse = await fetch(populateURL, populateOptions);
            const populateJson = await populateResponse.json();

            if (!populateResponse.ok) throw new Error(populateJson);

            return true;
        } catch (error) {
            console.error('Something went wrong with the API call:\n' + error);
            alert('An error occurred. Please try again in a few moments.')
            return false;
        }
    },

    async getTracks(IDs) {
        // this.authorize();

        try {
            let url = 'https://api.spotify.com/v1/tracks';
            url += '?ids=' + IDs.join(',');
            const options = {
                method: 'GET', 
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            }

            const response = await fetch(url, options);
            if (!response.ok) throw new Error(response);
            const json = await response.json();

            return this.formatRawTracks(json.tracks);
        } catch (error) {
            console.error('Something went wrong with the API call:\n' + error);
            alert('An error occurred. Please try again in a few moments.')
        }
    }
}

export default Spotify;