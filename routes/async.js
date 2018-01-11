var async = require('async');
var express = require('express');
var router = express.Router();
var mysql = require('mysql');
var connection = mysql.createConnection({
    //DB 연결 정보
});
var timestamp = new Date().getTime();

//병렬 처리
router.get('/parallel', function(req, res, next) {
    async.parallel([
        function (callback) {
            setTimeout(function () {
                console.log('one');
                callback(null, 'one');
            }, 2000); //2초
        },
        function (callback) {
            setTimeout(function () {
                console.log('two');
                callback(null, 'two');
            }, 1000); //1초
        },
        function (callback) {
            setTimeout(function () {
                console.log('three');
                callback(null, 'three');
            }, 3000); //3초
        }
    ],
    function (err, results) {
        console.log(results, 'in ', new Date().getTime() - timestamp, 'ms');
    });
});

//시리즈 처리
router.get('/series', function(req, res, next) {
    async.series([ //독립적인 작업을 순차적으로 실행되며 이전 작업의 결과물에 상관없이 수행되는 작업일 경우)
        function(callback){ //실행1
            connection.query("select * from dev_account" ,function(err, rows){
                if(!err) {
                    callback(err,rows); ////에러를 null으로 넘기면 에러가 발생하더라도 다음 작업
                }else{
                    callback(err,"error1");
                }
            });
        },
        function(callback){
            connection.query("select * from dev_crawl_group", function(err, rows){
                if(!err) {
                    callback(err,rows);
                }else{
                    callback(err, "error2");
                }
            });
        },
        function(callback){
            connection.query("select * from dev_keyword_group", function(err, rows){
                if(!err) {
                    callback(err,rows);
                }else{
                    callback(err, "error3");
                }
            });
        },
        function(callback){
            connection.query("select * from dev_schedule_group",  function(err, rows){
                if(!err) {
                    callback(err,rows);
                }else{
                    callback(err, "error4");
                }
            });
        }
    ],
    function(err,results){
        console.log(err);
        res.send(results); // 실행된 전체 결과
        if(err) errorHandler(err);
    });
});

//워터폴 테스트
router.get('/waterfall', function(req, res, next) {
    var data = { "username" : "async_account", "password" : "qwer1234" , "type" : "waterfall" };

    async.waterfall([ //순차적으로 실행
        function(callback){ //실행1
            console.log("select");
            connection.query("select * from dev_account" ,function(err, rows){
                if(!err) { // 쿼리 실행 여부
                    callback(err,rows); // 다음 함수로 쿼리의 결과를 파라미터로 넘겨준다.
                }else{
                    callback(err,"error1"); // 다음 함수로 에러라는 문구를 파라미터로 넘겨준다.
                }
            });
        },
        function(arg2,callback){ //실행2 ( arg2, 첫번째 함수에서 넘어온 값 )
            console.log(arg2[0].USER_ID); // 첫 번째 함수에서 넘어온 값 제어
            connection.query("insert into async2 set ?", data, function(err, result2){
                if(!err) {
                    callback(err, "success2"); //데이터 입력 성공
                }else{
                    callback(err, "error2"); //데이터 입력 에러
                }
            });
        },
        function(arg3,callback){
            console.log(arg3); // success & error String value
            connection.query("insert into async3 set ?", data, function(err, result3){
                if(!err) {
                    callback(err, "success3"); //데이터 입력 성공
                }else{
                    callback(err, "error3");  //데이터 입력 에러
                }
            });
        },
            function(arg4,callback){
                console.log(arg4);  // success & error String value
                connection.query("insert into async4 set ?", data, function(err, result4){
                    if(!err) {
                        callback(err, "success4"); //데이터 입력 성공
                    }else{
                        callback(err, "error4");  //데이터 입력 에러
                    }
                });
            }
    ],
    function(err,result){
            console.log(err); // 성공 : null 값
            console.log(result); // waterfall 마지막 함수 실행 결과 내용
            if(err) errorHandler(err);
    });
});

module.exports = router;

