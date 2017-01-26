import { describe, it } from 'mocha';
import { expect } from 'chai';
import Data from '../../src/services/index';

describe('Functions should work properly', () => {
	const request = new Data(
		'https://travis-ci.org/emberjs/ember.js'
	);
	const url = request.sliceMsg();

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

	describe('Testing https request function', () => {
		describe('Wrong passed url for request should return error', () => {
			const request = new Data(
				null,
				'https://api.travis-ci.org/repositories/helloworld/helloworld.json'
			);
			it('should return error as this repository does not exist', done => {
				try {
					request.req((res, isWatching) => {
						expect(res).to.equal('You have send invalid link, please send valid link');
						expect(isWatching).to.equal(false);
						done();
					});
				} catch (err) {
					done(err);
				}
			});
		});
    describe('Correct passed url for request', () => {
			const request = new Data(
				null,
				'https://api.travis-ci.org/repositories/emberjs/ember.js.json'
			);
			it('x', done => {
				try {
          request.currBuild = 1;
					request.req((res, isWatching) => {
						// expect(res).to.equal('You have send invalid link, please send valid link');
						done();
					});
				} catch (err) {
					done(err);
				}
			});
		});
	});
});
