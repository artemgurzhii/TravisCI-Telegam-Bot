import { describe, it } from "mocha";
import { expect } from "chai";
import config from "../../config/index";


describe('Config should get data from .env file', () => {
	describe('Each value should be set properly', () => {
		it('Testing token', () => {
			expect(config.telegram.token).to.equal('227706347:AAF-Iq5fV8L4JYdk3g5wcU-z1eK1dd4sKa0');
		});
		it('Testing port', () => {
			expect(config.telegram.port).to.equal('8000');
		});
		it('Testing host', () => {
			expect(config.telegram.host).to.equal('0.0.0.0');
		});
	});
});
