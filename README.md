# gmail-send
Minimalistic module to send email using GMail 

Basically it's a wrapper around `nodemailer` package to simplify its usage for GMail even more.

If you have different needs regarding the functionality, please add a [feature request](https://github.com/alykoshin/gmail-send/issues).

# Install

````
npm install --save gmail-send
````

# Usage

## Configuring application-specific passwords in GMail

To send emails using GMail you need to add application-specific password to access GMail:
[My Account](https://myaccount.google.com/) -> [Sign-in & security](https://myaccount.google.com/security) -> [Signing in to Google](https://myaccount.google.com/security#signin) -> [App passwords](https://security.google.com/settings/security/apppasswords?utm_source=OGB&pli=1)

Select 'Other (Custom name)' in 'Select app'/'Select device' drop-downs, enter descriptive name for your application and pc and press 'GENERATE'.
Copy provided password.

## Demo example

````
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

var send = require('gmail-send')({
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
````

You can find this example in ````./demo/demo.js```` (you'll need to add ````credential.json```` in order to run it)

# Links to package pages:
[github.com](https://github.com/alykoshin/gmail-send)
[npmjs.com](https://www.npmjs.com/package/gmail-send)
