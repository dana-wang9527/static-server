var http = require("http");
var fs = require("fs");
var url = require("url");
var port = process.argv[2];

if (!port) {
  console.log("请指定端口号好不啦？\node server.js 8888 这样不会吗？");
  process.exit(1);
}

var server = http.createServer(function (request, response) {
  var parsedUrl = url.parse(request.url, true);
  var pathWithQuery = request.url;
  var queryString = "";
  if (pathWithQuery.indexOf("?") >= 0) {
    queryString = pathWithQuery.substring(pathWithQuery.indexOf("?"));
  }
  var path = parsedUrl.pathname;
  var query = parsedUrl.query;
  var method = request.method;

  /******** 从这里开始看，上面不要看 ************/

  console.log("有个人发请求过来啦！路径（带查询参数）为：" + pathWithQuery);

  response.statusCode = 200;

  const filePage = path === "/" ? "/index.html" : path; //当输入的是‘/’，就默认它是输入‘/index.html’
  const index = filePage.indexOf("."); //找出路径中.的位置
  const suffix = filePage.substring(index); //打出.后面的文件格式
  console.log(suffix);
  const fileTypes = {
    ".html": "text/html",
    ".css": "text/css",
    ".js": "text/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
  }; //创建哈希表，让文件格式和text后面格式一一对应
  console.log(`${fileTypes[suffix]}`);
  response.setHeader(
    "Content-Type",
    `${fileTypes[suffix] || "text/html"};charset=utf-8`
  ); //如果格式不是上面的几种就默认是text/html
  let content;
  try {
    content = fs.readFileSync(`./public${filePage}`);
  } catch (error) {
    content = "文件不存在";
    response.statusCode = 404;
  }
  response.write(content);
  response.end();
  /******** 代码结束，下面不要看 ************/
});
server.listen(port);
console.log(
  "监听 " +
    port +
    " 成功\n请用在空中转体720度然后用电饭煲打开 http://localhost:" +
    port
);
