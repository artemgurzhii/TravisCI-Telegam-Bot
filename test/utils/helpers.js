import { describe, it } from 'mocha';
import { expect } from 'chai';
import helpers from '../../src/utils/helpers';

describe('Testing if helpers works as expected', () => {
  describe('getJSON shoud return parsed json object', () => {
    it('correct url was passed', () => { helpers.getJSON('https://api.travis-ci.org/repositories/artemgurzhii/TravisCI-Telegam-Bot/builds/197018374.json')
        .then(value => {
          expect(value.id).to.equal(197018374);
        });
    });
  });

  describe('Message should be sliced correctly', () => {
    it('Should get id, repository and request url', () => {
      const sliced = helpers.jsonURL('https://travis-ci.org/emberjs/ember.js');
      expect(sliced).to.equal('https://api.travis-ci.org/repositories/emberjs/ember.js.json');
    });
  });

  describe('Get started and ended at time', () => {
    it('Time is parsed properly', () => {
      const json = {
        last_build_started_at: '2017-01-31T15:54:39Z',
        last_build_finished_at: '2017-01-31T16:10:36Z',
      };
      const time = helpers.getTime(json);
      expect(time[0]).to.equal('15:54:39');
      expect(time[1]).to.equal('16:10:36');
    });
  });
});
