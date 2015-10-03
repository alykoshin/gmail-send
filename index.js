/**
 * Created by alykoshin on 8/12/14.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var nodemailer = require('nodemailer');

var GMailer = (function(user, pass) {
  var self = this;

  var TRANSPORT = {
    service: 'Gmail', auth: { user: user, pass: pass }
  };
  var DEFAULT_FROM = user;

  var smtpTransport = nodemailer.createTransport( TRANSPORT );

  /**
   *
   * @param {string} toAddress
   * @param {string} dir
   * @param {string} fname
   * @param {callback} cb
   */
  self.send = function(toAddress, dir, fname, cb) {
    var from = DEFAULT_FROM + ' ' + '<' + DEFAULT_FROM + '>',
        to = /*toName   + ' ' +*/ toAddress,
        subject = 'test subject',
        text    = 'test text';

    // Preparing attachment
    //var img = fs.readFileSync(path.join(dir,fname));
    var attachment = {
      filename: fname,
      //contents: img,
      path: path.join(dir, fname),
      cid: fname
    };

    var mailOptions = {
      from:    from,    // sender address
      to:      to,      // comma separated list of receivers
      subject: subject, // Subject line
      text:    text,    // plaintext body
      attachments: [ attachment ]
    };
    if (DEFAULT_FROM) { mailOptions.replyTo = DEFAULT_FROM; }

    console.log('mailOptions: ', mailOptions);

    smtpTransport.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('Error sending message:', error);
        cb(error);

      } else {
        console.log("Message sent: " + info.response);
        cb(false, info.response);
      }
    });
  };

  return self;
});

module.exports = function(user, pass) {
  return new GMailer(user, pass);
};
