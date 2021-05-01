const morgan = require('morgan');
const chalk =  require('chalk');

function padLeft(str, len) {
  return len > str.length
      ? (new Array(len - str.length + 1)).join(' ') + str
      : str
}
function padRight(str, len) {
  return len > str.length
      ? str + (new Array(len - str.length + 1)).join(' ')
      : str
}
const methodColors = {
  "GET": "blue",
  "POST": "green",
  "PUT": "yellow",
  "DELETE": "red"
};

const morganMiddleware = morgan(function (tokens, req, res) {
  const date = tokens.date(req, res);
  const dateColor = 'white';

  const method = padRight(tokens.method(req, res), 6);
  const methodColor = methodColors[tokens.method(req, res)];

  const url = padRight(tokens.url(req, res), 50);
  const urlColor = 'white';

  const status = tokens.status(req, res);
  const statusColor = status >= 500 ? 'red' : status >= 400 ? 'yellow' : status >= 300 ? 'cyan' : 'green';

  //const responseTime = padLeft(tokens['response-time'](req, res), 7);
  const responseTimeColor = 'white';

  const remoteAddress = tokens['remote-addr'](req, res);
  const remoteAddressColor = 'gray';
  return [
    chalk[dateColor](date),
    chalk[methodColor].bold(method),
    chalk[urlColor].bold(url),
    chalk[statusColor].bold(status),
    // chalk[responseTimeColor](responseTime + ' ms (' + padLeft(tokens.res(req, res, 'content-length') || "-", 5) + ' bytes)'),
    chalk[remoteAddressColor](remoteAddress),
  ].join(' ');
});

module.exports = morganMiddleware;
