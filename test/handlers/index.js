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

  // const db = [{
  //   id: 111111111,
  //   url: 'https://travis-ci.org/emberjs/ember.js',
  //   json: 'https://api.travis-ci.org/repositories/emberjs/ember.js.json'
  // }, {
  //   id: 222222222,
  //   url: 'https://travis-ci.org/angular/angular',
  //   json: 'https://api.travis-ci.org/repositories/angular/angular.json'
  // }];
  //
  // describe('data', () => {
  //   it('data', () => {
  //     const link = output.data(db);
  //     expect(output.watching).to.equal(true);
  //   });
  // });

});
