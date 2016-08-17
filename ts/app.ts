import * as fs from 'fs';
import * as express from 'express';
import * as path from 'path';
import * as bodyParser from 'body-parser';
import noCache = require('no-cache-express');
import * as multer from 'multer';
import {Router as servicesRouter} from './services';
import {IWebServerConfig, startServer} from 'express-web-server';
import {IAppConfig} from './appConfig';
import {IGlobal} from './global';

let app = express();

app.use(noCache);

// "application/x-www-form-urlencoded" parser 
app.use(bodyParser.urlencoded({ extended: false }));
// "application/json" parser
app.use(bodyParser.json({'limit': '100mb'}));
// "multipart/form-data" parser
let upload = multer({ dest: 'uploads/' });
let muitipartFormDataParser = upload.single('avatar');
app.use(muitipartFormDataParser);

// local testing configuraton
var local_testing_config = JSON.parse(fs.readFileSync(__dirname + '/../local_testing_config.json', 'utf8'));

let config:IAppConfig = null;
// argv[2] is config file
if (process.argv.length < 3)
	config = local_testing_config;
else
	config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));

//console.log(JSON.stringify(config));

app.set('jsonp callback name', 'cb');

let g: IGlobal = {
	config: config
};
app.set('global', g);

app.use('/services', servicesRouter);
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components')));	// bower_components
app.use('/login', express.static(path.join(__dirname, '../login')));	// login UI

startServer(config.webServerConfig, app, (secure:boolean, host:string, port:number) => {
	console.log('oauth2 server listening at %s://%s:%s', (secure ? 'https' : 'http'), host, port);
});