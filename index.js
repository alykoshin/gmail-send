/**
 * Created by alykoshin on 8/12/14.
 */

'use strict';

const _          = require('lodash');
const path       = require('path');
const nodemailer = require('nodemailer');

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
 * @param {Object} fullResult
 */
/**
 * @constructor
 * @param {sendOptions} options  - options for underlying nodemailer
 * @type {Function}
 */
const GMailSend = function (options) {
  const self = this;

  /** @member {string} */
  self.options = options;

  /** helper to build 'Some Name <some.name@domain.com>' **/
  function prepareAddress(name, address) {
    return name + ' ' + '<' + address + '>';
  }


  function _send(options, callback) {

    const handleSuccess = (info) => {
      if (callback) {
        callback(null, info.response, info);
        //} else { //
        //  const result = {
        //    result: info && info.response,
        //    full:   info,
        //  };
        //  resolve(result);
      }
    };

    const handleError = (error) => {
      if (typeof error === 'string') error = new Error(error);
      if (callback) {
        callback(error, error.message, undefined);
        //} else {
        //  reject(error);
      }
    };

    options.from = options.from || options.user;
    //options.replyTo = options.replyTo || options.user;

    // Configure email transport

    const TRANSPORT = {
      service: 'Gmail', auth: { user: options.user, pass: options.pass }
    };

    const smtpTransport = nodemailer.createTransport(TRANSPORT);

    // Preparing nodemailer options (and attachments)

    // File attachments

    options.files = options.files || [];
    if (!Array.isArray(options.files)) options.files = [ options.files ];
    //if (typeof options.files === 'string') { options.files = [options.files]; }

    options.attachments = options.attachments || [];
    for (let i = 0; i < options.files.length; i++) {
      let file = options.files[ i ];
      // if string is passed, convert it to `nodemailer` attachment object
      if (typeof file === 'string') {
        file = {
          path: file,
          //filename: path.basename( file ),
          //cid:      path.basename( file ),
        };
      }
      if (!file.path) {
        //const msg = 'file/filepath to attach must be set';
        //if (callback) callback(new Error(msg), msg, undefined);
        //return reject()
        return handleError('file/filepath to attach must be set');
      }
      if (typeof file.filename === 'undefined') file.filename = path.basename(file.path);
      if (typeof file.cid === 'undefined') file.cid = file.filename;
      // we do not validate if options.files[i] is really object and has valid properties
      // add to options.attachments used by `nodemailer`
      options.attachments.push(file);
    }
    delete options.files; // remove files property as incompatible with options of underlying `nodemailer`

    // from

    options.from = prepareAddress(options.from, options.user); // adjust to nodemailer format

    // to

    if (typeof options.to === 'string') {
      options.to = prepareAddress(options.to, options.to);   // adjust to nodemailer format

    } else if (Array.isArray(options.to)) {
      let to     = options.to.map((addr) => prepareAddress(addr, addr));
      options.to = to.join(',');
    }

    // Sending email

    //console.log('gmail-send: send(): mailOptions: ', options);
    return smtpTransport.sendMail(options, function (error, info) {
      if (error) {
        //console.log('gmail-send: send(): Error sending message:', error);
        //if (callback) callback(error);
        //return reject(error);
        return handleError(error);

      } else {
        //console.log("gmail-send: send(): Message sent: " + info.response);
        //if (callback) callback(null, info.response, info);
        //return resolve(info.response, info);
        return handleSuccess(info);
      }
    }); // smtpTransport.sendMail()

  } // function _send()


  /**
   * Send email
   *
   * You may use almost any option available in Nodemailer,
   * but if you need fine tuning I'd recommend to consider using Nodemailer directly.
   *
   * @param {sendOptions}  [options]  - options for underlying nodemailer
   * @param {sendCallback} [callback]
   * @return Promise({{ result: string, full: object }})
   */
  self.send = function (options, callback) {
    if (arguments.length === 1)
      if (typeof options === 'function') { // only callback function is provided
        callback = options;
        options  = {};
      }

    options = options || {};
    options = _.extend({}, self.options, options);
    if (!options.user || !options.pass) {
      throw new Error('options.user and options.pass are mandatory.');
    }


    if (callback) return _send(
      options,
      callback,
    );
    else return new Promise((resolve, reject) =>
      _send(
        options,
        (error, result, full) => error
                                 ? reject(error)
                                 : resolve({ result, full })
      ) // _send()
    ); // return new Promise()

  }; // self.send = function()

  return self;
};

//

/**
 * Exporting function to send email
 *
 * @param {sendOptions} options  - options for new GMailSend()
 * @returns {function}
 */
module.exports = function (options) {
  return new GMailSend(options).send;
};
