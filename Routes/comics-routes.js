const express = require('express');
const router = express.Router();
const md5 = require('md5');
const axios = require('axios');

// prepare hash
const date = new Date();
const timestamp = date.getTime() / 1000;
const privateKey = process.env.MARVEL_PRIVATE_KEY;
const publicKey = process.env.MARVEL_PUBLIC_KEY;
const hash = md5(timestamp + privateKey + publicKey);

const urlBase = `https://gateway.marvel.com/v1/public/comics?limit=100orderBy=title&limit=10`;
const urlCredential = `&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;

let url = `https://gateway.marvel.com/v1/public/comics?limit=100&orderBy=title&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;
//  Read comics
router.get('/comics', async (req, res) => {
  try {
    const url = urlBase + urlCredential;
    const response = await axios.get(url);
    const comics = response.data.data;
    return res.json(comics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//  Read characters with pagination
router.get('/comics/:page', async (req, res) => {
  try {
    if (req.params) {
      urlOffset = `&offset=${(req.params.page - 1) * 10}`;
    }
    const url = urlBase + urlOffset + urlCredential;
    const response = await axios.get(url);
    const comics = response.data.data;
    return res.json(comics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
module.exports = router;
