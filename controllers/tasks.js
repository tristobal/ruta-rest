var pg = require('pg');
var config = require('../config');
var connectionString = process.env.DATABASE_URL || config.DATABASE_POSTGRES_LOCAL;

exports.getTasksByList = function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {

            var query = client.query("SELECT id, name, visited FROM task WHERE id_list = $1 ORDER BY name", [req.params.id_list]);
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

exports.findById = function(req, res) {
    /*Place.findById(req.params.id).populate('author').exec(function(err, tvshow) {
        if(err) return res.send(500, err.message);

        console.log('GET /place/' + req.params.id);
        res.status(200).jsonp(tvshow);
    });*/
};

exports.addTask = function(req, res) {

    req.body.
    pg.connect(connectionString, function(err, client, done) {
        var queryTxt = "INSERT INTO task (id_user, id_list, name, notes, lat, long, address, creation) values ($1, $2, $3, $4, $5, $6, $7, (now()::timestamp)) RETURNING id";
        client.query(queryTxt, [], function(error, result) {
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



    /*console.log('POST');
    console.log(req.body);

    var place = new Place({
        name:         req.body.name,
        location:     req.body.location,
        address:      req.body.address,
        notes:        req.body.notes,
        author:       mongoose.Types.ObjectId(req.body.author),
        //creation:     req.body.creation,
        visited:      req.body.visited,
        geoplacedata: JSON.stringify(req.body.geoplacedata)
    });

    place.save(function(err, placeResp) {
        if(err) return res.send(500, err.message);
        res.status(200).jsonp(placeResp);
    });*/
};

exports.update = function(req, res) {
    /*Place.findByIdAndUpdate(req.params.id, req.body, function(err, post) {
        if (err) {
            return res.send(500, err.message);
        } else if (post) {
            res.status(200).json({ message: 'Successfully updated' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    });*/
};

exports.delete = function(req, res) {
    /*Place.findByIdAndRemove(req.params.id, function(err, post) {
        if (err) {
            return res.send(500, err.message);
        } else if (post) {
            res.status(200).json({ message: 'Successfully deleted' });
        } else {
            res.status(404).json({ message: 'Record not found' });
        }
    });*/
};
