/**
 * Module dependencies
 */

var requiresdk = require('require-sdk');
var Promise = require('es6-promise').Promise;

/**
 * Create SoundCloud SDK loader
 */

var sdk = requiresdk('http://connect.soundcloud.com/sdk.js', 'SC');

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
  this.authenticateClient(clientId);
}

/**
 * Register a new SoundCloud API `clientId`. Required for retrieving track information.
 *
 * @param {String} clientId
 * @api private
 */

SCStream.prototype.authenticateClient = function(clientId) {
  sdk(function loadAPI(err, SC) {
    if (err) throw new Error('SoundCloud API failed to load');
    SC.initialize({client_id: clientId});
  });
};

/**
 * Stream a track. Accepts either a SoundCloud streaming url, or preloaded
 * track information.
 *
 * @param {String|Object} track
 * @return {Function} loaded track information and stream promise
 * @api public
 */

SCStream.prototype.stream = function(track) {
  var _this = this;
  return new Promise(function(resolve, reject) {
    if (isTrackUrl(track)) {
      _this.getTrackInfo(track).then(function(trackInfo) {
        resolve({
          track: trackInfo, 
          stream: _this.createStream(trackInfo.stream_url)
        });
      });
    } else if (isTrackObject(track)) {
      resolve({
        track: track, 
        stream: _this.createStream(track.stream_url)
      });
    } else {
      reject(new Error('Invalid track'));
    }
  });
};

/**
 * Retrieve track information for a `trackUrl`
 *
 * @param {String} trackUrl
 * @return {Function} promise
 * @api public
 */

SCStream.prototype.getTrackInfo = function(trackUrl) {
  return new Promise(function(resolve, reject) {
    sdk(function loadAPI(err, SC) {
      SC.get('/resolve', {url: trackUrl}, resolve);
    });
  });
};

/**
 * Create a new audio stream
 *
 * @param {String} streamUrl
 * @return {Function} promise
 * @api public
 */

SCStream.prototype.createStream = function(streamUrl) {
  return new Promise(function(resolve, reject) {
    sdk(function loadAPI(err, SC) {
      SC.stream(streamUrl, resolve);
    });
  });
};

/**
 * Determine if `track` is a track object
 *
 * @param {Object|String} track
 * @return {Boolean}
 */

function isTrackObject(track) {
  return typeof track === 'object' && isTrackUrl(track.stream_url);
}

/**
 * Determine if `track` is a valid streaming URL
 *
 * @param {Object|String} track
 * @return {Boolean}
 */

function isTrackUrl(track) {
  return typeof track === 'string'; //&& extra stuff later
}