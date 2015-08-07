RUTA-REST
=========

API RESTful de La Ruta App (Node.js y Postgres).

##### Nota

Llaves generadas con:
```sh
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout server.key -out server.crt
```

Para crear la base de datos y el usuario local que concuerde con los valores definidos en config.js, ejecutar:
```sh
$ sudo -i -u postgres
$ createdb ruta
$ createuser -r -S -d dev
$ psql
postgres=# ALTER USER dev WITH PASSWORD 'pass123';
postgres=# \q
$ psql -h localhost -U dev -d ruta -f database.sql -W
$ psql
INSERT INTO list (name, creation) VALUES ('Ruta del Sanguche', (now()::timestamp));
```
