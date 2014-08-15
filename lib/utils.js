/**
 * Determine if `url` is a valid SoundCloud URL
 *
 * @param {String} url
 * @return {Boolean}
 */

exports.isTrackUrl = function(url) {
  return typeof url === 'string' && url.indexOf('soundcloud.com') > 0;
}

/**
 * Determine if `track` is a valid track object
 *
 * @param {Object} track
 * @return {Boolean}
 */

exports.isTrackObject = function(track) {
  return typeof track === 'object' && isStreamingUrl(track.stream_url);   
}

/**
 * Determine if `url` is a valid SoundCloud streaming URL
 *
 * @param {String} url
 * @return {Boolean}
 */

function isStreamingUrl(url) {
  return typeof url === 'string' && url.indexOf('api.soundcloud.com') > 0;
}