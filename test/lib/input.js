import { describe, it } from 'mocha';
import { expect } from 'chai';
import UserInput from '../../src/lib/input';

describe('Respond message is depends on received message', () => {

  describe('/help', () => {
		it("'/help' message is received", () => {
      const input = new UserInput('/help');
			expect(input.isHelp()).to.equal(true);
		});
		it("'random/help' message is received", () => {
      const input = new UserInput('random/help');
			expect(input.isHelp()).to.equal(false);
		});
	});

  describe('/link', () => {
		it("'/link' message is received", () => {
      const input = new UserInput('/link');
			expect(input.isLink()).to.equal(true);
		});
		it("'random/link' message is received", () => {
      const input = new UserInput('random/link');
			expect(input.isLink()).to.equal(false);
		});
	});

  describe('/start_watching', () => {
		it("'/start_watching' message is received", () => {
      const input = new UserInput('/start_watching');
			expect(input.isStart()).to.equal(true);
		});
		it("'random/start_watching' message is received", () => {
      const input = new UserInput('random/start_watching');
			expect(input.isStart()).to.equal(false);
		});
	});

  describe('/stop_watching', () => {
		it("'/stop_watching' message is received", () => {
      const input = new UserInput('/stop_watching');
			expect(input.isStop()).to.equal(true);
		});
		it("'random/stop' message is received", () => {
      const input = new UserInput('random/stop');
			expect(input.isStop()).to.equal(false);
		});
	});

  describe('TravisCI link', () => {
		it('valid link is received', () => {
      const input = new UserInput('https://travis-ci.org/hello/world');
			expect(input.isValidLink()).to.equal(true);
		});
		it('link without https is not valid', () => {
      const input = new UserInput('travis-ci.org/hello/world');
			expect(input.isValidLink()).to.equal(false);
		});
	});

});
