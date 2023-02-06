require('dotenv').config()

const express = require('express')
const expressLayouts = require('express-ejs-layouts')

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node')

const app = express()

app.use(expressLayouts)
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(express.static(__dirname + '/public'))

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  })
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error))
// Our routes go here:

app.get('/', (req, res, next) => {
    res.render('home')
})

app.get('/artist-search', (req, res, next) => {
    SpotifyWebApi
        .searchAtists(req.query.searchQuery)
        .then(data => {
            res.render('artist-search', {
                artists: data.body.artists.items
            });
        }, function(error) {
            console.log('Something went wrong!', error)
        });
    });
    
app.get('/albums/:artistId', (req, res, next) => {
  spotifyApi.getArtistAlbums(req.params.artistId)
    .then(function(data) {
      res.render('albums', {
        albums: data.body.items
      });
    }, function(error) {
      console.log('Something went wrong!', error);
    });
});

app.get('/tracks/:albumId', (req, res, next) => {
  spotifyApi.getAlbumTracks(req.params.albumId)
    .then(function(data) {
      res.render('tracks', {
        tracks: data.body.items
      });
    }, function(error) {
      console.log('Something went wrong!', error);
    });
});


app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'))
