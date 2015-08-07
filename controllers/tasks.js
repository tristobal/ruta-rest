var pg = require('pg');
var config = require('../config');
var connectionString = process.env.DATABASE_URL || config.DATABASE_POSTGRES_LOCAL;

exports.getTasksByList = function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {

            var query = client.query("SELECT * FROM task WHERE id_list = $1 ORDER BY name", [req.params.id_list]);
            var results = [];
            query.on('row', function(row) {
                results.push(row);
            });

            query.on('end', function() {
                client.end();
                res.status(200).json(results);
            });
        }
    });
};

exports.getTaskById = function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {

            var query = client.query("SELECT * FROM task WHERE id = $1", [req.params.id_task]);
            var results = [];
            query.on('row', function(row) {
                results.push(row);
            });

            query.on('end', function() {
                client.end();
                res.status(200).json(results[0]);
            });
        }
    });
};

exports.addTask = function(req, res) {

    pg.connect(connectionString, function(err, client, done) {
        var queryTxt = "INSERT INTO task (id_user, id_list, name, notes, lat, long, address, creation) values ($1, $2, $3, $4, $5, $6, $7, (now()::timestamp)) RETURNING id";
        client.query(queryTxt, [req.body.id_user, req.body.id_list, req.body.name, req.body.notes, req.body.lat, req.body.long, req.body.address], function(error, result) {
            if(error) {
                console.log("ERROR al agregar tarea." + error);
                res.status(500).send(error);
            } else {
                var results = [];
                var idInserted = result.rows[0].id;
                var query = client.query("SELECT * FROM task WHERE id = $1", [idInserted]);
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

exports.update = function(req, res) {
    var idTask = req.params.id_task;
    pg.connect(connectionString, function(err, client, done) {
        var queryTxt = "UPDATE task SET name = $1, notes = $2, lat = $3, long = $4, address = $5, done = $6 WHERE id = $7";
        client.query(queryTxt, [req.body.name, req.body.notes, req.body.lat, req.body.long, req.body.address, req.body.done, idTask], function(error, result) {
            if(error) {
                console.log("ERROR al editar tarea." + error);
                res.status(500).send(error);
            } else {
                var results = [];
                var query = client.query("SELECT * FROM task WHERE id = $1", [idTask]);
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

exports.delete = function(req, res) {
    var idTask = req.params.id_task;
    pg.connect(connectionString, function(err, client, done) {
        var queryTxt = "DELETE FROM task WHERE id = $1";
        client.query(queryTxt, [idTask], function(error, result) {
            if(error) {
                console.log("ERROR al borrar tarea." + error);
                res.status(500).send(error);
            } else {
                var query = client.query("SELECT * FROM task WHERE id_list = $1 ORDER BY name", [config.ID_LIST_RUTA]);
                var results = [];
                query.on('row', function(row) {
                    results.push(row);
                });

                query.on('end', function() {
                    client.end();
                    res.status(200).json(results);
                });
            }
        });
    });
};
