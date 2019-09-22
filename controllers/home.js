module.exports = function (router) {
    // 页面请求拦截的路由
    router.use((req, res, next)=>{
        req.users = req.session.users;
        console.log(req.users);
        if(req.users){
            next();
        }else{
            res.redirect('/login')
        }
    });
    router.get('/',(req, res, next)=>{
        res.render('index',{a:"1"})
    });
    router.post('/userInfo',(req, res, next)=>{
       res.send({code: '0', users:req.session.users})
    })
}