import './CSS/SearchBar.css'

function SearchBar({submit}) {
    function submitSearchQuery() {
        submit(document.getElementById('search-input').value);
    }
    return (
        <div className='search-bar-container'>
            <div className='search-bar'>
                <input type='text' placeholder='Search...' id='search-input'/>
                <button 
                    id='submit-search' 
                    onMouseUp={submitSearchQuery} />
            </div>
        </div>
    )
}

export default SearchBar;