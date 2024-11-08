// routes/auth.js
const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();

const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const {
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    REDIRECT_URI,
    JWT_SECRET
} = process.env;

router.get('/login', (req, res) => {
    const scope = 'user-read-private user-read-email playlist-read-private';
    const redirectUrl = `${SPOTIFY_AUTH_URL}?response_type=code&client_id=${SPOTIFY_CLIENT_ID}&scope=${encodeURIComponent(
        scope
    )}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    res.redirect(redirectUrl);
});

router.get('/callback', async (req, res) => {
    const {
        code
    } = req.query;
    const authOptions = {
        method: 'POST',
        url: SPOTIFY_TOKEN_URL,
        headers: {
            Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`,
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        data: `grant_type=authorization_code&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
    };

    try {
        const response = await axios(authOptions);
        const { access_token, refresh_token } = response.data;

        // Generate JWT token
        const token = jwt.sign({ access_token, refresh_token }, JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Authentication failed' });
    }
});

module.exports = router;
