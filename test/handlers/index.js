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

  describe('All commands should return/send message', () => {
    it('Message /start was received', () => {
			expect(output.start()).to.contain('Hi, my nams is @TravisCI_Telegam_Bot');
		});
    it('Message /help was received', () => {
			expect(output.help()).to.contain('You send me your Tavis CI repository link.');
		});
    it('Message /link was received', () => {
      const link = output.link('hello.world');
			expect(link).to.equal('hello.world');
		});
    it('Message /start_watching was received', () => {
			expect(output.startWatching()).to.equal('Ok, since now I will watch for changes.');
		});
    it('Message /stop_watching was received', () => {
			expect(output.stopWatching()).to.contain('Ok, since now I will stop watching for changes.');
		});
    it('Should return passed argument', () => {
      const def = output.default('hello.world');
			expect(def).to.equal('hello.world');
		});
    it('Unknown message was received', () => {
			expect(output.unknown()).to.equal('Unknown command.');
		});
	});
});
