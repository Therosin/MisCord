/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const sqlite = require('sqlite');
const path = require('path');
const fs = require('fs');

module.exports = class sqlite3Database {
	constructor(client) {
		this.client = client;

		sqlite
			.open(path.join(__dirname, '../data/database.sqlite3'))
			.then(db => {
				this.connection = db;

				fs.readFile('./setup-database.sql', 'utf8', async (err, data) => {
					if (err) {
						return this.client.logger.error(`Failed to open setup sql file: ${err}`);
					}

					try {
						await this.connection.run(data);
						this.client.logger.info('Database setup complete...');
					} catch (err) {
						this.client.logger.error(`Could not setup database: ${err}`);
					}
				});
			})
			.catch(err => {
				this.client.logger.error(err);
			});
	}
};