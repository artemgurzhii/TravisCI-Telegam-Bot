import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import UserInput from './input';
import Commands from '../handlers';
import sliceMsg from '../utils/sliceMessage';
import store from '../db';

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
    this.store = store();
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
      this.store
				.then(value => value.selectURL(message.from))
				.then(value => {
					if (!!value[1]) {
						output.link(value[1].url);
					} else {
						output.default('You have no watched links');
					}
				});
			return;
		}

		/**
		 * If '/start_watching' message is received.
     * Change watching state to true.
		 * @return {Promise} Send message to user.
		 */
		if (input.isStart()) {
      this.store
        .then(database => database.watchingState(message.from, true));
			return output.startWatching();
		}

		/**
		 * If '/stop_watching' message is received.
     * Change watching state to false.
		 * @return {Promise} Send message to user.
		 */
		if (input.isStop()) {
      this.store
        .then(database => database.watchingState(message.from, false));
			return output.stopWatching();
		}

		/**
		 * Checking if user send valid travis-ci link
		 * @return {Promise} Send message to user.
     * If record already exist in db - update it with new link
     * Else create new record
     * Select all from db(Array) and pass it as argument, to send request function
		 */
		if (input.isValidLink()) {
			const json = sliceMsg(text);
			this.store
        .then(database => Promise.all([database, database.selectURL(message.from)]))
				.then(([database, url]) => {
					if (url[0] && url[0].url) {
						database.update(message.from, text, json);
					} else {
						database.insert(message.from, text, json);
					}
					return database;
				})
        .then(value => value.selectAll())
        .then(users => output.data(users));
		} else {
			// If unknown message/command was received
			return output.unknown();
		}
	}
}
