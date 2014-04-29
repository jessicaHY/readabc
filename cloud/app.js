// 在 Cloud code 里初始化 Express 框架
var express = require('express');
var fs = require('fs');
var app = express();


// App 全局配置
app.set('views','cloud/views');   // 设置模板目录
app.set('view engine', 'jade');    // 设置 template 引擎
app.use(express.bodyParser());    // 读取请求 body 的中间件

// 使用 Express 路由 API 服务 /hello 的 HTTP GET 请求
app.get('/hello', function(req, res) {
  res.render('hello', { message: 'Congrats, you just set up your app!' });
});

app.get("/upload", function(req, res) {
    res.render('upload');
})

app.post("/upload", function(req, res) {
    var file = req.files.icon;
    console.dir(file);
    if(file) {
        fs.readFile(file.path, function(err, data) {
            if (err)
                return res.send("file read error")

            //var base64Data = data.toString('base64');
            var avFile = new AV.File(file.name, data);
            avFile.save().then(function(file) {
                var test = new AV.Object("Test2");
                test.set("icon", avFile);
                test.save();
                res.send(file.url());
            })
        })
    } else
    res.send("please select a file");
})

app.get("/getIcon", function(req, res) {
    var Test = AV.Object.extend("Test2");
    var query = new AV.Query(Test);
    query.get("535f3803e4b0e22e3fad181d", {
        success: function(test) {
            test.destroy({
                success: function(myobject) {
                    console.dir(arguments);
                    res.send("del success");
                },
                error: function(myobject, error) {
                    console.dir(arguments);
                    res.send(error.message);
                }
            })
            var avFile = test.get("icon");
            res.send(avFile.thumbnailURL(50, 50, 100, true, "jpg"));
        },
        error: function(object, error) {
            console.dir(arguments);
            res.send(error.message);
        }
    })
})
// 最后，必须有这行代码来使 express 响应 HTTP 请求
app.listen();


