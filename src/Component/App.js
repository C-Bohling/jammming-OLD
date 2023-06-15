import React, { useState } from 'react';
import Cookies from '../cookies';
import Spotify from '../spotify';
import './CSS/App.css';
import Loading from './Loading';
import Playlist from './Playlist';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';

function App() {
    const [searchResultsTracks, setSearchResultsTracks] = useState([]);
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [title, setTitle] = useState('');
    const [initialized, setInitialized] = useState(false);
    const [searchBarValue, setSearchBarValue] = useState('');

    function addToPlaylist(newTrack) {
        if (!playlistTracks.includes(newTrack)) {
            const newPlaylistTracks = [...playlistTracks, newTrack];
            setPlaylistTracks(newPlaylistTracks)
            Cookies.storePlaylistTrackIDs(newPlaylistTracks.map((track) => track.id))
        } else {
            console.info(`${newTrack.title} is already in the list`);
        }
    }

    function removeFromPlaylist(track) {
        const newPlaylistTracks = playlistTracks.filter(value => {return value !== track});
        setPlaylistTracks(newPlaylistTracks);
        Cookies.storePlaylistTrackIDs(newPlaylistTracks.map((track) => track.id));
        console.log('removed');
    }

    function clearPlaylist() {
        setPlaylistTracks([]);
        Cookies.storePlaylistTrackIDs([]);
    }

    async function getInitialPlaylistTracks() {
        const trackIDs = Cookies.getPlaylistTrackIDs()
        if (trackIDs.length > 0) {
            setPlaylistTracks(await Spotify.getTracks(trackIDs))
        } 
        
    }

    async function initialize() {
        console.log('Initializing...')
        await Spotify.initialize();
        await getInitialPlaylistTracks();
        setInitialized(true);
        console.log('Initialized!')
    }

    async function savePlaylist() {
        const uris = playlistTracks.map( track => track.uri);
        console.log(uris);
        // call the spotify api request function here.
        if (title) {
            const success = Spotify.createPlaylist(title, uris);
            if (success) {
                clearPlaylist();
                setTitle('');
            }
        }
        
    }

    async function search(term, maxTracks) {
        if (term && maxTracks) {
            const tracks = await Spotify.search(term, maxTracks);
            setSearchResultsTracks(tracks);
        } else {
            console.log('empty search');
        }
    } 

    if (!initialized) {
        initialize();
    }

    return (
        <div className='App'>
            {!initialized && <Loading />}
            <div className='background-text'>
                <h1>JAMMMING</h1>
            </div>
            <div className='main-grid'>
                <SearchBar 
                    submit={search}
                    setValue={setSearchBarValue}
                    value={searchBarValue}/>
                <SearchResults 
                    tracks={searchResultsTracks}
                    addHandler={addToPlaylist} />
                <Playlist 
                    tracks={playlistTracks} 
                    title={title} 
                    setTitle={setTitle}
                    removeItemHandler={removeFromPlaylist} 
                    saveHandler={savePlaylist} />
            </div>
        </div>
    );
}

export default App;
