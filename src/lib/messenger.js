import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import Config from '../config';
import UserInput from './input';
import Handlers from '../handlers';
import All from '../services/index';

const input = new UserInput();
const functions = new All();
const handling = new Handlers();

let link;

export default class Messenger {

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      // this.bot = new TelegramBot(Config.telegram.token, { webHook: { port: Config.telegram.port, host: Config.telegram.host } });
      // this.bot.setWebHook(`${Config.telegram.externalUrl}:443/bot${Config.telegram.token}`);
      this.bot = new TelegramBot(Config.telegram.token, { polling: true });
    } else {
      this.bot = new TelegramBot(Config.telegram.token, { polling: true });
    }

  }

  listen() {
    this.bot.on('text', this.handleText.bind(this));
    return Promise.resolve();
  }

  handleText(msg) {

    // format the message
    const message = new Message(Message.mapMessage(msg));
    const text = message.text;

    // checking if asked "/how"
    if (input.programHow(text)) {
      return handling.how(this.bot, message);
    }

    // checking if asked "/link"
    if (input.programLink(text)) {
      return link ? handling.link(this.bot, message, link) : handling.link(this.bot, message, 'You have no watched links');
    }

    // checking if asked "/start"
    if (input.programStart(text)) {
      return handling.start(this.bot, message);
    }

    // checking if asked "/stop"
    if (input.programStop(text)) {
      return handling.stop(this.bot, message);
    }

    // checking if user send valid travis-ci link
    if (input.programValidLinkSended(text)) {
      link = text;
      const sliced = functions.sliceMsg(text);
      return handling.data(this.bot, message, sliced.url);
    }

    // default - send message with help
    return handling.how(this.bot, message);
  }
}
