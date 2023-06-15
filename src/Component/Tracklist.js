import './CSS/Tracklist.css';
import Track from './Track';

function Tracklist({ tracks, buttonAdds, buttonFunction }) {
    const tracklist = tracks.map((track, index) => {
        return <Track trackInfo={track} buttonAdds={buttonAdds} buttonFunction={buttonFunction} key={index} />
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