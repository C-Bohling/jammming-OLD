import Tracklist from './Tracklist';
import './CSS/SearchResults.css';
import './CSS/ListPanel.css';

function SearchResults({ tracks, addHandler }) {
    return (
        <div className='search-results list-panel'>
            <h2>Results...</h2>
            <Tracklist 
                tracks={tracks} 
                buttonAdds={true}
                buttonFunction={addHandler} />
        </div>
    )
}

export default SearchResults;