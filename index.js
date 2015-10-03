/**
 * Created by alykoshin on 8/12/14.
 */

'use strict';

var path = require('path');
var nodemailer = require('nodemailer');

var GMailSend = (function(user, pass) {
  var self = this;

  var TRANSPORT = {
    service: 'Gmail', auth: { user: user, pass: pass }
  };
  var DEFAULT_FROM = user;

  var smtpTransport = nodemailer.createTransport( TRANSPORT );

  /**
   *
   * @param {string} toAddress
   * @param {string || string[]} fnames
   * @param callback
   */
  self.send = function(toAddress, fnames, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    var from = DEFAULT_FROM + ' ' + '<' + DEFAULT_FROM + '>',
        to   = /*toName   + ' ' +*/ toAddress,
        subject = 'test subject',
        text    = 'test text';

    // Preparing attachments

    if (typeof fnames === 'string') { fnames = [fnames]; }

    var attachments = [];
    for (var i=0; i<fnames.length; i++) {
      var attachment = {
        path:     fnames[i],
        filename: path.basename( fnames[i] ),
        cid:      path.basename( fnames[i] )
      };
      attachments.push(attachment);
    }

    //

    var mailOptions = {
      from:    from,    // sender address
      to:      to,      // comma separated list of receivers
      subject: subject, // Subject line
      text:    text,    // plaintext body
      attachments: attachments
    };
    if (DEFAULT_FROM) { mailOptions.replyTo = DEFAULT_FROM; }

    console.log('mailOptions: ', mailOptions);

    // Sending email

    smtpTransport.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('Error sending message:', error);
        callback(error);

      } else {
        console.log("Message sent: " + info.response);
        callback(false, info.response);
      }
    });
  };

  return self;
});

module.exports = function(user, pass) {
  return new GMailSend(user, pass).send;
};
