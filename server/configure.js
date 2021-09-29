var path = require('path'),
    routes = require('./routes'),
    exphbs = require('express-handlebars'),
    express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    morgan = require('morgan'),
    methodOverride = require('method-override'),
    errorHandler = require('errorhandler'),
    moment = require('moment'),
    multer = require('multer');
const Handlebars = require('handlebars'); // *
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

module.exports = function(app) {
    app.engine('handlebars', exphbs.create({  //핸들바 하기 위해 , 왜 핸들바? -> 동적페이지 npnp
        defaultLayout:'main',
        handlebars: allowInsecurePrototypeAccess(Handlebars), // *
        layoutsDir: app.get('views')+'/layouts',
        partialsDir : [app.get('views')+'/partials'],
        helpers:{
            timeago: function(timestamp){
                return moment(timestamp).startOf('minute').fromNow(); //moment 라는 모듈 사용
            }
        }
    }).engine);
    app.set('view engine', 'handlebars');

    app.use(bodyParser()); // body-paser : POST된 것중 body 부분을 파싱함. 
    app.use(morgan('dev'));
    app.use(multer({ dest: path.join(__dirname, 'public/upload/temp')}));

    app.use(methodOverride());
    app.use(cookieParser('some-secret-value-here'));
    routes(app);
    app.use('/public/', express.static(path.join(__dirname, '../public')));

    if ('development' === app.get('env')) {
       app.use(errorHandler());
    }

    return app;
};