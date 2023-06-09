import './CSS/Track.css'

function Track({title, album, artist, id, buttonAdds, buttonFunction}) {
    return (
        <div className='track'>
            <div className='track-info'>
                <h3>{title}</h3>
                <h4>{album} | {artist}</h4>
            </div>
            <div className='move-button' onMouseUp={buttonFunction}>
                {buttonAdds? <>&#65291;</> : <>&#65293;</>}
            </div>
        </div>
    )
}

export default Track;