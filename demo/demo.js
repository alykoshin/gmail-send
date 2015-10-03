/**
 * Created by alykoshin on 04.10.15.
 */


'use strict';

// file credentials.json looks like following:
// {
//   "user": "user@gmail.com",
//   "pass": "abcdefghijklmnop"
// }
var credentials = require('./credentials.json');

// Require'ing module and setting default options

//var send = require('gmail-send')({
var send = require('../index.js')({
  user: credentials.user,           // Your GMail account used to send emails
  pass: credentials.pass,           // Application-specific password
  to:   credentials.user,           // Send to yourself
  // from:    credentials.user         // from: by default equals to user
  // replyTo: credentials.user         // replyTo: by default undefined
  subject: 'test subject',
  text:    'test text'
});

var file = './demo.js';

// Override any default option and send email

send({ // Overriding default parameters
  subject: 'attached file',
  files: [file]
}, function (err, res) {
  console.log('send(): err:', err, '; res:', res);
});
