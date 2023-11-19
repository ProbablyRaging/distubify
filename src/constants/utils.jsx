import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios';

export const useDarkMode = () => {
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const storedTheme = localStorage.getItem('darkMode');
        if (storedTheme) {
            setDarkMode(storedTheme === 'true');
            updateScrollbarColors(storedTheme === 'true');
        } else {
            const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setDarkMode(prefersDarkMode);
        }
    }, []);

    const updateScrollbarColors = (isDarkMode) => {
        const scrollbarTrackColor = isDarkMode ? '#121212' : '#fff';
        document.documentElement.style.setProperty('--scrollbar-new-color', scrollbarTrackColor);
    };

    const toggleDarkMode = () => {
        const newDarkMode = !darkMode;
        setDarkMode(newDarkMode);
        updateScrollbarColors(newDarkMode);
        localStorage.setItem('darkMode', newDarkMode.toString());
    };

    return [darkMode, toggleDarkMode];
};

export const checkForToken = async () => {
    const inlineToken = location.search.split('?auth=')[1];
    if (inlineToken) {
        const response = await axios.post('https://creatordiscord.xyz/api/validate', { data: inlineToken });
        if (response.data.data) {
            Cookies.set('distubify.sid', inlineToken, { expires: 1 });
            return response.data;
        }
    }
};

export const validateSession = async () => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, cookieValue] = cookie.split('=');
        if (name === 'distubify.sid') {
            const response = await axios.post('https://creatordiscord.xyz/api/validate', { data: cookieValue });
            if (response.data.data) {
                return response.data;
            } else {
                Cookies.remove('distubify.sid');
            }
        }
    }
}

export const getVideoList = async (page = 1) => {
    const response = await axios.get(`https://creatordiscord.xyz/api/videolist?page=${page}`);
    if (response) return response.data.videoList;
}

export const getVideoData = async (value) => {
    const response = await axios.post(`https://creatordiscord.xyz/api/videodata`, { data: value });
    if (response) return response.data.videoData;
}

export const getChannelList = async () => {
    const response = await axios.get('https://creatordiscord.xyz/api/channellist');
    if (response) return response.data.channelList;
}

export const getChannelVideos = async (value) => {
    const response = await axios.post('https://creatordiscord.xyz/api/channelvideos', { data: value });
    if (response) return response.data.videoList;
}

export const getChannelData = async (value) => {
    const response = await axios.post(`https://creatordiscord.xyz/api/channeldata`, { data: value });
    if (response) return response.data.channelData;
}

export const getFilteredResults = async (value) => {
    const response = await axios.post('https://creatordiscord.xyz/api/filter', { data: value });
    if (response) return response.data.videoList;
}

export const getSearchResults = async (value) => {
    const oldSearchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    const updatedSearchHistory = [value, ...oldSearchHistory];
    localStorage.setItem('searchHistory', JSON.stringify(updatedSearchHistory));

    const response = await axios.post('https://creatordiscord.xyz/api/search', { data: value });
    if (response) return response.data.videoList;
}

export const getSearchHistory = async () => {
    const searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
    return searchHistory;
}

export const newVideoSubmission = async (platform, value) => {
    if (platform === 'youtube') {
        const response = await axios.post('https://creatordiscord.xyz/api/addvideo_youtube', { data: value });
        if (response) return response.data;
    } else {
        const response = await axios.post('https://creatordiscord.xyz/api/addvideo_twitch', { data: value });
        if (response) return response.data;
    }
}

export const getVideoComments = async (videoId) => {
    const response = await axios.post('https://creatordiscord.xyz/api/getcomments', { data: videoId });
    if (response) return response.data;
}

export const newCommentSubmission = async (value, videoId) => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, cookieValue] = cookie.split('=');
        if (name === 'distubify.sid') {
            const response = await axios.post('https://creatordiscord.xyz/api/addcomment', { data: { value, videoId, cookieValue } });
            if (response.data) {
                return response.data;
            }
        }
    }
}

export const logUserOut = async () => {
    const cookies = document.cookie.split('; ');
    for (const cookie of cookies) {
        const [name, cookieValue] = cookie.split('=');
        if (name === 'distubify.sid') {
            const response = await axios.post('https://creatordiscord.xyz/api/logout', { data: cookieValue });
            if (response.data.message) {
                Cookies.remove('distubify.sid');
                return window.location.reload();
            }
        }
    }
}