/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
const sqlite = require('sqlite');
const path = require('path');
const fs = require('fs');

module.exports = class Database {
	constructor(client) {
		this.client = client;
	}
};