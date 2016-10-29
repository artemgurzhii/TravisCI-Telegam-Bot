require("dotenv").config();

export default {
	telegram: {
		token: process.env.TELEGRAM_TOKEN || "",
		port: process.env.PORT,
		host: process.env.HOST
	}
};
