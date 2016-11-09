// node/express application
var express = require('express');
var app = express();
var path = require('path');
var bodyParser = require('body-parser');

// puts post request body data and store it on req.body
app.use(bodyParser.urlencoded({extended: true}));

app.set('port', process.env.PORT || 3000);

// Our song data
var songs = [
  {
    artist: "Bruce Springstein",
    title: "Born in the U.S.A.",
    dateAdded: "Tue Nov 08 2016",
    songStatus: 'ok'
  }
];

// Routes
app.post('/songs', function(req, res) {
  // req.body is supplied by bodyParser above
  console.log("REQ body: ", req.body);
  var newSong = req.body;
  //add create tempory duplicate song array and append form entry

  songs.push(newSong);

  var songArr = songs.map(function(item){
    return item.title + item.artist;
  });
  var isDuplicate = songArr.some(function(item, i, array){
      console.log('dupe: ' + songArr.indexOf(item) + ' index: ' + i);
      return songArr.indexOf(item) != i;
  });

  if(isDuplicate) {
    console.log('duplicate song');
    songs.pop(newSong);
    //set flag property for last song array element
    songs[songs.length - 1].songStatus = 'duplicate';
    res.sendStatus(400);
  } else if(newSong.artist == '' || newSong.title == '') {
    console.log('cannot leave fields blank');
    songs.pop(newSong);
    //set flag property for last song array element
    songs[songs.length - 1].songStatus = 'blank';
    res.sendStatus(400);
    // this is inefficient code, but so is using indexOf
  } else {
  //  add to original song array
    var today = new Date();
    today = today.toString().substring(0, 15);
    //add date to new song
    newSong.dateAdded = today;
    res.sendStatus(201);
  }

  // created new resource

});

app.get('/songs', function(req, res) {
  console.log('handling get request for songs');
  // response options
  // res.sendStatus(200);
  res.send(songs);
});

// static file routing
app.get('/*', function(req, res) {
  var file = req.params[0] || '/views/index.html';
  console.log(file);

  res.sendFile(path.join(__dirname, './public/', file));
  // /public/views/index.html
});

app.listen(app.get('port'), function() {
  console.log('Server is listening on port ' + app.get('port'));
});
