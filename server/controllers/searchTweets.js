const query = require("../utils/query.js");

const searchTweets = async (req, res) => {
    const { search } = req.query;
    if (!search) {
        res.json({ data: [] });
        return;
    }
    try {
        const sql = `SELECT tweet FROM tweets WHERE tweet like "%${search}%"`;
        const tweets = await query(sql);
        if (tweets && !tweets.error && Array.isArray(tweets)) {
            res.json({ data: tweets });
        } else {
            res.json({ data: [] });
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports = searchTweets;