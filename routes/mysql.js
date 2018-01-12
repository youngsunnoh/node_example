var express = require('express');
var router = express.Router();
var getConnection = require('../config/mysql-connection.js');
var Excel = require('exceljs');
var excelbuilder = require('msexcel-builder');
var XLSX = require('xlsx');

router.get('/', function(req, res, next) {
    getConnection(function (err, con) {
        con.query('select * from dev_account', function(err, rows, fields) {
            if (!err){
                res.send("데이터입니다.");
                con.release();
            }else{
                console.log('Error while performing Query.', err);
                con.release();
            }
        /*res.json(connection.connect()); // 전체 row 값 json 형식으로 추출 *!/*/
        /*res.json(rows[0].USER_ID);  // 특정 컬럼 값 추출 */
         })
    })
});

router.get('/user', function(req, res, next) {
    getConnection(function (err, con) {
        con.query('select * from dev_account', function (err, rows, fields) {
            if (!err){
                /*res.send("데이터입니다."); */
                res.json(rows); // 전체 row 값 json 형식으로 추출 */
                con.release();
                /*res.json(rows[0].USER_ID);  // 특정 컬럼 값 추출 */
            }else{
                console.log('Error while performing Query.', err);
                con.release();
            }
        });
    });
});

router.get('/keyword/:id', function(req, res, next) {
    var id = req.params.id;
    getConnection(function (err, con) {
        con.query('select * from dev_crawl_keyword where user_id =?', [id], function (err, rows, fields) {
            if (!err){
                /*res.send("데이터입니다."); */
                res.json(rows); // 전체 row 값 json 형식으로 추출
                con.release();
            }else{
                console.log('Error while performing Query.', err);
                con.release();
            }
        });
    });
});
router.get('/excel',function(req,res) {
    var nodeExcel = require('excel-export');
    var conf = {}
    var arr = [];
    var i;
    conf.cols = [
        {
            caption: 'uuid',
            type: 'string',
            width: 3
        },
        {
            caption: 'title',
            type: 'string',
            width: 50
        },
        {
            caption: 'area',
            type: 'string',
            width: 15
        },
        {
            caption: 'contents',
            type: 'string',
            width: 15
        }
    ];
    getConnection(function (err, con) {
        con.query("select * from review", function (err, rows) {
            for (i = 0; i < rows.length; i++) {
                var uuid = rows[i].uuid;
                var area = rows[i].area;
                var contents = rows[i].contents;
                var title = rows[i].title;

                var a = [uuid, area, contents, title];
                arr.push(a);
            }
            conf.rows = arr;
            con.release();
            var result = nodeExcel.execute(conf);
            res.setHeader('Content-Type', 'application/vnd.openxmlformates');
            res.setHeader("Content-Disposition", "attachment;filename=" + "todo.xlsx");
            res.setHeader("Content-Length", result.length);
            res.end(new Buffer(result, 'binary'));
        });
    });
});

module.exports = router;