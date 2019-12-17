#!/usr/bin/env node

/**
 * Module dependencies.
 */
const app = require('../app');
import http = require('http');
import https = require('https');
import fs = require('fs');

/**
 * Get port from environment and store in Express.
 */
const port: boolean | string | number = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Create HTTP / HTTPS server.
 */
const certs: {
  cert: Buffer;
  key: Buffer
} | undefined = fs.existsSync('/etc/letsencrypt/live/api.apothicare.io/fullchain.pem')
    && fs.existsSync('/etc/letsencrypt/live/api.apothicare.io/privkey.pem') ? {
  cert: fs.readFileSync('/etc/letsencrypt/live/api.apothicare.io/fullchain.pem'),
  key: fs.readFileSync('/etc/letsencrypt/live/api.apothicare.io/privkey.pem')
} : undefined ;
const server: http.Server | https.Server = certs === undefined ?
    http.createServer(app) :
    https.createServer(certs, app);
/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string): boolean | string | number {
  const port: number = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "message" event.
 */

function onError(error: any): void {
  if (error.syscall !== 'listen') {
    throw error;
  }

  const bind: string = typeof port === 'string'
      ? 'Pipe ' + port
      : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  if (process.env.DEBUG === 'true')
    console.log('[\x1b[31mINFO\x1b[0m] API : \x1b[32mOK\x1b[0m');
}
