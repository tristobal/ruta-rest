var pg = require('pg');
var config = require('../config');
var connectionString = process.env.DATABASE_URL || config.DATABASE_POSTGRES_LOCAL;

exports.addList = function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var queryTxt = "INSERT INTO list (id_user, name) values ($1, $2) RETURNING id";
        client.query(queryTxt, [req.body.id_user, req.body.name], function(error, result) {
            if(error) {
                res.status(500).send(error);
            } else {
                var results = [];
                var idInserted = result.rows[0].id;
                var query = client.query("SELECT * FROM list WHERE id = $1", [idInserted]);
                query.on('row', function(row) {
                    results.push(row);
                });
                query.on('end', function() {
                    client.end();
                    res.status(200).jsonp(results);
                });
            }
        });
    });
};


exports.getMyLists = function(req, res) {

};
