var fs = require('fs');
var public_key = fs.readFileSync(__dirname + '/keys/server.crt').toString('ascii');
var private_key = fs.readFileSync(__dirname + '/keys/server.key').toString('ascii');

module.exports = {
    TOKEN_SECRET : "tokensecreto",
    DATABASE_MONGOLABS: 'mongodb://user_db:pass_db@ds029051.mongolab.com:29051/mongotest',
    DATABASE_LOCAL: 'mongodb://localhost/jwttest',
    DATABASE_POSTGRES_LOCAL: 'postgres://dev:pass123@localhost:5432/ruta',
    SALT_WORK_FACTOR: 10,
    PRIVATE_KEY: private_key,
    PUBLIC_KEY: public_key,
    ID_LIST_RUTA: 1
};
