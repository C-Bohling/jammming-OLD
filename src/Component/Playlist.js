import Tracklist from './Tracklist';
import './CSS/Playlist.css';
import './CSS/ListPanel.css';

function Playlist({ tracks, title, titleChangeHandler, removeItemHandler, saveHandler }) {
    return (
        <div className='playlist list-panel'>
            <input 
                type='text' 
                placeholder='Playlist Title' 
                onChange={titleChangeHandler}
                value={title}/>
            <Tracklist 
                tracks={tracks} 
                buttonAdds={false} 
                buttonFunction={removeItemHandler}/>
            <button onMouseUp={saveHandler}>
                SAVE TO SPOTIFY
            </button>
        </div>
    )
}

export default Playlist;