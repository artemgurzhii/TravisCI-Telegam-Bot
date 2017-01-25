import { describe, it } from 'mocha';
import { expect } from 'chai';
import Commands from '../../src/handlers/index';

describe('All commands available to user', () => {
  const bot = {
    sendMessage(id, text) {
      return text;
    }
  };

  const message = {
    from: 123456789,
    text: 'https://travis-ci.org/emberjs/ember.js'
  };

  const output = new Commands(bot, message);

  describe('Link command', () => {
		it('link1', () => {
      const link = output.link('hello.world');
			expect(link).to.equal('hello.world');
		});
	});

  describe('Watching state variable', () => {
    it('watch state should be true after initializing', () => {
      expect(output.watching).to.equal(true);
    });
  });

  describe('Watching state should be changed to false', () => {
    it('watch state should changed to false', () => {
      const state = output.stop();
      expect(output.watching).to.equal(false);
    });
  });

  describe('Watching state should be changed to true', () => {
    it('watch state should changed to false true', () => {
      const link = output.start();
      expect(output.watching).to.equal(true);
    });
  });

});
