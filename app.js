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

/*My solution
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
*/

// Accurate Solution
app.get('/artist-search', (req, res) => {
    const { name } = req.query
    spotifyApi
        .searchArtists(name)
        .then(data => {
            // console.log('The received data from the API: ', data.body);
            const artistsArr = data.body.artists.items;
            res.render('artist-search-results', { artistsArr });
        })
        .catch(err => console.log('Sth went wrong when searching artists: ', err));
  })


//other solution
// app.get('/albums/:artistId', (req, res, next) => {
//     const { artistId } = req.params
//     spotifyApi
//         .getArtistAlbums(artistId)
//         .then(data => {
//             const albumsArr = data.body.items;
//             res.render('albums', { albumsArr });
//         })
//         .catch(err => console.log('Sth went wrong when searching albums: ', err));

//     spotifyApi
//         .getArtist(artistId)
//         .then(data => {
//             const artistName = data.body.name
//             console.log(artistName);
//         })
//         .catch(err => console.log('Sth went wrong when searching artist name: ', err));
// })

/*My solution
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
*/


//Accuarte solution
app.get('/albums/:artistId', async (req, res, next) => {
    try {
        const { artistId } = req.params
        const data = await spotifyApi.getArtistAlbums(artistId);
        const albumsArr = data.body.items;
        res.render('albums', { albumsArr });
    } catch (error) {
        console.log('Sth went wrong when searching albums: ', err);
    }
})


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
