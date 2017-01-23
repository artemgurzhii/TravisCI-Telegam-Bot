import pg from 'pg';
import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import Config from '../config';
import UserInput from './input';
import Handlers from '../handlers';
import Data from '../services';

export default class Messenger {

	constructor() {
		this.bot = new TelegramBot(Config.telegram.token, {
			polling: true
		});
    this.handling = undefined;
    this.link = undefined;
	}

	listen() {
		this.bot.on('text', this.handleText.bind(this));
		return Promise.resolve();
	}

	handleText(msg) {
		// format the message
		const message = new Message(Message.mapMessage(msg));
		const text = message.text;
    const functions = new Data(text);
    const input = new UserInput(text);
    this.handling = new Handlers(this.bot, message);

		// if message is '/how'
		if (input.programHow()) {
			return this.handling.how();
		}

		// if message is '/link'
		if (input.programLink()) {
      if (this.link === undefined) {
        return this.handling.link('You have no watched links');
      }
      let results = [];
      pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        if (err) throw err;

        const query = client.query(
          'SELECT url FROM TravisCITelegamBot WHERE id=($1)', [message.from]
        );
        query.on('row', row => {
          results.push(row);
        });
        query.on('end', () => {
          done();
          // console.log(results);
          return this.handling.data(results);
        });
      });
      return this.handling.link(this.link);
		}

		// if message is '/start'
		if (input.programStart()) {
      if (this.link === undefined) {
        return this.handling.link('You have no watched links');
      }
			return this.handling.start();
		}

		// if message is '/stop'
		if (input.programStop()) {
      if (this.link === undefined) {
        return this.handling.link('You\'re not watching for any changes');
      }
			return this.handling.stop();
		}

		// checking if user send valid travis-ci link
		if (input.programValidLinkSended()) {
      let results = [];
      this.link = text;
			const sliced = functions.sliceMsg(text);

      pg.connect(process.env.DATABASE_URL, (err, client, done) => {
        if (err) throw err;

        client.query(
          'INSERT INTO TravisCITelegamBot(id, url, json) values($1, $2, $3) ON CONFLICT DO NOTHING',
          [message.from, this.link, sliced.url]
        );
        client.query(
          'UPDATE TravisCITelegamBot SET url=($2), json=($3) WHERE id=($1)',
          [message.from, this.link, sliced.url]
        );

        const query = client.query(
          'SELECT * FROM TravisCITelegamBot'
        );
        query.on('row', row => {
          results.push(row);
        });
        query.on('end', () => {
          done();
          return this.handling.data(results);
        });
      });
		}
	}
}
