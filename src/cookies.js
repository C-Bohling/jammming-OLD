const Cookies = {
    storePlaylistTrackIDs(IDs) {
        // console.log('IDs = ' + IDs);
        this.set('playlistTrackIDs', IDs.join(','), 30)
        // document.cookie = `playlistTrackIDs=${IDs.join(',')};SameSite=Lax;Expires${(new Date(Date.now()+ 86400000)).toUTCString()}`;
    },

    set(key, value, expDays=1) {
        if ((this.getCookiesAllowed()) || (key === 'cookiesAllowed')) {
            const expTime = (new Date(Date.now() + 86400000 * expDays)).toUTCString();
            document.cookie = `${key}=${value};SameSite=Lax;Expires=${expTime}`;            
        }
    },
    
    getCookies() {
        // console.log(document.cookie)
        const cookiesList = document.cookie.split('; ');
        let cookiesObject = {};
        cookiesList.forEach( value => {
            const split = value.split('=');
            cookiesObject[split[0]] = split[1];
        });
        // console.log(cookiesObject);
        return cookiesObject;
    },

    get(key) {
        const cookies = this.getCookies()
        return cookies[key] ? cookies[key] : false;
    },

    getPlaylistTrackIDs() {
        const cookies = this.getCookies();
        if (cookies.playlistTrackIDs) {
            const IDList = cookies.playlistTrackIDs.split(',');
            // console.info('IDList = ' + IDList);
            return IDList;
        }
        else return [];
    },

    delete(key) {
        this.set(`${key}=; expires=Thu, 01 Jan 1970 00:00:00 UTC;`);
    },

    getCookiesAllowed() {
        return this.get('cookiesAllowed') ? true : false;
    } 
};

export default Cookies;