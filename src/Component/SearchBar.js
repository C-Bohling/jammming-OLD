import './CSS/SearchBar.css'

function SearchBar({submit, setValue, value}) {
    function submitSearchQuery() {
        const inputValue = document.getElementById('search-input').value
        if (inputValue.length > 2) {
            submit(inputValue, 20);
        }
    }

    function changeHandler(e) {
        // console.log(e.target.value);
        // console.log(setValue);
        setValue(e.target.value);
    }

    return (
        <div className='search-bar-container'>
            <div className='search-bar'>
                <input type='search' placeholder='Search...' value={value} id='search-input' onChange={changeHandler}/>
                <button 
                    id='submit-search' 
                    onMouseUp={submitSearchQuery} />
            </div>
        </div>
    )
}

export default SearchBar;