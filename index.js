/**
 * Module dependencies
 */

import Promise from 'promise';
import requiresdk from 'require-sdk';

/**
 * Create new `SCStream`
 */

export default class SCStream {

  /**
   * Constuct a new `SCStream` and authenticate with SoundCloud API
   *
   * @param {String} clientId
   */

  constructor(clientId) {
    this.sdk = requiresdk('http://connect.soundcloud.com/sdk.js', 'SC');
    this._authenticate(clientId);
  }

  /**
   * Retrieve a `track`s information and create a stream.
   *
   * @param {String} track url to be played
   * @return {Promise} loaded track information and stream
   * @api public
   */

  stream(track) {
    return this._getTrackInfo(track).then(this._resolveStreamAndData.bind(this));
  }

  /**
   * Retrieve a `track`s information first, then create and return
   * a stream as a promise.
   *
   * @param {String} track
   * @returns {Object}
   *  - {Object} data
   *  - {Promise} stream promise
   * @api public
   */

  staggerStream(track) {
    return this._getTrackInfo(track).then((data) => {
      return {
        data: data,
        stream: this._createStream(data.stream_url)
      };
    });
  }

  /**
   * Register a new SoundCloud API `clientId`. Required for retrieving track information.
   *
   * @param {String} clientId
   * @api private
   */

  _authenticate(clientId) {
    this.sdk((err) => {
      if (err) throw new Error('SoundCloud API failed to load');
      window.SC.initialize({client_id: clientId});
    });
  }

  /**
   * Retrieve track information for `track`.
   *
   * @param {String} track url to be played
   * @return {Promise}
   * @api private
   */

  _getTrackInfo(track) {
    return new Promise((resolve, reject) => {
      this.sdk((err) =>{
        window.SC.get('/resolve', {url: track}, resolve);
      });
    });
  }

  /**
   * Create a new `stream` using a track `data` object, then return both.
   *
   * @param {Object} data track object
   * @returns {Promise}
   * @api private
   */

  _resolveStreamAndData(data) {
    return this._createStream(data.stream_url).then((stream) => {
      return {data: data, stream: stream};
    });
  }

  /**
   * Create a new audio stream.
   *
   * @param {String} streamUrl
   * @return {Promise}
   * @api private
   */

  _createStream(streamUrl) {
    return new Promise((resolve, reject) => {
      this.sdk((err) =>{
        window.SC.stream(streamUrl, resolve);
      });
    });
  }
}
