import './CSS/Tracklist.css';
import Track from './Track';

function Tracklist({ tracks, buttonAdds, buttonFunction }) {
    const tracklist = tracks.map((track) => {
        return <Track {...track} buttonAdds={buttonAdds} buttonFunction={buttonFunction} />
    })
    return (
        <div className='tracklist-container'>
            <div className='tracklist'>
                {tracklist}
            </div>
        </div>
        
    )
}

export default Tracklist;