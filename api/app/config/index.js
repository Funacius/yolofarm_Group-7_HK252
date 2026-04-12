const dotenv = require("dotenv");
dotenv.config();

export default {
  port: process.env.PORT,
  databaseURL: process.env.DATABASE_URI,
  mailchimp: {
    apiKey: process.env.MAILCHIMP_API_KEY,
    sender: process.env.MAILCHIMP_SENDER,
  },
};
