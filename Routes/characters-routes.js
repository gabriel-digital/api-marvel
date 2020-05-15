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

const urlBase = `https://gateway.marvel.com/v1/public/characters?orderBy=name&limit=10`;
const urlCredential = `&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`;

let urlOffset = `&offset=0`;

//  Read characters
router.get("/", async (req, res) => {
  try {
    const url = urlBase + urlOffset + urlCredential;
    const response = await axios.get(url);
    const characters = response.data.data;
    return res.json(characters);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//  Read characters with pagination
router.get("/:page", async (req, res) => {
  try {
    if (req.params) {
      urlOffset = `&offset=${(req.params.page - 1) * 10}`;
    }
    const url = urlBase + urlOffset + urlCredential;
    const response = await axios.get(url);
    const characters = response.data.data;
    return res.json(characters);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Read characters filtered by name
router.post("/", async (req, res) => {
  try {
    const url =
      urlBase +
      `&name=${req.fields.name}` +
      urlOffset +
      req.fields.name +
      urlCredential;
    const response = await axios.get(url);
    const characters = response.data.data;
    return res.json(characters);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//  Read collection of comics for a character
router.post("/character", async (req, res) => {
  try {
    const response = await axios.get(
      `${req.fields.collection}?limit=100&apikey=${publicKey}&ts=${timestamp}&hash=${hash}`
    );
    const collection = response.data.data;
    return res.json(collection);
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
