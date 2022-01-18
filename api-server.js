const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const jwt = require("express-jwt");
const jwksRsa = require("jwks-rsa");
const axios = require("axios");
const authConfig = require("./src/auth_config.json");
const config = require("./config/config.json");
const app = express();

const port = process.env.API_PORT || 3001;
const appPort = process.env.SERVER_PORT || 3000;
const appOrigin = authConfig.appOrigin || `http://localhost:${appPort}`;

const connection = require("./server/utils/connection.js");
const processTweets = require("./server/controllers/processTweets.js");
const searchTweets = require("./server/controllers/searchTweets.js");

if (
  !authConfig.domain ||
  !authConfig.audience ||
  authConfig.audience === "YOUR_API_IDENTIFIER"
) {
  console.log(
    "Exiting: Please make sure that auth_config.json is in place and populated with valid domain and audience values"
  );
  process.exit();
}

app.use(morgan("dev"));
app.use(helmet());
app.use(cors({ origin: appOrigin }));

// Set up db connection
(async () => {
  const useDb = await new Promise((resolve, reject) => {
    connection.connect((err) => {
      if (err) {
        resolve({ 'error': true });
      }
      return connection.query('USE ??', [config.db_database], (err, result) => {
        if (err) {
          return resolve({ 'error': true });
        }
        return resolve(result);
      });
    });
  });
  if (useDb.error) {
    return console.error('Unable to establish MySQL connection');
  } else {
    console.log('MYSQL connection established successfully');
  }
})();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),
  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ["RS256"],
});

const authTwitter = async (req, res, next) => {
  if (!req.user) {
    throw new Error('Invalid User');
  }
  const subList = req.user.sub && typeof req.user.sub === 'string' ? req.user.sub.split('|') : [];
  req.user.user_id = subList.length > 1 ? subList[1] : null;
  if (!req.user.user_id) {
    throw new Error('Invalid User Id');
  }
  const url = `https://${authConfig.domain}/oauth/token`;
  try {
    const token = process.env.AUTH0_MANAGEMENT_API_TOKEN;
    const postData = {
      client_id: authConfig.auth0_management_clientId,
      client_secret: authConfig.auth0_management_clientSecret,
      audience: `https://${authConfig.domain}/api/v2/`,
      grant_type: "client_credentials"
    };
    const config = {
      headers: {
        "Content-type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    };
    const result = await axios.post(url, postData, config);
    if (!(result && result.data && result.data.access_token)) {
      return;
    }
    req.user.access_token = result.data.access_token;
    next();
  } catch (e) {
    console.log(e);
  }
};

// Routes
app.get("/api/test-server", (req, res) => {
  res.send({
    msg: `API Server listening on port ${port}`,
  });
});
// Search Tweets
app.get("/api/search-tweets", searchTweets);
// Health check jwt
app.get("/api/test-auth0-token", checkJwt, (req, res) => {
  res.send({
    msg: "Your auth0 access token was successfully validated!",
  });
});
// Health check twitter middleware authentication
app.get("/api/test-twitter-token", checkJwt, authTwitter, (req, res) => {
  res.send({
    msg: "Your twitter access token was successfully validated!",
  });
});
// Process tweets
app.get("/api/process-tweets", checkJwt, authTwitter, processTweets);

app.listen(port, () => console.log(`API Server listening on port ${port}`));
