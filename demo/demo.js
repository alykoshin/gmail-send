/**
 * Created by alykoshin on 04.10.15.
 */

// To run the example add credentials.json (see below), then run:
// node demo.js
//

'use strict';

// file credentials.json looks like following:
//
// {
//   "user": "user@gmail.com",
//   "pass": "abcdefghijklmnop"
// }
//
// You may use credentials.json.example to add you own user/pass and rename to credentials.json
//
var credentials = require('./credentials.json');

// Require'ing module and setting default options

//var send = require('gmail-send')({
var send = require('../index.js')({
  user: credentials.user,           // Your GMail account used to send emails
  pass: credentials.pass,           // Application-specific password
  to:   credentials.user,           // Send to yourself
  // from:    credentials.user      // from: by default equals to user
  // replyTo: credentials.user      // replyTo: by default undefined
  subject: 'test subject',
  text:    'plain text'//,
  //html:    '<b>html text</b>'
});

var file = './demo.js';             // File to attach

// Override any default option and send email

send({ // Overriding default parameters
  subject: 'attached '+file,        // Override value set as default
  files: [file]
}, function (err, res) {
  console.log('send(): err:', err, '; res:', res);
});
