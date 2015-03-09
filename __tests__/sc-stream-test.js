jest.dontMock('../');

describe('SCStream', () => {
  const requiresdk = require('require-sdk');
  const SCStream = require('../');

  let sdkMock;
  let scstream;

  beforeEach(() => {

    /**
     * Mock out API loading util
     */

    sdkMock = jest.genMockFunction().mockImplementation((cb) => cb());

    requiresdk.mockImplementation(() => sdkMock);

    /**
     * Mock out SoundCloud API
     */

    window.SC = {
      initialize: jest.genMockFunction(),

      get: jest.genMockFunction().mockImplementation((u, t, cb) => {
        cb({
          stream_url: 'a streaming url'
        });
      }),

      stream: jest.genMockFunction().mockImplementation((url, cb) => {
        cb('a stream');
      })
    };

    scstream = new SCStream('sc-client-id');
  });

  it('should raise an error if the SoundCloud API fails to load', () => {
    sdkMock.mockImplementation((cb) => cb('error'));
    expect((() => { new SCStream();})).toThrow('SoundCloud API failed to load');
  });

  it('should load the SoundCloud API when initialized', () => {
    expect(requiresdk.mock.calls[0][0]).toBe('http://connect.soundcloud.com/sdk.js');
    expect(requiresdk.mock.calls[0][1]).toBe('SC');
    expect(sdkMock.mock.calls.length).toBe(1);
  });


  it('should authenticate a new soundcloud client', () => {
    expect(window.SC.initialize.mock.calls[0][0].client_id).toBe('sc-client-id');
  });

  it('should retrieve track information', () => {
    scstream.getTrackInfo('https://soundcloud.com/baauer/one-touch');
    expect(window.SC.get.mock.calls[0][1].url).toBe('https://soundcloud.com/baauer/one-touch');
  });

  it('should create a new audio stream', () => {
    scstream.createStream('a streaming url');
    expect(window.SC.stream.mock.calls[0][0]).toBe('a streaming url');
  });

  pit('should retrieve track info and create a stream', () => {
    return scstream.stream('https://soundcloud.com/baauer/one-touch')
      .then((track) => {
        expect(track.data).toEqual({stream_url: 'a streaming url'});
        expect(track.stream).toBe('a stream');
      });
  });

  pit('should be able to stagger loading track info & stream', () => {
    return scstream.staggerStream('https://soundcloud.com/baauer/one-touch')
      .then((track) => {
        expect(track.data).toEqual({stream_url: 'a streaming url'});
        expect(track.stream.then).toBeDefined(); // track.stream is a promise
        return track.stream;
      })
      .then((stream) => {
        expect(stream).toBe('a stream');
      });
  });
});
