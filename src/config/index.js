require('dotenv').config();

export default {
  telegram: {
    token: process.env.TELEGRAM_TOKEN || '',
    port: process.env.PORT || 3000,
    host: process.env.HOST
  }
};
