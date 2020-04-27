
## Getting Started

### Run from Command Line

To run the service you must provide the following configuration as commandline parameters or environment variables:

| Parameter    | Envvar        | Description                                                                                      |
|--------------|---------------|--------------------------------------------------------------------------------------------------|
| port         | HTTP_PORT     | Listen on this port (default: 3000)                                                              |
| https        | HTTPS         | Allow HTTPS connections (server.key and server.cert file needed, default: false)                 |
| clientid     | CLIENT_ID     | OAuth2 provider's client ID                                                                      |
| clientsecret | CLIENT_SECRET | OAuth2 provider's client secret                                                                  |
| callbackurl  | CALLBACK_URL  | callback url to return after the login (for example: http://localhost:3000/auth/oauth2/callback) |
| loglevel     | LOGLEVEL      | set log verbosity level (*debug*, info, warning, error) [optional]                               |
| https        | HTTPS         | Enable https (true, *false*)                                                                     |

Example:

`npm run start:dev -- --clientid="<client id here>" --clientsecret="<secret here>" --callbackurl="http://localhost:3000/auth/oauth2/callback"`

`npm run start -- --clientid="<client id here>" --clientsecret="<secret here>" --callbackurl="https://<server FQDN>:3000/auth/oauth2/callback" --https=true`

### Enable SSL

Generate the key and cert file in the server's root directory (provide the server's FQDN when openssl asks):

`openssl req -nodes -new -x509 -keyout server.key -out server.cert`

And start the server with `--https=true` parameter.

### Run in a Container

Build the docker container from the dockerfile:

`docker build -t <containername> .`

Run the docker container locally on port 3000:

`docker run -e "CLIENT_ID=<client id here>" -e "CLIENT_SECRET=<secret here>" -e "CALLBACK_URL=http://localhost:3000/auth/oauth2/callback" --publish 3000:3000 <containername>`

## References

- [Quickstart: Add sign in using OpenID Connect to a Node.js web app](https://docs.microsoft.com/en-us/azure/active-directory/develop/quickstart-v2-nodejs-webapp)
- [Passport.js OAuth documentation](http://www.passportjs.org/docs/oauth/)
- [Passport-OAuth2 plugin](https://github.com/jaredhanson/passport-oauth2)
- [OAuth 2 with Passport - 10 Steps Recipe](https://www.pveller.com/oauth2-with-passport-10-steps-recipe/)