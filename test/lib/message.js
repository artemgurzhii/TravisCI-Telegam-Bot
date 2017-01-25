import { describe, it } from 'mocha';
import { expect } from 'chai';
import Message from '../../src/lib/message';

describe('Should get message and user data', () => {
  const data = {
    from: {
      id: 123456789
    },
    text: 'Hello World'
  };

  const message = new Message(Message.mapMessage(data));

  describe('should set id and text message', () => {
		it('ID is correct', () => {
			expect(message.from).to.equal(123456789);
		});
		it('Text is correct', () => {
			expect(message.text).to.equal('Hello World');
		});
	});

});
