# gmail-send
Minimalistic module to send email using GMail 

Basically it's a wrapper around `nodemailer` package to simplify its usage.

Not yet intended for public use.

# Usage

To send emails using GMail you need to add application-specific password to access GMail:
[My Account](https://myaccount.google.com/) -> [Sign-in & security](https://myaccount.google.com/security) -> [Signing in to Google](https://myaccount.google.com/security#signin) -> [App passwords](https://security.google.com/settings/security/apppasswords?utm_source=OGB&pli=1)


Select 'Other (Custom name)' in 'Select app'/'Select device' drop-downs, enter descriptive name for your application and pc and press 'GENERATE'.
Copy provided password.

````
var LOGIN = 'login@gmail.com',   // Your GMail account used to send emails
  PASSWORD = 'abcdefghijklmnop'; // Application-specific password from previous step
                                                     
var send = require('gmail-send')(LOGIN, PASSWORD);

var file = './package.json';

send( email, [file], function (err, res) {
  console.log('send(): err:', err, '; res:', res);
});
````
