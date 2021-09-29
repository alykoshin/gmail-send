const credentials = require('./credentials.json');

console.log('Fake addresses are used and no error checking are done in this example');
console.log('Please have a look into "Sent" Folder of your GMail to check the results.')

// /* const gmailSend = */ require("gmail-send")({
/* const gmailSend = */
require("../index.js")({
  user:    credentials.user, // "foo@bar.com",
  pass:    credentials.pass, // "foobarfoobar",
  from:    'Test User Name', // from: by default equals to user
  to:      [
    "foo@bar.com",
    "bar@bar.com",
    "baz@bar.com"         // this is picked up quoted
  ],
  subject: "Hello World Subject",
  text:    "Hello World Text"
})();
