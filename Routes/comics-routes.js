const express = require("express");
const router = express.Router();
const md5 = require("md5");
const axios = require("axios");

// prepare hash
const date = new Date();
const timestamp = date.getTime() / 1000;
const privateKey = process.env.MARVEL_PRIVATE_KEY;
const publicKey = process.env.MARVEL_PUBLIC_KEY;
const hash = md5(timestamp + privateKey + publicKey);

let url = `https://gateway.marvel.com/v1/public/comics?limit=100&orderBy=title&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;
//  Read comics
router.get("/comics", async (req, res) => {
  try {
    const response = await axios.get(
      `https://gateway.marvel.com/v1/public/comics?limit=10&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`
    );
    const comics = response.data.data;
    return res.json(comics);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
