CREATE TABLE IF NOT EXISTS `servers` (
  `id` INTEGER PRIMARY KEY,
  `guild` VARCHAR(18) NOT NULL,
  `server_id` VARCHAR(76) NOT NULL,
  `server_name` VARCHAR(25) NOT NULL,
  `server_ip` VARCHAR(16) NOT NULL,
  `server_gameport` VARCHAR(6) NOT NULL,
  `server_rconport` VARCHAR(6) NOT NULL,
  `server_password` VARCHAR(25) NOT NULL,
  `server_authkey` VARCHAR(25) NOT NULL)