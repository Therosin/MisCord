// APIServ
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
