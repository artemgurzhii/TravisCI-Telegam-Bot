import { describe, it } from 'mocha';
import { expect } from 'chai';
import UserInput from '../../src/lib/input';

describe('Respond message is depends on received message', () => {

  describe('/how', () => {
		it("'/how' message is received", () => {
      const input = new UserInput('/how');
			expect(input.isHow()).to.equal(true);
		});
		it("'random/how' message is received", () => {
      const input = new UserInput('random/how');
			expect(input.isHow()).to.equal(false);
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

  describe('/start', () => {
		it("'/start' message is received", () => {
      const input = new UserInput('/start');
			expect(input.isStart()).to.equal(true);
		});
		it("'random/start' message is received", () => {
      const input = new UserInput('random/start');
			expect(input.isStart()).to.equal(false);
		});
	});

  describe('/stop', () => {
		it("'/stop' message is received", () => {
      const input = new UserInput('/stop');
			expect(input.isStop()).to.equal(true);
		});
		it("'random/stop' message is received", () => {
      const input = new UserInput('random/stop');
			expect(input.isStop()).to.equal(false);
		});
	});

  describe('TravisCI link', () => {
		it("'https://travis-ci.org/emberjs/ember.js' message is received", () => {
      const input = new UserInput('https://travis-ci.org/emberjs/ember.js');
			expect(input.isValidLink()).to.equal(true);
		});
		it("'travis-ci.org/emberjs/ember.js' message is received", () => {
      const input = new UserInput('travis-ci.org/emberjs/ember.js');
			expect(input.isValidLink()).to.equal(false);
		});
	});

});
