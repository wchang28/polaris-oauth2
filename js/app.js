var fs = require('fs');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var noCache = require('no-cache-express');
var multer = require('multer');
var services_1 = require('./services');
var express_web_server_1 = require('express-web-server');
var app = express();
app.use(noCache);
// "application/x-www-form-urlencoded" parser 
app.use(bodyParser.urlencoded({ extended: false }));
// "application/json" parser
app.use(bodyParser.json({ 'limit': '100mb' }));
// "multipart/form-data" parser
var upload = multer({ dest: 'uploads/' });
var muitipartFormDataParser = upload.single('avatar');
app.use(muitipartFormDataParser);
// local testing configuraton
var local_testing_config = JSON.parse(fs.readFileSync(__dirname + '/' + 'local_testing_config.json', 'utf8'));
var config = null;
// argv[2] is config file
if (process.argv.length < 3)
    config = local_testing_config;
else
    config = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
//console.log(JSON.stringify(config));
app.set('jsonp callback name', 'cb');
app.set('global', {
    config: config
});
function servicesMiddleware(req, res, next) {
    req["companyName"] = config.companyName;
    req["authorizeBaseEndpoint"] = config.authorizeBaseEndpoint;
    req["cipherSecret"] = config.cipherSecret;
    req["reCaptchaSettings"] = config.reCaptchaSettings;
    next();
}
app.use('/services', servicesMiddleware, services_1.Router);
app.use('/bower_components', express.static(path.join(__dirname, '../bower_components'))); // bower_components
app.use('/login', express.static(path.join(__dirname, '../login'))); // login UI
express_web_server_1.startServer(config.webServerConfig, app, function (secure, host, port) {
    console.log('app server listening at %s://%s:%s', (secure ? 'https' : 'http'), host, port);
});
