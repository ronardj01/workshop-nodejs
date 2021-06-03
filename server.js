//Import modules and variable
const express = require('express');
const app = express();
let albums = require('./albums');
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

  } else { //If albumId is not a number or is less than 0
    res.status(400).send('Send a number larger than 0 please');
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
//Delete an album
app.delete("/albums/:albumId", (req, res) => {
  const albumId = req.params.albumId;
  let result = {};

  //Check if albumId is a number equal or larger than 0 
  const isNumber = (!isNaN(albumId) && albumId > 0);

  if (isNumber) {
    //Assign values to result variable
    result = albums.filter((album) => {
      return album.albumId != albumId;
    })

    //Cut the selected album and write the new albums to albums.json
    albums = result;
    fsWriteAlbums(albums);
    res.status(200).json(result);

  } else { //If albumId is not a number or is less than 0
    res.status(400).send('Send a number larger than 0 please');
  }
});

//UPDATE
//Update an albums
app.put("/albums/:albumId", (req, res) => {
  const modifier = req.body;
  const albumId = req.params.albumId

  //Check if albumId is a number equal or larger than 0 
  const isNumber = (!isNaN(albumId) && albumId > 0);

  if (isNumber) {
    //Search album to modify
    const modifiedAlbum = albums.find(album => album.albumId == albumId);

    //Modify propierties and write it to albums.json
    modifiedAlbum.artistName = modifier.artistName
    modifiedAlbum.collectionName = modifier.collectionName
    modifiedAlbum.artworkUrl100 = modifier.artworkUrl100
    modifiedAlbum.releaseDate = modifier.releaseDate
    modifiedAlbum.primaryGenreName = modifier.primaryGenreName
    modifiedAlbum.url = modifier.url

    fsWriteAlbums(albums);
    res.status(200).json(modifiedAlbum);

  } else { //If albumId is not a number or is less than 0
    res.status(400).send('Send a number larger than 0 please');
  }

})

//Port 
app.listen(3000, () => console.log("Server is up and running"))