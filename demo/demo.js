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


// Example 1
// =========
console.log('* [example 1.1] sending test email');

// Require'ing module and setting default options

//var send = require('gmail-send')({
var send = require('../index.js')({
  // user: 'user@gmail.com',
  user: credentials.user,                  // Your GMail account used to send emails
  // pass: 'abcdefghijklmnop',
  pass: credentials.pass,                  // Application-specific password
  // to:   'user@gmail.com',
  to:   credentials.user,                  // Send to yourself
                                           // you also may set array of recipients:
                                           // [ 'user1@gmail.com', 'user2@gmail.com' ]
  // from:    credentials.user             // from: by default equals to user
  // replyTo: credentials.user             // replyTo: by default undefined
  // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
  subject: 'test subject',
  text:    'gmail-send examples 1.1 & 1,2',// Plain text
  //html:    '<b>html text</b>'            // HTML
});


// Override any default option and send email

console.log('* [example 1.1] sending test email');

var filepath = './demo-attachment.txt';  // File to attach

send({ // Overriding default parameters
  subject: 'attached '+filepath,         // Override value set as default
  files: [ filepath ],
}, function (err, res) {
  console.log('* [example 1.1] send() callback returned: err:', err, '; res:', res);
});


// Set additional file properties

console.log('* [example 1.2] sending test email');

send({ // Overriding default parameters
  subject: 'attached '+filepath,              // Override value set as default
  files: [                                    // Array of files to attach
    {
      path: filepath,
      filename: 'filename-can-be-changed.txt' // You can override filename in the attachment if needed
    }
  ],
}, function (err, res) {
  console.log('* [example 1.2] send() callback returned: err:', err, '; res:', res);
});


// Example 2
// =========
console.log('* [example2] sending test email without checking the result');

//var send = require('gmail-send')({
require('../index.js')({
  user: credentials.user,           // Your GMail account used to send emails
  pass: credentials.pass,           // Application-specific password
  to:   credentials.user,           // Send to yourself
  subject: 'ping',
  text:    'gmail-send example 2',  // Plain text
})({});                             // Send email without any check

