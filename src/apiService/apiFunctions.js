import axios from 'axios';

//Live URL
const BASE_URL = 'https://admin.kitabcloud.se/api/'

//Staging URL
// const BASE_URL = 'http://13.49.228.164/api/'

export const apiFunctions = {
    createFormData: (reqObj) => {
        let formData = new FormData()
        for (const property in reqObj) {
            formData.append(property, reqObj[property])
        }
        return formData;
    },
    getPrivacyPolicy: async () => {
        const res = await axios.get(BASE_URL + 'privacy_policy')
        return res.data.data.description
    },
    getTermsAndConditions: async () => {
        const res = await axios.get(BASE_URL + 'terms_conditions')
        return res.data.data.description
    },
    signUp: async (data) => {
        try {
            const response = await axios.post(BASE_URL + 'register', data)
            console.log('Response is', response.data)
            return response;
        } catch (error) {
            console.log('Error signup:', error);
            return { error: error.message };
        }
    },
    login: async (data) => {
        try {
            const response = await axios.post(BASE_URL + 'login', data)
            console.log('🚀 ~ login: ~ response:', response)
            return response;
        } catch (error) {
            console.error('Error: login', error);
            return { error: error.message };
        }
    },
    socialSignUp: async (data) => {
        try {
            const res = await axios.post(BASE_URL + 'socialSignup', data)
            return res;
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    socialLogin: async (data) => {
        try {
            const res = await axios.post(BASE_URL + 'socialSignup', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            return res;
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getCategories: async (token) => {
        try {
            const res = await axios.get(BASE_URL + 'category', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            console.log('Data is', res.data.data)
            return res.data.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getUserData: async (token) => {
        console.log('Get user data called')
        try {
            const res = await axios.post(BASE_URL + 'get_user', { token: token }, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            return res.data.user;
        } catch (error) {
            console.log('getUserData error:',error);
        }
    },
    updateUserData: async (reqObj, token) => {
        try {
            const res = await axios.post(BASE_URL + 'update', reqObj, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        }
        catch (error) {
            console.log('Error is', error)
        }
    },
    getAllAuthors: async (token) => {
        const res = await axios.get(BASE_URL + 'author', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        console.log('Response is', res.data)
        return res.data.data;
    },
    getAllReaders: async (token) => {
        const res = await axios.get(BASE_URL + 'reader', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data;
    },
    getAuthorDetails: async (token, id) => {
        const res = await axios.get(BASE_URL + 'author/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data.author;
    },
    getReaderDetails: async (token, id) => {
        const res = await axios.get(BASE_URL + 'reader/' + id, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data.reader;
    },
    followUnfollow: async (token, reqObj) => {
        try {
            const res = await axios.post(BASE_URL + 'follower', reqObj, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getBooks: async (token, reqObj) => {
        try {
            console.log('Req obj is', reqObj)
            const res = await axios.post(BASE_URL + 'books', reqObj, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    searchItems: async (reqObj, token) => {
        try {
            let res = await axios.post(BASE_URL + 'search', reqObj, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data.data
        }
        catch (error) {
            console.log('Error is', error)
        }
    },
    likeUnlineBook: async (id, token) => {
        try {
            console.log('Id is', id)
            console.log('Token is', token)
            const res = await axios.get(BASE_URL + 'booklike/' + id, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    likeUnlineVideo: async (id, token) => {
        try {
            console.log('Id is', id)
            console.log('Token is', token)
            const res = await axios.get(BASE_URL + 'videoLike/' + id, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    likeUnlinePodcast: async (id, token) => {
        try {
            console.log('Id is', id)
            console.log('Token is', token)
            const res = await axios.get(BASE_URL + 'podcastLike/' + id, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getBookDetailsById: async (id, token) => {
        try {
            const res = await axios.get(BASE_URL + 'books/' + id, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getBookDetailsByCategoryLanguage: async (cat_id, lang_id, token) => {
        console.log('Cat id is', cat_id)
        console.log('Lang id is', lang_id)
        try {
            const res = await axios.get(BASE_URL + 'getBooksByLanguageCategory?category_id=' + cat_id + '&language_id=' + lang_id, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getUserLikedBooks: async (token) => {
        try {
            const res = await axios.get(BASE_URL + 'getLikedBooks', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    bookMarkBook: async (bookId, token) => {
        try {
            const res = await axios.get(BASE_URL + 'bookmark/' + bookId, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getUserBookMarkedBooks: async (token) => {
        try {
            const res = await axios.get(BASE_URL + 'getBookmarkBooks', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    postReview: async (token, reqObj) => {
        try {
            const res = await axios.post(BASE_URL + 'review', reqObj, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log('Response is', res.data)
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    storeBookPlayed: async (token, reqObj) => {
        try {
            const res = await axios.post(BASE_URL + 'book_played', reqObj, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log('Data is', res.data)
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getPlayedBooks: async (token) => {
        try {
            const res = await axios.get(BASE_URL + 'book_played', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getHomeData: async (token) => {
        console.log('Token is', token)
        try {
            const res = await axios.get(BASE_URL + 'home_data', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getHomeDataWithLanguages: async (token, langID) => {
        try {
            console.log('Token is', token)
            console.log('Language id', langID)
            const res = await axios.get(BASE_URL + 'home_data_with_language?language_id=' + langID, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log('Data is', res.data)
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getAudiobooksByLanguage: async (token, langID) => {
        try {
            console.log('Token is', token)
            console.log('Language id', langID)
            const res = await axios.get(BASE_URL + 'getAudiobooksByLanguage?language_id=' + langID, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log('Data is', res.data)
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getEbooksWithLanguages: async (token, langID) => {
        try {
            console.log('Token is', token)
            console.log('Language id', langID)
            const res = await axios.get(BASE_URL + 'getEbooksByLanguage?language_id=' + langID, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log('Data is', res.data)
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getMagazinesWithLanguages: async (token, langID) => {
        try {
            console.log('Token is', token)
            console.log('Language id', langID)
            const res = await axios.get(BASE_URL + 'getMagazinesByLanguage?language_id=' + langID, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log('Data is', res.data)
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getPodcastsWithLanguages: async (token, langID) => {
        try {
            console.log('Token is', token)
            console.log('Language id', langID)
            const res = await axios.get(BASE_URL + 'getPodcastsByLanguage?language_id=' + langID, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log('Data is', res.data)
            return res.data
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getFeaturedBooks: async (token) => {
        try {
            const res = await axios.get(BASE_URL + 'get_featured_books', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data.book
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    buySubscription: async (token, reqObj) => {
        try {
            const res = await axios.post(BASE_URL + 'subscribe', reqObj, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data
        }
        catch (error) {
            console.log('Error is', error)
        }
    },
    saveAdClick: async (reqObj, token) => {
        try {
            const res = await axios.post(BASE_URL + 'clickads', reqObj, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            console.log('Ads click is', res.data)
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getTopPlayedBooksByTimeframe: async (token, type) => {
        try {
            const res = await axios.get(BASE_URL + 'getPlayedBookByTimeFrame/' + type, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            return res.data.book
        }
        catch (err) {
            console.log('Error is', err)
        }
    },
    getAllLanguages: async (token) => {
        const res = await axios.get(BASE_URL + 'language', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
        return res.data.data;
    },
    getBackgroundImages: async () => {
        try {
            const res = await fetch(BASE_URL + 'backgroundImages');
            if (!res.ok) {
                throw new Error('Network response was not ok.');
            }
            const data = await res.json();
            return data.data;
        } catch (error) {
            console.error('Error:', error);
            return [];
        }
    },
    forgotPassword: async (reqObj) => {
        const res = await axios.post(BASE_URL + 'forgot', reqObj)
    },
    getAudiobooks: async (token) => {
        const res = await axios.get(BASE_URL + 'audio', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return res.data.categoryWithAudioBooks
    },
    getEbooks: async (token) => {
        const res = await axios.get(BASE_URL + 'ebooks', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return res.data.categoryWithEBooks
    },
    getMagazines: async (token) => {
        const res = await axios.get(BASE_URL + 'magazines', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return res.data.categoryWithMagazines
    },
    getVideos: async (token) => {
        const res = await axios.get(BASE_URL + 'videos', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return res.data.categoryWithVideos
    },
    getPodcasts: async (token) => {
        const res = await axios.get(BASE_URL + 'podcast', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        console.log('Podcasts are', res.data)
        return res.data.categoryWithPodcast
    },
    logoutUser: async (token) => {
        const res = await axios.get(BASE_URL + 'logout?token=' + token, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return res.data
    },
    deleteUser: async (token) => {
        const res = await axios.get(BASE_URL + 'destroy?token=' + token, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        return res.data
    },
    getUserCountry: async (reqObj) => {
        try {
            console.log(BASE_URL + 'country/lat-lng?lat='+reqObj.lat+'&lng='+reqObj.lng)
            let res = await axios.get(BASE_URL + 'country/lat-lng?lat='+reqObj.lat+'&lng='+reqObj.lng)
            console.log('responseeeeee is ',res.data)
            return res.data
        }
        catch (error) {
            console.log('Called', error)
        }
    }
} 