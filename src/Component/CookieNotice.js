import './CSS/CookieNotice.css';

function CookieNotice({okPressHandler, declinePressHandler}) {
    return (
        <div className='cookie-div'>
            <div className='notice'>
                <h2>We use cookies</h2>
                <p>By selecting 'Accept' you consent to the 
                    use and storage of cookies on
                    your device. You can decline cookies by
                    selecting 'Decline' but some functionality 
                    will be lost.</p>
            </div>
            <div className='cookie-options'>
                <button className='cookie-button' onMouseUp={okPressHandler}>Accept</button>
                <button className='cookie-button' onMouseUp={declinePressHandler}>Decline</button>
            </div>
            

        </div>
    )
    
}

export default CookieNotice;