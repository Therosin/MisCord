// Copyright (C) 2021 Theros @[MisModding|SvalTek]
// 
// This file is part of MisCord.
// 
// MisCord is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
// 
// MisCord is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
// 
// You should have received a copy of the GNU General Public License
// along with MisCord.  If not, see <http://www.gnu.org/licenses/>.


const express = require('express')
const path = require('path');
const mds = require('markdown-serve');
const app = express();
const port = 8080;


const apigateway = require('./API/apigateway')

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(
	mds.middleware({
		rootDirectory: path.resolve(__dirname, 'Public'),
		view: 'markdown'
	})
);

app.use('/api', apigateway)

app.listen(port, () => console.info(`apiServer listening on port ${port}!`));
