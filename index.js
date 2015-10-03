/**
 * Created by alykoshin on 8/12/14.
 */

'use strict';

var _ = require('lodash');
var path = require('path');
var nodemailer = require('nodemailer');

var GMailSend = (function(options) {
  var self = this;

  self.options = options;
  /**
   *
   * @param {{ user: string, pass: string, files: {string||string[]}, subject: string, text: string }} options
   * @param callback
   */
  self.send = function(options, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    options = _.extend({}, self.options, options);

    if (!options.user) { throw 'options.user is mandatory field.'; }
    if (!options.pass) { throw 'options.pass is mandatory field.'; }

    options.from = options.from || options.user;
    //options.replyTo = options.replyTo || options.user;

    var TRANSPORT = {
      service: 'Gmail', auth: { user: options.user, pass: options.pass }
    };

    var smtpTransport = nodemailer.createTransport( TRANSPORT );

    // Preparing attachments

    if (typeof options.files === 'string') { options.files = [options.files]; }

    var attachments = [];
    for (var i=0; i<options.files.length; i++) {
      var attachment = {
        path:     options.files[i],
        filename: path.basename( options.files[i] ),
        cid:      path.basename( options.files[i] )
      };
      attachments.push(attachment);
    }

    //

    var mailOptions = {
      from:    options.from + ' ' + '<' + options.from + '>', // sender address
      to:      options.to,      // comma separated list of receivers
      replyTo: options.replyTo,      // comma separated list of receivers
      subject: options.subject, // Subject line
      text:    options.text,    // plaintext body
      attachments: attachments
    };

    console.log('gmail-send: send(): mailOptions: ', mailOptions);

    // Sending email

    smtpTransport.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log('gmail-send: send(): Error sending message:', error);
        callback(error);

      } else {
        console.log("gmail-send: send(): Message sent: " + info.response);
        callback(false, info.response);
      }
    });
  };

  return self;
});

module.exports = function(user, pass) {
  return new GMailSend(user, pass).send;
};
