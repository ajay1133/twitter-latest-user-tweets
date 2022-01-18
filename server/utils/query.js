const connection = require("./connection.js");

const query = (sql, values = []) => {
    if (!(connection && connection.query && sql && typeof sql === 'string')) {
        return new Promise((resolve, reject) => {
            return resolve({ error: true });
        });
    }
    if (!Array.isArray(values)) {
        values = [];
    }
    return new Promise((resolve, reject) => {
        connection.query(sql, values, (err, result) => {
            if (err) {
                console.log(err);
                return resolve({ error: true });
            }
            return resolve(result);
        });
    });
}

module.exports = query;