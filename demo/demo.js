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

var send = require('../index.js')({ // Setting default parameters
  user: credentials.user,           // Your GMail account used to send emails
  pass: credentials.pass,           // Application-specific password
  to:   credentials.user,           // Send to yourself
  // from:    credentials.user         // from: by default equals to user
  // replyTo: credentials.user         // replyTo: by default equals to user
  subject: 'test subject',
  text:    'test text'
});

var file = './package.json';

send({
  files: [file]
}, function (err, res) {
  console.log('send(): err:', err, '; res:', res);
});
