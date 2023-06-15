import './CSS/Track.css'

function Track({trackInfo, buttonAdds, buttonFunction}) {
    function buttonHandler(e) {
        buttonFunction(trackInfo);
    }
    return (
        <div className='track'>
            <div className='track-info'>
                <h3>{trackInfo.title}</h3>
                <h4>{trackInfo.album} | {trackInfo.artist}</h4>
            </div>
            <div className='move-button' onMouseUp={buttonHandler}>
                {buttonAdds? <>&#65291;</> : <>&#65293;</>}
            </div>
        </div>
    )
}

export default Track;