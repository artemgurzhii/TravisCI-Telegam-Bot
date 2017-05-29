import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import Input from './input';
import Output from './output';
import helpers from '../utils/helpers';
import store from '../db';

/**
 * Initialize bot.
 * @class
 * @classdesc Listen and respond to received messages.
 */
export default class Messenger {

	/**
	 * Initialize new Telegram Bot and database.
	 */
	constructor() {
		this.bot = new TelegramBot(process.env.TELEGRAM_TOKEN, {
			polling: true
		});
    this.store = store();
	}

	/**
	 * Listen for messages and fire response function when new mesage is received.
   * @return {Promise} Resolving promise.
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
     * Get message text text and message sender id.
		 * Initialize input(received message) and output(message to send depends on input).
		 */
		const message = new Message(Message.mapMessage(msg));
		const text = message.text;
		const input = new Input(text);
		const output = new Output(this.bot, message);

		// '/start' message is received.
		if (input.start()) {
			return output.start();
		}

		// '/how' message is received.
		if (input.isHelp()) {
			return output.help();
		}

    // '/watch_all_builds' message is received.
    if (input.watchAllBuilds()) {
      this.store
        .then(db => {
          db.buildsToNotify(message.from, false);
          return db;
        })
        .then(db => db.selectAll())
        .then(users => output.data(users, false));
      return output.watchBuilds();
    }

    // '/watch_only_failing_builds' message is received.
    if (input.watchOnlyFailingBuilds()) {
      this.store
        .then(db => {
          db.buildsToNotify(message.from, true);
          return db;
        })
        .then(db => db.selectAll())
        .then(users => output.data(users, false));
      return output.watchBuilds('only failed');
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
					if (!!value[0]) {
						output.link(value[0].url);
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
        .then(db => {
          db.watchingState(message.from, true);
          return db;
        })
        .then(db => db.selectAll())
        .then(users => output.data(users, false));
			return output.changeWatchingState('start');
		}

		/**
		 * If '/stop_watching' message is received.
     * Change watching state to false.
		 * @return {Promise} Send message to user.
		 */
		if (input.isStop()) {
      this.store
        .then(db => {
          db.watchingState(message.from, false);
          return db;
        })
        .then(db => db.selectAll())
        .then(users => output.data(users, false));
			return output.changeWatchingState('stop');
		}

		/**
		 * Check if user send valid Travis-CI link.
     * If invalid link was received, returned json is going to have file property.
     * If valid link was received create new record or update existing.
     * Select all from db(Array) and pass it as argument, to send request function.
		 * @return {Promise} Send message to user.
		 */
		if (input.isValidLink()) {
			const json = helpers.jsonURL(text);

      helpers
        .getJSON(json)
        .then(data => {
          if (data.file) {
            output.wrongLink(message.from);
            this.store.then(db => db.delete(message.from));
          } else {
            const fields = [message.from, text, json, data.last_build_number - 1];
            this.store
              .then(db => Promise.all([db, db.selectURL(message.from)]))
              .then(([db, url]) => {
                if (url[0]) {
                  db.update(...fields);
                } else {
                  db.insert(...fields);
                }
                return db;
              })
              .then(db => db.selectAll())
              .then(users => output.data(users, true));
            }
      });
		} else {
			// If unknown message/command was received
			return output.unknown();
		}
	}
}
