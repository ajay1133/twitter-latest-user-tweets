# Twitter Process And Search Tweets Application

This sample demonstrates the following use cases:
## Project setup

Use `npm` to install the project dependencies:

```bash
npm install
```
### Configure credentials

Create Mysql Database 
Create table tweets with at least following columns

-- id, BigInt(20) Primary Key, Auto Increment
-- tweet_id, BigInt(20)
-- user_id, BigInt(20)
-- tweet, Varchar(500)
-- next_token, Varchar(500)

Pre load your config.json with you db credentials

The project needs to be configured with your Auth0 domain and client ID in order for the authentication flow to work.

To do this, first copy `src/auth_config.json.example` into a new file in the same folder called `src/auth_config.json`, do the same with `config/config.json`. Finally replace the values with your own Auth0 application credentials, and optionally the base URLs of your application and API:

```json
Your authConfig.json
{
  "domain": "{YOUR AUTH0 DOMAIN}",
  "clientId": "{YOUR AUTH0 CLIENT ID}",
  "audience": "{YOUR AUTH0 API_IDENTIFIER}",
  "auth0_management_clientId": "{YOUR AUTH0 MANAGEMENT API CLIENTID}",
  "auth0_management_clientSecret": "{YOUR AUTH0 MANAGEMENT API CLIENT SECRET}"
}
```

**Note**: Do not specify a value for `audience` here if you do not wish to use the API part of the sample.

```json
Your config.json
{
  "twitter_app_bearer_token": "{YOUR TWITTER APP BEARER TOKEN}",
  "db_host": "{YOUR DATABASE HOST}",
  "db_user": "{YOUR DATABASE USER HAVING WRITE ACCESS}",
  "db_password": "{YOUR DATABASE USER PASSWORD HAVING WRITE ACCESS}",
  "db_database": "{YOUR DATABASE}",
  "twitter_api_limit": "{MAX_RESULTS_TO_FETCH_FROM_TWITTER_API}"
}
```

**Note**: You must have access to Twitter Developer Account and should create a application having callback url configured with your Auth0 tenant

## Run the sample

### Compile and hot-reload for development

This compiles and serves the React app and starts the backend API server on port 3001.

```bash
npm run dev
```

## Deployment

### Compiles and minifies for production

```bash
npm run build
```

### Docker build

To build and run the Docker image, run `exec.sh`, or `exec.ps1` on Windows.

### Run your tests

```bash
npm run test
```

## Frequently Asked Questions

If you're having issues running the sample applications, including issues such as users not being authenticated on page refresh, please [check the auth0-react FAQ](https://github.com/auth0/auth0-react/blob/master/FAQ.md).

## What is Auth0?

Auth0 helps you to:

* Add authentication with [multiple sources](https://auth0.com/docs/identityproviders), either social identity providers such as **Google, Facebook, Microsoft Account, LinkedIn, GitHub, Twitter, Box, Salesforce** (amongst others), or enterprise identity systems like **Windows Azure AD, Google Apps, Active Directory, ADFS, or any SAML Identity Provider**.
* Add authentication through more traditional **[username/password databases](https://auth0.com/docs/connections/database/custom-db)**.
* Add support for **[linking different user accounts](https://auth0.com/docs/users/user-account-linking)** with the same user.
* Support for generating signed [JSON Web Tokens](https://auth0.com/docs/tokens/json-web-tokens) to call your APIs and **flow the user identity** securely.
* Analytics of how, when, and where users are logging in.
* Pull data from other sources and add it to the user profile through [JavaScript rules](https://auth0.com/docs/rules).

## Create a Free Auth0 Account

1. Go to [Auth0](https://auth0.com) and click **Sign Up**.
2. Use Google, GitHub, or Microsoft Account to login.

## Issue Reporting

If you have found a bug or if you have a feature request, please report them at this repository issues section. Please do not report security vulnerabilities on the public GitHub issue tracker. The [Responsible Disclosure Program](https://auth0.com/responsible-disclosure-policy) details the procedure for disclosing security issues.

## Author

Ajay Sharma

## License

This project is licensed under the MIT license. See the [LICENSE](../LICENSE) file for more info.
