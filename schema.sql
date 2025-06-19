BEGIN TRANSACTION;
CREATE TABLE IF NOT EXISTS "advances" (
	"id"	integer NOT NULL,
	"amount"	integer NOT NULL,
	"reason"	varchar NOT NULL,
	"dateGiven"	datetime NOT NULL,
	"dateExpected"	datetime NOT NULL,
	"status"	varchar NOT NULL,
	"clerkId"	integer,
	"farmerId"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "FK_4008035f22fbcb6be1d918d2133" FOREIGN KEY("clerkId") REFERENCES "clerks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT "FK_e21ee3a030beae275361adff3c7" FOREIGN KEY("farmerId") REFERENCES "farmers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
CREATE TABLE IF NOT EXISTS "clerks" (
	"id"	integer NOT NULL,
	"firstName"	varchar(20) NOT NULL,
	"middleName"	varchar(20),
	"lastName"	varchar,
	"username"	varchar NOT NULL,
	"gender"	varchar NOT NULL,
	"phone"	integer NOT NULL,
	"email"	varchar NOT NULL,
	"password"	varchar NOT NULL,
	"avatar"	varchar,
	CONSTRAINT "UQ_d6b6447114e9af54cc775e04491" UNIQUE("email"),
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "UQ_bf8db35566365d26bec477939d7" UNIQUE("phone"),
	CONSTRAINT "UQ_292047cad2e6a93fab2ffd081f5" UNIQUE("username")
);
CREATE TABLE IF NOT EXISTS "deliveries" (
	"id"	integer NOT NULL,
	"deliveryCode"	varchar NOT NULL,
	"deliveryDate"	date NOT NULL,
	"quantity"	integer NOT NULL,
	"berryType"	varchar NOT NULL,
	"farmerNumber"	integer NOT NULL,
	"servedById"	integer,
	"farmerId"	integer,
	"harvestId"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "FK_bc259e772d469ef119c3ad52e82" FOREIGN KEY("farmerId") REFERENCES "farmers"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT "FK_cad31b2d322382afb231b0e80be" FOREIGN KEY("harvestId") REFERENCES "harvests"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT "FK_0ddbce52244e2f1c5e476813ae9" FOREIGN KEY("servedById") REFERENCES "clerks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
CREATE TABLE IF NOT EXISTS "events" (
	"id"	integer NOT NULL,
	"title"	varchar NOT NULL,
	"date"	date NOT NULL,
	"startTime"	varchar NOT NULL,
	"endTime"	varchar NOT NULL,
	"venue"	varchar NOT NULL,
	"description"	varchar NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "farmers" (
	"id"	integer NOT NULL,
	"firstName"	varchar NOT NULL,
	"middleName"	varchar,
	"lastName"	varchar NOT NULL,
	"farmerNumber"	integer NOT NULL,
	"phone"	integer NOT NULL,
	"email"	varchar NOT NULL,
	"nationalID"	integer NOT NULL,
	"coordinates"	varchar,
	"crop"	varchar NOT NULL,
	"paymentMode"	varchar NOT NULL,
	"avatar"	varchar,
	CONSTRAINT "UQ_8c59a48f4e0c003ed1394516bfa" UNIQUE("email"),
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "UQ_6fd2dc8c4eedaa249f96c64e3ff" UNIQUE("nationalID")
);
CREATE TABLE IF NOT EXISTS "harvests" (
	"id"	integer NOT NULL,
	"name"	varchar NOT NULL,
	"startDate"	datetime NOT NULL,
	"endDate"	datetime NOT NULL,
	"target"	integer,
	"seasonId"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "FK_72561cf7bc15e7de6657c7adafb" FOREIGN KEY("seasonId") REFERENCES "seasons"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
CREATE TABLE IF NOT EXISTS "inventory" (
	"id"	integer NOT NULL,
	"productName"	varchar NOT NULL,
	"category"	varchar NOT NULL,
	"quantity"	integer NOT NULL,
	"description"	varchar(150),
	"weight"	integer,
	"dateReceived"	datetime NOT NULL,
	"image"	varchar,
	"receivedById"	integer,
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "UQ_04c24eda257490dc9109de29829" UNIQUE("productName"),
	CONSTRAINT "FK_0ab2aa10387b57b215b54dd0f8c" FOREIGN KEY("receivedById") REFERENCES "clerks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
);
CREATE TABLE IF NOT EXISTS "inventory_item_update" (
	"id"	varchar NOT NULL,
	"updateType"	varchar(20) NOT NULL,
	"description"	varchar(255) NOT NULL,
	"reason"	varchar(255) NOT NULL,
	"quantity"	integer NOT NULL,
	"location"	varchar(255) NOT NULL,
	"updatedAt"	datetime NOT NULL,
	"itemId"	integer NOT NULL,
	"clerkId"	integer NOT NULL,
	PRIMARY KEY("id"),
	CONSTRAINT "FK_94f6f38893b21148ddb87c90636" FOREIGN KEY("clerkId") REFERENCES "clerks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT "FK_09be2130c025d115439df7be960" FOREIGN KEY("itemId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
CREATE TABLE IF NOT EXISTS "inventory_item_updates" (
	"id"	varchar NOT NULL,
	"updateType"	varchar(20) NOT NULL,
	"description"	varchar(255) NOT NULL,
	"reason"	varchar(255) NOT NULL,
	"quantity"	integer NOT NULL,
	"location"	varchar(255) NOT NULL,
	"updatedAt"	datetime NOT NULL,
	"itemId"	integer NOT NULL,
	"clerkId"	integer NOT NULL,
	PRIMARY KEY("id"),
	CONSTRAINT "FK_c2ad73520ed4426dbe9c9d63834" FOREIGN KEY("clerkId") REFERENCES "clerks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION,
	CONSTRAINT "FK_dec0ba3ea253c622379b52ea00c" FOREIGN KEY("itemId") REFERENCES "inventory"("id") ON DELETE CASCADE ON UPDATE NO ACTION
);
CREATE TABLE IF NOT EXISTS "managers" (
	"id"	integer NOT NULL,
	"firstName"	varchar(20) NOT NULL,
	"middleName"	varchar(20),
	"lastName"	varchar,
	"username"	varchar NOT NULL,
	"gender"	varchar NOT NULL,
	"phone"	integer NOT NULL,
	"email"	varchar NOT NULL,
	"password"	varchar NOT NULL,
	"avatar"	varchar,
	CONSTRAINT "UQ_8d5fd9a2217bf7b16bef11fdf83" UNIQUE("email"),
	PRIMARY KEY("id" AUTOINCREMENT),
	CONSTRAINT "UQ_2d9710b05598e31f31fcfbd1aa0" UNIQUE("phone"),
	CONSTRAINT "UQ_fccadd24fa0b0f7e1793ba007aa" UNIQUE("username")
);
CREATE TABLE IF NOT EXISTS "notifications" (
	"id"	integer NOT NULL,
	"title"	varchar NOT NULL,
	"category"	varchar NOT NULL,
	"message"	varchar NOT NULL,
	"date"	datetime NOT NULL,
	"seen"	boolean NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "reports" (
	"id"	integer NOT NULL,
	"reportName"	text NOT NULL,
	"dateGenerated"	date NOT NULL,
	"filePath"	text NOT NULL,
	"reportType"	text NOT NULL DEFAULT ('general'),
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "seasons" (
	"id"	integer NOT NULL,
	"name"	varchar NOT NULL,
	"startDate"	integer NOT NULL,
	"endDate"	integer NOT NULL,
	"target"	integer,
	"description"	varchar,
	PRIMARY KEY("id" AUTOINCREMENT)
);
CREATE TABLE IF NOT EXISTS "sessions" (
	"id"	varchar NOT NULL,
	"data"	varchar NOT NULL,
	"deletedAt"	datetime,
	PRIMARY KEY("id")
);
CREATE INDEX IF NOT EXISTS "inventory_item_update_location_idx" ON "inventory_item_update" (
	"location"
);
CREATE UNIQUE INDEX IF NOT EXISTS "inventory_item_update_pkey" ON "inventory_item_update" (
	"id"
);
COMMIT;
