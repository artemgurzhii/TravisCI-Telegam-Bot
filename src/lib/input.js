export default class UserInput {

	// if message text matching "/how"
	programHow(text) {
		return text.match("/how");
	}

	// if message text matching /link"
	programLink(text) {
		return text.match("/link");
	}

	// if message text matching "/start"
	programStart(text) {
		return text.match("/start");
	}

	// if message text matching "/stop"
	programStop(text) {
		return text.match("/stop");
	}

	// if message text is valid link
	programValidLinkSended(text) {
		return text.match(/https:\/\/travis-ci\.org\/\S+\/\S+$/);
	}

}
