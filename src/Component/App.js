import React, { useState } from 'react';
import Cookies from '../cookies';
import Spotify from '../spotify';
import './CSS/App.css';
import Loading from './Loading';
import Playlist from './Playlist';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import CookieNotice from './CookieNotice';

function App() {
    const [searchResultsTracks, setSearchResultsTracks] = useState([]);
    const [playlistTracks, setPlaylistTracks] = useState([]);
    const [title, setTitle] = useState(Cookies.get('playlistTitle') || '');
    const [initialized, setInitialized] = useState(false);
    const [searchBarValue, setSearchBarValue] = useState('');
    const [displayCookieNotice, setDisplayCookieNotice] = useState(!Cookies.getCookiesAllowed());

    function addToPlaylist(newTrack) {
        if (!playlistTracks.includes(newTrack)) {
            const newPlaylistTracks = [...playlistTracks, newTrack];
            setPlaylistTracks(newPlaylistTracks)
            Cookies.storePlaylistTrackIDs(newPlaylistTracks.map((track) => track.id))
        } 
        // else {
        //     alert(`"${newTrack.title}" by ${newTrack.artist} is already in the list`);
        // }
    }

    function removeFromPlaylist(track) {
        const newPlaylistTracks = playlistTracks.filter(value => {return value !== track});
        setPlaylistTracks(newPlaylistTracks);
        Cookies.storePlaylistTrackIDs(newPlaylistTracks.map((track) => track.id));
    }

    function clearPlaylist() {
        setPlaylistTracks([]);
        Cookies.storePlaylistTrackIDs([]);
    }

    function handleKeyPress(e) {
        const searchInput = document.getElementById('search-input');
        const activeElement = document.activeElement;
        if ((e.key === 'Enter') && (searchInput === activeElement)) {
            search(searchInput.value, 20);
        }
    }

    function enableCookies() {
        Cookies.set('cookiesAllowed', 'true', 365);
        setDisplayCookieNotice(false)
    }

    function declineCookies() {
        setDisplayCookieNotice(false)
    }

    function setPlaylistTitle(title) {
        Cookies.set('playlistTitle', title)
        setTitle(title);
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
        document.onkeydown = handleKeyPress;
        setInitialized(true);
        console.log('Initialized!');
    }

    async function savePlaylist() {
        const uris = playlistTracks.map( track => track.uri);
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
            setSearchBarValue('');
        } else {
            console.error(`invalid search: term=${term} maxTracks=${maxTracks}`);
        }
    } 

    if (!initialized) {
        const start = Date.now()
        initialize();
        console.log(`Completed initialization in ${Date.now() - start} ms.`)
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
                    setTitle={setPlaylistTitle}
                    removeItemHandler={removeFromPlaylist} 
                    saveHandler={savePlaylist} />
            </div>
            {displayCookieNotice && <div><CookieNotice okPressHandler={enableCookies} declinePressHandler={declineCookies} /></div>}
        </div>
        
    );
}

export default App;
