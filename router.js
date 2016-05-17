var express = require('express');
var http = require('http');
var config = require('./config').config;
var router = express.Router();

router.post('/build', function(req, res) {
    var data = req.body;
    console.log(data);
 
    if (data.token && data.token == config.token) {
        var cmd = config[data.channel_name];
        //console.log(cmd);
        if (cmd) { 
            if (data.trigger_word === cmd.command && data.text) {
                var command = data.text.replace(data.trigger_word, '').replace(/[ ]/g, '');
                var job = cmd[command];
                console.log('command:' + command + ' job:' + job);
                if (job) {
                    PostCiBuildCommand(job, res);
                } else {
                    var commands = data.channel_name + ' cmds:';
                    for (var item in cmd) {
                        if (item != 'command') {
                            commands += item + ' ';
                        }
                    }                              
                    sendError(res, commands);
                }
            }
        } else {           
            sendError(res, 'invalid params');
        }
    } else {
        sendError(res, 'invalid token');
    }
});

function sendError(res, info) {
    var error = {
        text: info
    }
    res.send(JSON.stringify(error));
}

function PostCiBuildCommand(job, response) {
  // An object of options to indicate where to post to
  var postData = '';

  var post_options = {
      host: config.ci.url,
      port: config.ci.port,
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
          response.send(JSON.stringify(error));
      });
      res.on('end', function() {
          console.log('no more data in response.');
          if (response.headersSent) {
              console.log('response header sent!');
              return;
          }
          var end = {
              text: 'build ' + job + ' start!'
          }
          response.send(JSON.stringify(end));
      });
  });

  req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
      sendError(response, e.message);
  })

  // post the data
  req.write(postData);
  req.end();
}

module.exports = router;
