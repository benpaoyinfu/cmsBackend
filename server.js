const express = require('express')

const router = express.Router();
const app = express()
//引入mysql模块
const mysql = require("mysql");
const bodyParser = require('body-parser');
app.use( bodyParser.json() );
const dbConfig = require('./database/DBConfig'); 

//使用DBConfig中配置信息创建一个MySQL连接池
const pool = mysql.createPool(dbConfig.mysql);

//响应JSON数据
const responseJSON = function (res, ret) {
  if (typeof ret == 'undefined') {
    res.json({
      code: "-200",
      msg: "操作失败"
    });
  } else {
    res.json(ret);
  }
};

app.get("/", (req, res) => {
  res.send('hello world')
})


//进行查询
app.get('/query', function (req, res, next) {
  pool.getConnection(function (err, connection) {
    const params = req.query || req.params; //前端传的参数（暂时写这里，在这个例子中没用）
    const sql = 'select * from people'
    connection.query(sql, function (err, result) {
      //将结果以json形式返回到前台
      responseJSON(res, result);
      //释放链接
      connection.release();
    })
  })
})



app.listen(8000, () => {
  console.log('服务监听8000端口')
})