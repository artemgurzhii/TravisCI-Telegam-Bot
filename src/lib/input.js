export default class UserInput {

	// message is '/how'
	programHow(msg) {
		return msg.match("/how");
	}

	// message is 'link'
	programLink(msg) {
		return msg.match("/link");
	}

	// message is "/'tart'
	programStart(msg) {
		return msg.match("/start");
	}

	// message is "'stop'
	programStop(msg) {
		return msg.match("/stop");
	}

	// message is valid link
	programValidLinkSended(msg) {
		return msg.match(/https:\/\/travis-ci\.org\/\S+\/\S+$/);
	}

}
