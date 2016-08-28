import getTravisData from '../common'

describe('getTravisData', function() {
  describe('Should send request to normal link, if user add spaces or other characters in message', function() {
    it('Should log 1', function () {
      [1,2,3].indexOf(5).should.equal(-1);
    });
  });
});
