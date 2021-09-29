/**
 * Created by alykoshin on 22.07.19.
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


//
// Promise Example 1
// =================
console.log('* [promise-example-1] configuring');

// Require'ing module and setting default options

//const send = require('gmail-send')({
const send = require('../index.js')({
  user:    credentials.user,
  pass:    credentials.pass,
  from:    'Test User Name',
  to:      credentials.user,
  subject: 'test subject',
  text:    'gmail-send promise examples',
});


// Send email

console.log('* [promise-example-1] sending');

const result = send() // Using default parameters
  .then((res) => {
    console.log('* [promise-example-1] then: res.result:', res.result);
    // full response from Nodemailer:
    // console.log('* [promise-example-1] then: res.full:', res.full);
  })
  .catch((error) => {
    console.log('ERROR:', error);
    console.log('* [promise-example-1] catch: error:', error);
  })
;


console.log('* [promise-example-2] sending');

const asyncAwaitSend = async () => {
  try {
    const res = await send(); // Using default parameters
    console.log('* [promise-example-2] res.result:', res.result);
    // uncomment to see full response from Nodemailer:
    // console.log('* [promise-example-2] res.full:', res.full);
  } catch (e) {
    console.error('* [promise-example-2] ERROR:', e);
  }
};
asyncAwaitSend();


