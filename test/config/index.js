import { describe, it } from 'mocha';
import { expect } from 'chai';
import config from '../../src/config/index';


describe('Config should get data from .env file', () => {
	describe('Each value should be set properly', () => {
		it('Testing port', () => {
			expect(config.telegram.port).to.equal('8000');
		});
		it('Testing host', () => {
			expect(config.telegram.host).to.equal('0.0.0.0');
		});
	});
});
