import React, { useState } from 'react';
import axios from 'axios';
import './Home.css'

const Home = () => {
    const [songs, setSongs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const searchSongs = async () => {
        try {
            const response = await axios.get(
                `https://youtube-music-api.herokuapp.com/search?q=${searchQuery}`
            );
            setSongs(response.data.content);
        } catch (error) {
            console.error('Error fetching songs:', error);
        }
    };

    return (
        <div>
            <h1>InfinityPLAY</h1>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button onClick={searchSongs}>Search</button>
            <ul>
                {songs.map((song) => (
                    <li key={song.videoId}>
                        <a href={`/player/${song.videoId}`}>{song.name}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Home;
