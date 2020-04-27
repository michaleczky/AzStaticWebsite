const express = require('express');
const session = require('express-session');
const getenv = require('getenv');
const parseArgs = require('minimist');
const path = require('path');
const winston = require('winston');
const passport = require('passport'), OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
const crypto = require('crypto');
const ensureLoggedIn = require('connect-ensure-login').ensureLoggedIn;

const argv = parseArgs(process.argv.slice(2));

const config = {
  port: argv['port'] || getenv('HTTP_PORT', 3000),
  loglevel: argv['loglevel'] || getenv('LOGLEVEL', 'debug'),
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

function extractUserId(accessToken, next) {
  next(null, crypto.createHash('md5').update(accessToken).digest('hex'));
}

function processOAuthResponse(accessToken, refreshToken, profile, next) {
  if (accessToken) {
    logger.info(`Successful oauth2 authentication.`);
    extractUserId(accessToken, (err, uid) => next(err, uid));
  } else {
    logger.error('Invalid access token.');
    next(new Error('User has no permission to access this site.'));
  } 
}

passport.use(new OAuth2Strategy({
  authorizationURL: config.authorizationURL,
  tokenURL: config.tokenUrl,
  clientID: config.clientId,
  clientSecret: config.clientSecret,
  callbackURL: config.callbackUrl,
  scope: ['profile', 'openid']
}, processOAuthResponse));

passport.serializeUser((uid, next) => {
  logger.debug(`serializing ${uid}`);
  next(null, uid);
});

passport.deserializeUser((uid, next) => {
  logger.debug(`deserializing ${uid}`);
  next(null, uid)
});

const app = express();
app.use(session({
  secret: 'dwd43883sfffddf'
}));
app.use(passport.initialize());
app.use(passport.session());
app.get('/auth/oauth2', passport.authenticate('oauth2'));
app.get('/auth/oauth2/callback',
  passport.authenticate('oauth2', { session: true, successReturnToOrRedirect: '/', failureRedirect: '/auth/error' })
);
app.get('/auth/error', (req, res) => res.send('Authentication error.'));
app.get('/*', 
  ensureLoggedIn('/auth/oauth2'), 
  express.static(path.join(__dirname, 'content'))
);
app.listen(config.port, () => logger.info(`App listening on port ${config.port}`)); 