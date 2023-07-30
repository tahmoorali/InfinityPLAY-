import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import './Player.css';

const Player = (props) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songData, setSongData] = useState({});
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isRepeat, setIsRepeat] = useState(false);
    const [isShuffle, setIsShuffle] = useState(false);
    const [playlist, setPlaylist] = useState([]);
    const [currentSongIndex, setCurrentSongIndex] = useState(0);

    // Fetch song data when the component mounts
    useEffect(() => {
        const fetchSongData = async () => {
            try {
                const response = await axios.get(
                    `https://youtube-music-api.herokuapp.com/song?id=${props.match.params.songId}`
                );
                setSongData(response.data);
            } catch (error) {
                console.error('Error fetching song data:', error);
            }
        };

        const fetchPlaylist = async () => {
            try {
                // Replace 'API_ENDPOINT_FOR_PLAYLIST' with the actual API endpoint to fetch the playlist
                const response = await axios.get('API_ENDPOINT_FOR_PLAYLIST');
                setPlaylist(response.data);
                // Find the index of the current song in the playlist
                const currentIndex = response.data.findIndex(
                    (song) => song.videoId === props.match.params.songId
                );
                setCurrentSongIndex(currentIndex);
            } catch (error) {
                console.error('Error fetching playlist:', error);
            }
        };

        fetchSongData();
        fetchPlaylist();
    }, [props.match.params.songId]);

    // Update the duration when the audio metadata is loaded
    const handleLoadedMetadata = () => {
        setDuration(audioRef.current.duration);
    };

    // Update the current time of the audio
    const handleTimeUpdate = () => {
        setCurrentTime(audioRef.current.currentTime);
    };

    // Play or pause the audio
    const handlePlayPause = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
    };

    // Go to the previous song
    const handleBackward = () => {
        const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
        setCurrentSongIndex(prevIndex);
    };

    // Go to the next song
    const handleForward = () => {
        const nextIndex = (currentSongIndex + 1) % playlist.length;
        setCurrentSongIndex(nextIndex);
    };

    // Toggle repeat functionality
    const handleRepeat = () => {
        setIsRepeat(!isRepeat);
    };

    // Toggle shuffle functionality
    const handleShuffle = () => {
        setIsShuffle(!isShuffle);
    };

    // Handle the end of the audio track
    const handleEnded = () => {
        if (isRepeat) {
            audioRef.current.play();
        } else if (isShuffle) {
            const randomIndex = Math.floor(Math.random() * playlist.length);
            setCurrentSongIndex(randomIndex);
        } else {
            const nextIndex = (currentSongIndex + 1) % playlist.length;
            setCurrentSongIndex(nextIndex);
        }
    };

    // Update the audio source whenever the currentSongIndex changes
    useEffect(() => {
        if (playlist.length > 0) {
            const videoId = playlist[currentSongIndex].videoId;
            audioRef.current.src = `https://youtube-music-api.herokuapp.com/stream?id=${videoId}`;
            audioRef.current.play();
        }
    }, [currentSongIndex, playlist]);

    // Helper function to format time in minutes and seconds
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    return (
        <div>
            <h2>Now Playing</h2>
            <h3>{songData.title}</h3>
            <audio
                ref={audioRef}
                controls
                onLoadedMetadata={handleLoadedMetadata}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
            >
                <source
                    src={`https://youtube-music-api.herokuapp.com/stream?id=${props.match.params.songId}`}
                    type="audio/mpeg"
                />
                Your browser does not support the audio element.
            </audio>
            <div>
                <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
                <button onClick={handleBackward}>Backward</button>
                <button onClick={handleForward}>Forward</button>
                <button onClick={handleRepeat}>{isRepeat ? 'Repeat Off' : 'Repeat'}</button>
                <button onClick={handleShuffle}>{isShuffle ? 'Shuffle Off' : 'Shuffle'}</button>
            </div>
            <div>
                <p>{formatTime(currentTime)}</p>
                <p>{formatTime(duration)}</p>
            </div>
        </div>
    );
};

export default Player;
