export default class Message {

  constructor(msg) {
    [this.from, this.text, this.user] = [msg.from, msg.text, msg.user];
  }

  static mapMessage(msg) {
    return {
      from: msg.from.id,
      text: msg.text
    }
  }

}
