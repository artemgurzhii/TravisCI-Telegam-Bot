import pg from 'pg';
import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import UserInput from './input';
import Commands from '../handlers';
import Data from '../services';

/**
 * Initialize bot.
 * @class
 * @classdesc Listen and respond to received messages.
 */
export default class Messenger {

  /**
   * Set this.bot to new TelegramBot().
   */
	constructor() {
		this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
			polling: true
		});
	}

  /**
   * Listen for messages and fire response function on new message.
   */
	listen() {
		this.bot.on('text', this.handleText.bind(this));
		return Promise.resolve();
	}

   /**
    * Fired when message is received.
    * @param {Object} msg - Object containing info about sender(message text and user id).
    * @return {Function} Return function call depending on the received messag.
    */
	handleText(msg) {
    /**
     * Format the message.
     * Getting message sender and user id stored in message variable.
     * Initializing input(received message) and output(message to send, depends on input).
    */
		const message = new Message(Message.mapMessage(msg));
		const text = message.text;
    const input = new UserInput(text);
    const output = new Commands(this.bot, message);
    let link;

    // '/start' message is received.
		if (input.start()) {
			return output.start();
		}

		// '/how' message is received.
		if (input.isHelp()) {
			return output.help();
		}

    /**
     * If '/link' message is received.
     * Send link if it exist in db, else send message, that no links are being watched.
     * @return {undefined} Send message to user.
     */
		if (input.isLink()) {
      let results = [];
      pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        if (err) throw err;

        const query = client.query(
          'SELECT * FROM TravisCITelegamBot WHERE id=($1)',
          [message.from]
        );
        query.on('row', row => {
          results.push(row);
        });
        query.on('end', () => {
          if (!!results[0]) {
            output.link(results[0].url);
          } else {
            output.default('You have no watched links');
          }
          done();
        });
      });
      return;
    }

    /**
     * If '/start_watching' message is received.
     * @return {Promise} Send message to user.
     */
		if (input.isStart()) {
			return output.startWatching();
		}

    /**
     * If '/stop_watching' message is received.
     * @return {Promise} Send message to user.
     */
		if (input.isStop()) {
			return output.stopWatching();
		}

    /**
     * Checking if user send valid travis-ci link
     * @return {Promise} Send message to user.
     */
		if (input.isValidLink()) {
      const functions = new Data(text);
			const sliced = functions.sliceMsg(text);
      let results = [];
      link = text;

      pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        if (err) throw err;

        client.query(
          'INSERT INTO TravisCITelegamBot(id, url, json) values($1, $2, $3) ON CONFLICT DO NOTHING',
          [message.from, link, sliced.url]
        );
        client.query(
          'UPDATE TravisCITelegamBot SET url=($2), json=($3) WHERE id=($1)',
          [message.from, link, sliced.url]
        );

        const query = client.query(
          'SELECT * FROM TravisCITelegamBot'
        );
        query.on('row', row => {
          results.push(row);
        });
        query.on('end', () => {
          done();
          return output.data(results);
        });
      });;
		} else {
      // If unknown message/command was received
      return output.unknown();
    }
	}
}
