// import logo from '../logo.svg';
import './CSS/App.css';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import Playlist from './Playlist';

const TRACKS = [
    {
        title: 'Song 1',
        album: 'Album 1',
        artist: 'Baker Street Insomniacs',
        id: '128952'
    },
    {
        title: 'Song 2',
        album: 'Album 1',
        artist: 'Baker Street Insomniacs',
        id: '125421'
    },
    {
        title: 'Elephants',
        album: 'In the trees',
        artist: 'don\'t walk in the jungle',
        id: '939399'
    }
]

function App() {
    return (
        <div className="App">
            <div className='background-text'>
                <h1>JAMMMING</h1>
            </div>
            <div className='main-grid'>
                <SearchBar 
                    submit={(query) => {console.log(query)}}/>
                <SearchResults 
                    tracks={TRACKS} 
                    addHandler={() => {return 0}} />
                <Playlist 
                    tracks={TRACKS} 
                    // title={''} 
                    titleChangeHandler={() => {return 0}} 
                    removeItemHandler={() => {return 0}} 
                    saveHandler={() => {return 0}} 
                    />
            </div>
        </div>
    );
}

export default App;
