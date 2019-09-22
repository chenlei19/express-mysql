const pool = require('../config/mysql');

var md5=require('md5-node');

module.exports = function (router) {
    router.get('/login',(req,res, next)=>{
        // res.cookie("chen","123", {signed: true})//发送带签名
        console.log("login-------------2")
        res.render('login',req)
    })

    router.get('/register',(req, res, next)=>{
        res.render('register',req)
    });

    router.post('/register',(req, res, next)=>{
        var body = req.body
        if(!body.user){
            res.send({code: '1',msg: '账号不能为空'});
        }else if(!body.pass){
            res.send({code: '2',msg: '密码不能为空'});
        }else if(!/\w{6,32}/.test(body.user)){
            res.send({code: '3',msg: '账号不合法'});
        }else if(!/\w{6,32}/.test(req.pass)){
            res.send({code: '4',msg: '密码不合法'});
        }else{
            pool.query( `SELECT * FROM register WHERE user=?` ,[body.user], (err, data) => {    //OR 或  AND 且
                console.log(data)
                if(err){
                    res.send({code: '5', msg:'系统异常'});
                }else if(data.length > 0){
                    res.send({code: '6', msg:'该用户名已被注册'});
                }else{
                    pool.query( `INSERT INTO register(id,user,password) VALUES(0,?,?)` ,[body.user,md5(body.pass)],(err, data) => {
                        if(err){
                            res.send({code: '5', msg:'系统异常'});
                        }else{
                           req.session.users =  body.user;
                           res.send({code: '0', msg:'注册成功'});
                        }
                    })
                }
            })
        }
    })

    router.post('/login',(req, res, next)=>{
        console.log("login-------------4")
        var body = req.body
        if(!body.user){
            res.send({code: '1',msg: '账号不能为空'});
        }else if(!body.pass){
            res.send({code: '2',msg: '密码不能为空'});
        }else{
            pool.query( `SELECT * FROM register WHERE user=? AND password=?` ,[body.user,md5(body.pass)], (err, data) => {
                console.log(data)
                if(err){
                    res.send({code: '5', msg:'系统异常'});
                }else if(data.length > 0){
                    req.session.users =  body.user;
                    res.send({code: '0', msg:'登录成功'});
                }else{
                    res.send({code: '7', msg:'账号或密码错误'});
                }
            })
        }
    })

    router.get('/logout',(req, res, next)=>{
        req.session.destroy();
        res.redirect('/login');
    })
}