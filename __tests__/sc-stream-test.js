jest.autoMockOff();

var trackInfo = require('./sample-data');
var SCStream = require('../');
var scStream;

describe('creation', function() {
  it('should register a new SoundCloud API client', function() {
    var authenticateClient = SCStream.prototype.authenticateClient = jest.genMockFunction();
    var scStream = new SCStream('test-client-id');
    expect(authenticateClient).toBeCalledWith('test-client-id');
  });
});

describe('.stream', function() {
  beforeEach(function() {
    scStream = new SCStream('test-client-id');
  });

  it('should return a promise', function() {
    expect(typeof scStream.stream(trackInfo).then).toBe('function');
  });

  it('should call getTrackInfo if track is a URL', function() {
    var getTrackInfo = SCStream.prototype.getTrackInfo = jest.genMockFunction();
    
    scStream.stream(trackInfo.stream_url);
    expect(getTrackInfo).toBeCalledWith(trackInfo.stream_url);
  });

  it('should just resolve with passed in track info if object', function() {
    var getTrackInfo = SCStream.prototype.getTrackInfo = jest.genMockFunction();
    var createStream = SCStream.prototype.createStream = jest.genMockFunction();

    scStream.stream(trackInfo);
    expect(getTrackInfo).not.toBeCalled();
    expect(createStream).toBeCalledWith(trackInfo.stream_url);
  });
});

