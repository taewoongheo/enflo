require('dotenv').config();

module.exports = ({ config }) => {
  return {
    ...config,
    router: {
      root: './app',
    },

    extra: {
      EMAIL_API_URL: process.env.EMAIL_API_URL,
      EMAIL_API_SECRET_KEY: process.env.EMAIL_API_SECRET_KEY,
    },
  };
};
