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
const credentials = require('./credentials.json');


// Example 1
// =========
console.log('* [example 1]');

// Require'ing module and setting default options

//const send = require('gmail-send')({
const send = require('../index.js')({
  //user: 'user@gmail.com',
  user: credentials.user,                  // Your GMail account used to send emails
  //pass: 'abcdefghijklmnop',
  pass: credentials.pass,                  // Application-specific password
  //to:   'user@gmail.com',
  to: credentials.user,                    // Send to yourself
  //                                       // you also may set array of recipients:
  //                                       // [ 'user1@gmail.com', 'user2@gmail.com' ]
  from: 'Test User Name',                  // from: by default equals to user
  // replyTo: credentials.user,            // replyTo: by default `undefined`

  // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
  //                                       // (but no any processing will be done on them)

  subject: 'test subject',
  text:    'gmail-send examples 1 and 2',         // Plain text
  // html:    '<b>html text</b>'           // HTML
  // files: [ filepath ],                  // Set filenames to attach (if you need to set attachment filename in email,
  // see example below
});


const filepath = './demo-attachment.txt';  // File to attach


console.log('* [example 1] sending test email');

// Override any default option and send email

send({ // Overriding default parameters
  subject: 'attached ' + filepath,   // Override value set as default
  files:   [ filepath ],             // Set filenames to attach
}, function (err, res, full) {
  if (err) return console.log('* [example 1] send() callback returned: err:', err);
  console.log('* [example 1] send() callback returned: res:', res);
  // uncomment to see full response from Nodemailer:
  // console.log('* [example 1] send() callback returned: full:', full);
});
//
// //  String result:
//
// * [example 1] sending test email
//
//
// // Full response (if uncommented):
//
// * [example 1] send() callback returned: err: null ; res: 250 2.0.0 OK  1234567890 1234567890abcde.67 - gsmtp ;
// full: { 1234567890 1234567890abcde.67 - gsmtp ; full: { accepted: [ 'user@gmail.com' ], rejected: [], envelopeTime:
// 252, messageTime: 1386, messageSize: 678, response: '250 2.0.0 OK  1234567890 1234567890abcde.67 - gsmtp', envelope:
// { from: 'user@gmail.com', to: [ 'user@gmail.com' ] }, messageId: '<12345678-1234-1234-1234-12345678901@gmail.com>' }


console.log('* [example 2] sending test email');

// Set additional file properties

send({ // Overriding default parameters
  subject: 'attached ' + filepath,              // Override value set as default
  files:   [                                    // Array of files to attach
    {
      path:     filepath,
      filename: 'filename-can-be-changed.txt' // You can override filename in the attachment if needed
                                              // this value will be set as attachment filename in email
    }
  ],
}, function (err, res, full) {
  if (err) return console.log('* [example 2] send() callback returned: err:', err);
  console.log('* [example 2] send() callback returned: res:', res);
  // uncomment to see full response from Nodemailer:
  // console.log('* [example 2] send() callback returned: full:', full);
});
//
// // String result:
//
// * [example 2] sending test email
//
//
// // Full response (if uncommented):
//`
// * [example 2] send() callback returned: err: null ; res: 250 2.0.0 OK  1234567890 1234567890abcde.67 - gsmtp ;
// full: { accepted: [ 'user@gmail.com' ], rejected: [], envelopeTime: 239, messageTime: 885, messageSize: 694,
// response: '250 2.0.0 OK  1234567890 1234567890abcde.67 - gsmtp', envelope: { from: 'user@gmail.com', to: [
// 'user@gmail.com' ] }, messageId: '<12345678-1234-1234-1234-12345678901@gmail.com>' }


////////////////////////////////////////////////////////////////////////////////


console.log('* [example 3] sending test email without checking the result');

//var send = require('gmail-send')({
require('../index.js')({
  user:    credentials.user,           // Your GMail account used to send emails
  pass:    credentials.pass,           // Application-specific password
  to:      credentials.user,           // Send to yourself
  subject: 'ping',
  text:    'gmail-send example 3',  // Plain text
})(() => {
});                         // Send email without any check
                            //
                            // Either callback function MUST be provided
                            // or Promise rejection must be handled (see below)
//
// * [example2] sending test email without checking the result
//


////////////////////////////////////////////////////////////////////////////////

