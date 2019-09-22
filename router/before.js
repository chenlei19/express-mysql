const express = require('express');
const router = express.Router();

// 所有/index下的页面请求拦截的路由
router.use(function (req, res, next) {
    req.users = req.session.users;
    console.log(req.users);
    next();
});

router.get('/',function (req,res) {
    res.send('首页');
})
router.get('/:a',function (req,res) {
    let { a } = req.params
    res.send(`首页${a}`);
})
// router.use('/bb',require('./home'))  ///  index/bb/a  index/bb/b
module.exports=router;
