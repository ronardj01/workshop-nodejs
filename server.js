//Import modules and variable
const express = require('express');
const app = express();
const albums = require('./albums');

//Retrive
//Return all albums
app.get("/albums", (req, res) => {
  res.send(albums);
});

//Return albums by albumId selected by user
app.get("/albums/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  let result = {};

  //Check if albumId is a number equal or larger than 0 
  const isNumber = (!isNaN(albumId) && albumId > 0);
  
  //Search album by albumID
  if (isNumber) {
    result = albums.find(album => album.albumId == albumId);

    //Check if albumId exist
    result === undefined ? res.send('AlbumId does not exist!') : res.status(200).send(result);

  } else { //If album is not a number or is less than 0
    res.status(400).send('Send a number larger than please');
  }
});

//Port 
app.listen(3000, () => console.log("Server is up and running"))