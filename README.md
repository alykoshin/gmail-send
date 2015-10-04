# gmail-send
Minimalistic module to send emails using GMail 

Basically it's a wrapper around `nodemailer` package to simplify its usage for GMail even more.

If you have different needs regarding the functionality, please add a [feature request](https://github.com/alykoshin/gmail-send/issues).

# Install

````
npm install --save gmail-send
````

# Usage

## Configuring application-specific passwords in GMail

To be able send emails from Node using GMail you need to add application-specific password to access GMail:
[My Account](https://myaccount.google.com/) -> [Sign-in & security](https://myaccount.google.com/security) -> [Signing in to Google](https://myaccount.google.com/security#signin) -> [App passwords](https://security.google.com/settings/security/apppasswords?utm_source=OGB&pli=1)

Select 'Other (Custom name)' in 'Select app'/'Select device' drop-downs, enter descriptive name for your application and pc and press 'GENERATE'.
Copy provided password.

## Demo example

````js
// Require the module and set default options
var send = require('gmail-send')({
  user: 'user@gmail.com',      // Your GMail account used to send emails
  pass: 'abcdefghijklmnop',    // Application-specific password
  to:   'user@gmail.com',      // Send to yourself
  // from:   'user@gmail.com'  // from: by default equals to user
  // replyTo:'user@gmail.com'  // replyTo: by default undefined
  subject: 'test subject',
  text:    'test text'
});

var file = './demo.js';        // File to attach

// Override any default option and send email
send({                         
  subject: 'attached '+file,   // Override value set as default 
  files: [file]
}, function (err, res) {
  console.log('send(): err:', err, '; res:', res);
});
````

You can find the working example in `./demo/demo.js` (you'll need to set your user/pass in  `credential.json.example` and rename to `credential.json` in order to run it)

____
**Links to package pages:**
[github.com](https://github.com/alykoshin/gmail-send) [npmjs.com](https://www.npmjs.com/package/gmail-send)
