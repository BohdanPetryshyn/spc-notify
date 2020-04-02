const http = require('http');

const HISTORY_HOST = process.env.HISTORY_HOST || 'http://localhost:8080';

module.exports = () => {
  return new Promise((resolve, reject) => {
    http.get(HISTORY_HOST, res => {
      if (res.statusCode < 200 || res.statusCode >= 300) {
        reject(
          new Error(`Request failed with status code = ${res.statusCode}`)
        );
      }
      resolve(res);
    });
  });
};
