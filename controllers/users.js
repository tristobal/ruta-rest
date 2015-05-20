var pg = require('pg');
var moment = require('moment');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt');
var config = require('../config');
var connectionString = process.env.DATABASE_URL || config.DATABASE_POSTGRES_LOCAL;

exports.addUser = function(req, res) {

    var user = {
        email:    req.body.email,
        password: req.body.password,
        nickname: req.body.nickname
    };

    var salt = bcrypt.genSaltSync(config.SALT_WORK_FACTOR);
    user.password = bcrypt.hashSync(user.password, salt);

    pg.connect(connectionString, function(err, client, done) {
        var queryTxt = "INSERT INTO public.user (nickname, email, password, creation) values ($1, $2, $3, (now()::timestamp)) RETURNING id";
        client.query(queryTxt, [user.nickname, user.email, user.password], function(error, result) {
            if(error) {
                res.status(500).send(error);
            } else {
                var results = [];
                var idInserted = result.rows[0].id;
                var query = client.query("SELECT * FROM public.user WHERE id = $1", [idInserted]);
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

exports.getUser = function(req, res) {
    var email = req.body.email;
    email = email.toLowerCase();
    var password = req.body.password;

    pg.connect(connectionString, function(err, client, done) {
        var queryTxt = "SELECT id, password, nickname FROM public.user WHERE email = $1";
        client.query(queryTxt, [email], function(error, result) {
            if(error) {
                res.status(500).send(error);
            } else if (result.rows.length === 0) {
                res.status(500).send("User not found");
            } else {

                console.log(result.rows.length);
                var encryptedPassword = result.rows[0].password;

                if (bcrypt.compareSync(password, encryptedPassword)) {
                    var expires = moment().add(1, "days").unix();
                    var jsonClaims = {
                        "sub": result.rows[0].id,
                        "exp": expires
                    };
                    var token = jwt.sign(jsonClaims, config.PRIVATE_KEY, { algorithm: 'RS512' });
                    client.end();
                    res.status(200).json({
                        token : token,
                        expires : expires,
                        user : result.rows[0].nickname
                    });

                } else {
                    res.status(500).send("Incorrect password");
                }
            }
        });
    });
};

exports.update = function(req, res) {

    var user = {
        id:           req.params.id,
        email:        req.body.email,
        password:     req.body.password,
        nickname:     req.body.nickname,
        new_password: req.body.new_password
    };

    var salt = bcrypt.genSaltSync(config.SALT_WORK_FACTOR);
    user.new_password = bcrypt.hashSync(user.new_password, salt);

    pg.connect(connectionString, function(err, client, done) {
        var queryTxt = "SELECT password FROM public.user WHERE id = $1";
        client.query(queryTxt, [user.id], function(error, result) {
            if(error) {
                res.status(500).send(error);
            } else {
                var encryptedPassword = result.rows[0].password;

                if (bcrypt.compareSync(user.password, encryptedPassword)) {
                    queryTxt = "UPDATE public.user SET nickname = $1, email = $2, password = $3 WHERE id = $4";
                    client.query(queryTxt, [user.nickname, user.email, user.new_password, user.id], function(error, result) {
                        if(error) {
                            res.status(500).send(error);
                        } else {
                            var results = [];
                            var query = client.query("SELECT * FROM public.user WHERE id = $1", [user.id]);
                            query.on('row', function(row) {
                                results.push(row);
                            });

                            query.on('end', function() {
                                client.end();
                                res.status(200).jsonp(results);
                            });
                        }
                    });
                } else {
                    res.status(500).send("Incorrect password");
                }
            }
        });
    });
};

exports.delete = function(req, res) {
    pg.connect(connectionString, function(err, client, done) {
        var queryTxt = "DELETE FROM public.user WHERE id = $1";
        client.query(queryTxt, [req.params.id], function(error, result) {
            if(error) {
                res.status(500).send(error);
            } else {
                client.end();
                res.status(200).send("Deletion successful");
            }
        });
    });
};
