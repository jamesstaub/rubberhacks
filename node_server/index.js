'use strict';
var http = require('http');
var httpPort = 8080;

var Firebase = require("firebase");
var firebaseOSC = new Firebase('https://rubberhacks.firebaseio.com/');

var oscIO = require('./oscIO');

// amazon s3 bucket
var streamingS3 = require('streaming-s3'),
    fs = require('fs');

// amazon s3 bucket
const accessKey = process.env.S3_ACCESS_KEY;
const secret = process.env.S3_SECRET;


// http server
function handleRequest(request, response){
    response.end('It Works!! Path Hit: ' + request.url);
}

var server = http.createServer(handleRequest);

server.listen(httpPort, function(){
    //Callback triggered when server is successfully listening.
    console.log("Server listening on: http://localhost:%s", httpPort);
});

// receieve all firebase data, send to max over osc
firebaseOSC.on("value", function(snapshot) {
  var fbResponse = snapshot.val();

  for (var uid in fbResponse) {
    // var userIndex = uidToInt(uid);
    var userData = fbResponse[uid];
    if (typeof userData === 'object') {
      // var jsonUserData = unescape(JSON.stringify(userData));
      // oscIO.send(String(uid), jsonUserData);
      var userArray = [];
      for(var slider in userData){
        userArray.push(userData[slider]);
      }
      oscIO.send(String(uid), userArray);
    }

  }

  setTimeout(function(){
    oscIO.send('done', 1);
  }, 2);


});

// var userIndexes = {};
// function uidToInt(uid, userIndexeObj) {
//    //convert firbase user ids into a hash of numeric indexes
//   // userIndexes[uid] = true;
//   if (userIndexes.hasOwnProperty(uid)) {
//   }
//   for (var user in userIndexes) {
//     // userIndexes[user] = count;
//     // count ++;
//   }
//   return userIndexes;
// }


// oscIO.receive('', 'message', function (message) {
//   // console.log(message);
//     if (message[0] === "filename") {
//       var filename = message[1];
//       var mediapath = '/../media/';
//       var fStream = fs.createReadStream(  __dirname + mediapath + filename);
//       console.log('mediafile',  __dirname + mediapath + filename);
//       var uploader = new streamingS3(fStream, {
//         accessKeyId: accessKey,
//         secretAccessKey: secret },
//         {
//           Bucket: 'nodeoscjitter',
//           Key: filename,
//           ContentType: 'image/jpeg'
//         },  function (err, resp, stats) {
//         if (err) return console.log('Upload error: ', err);
//         // console.log('Upload stats: ', stats);
//         console.log('Upload successful: ', resp);
//         console.log('location: ', resp.Location);
//         firebaseOSC.update({media: resp.Location});
//         }
//       );

//     }

//   });
