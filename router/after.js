const express = require('express');
const router = express.Router();
// 所有/home下的页面请求拦截的路由
router.use((req,res,next)=>{
    req.user = req.session.user
    if(req.user){
        next()
    }else{
        res.redirect('/login')
    }
})
router.get('/',function (req,res) {
    const user = req.session.user
    res.send(`${user}个人`);
})
router.get('/:a',function (req,res) {
    const user = req.session.user
    let { a } = req.params
    res.send(`${user}个人${a}`);
})

module.exports=router;
