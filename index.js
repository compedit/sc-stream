/**
 * Module dependencies
 */

var Promise = require('promise');
var requiresdk = require('require-sdk');
var sdk;

/**
 * Expose SCStream
 */

module.exports = SCStream;


/**
 * Initialize a new `SCStream` instance and authenticate with SoundCloud API
 *
 * @param {String} clientId
 * @api public
 */

function SCStream(clientId) {
  if (!(this instanceof SCStream)) return new SCStream(clientId);
  sdk = requiresdk('http://connect.soundcloud.com/sdk.js', 'SC');
  this.authenticateClient(clientId);
}

/**
 * Register a new SoundCloud API `clientId`. Required for retrieving track information.
 *
 * @param {String} clientId
 * @api private
 */

SCStream.prototype.authenticateClient = function(clientId) {
  sdk(function loadAPI(err) {
    if (err) throw new Error('SoundCloud API failed to load');
    window.SC.initialize({client_id: clientId});
  });
};

/**
 * Retrieve a `track`s information and create a stream.
 *
 * @param {String} track url to be played
 * @return {Promise} loaded track information and stream
 * @api public
 */

SCStream.prototype.stream = function(track) {
  return this.getTrackInfo(track).then(this.resolveStreamAndData.bind(this));
};

/**
 * Retrieve a `track`s information first, then create and return
 * a stream as a promise.
 *
 * @param {String} track
 * @returns {Object}
 *  - {Object} data
 *  - {Promise} stream promise
 */

SCStream.prototype.staggerStream = function(track) {
  var _this = this;
  return this.getTrackInfo(track).then(function(data) {
    return {
      data: data,
      stream: _this.createStream(data.stream_url)
    };
  });
};

/**
 * Retrieve track information for `track`.
 *
 * @param {String} track url to be played
 * @return {Promise}
 * @api private
 */

SCStream.prototype.getTrackInfo = function(track) {
  return new Promise(function(resolve, reject) {
    sdk(function loadAPI(err) {
      window.SC.get('/resolve', {url: track}, resolve);
    });
  });
};

/**
 * Create a new `stream` using a track `data` object, then return both.
 *
 * @param {Object} data track object
 * @returns {Promise}
 * @api private
 */

SCStream.prototype.resolveStreamAndData = function(data) {
  return this.createStream(data.stream_url).then(function(stream) {
    return {data: data, stream: stream};
  });
};

/**
 * Create a new audio stream.
 *
 * @param {String} streamUrl
 * @return {Promise}
 * @api private
 */

SCStream.prototype.createStream = function(streamUrl) {
  return new Promise(function(resolve, reject) {
    sdk(function loadAPI(err) {
      window.SC.stream(streamUrl, resolve);
    });
  });
};
