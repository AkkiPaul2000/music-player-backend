// routes/spotify.js
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();
const {
    JWT_SECRET
} = process.env;

const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

// Middleware to verify JWT and set Spotify access token
const authenticate = (req, res, next) => {
    const token = req.headers.authorization ?.split(' ')[1];
    if (!token) return res.status(403).send('Token missing');

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.access_token = decoded.access_token;
        next();
    } catch (error) {
        res.status(403).send('Invalid token');
    }
};

router.get('/playlists', authenticate, async(req, res) => {
    try {
        const response = await axios.get(`${SPOTIFY_API_BASE_URL}/me/playlists`, {
            headers: {
                Authorization: `Bearer ${req.access_token}`
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch playlists'
        });
    }
});

router.get('/playlist/:id', authenticate, async(req, res) => {
    const {
        id
    } = req.params;
    try {
        const response = await axios.get(`${SPOTIFY_API_BASE_URL}/playlists/${id}`, {
            headers: {
                Authorization: `Bearer ${req.access_token}`
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch playlist'
        });
    }
});

router.get('/track/:id', authenticate, async(req, res) => {
    const {
        id
    } = req.params;
    try {
        const response = await axios.get(`${SPOTIFY_API_BASE_URL}/tracks/${id}`, {
            headers: {
                Authorization: `Bearer ${req.access_token}`
            },
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({
            error: 'Failed to fetch track'
        });
    }
});

module.exports = router;
