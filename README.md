[![npm version](https://badge.fury.io/js/gmail-send.svg)](http://badge.fury.io/js/gmail-send)
[![Build Status](https://travis-ci.org/alykoshin/gmail-send.svg)](https://travis-ci.org/alykoshin/gmail-send)
[![Coverage Status](https://coveralls.io/repos/alykoshin/gmail-send/badge.svg?branch=master&service=github)](https://coveralls.io/github/alykoshin/gmail-send?branch=master)
[![Code Climate](https://codeclimate.com/github/alykoshin/gmail-send/badges/gpa.svg)](https://codeclimate.com/github/alykoshin/gmail-send)
[![Inch CI](https://inch-ci.org/github/alykoshin/gmail-send.svg?branch=master)](https://inch-ci.org/github/alykoshin/gmail-send)

[![Dependency Status](https://david-dm.org/alykoshin/gmail-send/status.svg)](https://david-dm.org/alykoshin/gmail-send#info=dependencies)
[![devDependency Status](https://david-dm.org/alykoshin/gmail-send/dev-status.svg)](https://david-dm.org/alykoshin/gmail-send#info=devDependencies)

[![Known Vulnerabilities](https://snyk.io/test/github/alykoshin/gmail-send/badge.svg)](https://snyk.io/test/github/alykoshin/gmail-send)


# gmail-send

Minimalistic module to send emails using GMail 

Basically it's a wrapper around `nodemailer` package to simplify its usage for GMail accounts even more.

If you have different needs regarding the functionality, please add a [feature request](https://github.com/alykoshin/gmail-send/issues).


## Install

```bash
npm install --save gmail-send
```

## Usage

### Preparational step (this step is required only if you are using two-step verrification) 

Configure application-specific passwords for your GMail account
(if you are not using two-step verification, just skip this step and use same password you are using to login to GMail)

To be able send emails using GMail from any application (including Node.js) you need to generate application-specific password to access GMail:
[My Account](https://myaccount.google.com/) -> [Sign-in & security](https://myaccount.google.com/security) -> [Signing in to Google](https://myaccount.google.com/security#signin) -> [App passwords](https://security.google.com/settings/security/apppasswords?utm_source=OGB&pli=1)

Select 'Other (Custom name)' in 'Select app'/'Select device' drop-downs, enter descriptive name for your application and device and press 'GENERATE'.
Copy provided password.


### Code example

#### Example 1

```js
console.log('* [example 1.1] sending test email');

// Require'ing module and setting default options

var send = require('gmail-send')({
//var send = require('../index.js')({
  user: 'user@gmail.com',
  // user: credentials.user,                  // Your GMail account used to send emails
  pass: 'abcdefghijklmnop',
  // pass: credentials.pass,                  // Application-specific password
  to:   'user@gmail.com',
  // to:   credentials.user,                  // Send to yourself
                                           // you also may set array of recipients:
                                           // [ 'user1@gmail.com', 'user2@gmail.com' ]
  // from:    credentials.user,            // from: by default equals to user
  // replyTo: credentials.user,            // replyTo: by default undefined
  // bcc: 'some-user@mail.com',            // almost any option of `nodemailer` will be passed to it
  subject: 'test subject',
  text:    'gmail-send example 1',         // Plain text
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
```

#### Example 2

You may also set all needed parameters at once and immediately send:

```js
console.log('* [example2] sending test email without checking the result');

//var send = require('gmail-send')({
require('../index.js')({
  user: credentials.user,           // Your GMail account used to send emails
  pass: credentials.pass,           // Application-specific password
  to:   credentials.user,           // Send to yourself
  subject: 'ping',
  text:    'gmail-send example 3',  // Plain text
})({});                             // Send email without any check
```

You can find this working examples in `./demo/demo.js` (you'll need to set your GMail user/pass in  `credential.json.example` and rename it to `credential.json` in order to run the example). When credentials are set, run the application using `node demo/demo.js` or `node demo.js` depending on your current directory.


## Credits
[Alexander](https://github.com/alykoshin/)


## Links to package pages:

[github.com](https://github.com/alykoshin/gmail-send) &nbsp; [npmjs.com](https://www.npmjs.com/package/gmail-send) &nbsp; [travis-ci.org](https://travis-ci.org/alykoshin/gmail-send) &nbsp; [coveralls.io](https://coveralls.io/github/alykoshin/gmail-send) &nbsp; [inch-ci.org](https://inch-ci.org/github/alykoshin/gmail-send)


## License

MIT
