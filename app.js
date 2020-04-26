const express = require('express');
const getenv = require('getenv');
const parseArgs = require('minimist');
const path = require('path');
const winston = require('winston');
const passport = require('passport'), OAuth2Strategy = require('passport-oauth').OAuth2Strategy;

const argv = parseArgs(process.argv.slice(2));

const config = {
  port: argv['port'] || getenv('HTTP_PORT', 3000),
  loglevel: argv['loglevel'] || getenv('LOGLEVEL', 'info'),
  clientId: argv['clientid'] || getenv('CLIENT_ID', ''),
  clientSecret: argv['clientsecret'] || getenv('CLIENT_SECRET', ''),
  callbackUrl: argv['callbackurl'] || getenv('CALLBACK_URL', ''),
  authorizationURL: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
  tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
  graphApiUrl: 'https://graph.microsoft.com'
};

const logger = winston.createLogger({
  level: config.loglevel,
  format: winston.format.simple(),
  transports: [ new winston.transports.Console() ]
});

if (!config.clientId || !config.clientSecret || !config.callbackUrl ) {
  logger.error('Invalid configuration.');
  process.exit(-1);
}

function verifyUser() {

}

passport.use(new OAuth2Strategy({
  authorizationURL: config.authorizationURL,
  tokenURL: config.tokenUrl,
  clientID: config.clientId,
  clientSecret: config.clientSecret,
  callbackURL: config.callbackUrl,
  scope: ['profile', 'openid', 'https://graph.microsoft.com/mail.read']
}, (accessToken, refreshToken, profile, callback) => {
  logger.info(`succesfull oauth2 authentication, profile.id: ${profile.id}`);
  callback();
  }
));

const app = express();
app.use(express.static('content'));
app.get('/auth/oauth2', passport.authenticate('oauth2'));
app.get('/auth/oauth2/callback',
  passport.authenticate('oauth2', { successRedirect: '/',
                                      failureRedirect: '/login' }));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + 'content/index.html'));
});
app.listen(config.port, () => logger.info(`App listening on port ${config.port}`));