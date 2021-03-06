/* setup.sql

  Set up database and tables.
  Run this: mysql -u username -p < setup.sql
  Or, from within the MySQL CLI: source /path/to/setup.sql

*/

CREATE DATABASE IF NOT EXISTS file_buy;
USE file_buy;

CREATE TABLE IF NOT EXISTS listings (
  preview BLOB DEFAULT NULL,
  email VARCHAR(100) NOT NULL,
  price DECIMAL(13,2) NOT NULL,
  id VARCHAR(36) DEFAULT UUID(),
  order_id char(17) DEFAULT NULL,
  name varchar(100) NOT NULL,
  size int(15) UNSIGNED NOT NULL,
  complete tinyint(2) NOT NULL DEFAULT 0,
  time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY ( id )
);

CREATE TABLE IF NOT EXISTS commissions (
  id VARCHAR(36) DEFAULT UUID(),
  steps TINYINT(4) UNSIGNED NOT NULL DEFAULT 1,
  email VARCHAR(100) NOT NULL,
  current INT(4) UNSIGNED NOT NULL DEFAULT 1,
  PRIMARY KEY ( id )
);

CREATE TABLE IF NOT EXISTS steps (
  commission_id VARCHAR(36),
  sequence_number TINYINT(4) NOT NULL,
  price DECIMAL(13,2) NOT NULL,
  preview BLOB DEFAULT NULL,
  name VARCHAR(100) DEFAULT NULL,
  status TINYINT(3) NOT NULL DEFAULT 0,
  title VARCHAR(100) NOT NULL DEFAULT "Milestone",
  description TEXT NOT NULL DEFAULT "No description provided.",
  order_id char(17) DEFAULT NULL
);