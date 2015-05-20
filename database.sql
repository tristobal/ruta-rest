CREATE TABLE "user" (
    "id"  SERIAL ,
    "nickname" VARCHAR NOT NULL DEFAULT 'NULL' ,
    "email" VARCHAR NOT NULL DEFAULT 'NULL' ,
    "password" VARCHAR NOT NULL DEFAULT 'NULL' ,
    "notifications" BOOLEAN NOT NULL DEFAULT 'true' ,
    "creation" TIMESTAMP WITHOUT TIME ZONE ,
    PRIMARY KEY ("id"),
    CONSTRAINT unique_email UNIQUE (email)
);

CREATE TABLE "task" (
    "id"  SERIAL ,
    "id_user" INTEGER ,
    "id_list" INTEGER ,
    "name" VARCHAR NOT NULL DEFAULT 'NULL' ,
    "notes" VARCHAR ,
    "lat" double precision ,
    "long" double precision ,
    "address" VARCHAR ,
    "done" BOOLEAN NOT NULL DEFAULT 'false' ,
    "creation" TIMESTAMP WITHOUT TIME ZONE ,
    PRIMARY KEY ("id")
);

CREATE TABLE "list" (
    "id"  SERIAL ,
    "name" VARCHAR NOT NULL DEFAULT 'NULL' ,
    "creation" TIMESTAMP WITHOUT TIME ZONE ,
    PRIMARY KEY ("id")
);

CREATE TABLE "member" (
    "id_user" INTEGER ,
    "id_list" INTEGER ,
    "owner" BOOLEAN NOT NULL DEFAULT 'false' ,
    PRIMARY KEY ("id_user", "id_list")
);

ALTER TABLE "task" ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id");
ALTER TABLE "task" ADD FOREIGN KEY ("id_list") REFERENCES "list" ("id");
ALTER TABLE "member" ADD FOREIGN KEY ("id_user") REFERENCES "user" ("id");
ALTER TABLE "member" ADD FOREIGN KEY ("id_list") REFERENCES "list" ("id");
