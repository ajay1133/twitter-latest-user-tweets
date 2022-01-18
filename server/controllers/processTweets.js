const axios = require('axios');
const query = require('../utils/query.js');
const config = require("../../config/config.json");

const processTweets = async (req, res) => {
    let nextToken = null;
    const lastTweetsSet = new Set();
    try {
        const sql = `
            SELECT id, tweet_id, next_token FROM tweets
            WHERE user_id = ? ORDER BY id DESC LIMIT ?
        `;
        const lastTweets = await query(sql, [req.user.user_id, config.twitter_api_limit]);
        if (lastTweets && !lastTweets.error && Array.isArray(lastTweets) && lastTweets.length) {
            nextToken = lastTweets[0].next_token || null;
            lastTweets.forEach(v => {
                if (!v.tweet_id) {
                    return false;
                }
                lastTweetsSet.add(BigInt(v.tweet_id));
            });
        }
    } catch (e) {
        // Do nothing
    }
    console.log(lastTweetsSet);
    let params = {
        max_results: config.twitter_api_limit,
        "tweet.fields": "created_at"
    };
    const options = {
        headers: {
            authorization: `Bearer ${config.twitter_app_bearer_token}`
        }
    };
    try {
        const resp = await getPage(req, params, options, nextToken);
        if (!(resp && resp.meta && resp.meta.result_count && resp.meta.result_count > 0)) {
            throw new Error('Invalid timeline api response = ', resp);
        }
        if (resp.meta.next_token) {
            nextToken = resp.meta.next_token;
        }
        const response = Array.isArray(resp.data) ? resp.data : [];
        const promises = [];
        const filteredResponse = [];
        for (let i = 0; i < response.length; i++) {
            if (lastTweetsSet.has(BigInt(Number(response[i].id)))) {
                continue;
            }
            filteredResponse.push(response[i]);
            const sql = `INSERT INTO tweets (tweet_id, user_id, tweet, next_token) VALUES (?, ?, ?, ?)`;
            promises.push(
                query(sql, [response[i].id, req.user.user_id, response[i].text, nextToken])
            );
        }
        await Promise.all(promises);
        res.json({
            fetched_count: response.length,
            filtered_count: filteredResponse.length,
            data: filteredResponse
        });
    } catch (e) {
        console.log(e);
    }
};

const getPage = async (req, params, options, nextToken) => {
    if (nextToken) {
        params.pagination_token = nextToken;
    }
    try {
        let url = `https://api.twitter.com/2/users/${req.user.user_id}/mentions`;
        if (params) {
            const
                paramsKeys = Object.keys(params),
                paramsValues = Object.values(params);
            for (let i = 0; i < paramsKeys.length; i++) {
                url += (i === 0 ? '?' : '&') + paramsKeys[i] + '=' + paramsValues[i];
            }
        }
        const resp = await axios.get(url, options);
        if (!(resp && resp.status === 200)) {
            throw new Error('Invalid response = ', resp);
        }
        return resp.data;
    } catch (err) {
        throw new Error(`Request failed: ${err}`);
    }
};

module.exports = processTweets;