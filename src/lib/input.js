export default class UserInput {

  constructor(msg) {
    this.msg = msg;
  }

  // If message is '/how'
	programHow() {
		return this.msg.match('/how');
	}

  // If message is '/link'
	programLink() {
		return this.msg.match('/link');
	}

  // If message is '/start'
	programStart() {
		return this.msg.match('/start');
	}

	// If message is '/stop'
	programStop() {
		return this.msg.match('/stop');
	}

  // If user send valid Travis-CI link
	programValidLinkSended() {
		return this.msg.match(/https:\/\/travis-ci\.org\/\S+\/\S+$/);
	}

}
