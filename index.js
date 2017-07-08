/**
 * Created by alykoshin on 8/12/14.
 */

'use strict';

var _ = require('lodash');
var path = require('path');
var nodemailer = require('nodemailer');

/**
 * sendOptions - options for nodemailer
 *
 * @typedef {Object} sendOptions
 * @property {string} options.user
 * @property {string} options.pass
 * @property {(string || string[])} options.files
 * @property {string} options.from
 * @property {string} options.to
 * @property {string} options.replyTo
 * @property {string} options.text
 * @property {string} options.html
 * @property {string} options.attachments - array of `nodemailer`s compatible attachments definitions
 */
/**
 * @callback sendCallback
 * @param {Object} error
 * @param {string} result
 */
/**
 * @constructor
 * @param {sendOptions} options  - options for underlying nodemailer
 * @type {Function}
 */
var GMailSend = function(options) {
  var self = this;

  /** @member {string} */
  self.options = options;

  /** helper to build 'Some Name <some.name@domain.com>' **/
  function prepareAddress(name, address) {
    return name + ' ' + '<' + address + '>';
  }

  /**
   * Send email
   * You may use almost any option available in nodemailer,
   * but if you need fine tuning I'd recommend to consider using nodemailer directly.
   *
   * @param {sendOptions} options  - options for underlying nodemailer
   * @param {sendCallback} callback
   */
  self.send = function(options, callback) {
    callback = (typeof callback === 'function') ? callback : function() {};

    options = _.extend({}, self.options, options);

    if (!options.user || !options.pass) { throw 'options.user options.pass are mandatory.'; }

    options.from = options.from || options.user;
    //options.replyTo = options.replyTo || options.user;

    // Configure email transport

    var TRANSPORT = {
      service: 'Gmail', auth: { user: options.user, pass: options.pass }
    };

    var smtpTransport = nodemailer.createTransport( TRANSPORT );

    // Preparing nodemailer options (and attachments)

    // File attachments

    options.files = options.files || [];
    if (!Array.isArray(options.files)) options.files = [ options.files ];
    //if (typeof options.files === 'string') { options.files = [options.files]; }

    options.attachments = options.attachments || [];
    for (var i=0; i<options.files.length; i++) {
      var file = options.files[i];
      // if string is passed, convert it to `nodemailer` attachment object
      if (typeof file === 'string') {
        file = {
          path:     file,
          //filename: path.basename( file ),
          //cid:      path.basename( file ),
        };
      }
      if (!file.path) return callback(new Error('file/filepath to attach must be set'), '');
      if (file.filename === 'undefined') file.filename = path.basename( file.path );
      if (file.cid      === 'undefined') file.cid      = file.filename;
      // we do not validate if options.files[i] is really object and has valid properties
      // add to options.attachments used by `nodemailer`
      options.attachments.push( file );
    }
    delete options.files; // remove files property as incompatible with options of underlying `nodemailer`

    // from

    options.from = prepareAddress(options.from, options.from); // adjust to nodemailer format

    // to

    if (typeof options.to === 'string') {
      options.to = prepareAddress(options.to, options.to);   // adjust to nodemailer format

    } else if (Array.isArray(options.to)) {
      let to = options.to.map((addr) => prepareAddress(addr, addr));
      options.to = to.join(',');
    }

    // Sending email

    //console.log('gmail-send: send(): mailOptions: ', options);
    smtpTransport.sendMail(options, function(error, info) {
      if (error) {
        //console.log('gmail-send: send(): Error sending message:', error);
        callback(error);

      } else {
        //console.log("gmail-send: send(): Message sent: " + info.response);
        callback(null, info.response);
      }
    });
  };

  return self;
};

//

/**
 * Exporting function to send email
 *
 * @param {sendOptions} options  - options for new GMailSend()
 * @returns {function}
 */
module.exports = function(options) {
  return new GMailSend(options).send;
};
