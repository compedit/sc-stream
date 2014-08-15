jest.dontMock('../lib/utils');
jest.dontMock('./sample-data');

var utils = require('../lib/utils');
var sampleData = require('./sample-data');

describe('.isTrackUrl', function() {
  it('should reject anything that isnt a string', function() {
    var testUrl = {not: 'a track'};
    expect(utils.isTrackUrl(testUrl)).toBe(false);
  });

  it('should reject URLS that arent from SoundCloud', function() {
    var testUrl = 'http://youtube.com/v/jksdflsdflsdjfld';
    expect(utils.isTrackUrl(testUrl)).toBe(false);
  });

  it('should accept valid SoundCloud URLs', function() {
    var testUrl = sampleData.permalink_url;
    expect(utils.isTrackUrl(testUrl)).toBe(true);
  });
});

describe('.isTrackObject', function() {
  it('should reject anything that isnt an object', function() {
    var testTrack = 'not an object.';
    expect(utils.isTrackObject(testTrack)).toBe(false);
  });

  it('should reject track objects without a valid stream url', function() {
    var testTrack = {stream_url: sampleData.permalink_url};
    expect(utils.isTrackObject(testTrack)).toBe(false);
  });

  it('should accept valid track objects', function() {
    var testTrack = sampleData;
    expect(utils.isTrackObject(testTrack)).toBe(true);
  });
});