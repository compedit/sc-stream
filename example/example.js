/**
 * Module dependencies
 */

const SCStream = require('../');
const Promise = require('promise');

const scstream = new SCStream('5e687b50ccc60566b71bc47a42a2b169');

/**
 * Without staggering
 */

scstream.stream('https://soundcloud.com/baauer/one-touch').then((track) => {
  console.log('[regular] - received track:', track);
});

/**
 * With staggering
 */

scstream.staggerStream('https://soundcloud.com/baauer/one-touch')
  .then((track) => {
    console.log('[staggered] - received data:', track.data);
    return track.stream;
  })
  .then((stream) => {
    console.log('[staggered] - received stream:', stream);
  });
