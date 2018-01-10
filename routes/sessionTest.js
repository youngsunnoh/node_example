var express = require('express');
var session = require('express-session'); // 세션
var router = express.Router();


router.get('/', function(req, res, next) {
    var sess;
    sess = req.session;
    if(sess.username){
            res.send("세션아이디: " + sess.username + " 세션비밀번호:" + sess.password);
        }else{
            res.send("세션이 없습니다.로그인 해주세요.");
        }
});


router.get('/logout',function(req,res){
    var sess = req.session;
    if(sess.username){
        req.session.destroy(function(err){
            if(err){
                console.log(err);
            }else{
                res.send("세션 초기화")
            }
        })
    }else{
        res.send("세션 정보가 없음")
    }
});

router.get('/login/:username/:password', function(req, res, next) {
    var sess;
    sess = req.session;
    console.log(req.params.username);
    console.log(req.params.password);
    sess.username = req.params.username;
    sess.password = req.params.password;
    res.send("로그인되었습니다.");
});

module.exports = router;