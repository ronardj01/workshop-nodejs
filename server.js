//Import modules and variable
const express = require('express');
const app = express();
const albums = require('./albums');
const lodash = require('lodash')
const fs = require('fs')

//fs write function

const fsWriteAlbums = (dataToWrite) => {
  return fs.writeFileSync('albums.json', JSON.stringify(dataToWrite, null, 2))
}

//RETRIVE
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

//CREATE
//Middleware
app.use(express.json());

//Add new album
app.post("/albums", (req, res) => {
  const newAlbum = req.body;

  //Create and assign new albumId
  newAlbumId = Math.max(...albums.map((album) => album.albumId)) + 1;
  newAlbum.albumId = newAlbumId;

  //Check if all properties was send in the body
  const allPropertiesOk = lodash.isEqual(Object.keys(newAlbum).sort(), Object.keys(albums[0]).sort())
  console.log(allPropertiesOk)
  
  //Create a new Album
  if (allPropertiesOk) {

    //Push new albums and write it to albums.json
    albums.push(newAlbum);
    fsWriteAlbums(albums);
    res.status(201).json(albums);
    
  } else { //If album's properties are not complete
    res.send('Complete all properties')
  }
});

//DELETE




//Port 
app.listen(3000, () => console.log("Server is up and running"))