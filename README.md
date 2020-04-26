
## Getting Started

To run the service you must provide the following configuration as commandline parameters or environment variables:

| Parameter    | Envvar        | Description                                                                                      |
|--------------|---------------|--------------------------------------------------------------------------------------------------|
| clientid     | CLIENT_ID     | OAuth2 provider's client ID                                                                      |
| clientsecret | CLIENT_SECRET | OAuth2 provider's client secret                                                                  |
| callbackurl  | CALLBACK_URL  | callback url to return after the login (for example: http://localhost:3000/auth/oauth2/callback) |
| loglevel     | LOGLEVEL      | set log verbosity level (debug, info, warning, error) [optional]                                 |

Example:

`npm run start -- --clientid="<client id here>" --clientsecret="<secret here>" --callbackurl="http://localhost:3000/auth/oauth2/callback"`

## References

- [Quickstart: Add sign in using OpenID Connect to a Node.js web app](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v2-nodejs-webapp)
- [Passport.js OAuth documentation](http://www.passportjs.org/docs/oauth/)
- [Passport-OAuth2 plugin](https://github.com/jaredhanson/passport-oauth2)