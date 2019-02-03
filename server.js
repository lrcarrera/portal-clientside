//Install express server
const express = require('express');
const path = require('path');

const app = express();

// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/ng7-pre'));

app.get('/*', function(req,res) {

res.sendFile(path.join(__dirname+'/dist/ng7-pre/index.html'));
});

var routes = require('./src/app/app-routing.module.ts'); //importing route
routes(app); //register the route

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);
