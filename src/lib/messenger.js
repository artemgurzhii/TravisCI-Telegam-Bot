import TelegramBot from 'node-telegram-bot-api';
import Message from './message';
import Config from '../config';
import UserInput from './input';
import Handlers from '../handlers';

import all from '../services/index'

const input = new UserInput();
const functions = new all();
const command = new Handlers();

let link;

export default class Messenger {

  constructor() {
    if (process.env.NODE_ENV === 'production') {
      this.bot = new TelegramBot(Config.telegram.token, { webHook: { port: Config.telegram.port, host: Config.telegram.host } });
      this.bot.setWebHook(`${Config.telegram.externalUrl}:443/bot${Config.telegram.token}`);
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
      return command.how(this.bot, message);
    }

    // checking if asked "/link"
    if (input.programLink(text)) {
      return link ? command.link(this.bot, message, link) : command.link(this.bot, message, 'You have no watched links');
    }

    // checking if asked "/start"
    if (input.programStart(text)) {
      return command.start(this.bot, message);
    }

    // checking if asked "/stop"
    if (input.programStop(text)) {
      return command.stop(this.bot, message);
    }

    // checking if user send valid travis-ci link
    if (input.programValidLinkSended(text)) {
      link = text;
      const sliced = functions.sliceMsg(text);
      return command.data(this.bot, message, sliced.url);
    }

    // default - send message with help
    return command.how(this.bot, message);
  }
}
