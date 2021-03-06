// jar파일 import
// npm install java 설치시 에러 해결
// npm install node-java 설치
// npm install java 설치
// npm install node-gyp 설치
// npm install --global --production windows-build-tools
// JDK 1.7 요구사항
// PATH 설정 : jdk1.7/bin , jre7/bin
// jar 파일은 config에서  import 
// config 에서 connection 생성 

var express = require('express');
var router = express.Router();
var java = require("java");
// SDK 연동
var logpresso = require('../config/logpresso-connection');
var javaLangSystem = java.import('java.lang.System');

// 쿼리 조회 ( 로그프레소에서 제공하는 java sdk 연결 )
// Class 메소드 호출 시 메소드 이름뒤에 Sync 처리
var connection = logpresso.getJavaInstance();
var cursor = connection.querySync("table limit=100 dev_spider_data");
//임의의 오브젝트 생성
var obj = {table: []};

while(cursor.hasNextSync()){
    var Tuple = cursor.nextSync();
    //로그프레소 결과는 튜플 형태로 res
    obj.table.push(Tuple.getSync("author"));
    obj.table.push(Tuple.getSync("biz_kind"));
    obj.table.push(Tuple.getSync("postdate"));
    obj.table.push(Tuple.getSync("content"));
}
cursor.close();
/*javaLangSystem.out.printlnSync(names);
javaLangSystem.out.printlnSync("hghhh");*/

router.get('/log', function(req, res, next) {
    res.json(obj);
});

module.exports = router;