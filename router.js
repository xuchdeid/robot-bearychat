var express = require('express');
var http = require('http');
var config = require('./config').config;
var router = express.Router();

router.post('/build', function(req, res) {
    var data = req.body;
    console.log(data);
    if (data.trigger_word === config.android.command && data.text) {
        var command = data.text.replace(data.trigger_word, '').replace(/[ ]/g, '');
        var job = config.android[command];
        console.log('command:' + command + ' job:' + job);
        if (job) {
            PostCiBuildCommand(job, res);
        } else {
            var commands = 'commands:';
            for (var item in config.android) {
                commands += item + ' ';
            }
            var error = {
                text: commands
            }
            res.send(JSON.stringify(error));
        }
    } else {
        res.send('invalid params');
    }
});

function PostCiBuildCommand(job, response) {
  // An object of options to indicate where to post to
  var postData = '';

  var post_options = {
      host: config.ci.url,
      port: '80',
      path: config.ci.path.replace(/{job}/, job),
      method: 'POST',
      headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + new Buffer(config.ci.user + ':' + config.ci.pwd).toString('base64'),
          'Content-Length': postData.length
      }
  };

  // Set up the request
  var req = http.request(post_options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function(chunk) {
          //console.log('Response: ' + chunk);
          var error = {
              text: 'invalid user or password!'
          }
          res.send(JSON.stringify(error));
      });
      res.on('end', function() {
          console.log('no more data in response.');
          if(response.headersSent) {
              return;
          }
          var end = {
              text: 'build ' + job + ' start!'
          }
          res.send(JSON.stringify(end));
      });
  });

  req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      response.send(e.message);
  })

  // post the data
  req.write(postData);
  req.end();
}

module.exports = router;
