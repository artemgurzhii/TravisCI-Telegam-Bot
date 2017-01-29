import { describe, it } from 'mocha';
import { expect } from 'chai';
import sliceMsg from '../../src/utils/sliceMessage';

describe('Should correctly slice message', () => {
  it('Should get id, repository and request url', () => {
    const sliced = sliceMsg('https://travis-ci.org/emberjs/ember.js');
    expect(sliced).to.equal('https://api.travis-ci.org/repositories/emberjs/ember.js.json');
  });
});
