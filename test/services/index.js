import https from 'https';
import { describe, it } from 'mocha';
import { expect } from 'chai';
import Data from '../../src/services/index';

const instance = new Data();
const url = instance.sliceMsg('https://travis-ci.org/emberjs/ember.js');

describe('Functions should work properly', () => {

	// Testing 'sliceMsg' function
	describe('sliceMsg function should correctly slice string and return data', () => {

		it('Returned url for https request', () => {
			expect(url.url).to.equal('https://api.travis-ci.org/repositories/emberjs/ember.js.json');
		});
		it('Returned user name', () => {
			expect(url.id).to.equal('emberjs');
		});
		it('Returned user repository', () => {
			expect(url.repository).to.equal('ember.js');
		});
	});

	// Testing 'req' function
	describe('testing https request function', () => {
		it('should return json file without "file" field', done => {
			try {
				instance.req(url.url, res => {
					let matching = res.startsWith('Hi, your build at https://travis-ci.org/emberjs/ember.js');
					expect(matching).to.be.true;
					done();
				});
			} catch (err) {
				done(err);
			}
		});
	});
});
