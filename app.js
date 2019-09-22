const express = require('express');
const body = require('body-parser');
const multer = require('multer');
const path = require('path');

const cookieParser = require('cookie-parser');
// const cookieSession = require('cookie-session');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);  // 将session上传至mysql数据库
const mysql = require('./config/mysql');

const compression = require('compression');//gzip压缩中间件

// const before = require('./router/before');
// const after = require('./router/after');
const enrouten = require('express-enrouten');
const ejs = require('ejs');
const app = express();




// view engine setup 设置视图的根目录
app.set('views',path.resolve('views'));

//设置默认模板引擎:html
app.engine('html',ejs.__express);
app.set('view engine', 'html');
app.disable('view cache');

//尽量在其他中间件前使用compression
app.use(compression());

//提交的数据进行格式化
app.use(body.urlencoded({extended:false}));

//定义文件上传的路径
app.use(multer({ dest: 'uploads/' }).any());

//session设置
app.use(cookieParser('session_cookie_secret')) //cookieParser()参数一，用来设置签名密钥，可以是一个数组

app.use(session({
    key: 'SESSION',	                    //自行设置的签名
    secret: 'session_cookie_secret',		//密匙
    store:new MySQLStore({
        expiration: 10800000,
        createDatabaseTable: true,	//是否创建表
        schema: {
            tableName: 'session_tab',	//表名
            columnNames: {		//列选项
                session_id: 'session_id',
                expires: 'expires',
                data: 'data'
            }
        }
    },mysql),		//存储管理器
    resave: false,
    saveUninitialized: true,            //用户不论是否登录网站，只要访问网站都会生成一个session，只不过这个session是一个空的session
    httpOnly: true,                       // 不能通过js 获取cookie   默认是true
    cookie: { maxAge: 100 * 1000,secure: false}, //设置maxAge是10000ms，即10s后session和相应的cookie失效过期
}));

app.get('/', (req,res,next)=>{
    console.log("login-------------0")
    res.redirect("/login");
});

//静态资源路径,image,css,js等文件
app.use(express.static(path.resolve('static')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// //前台业务逻辑路由-不需要登陆就可以访问
// app.use('/index',before); //express路由写法
// //后台业务逻辑路由-必须登陆后才可以访问
// app.use('/home', after);


app.get('/login', (req,res,next)=>{
    console.log("login-------------1")
    next()
});

//路由
app.use(enrouten({         //express-enrouten  路由中间件
    directory: 'controllers'
}))
app.use((req,res,next)=>{
    console.log("login-------------3")
    next()
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

app.listen(8888);









