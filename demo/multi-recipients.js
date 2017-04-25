var credentials = require('./credentials.json');
const gmailSend = require("../index.js")({
//const gmailSend = require("gmail-send")({
  user: credentials.user, // "foo@bar.com",
  pass: credentials.pass, //"foobarfoobar",
  to: [
    "foo@bar.com",
    "bar@bar.com",
    "baz@bar.com" // this is picked up quoted
  ],
  subject: "Hello world",
  text: "Hello world"
})();
