[![npm version](https://badge.fury.io/js/gmail-send.svg)](http://badge.fury.io/js/gmail-send)
[![Build Status](https://travis-ci.org/alykoshin/gmail-send.svg)](https://travis-ci.org/alykoshin/gmail-send)
[![Coverage Status](https://coveralls.io/repos/alykoshin/gmail-send/badge.svg?branch=master&service=github)](https://coveralls.io/github/alykoshin/gmail-send?branch=master)
[![Code Climate](https://codeclimate.com/github/alykoshin/gmail-send/badges/gpa.svg)](https://codeclimate.com/github/alykoshin/gmail-send)
[![Inch CI](https://inch-ci.org/github/alykoshin/gmail-send.svg?branch=master)](https://inch-ci.org/github/alykoshin/gmail-send)

[![Dependency Status](https://david-dm.org/alykoshin/gmail-send/status.svg)](https://david-dm.org/alykoshin/gmail-send#info=dependencies)
[![devDependency Status](https://david-dm.org/alykoshin/gmail-send/dev-status.svg)](https://david-dm.org/alykoshin/gmail-send#info=devDependencies)


# gmail-send

Minimalistic module to send emails using GMail 

Basically it's a wrapper around `nodemailer` package to simplify its usage for GMail accounts even more.

If you have different needs regarding the functionality, please add a [feature request](https://github.com/alykoshin/gmail-send/issues).


## Install

````
npm install --save gmail-send
````

## Usage

### Preparational step: Configure application-specific passwords for your GMail account

To be able send emails using GMail from any application (including Node.js) you need to generate application-specific password to access GMail:
[My Account](https://myaccount.google.com/) -> [Sign-in & security](https://myaccount.google.com/security) -> [Signing in to Google](https://myaccount.google.com/security#signin) -> [App passwords](https://security.google.com/settings/security/apppasswords?utm_source=OGB&pli=1)

Select 'Other (Custom name)' in 'Select app'/'Select device' drop-downs, enter descriptive name for your application and device and press 'GENERATE'.
Copy provided password.


### Code example

#### Example 1

````js
console.log('* [example1] sending test email');

// Require the module and set default options
// You may use almost any option available in nodemailer, 
// but if you need fine tuning I'd recommend to consider using nodemailer directly.
var send = require('gmail-send')({
  user: 'user@gmail.com',               // Your GMail account used to send emails
  pass: 'abcdefghijklmnop',             // Application-specific password
  to:   '"User" <user@gmail.com>',      // Send back to yourself
  // from:   '"User" <user@gmail.com>'  // from: by default equals to user
  // replyTo:'user@gmail.com'           // replyTo: by default undefined
  subject: 'test subject',
  text:    'test text'
  // html:    '<b>html text text</b>'
});

var file = './demo-attachment.txt';        // File to attach

// Override any default option and send email
send({                         
  subject: 'attached '+file,   // Override value set as default 
  files: [file]                // String or array of strings of filenames to attach
}, function (err, res) {
  console.log('* [example1] send(): err:', err, '; res:', res);
});
````

#### Example 2

You may also set all needed parameters at once and immediately send:

````js
console.log('* [example2] sending test email');

var send = require('gmail-send')({
  user: credentials.user,           // Your GMail account used to send emails
  pass: credentials.pass,           // Application-specific password
  to:   credentials.user,           // Send to yourself
  subject: 'ping',
  text:    'gmail-send example 2'   // Plain text
})();                               // Send without any check
````

You can find this working examples in `./demo/demo.js` (you'll need to set your GMail user/pass in  `credential.json.example` and rename it to `credential.json` in order to run the example). When credentials are set, run the application using `node demo/demo.js` or `node demo.js` depending on your current directory.


## Credits
[Alexander](https://github.com/alykoshin/)


## Links to package pages:

[github.com](https://github.com/alykoshin/gmail-send) &nbsp; [npmjs.com](https://www.npmjs.com/package/gmail-send) &nbsp; [travis-ci.org](https://travis-ci.org/alykoshin/gmail-send) &nbsp; [coveralls.io](https://coveralls.io/github/alykoshin/gmail-send) &nbsp; [inch-ci.org](https://inch-ci.org/github/alykoshin/gmail-send)


## License

MIT
