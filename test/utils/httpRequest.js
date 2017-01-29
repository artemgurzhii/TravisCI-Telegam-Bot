import { describe, it } from 'mocha';
import { expect } from 'chai';
import httpRequest from '../../src/utils/httpRequest';

const validURL = 'https://api.travis-ci.org/repositories/emberjs/ember.js.json';
const inValidURL = 'https://api.travis-ci.org/repositories/hello/ember.js.json';

describe('httpRequest test', () => {
  describe('Invalid url is passed', () => {
    it('Testing for invalid url', done => {
      try {
        httpRequest(inValidURL, (res, valid) => {
          expect(valid).to.equal(false);
          expect(res).to.equal('Please send valid link. Example: https://travis-ci.org/emberjs/ember.js');
        });
        setTimeout(done, 200);
      } catch (err) {
        done(err);
      }
    }).timeout(5000);
  });
  describe('Valid url is passed', () => {
    it('Testing for valid url', done => {
      try {
        httpRequest(validURL, (res, valid) => {
          expect(valid).to.equal(true);
        });
        setTimeout(done, 200);
      } catch (err) {
        done(err);
      }
    }).timeout(5000);
  });
});
