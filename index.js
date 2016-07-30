/**
 * トイレからのセンサデータ送信を模擬送信するプログラム
 *
 */
var http = require('http');

/**
 * 環境設定
 */
var config = require('config');
/**
 * 送信リクエスト設定
 */
var options = {
  method: 'POST',
  //  auth: 'sgvcswnl:ZMnrGDuJEblXAxyECigiti2GAywJIA_0',
  hostname: '127.0.0.1',
  port: 8888,
  path: '/api/devices/'+config.get('auth.id')+'/values',
  auth: config.get('auth.id') + ':' + config.get('auth.password'),
  headers: {
    "content-type": "application/json",
    "User-Agent": "simulator"
  }
};

/**
 * 10秒に1回サーバへ送信する
 */
setInterval(function() {
  var message = [];
  var thresholds = config.get('thresholds');
  for(var i = 0; i < config.get('rooms'); i++) {
    var rate = Math.floor(Math.random() * 10);
    if(config.get('occupancy_rate') < rate) {
      message.push(thresholds[i].close);
    } else {
      message.push(thresholds[i].open);
    }
  }
  var body = JSON.stringify(message);
  options.headers["Content-Length"] = Buffer.byteLength(body);
  var req = http.request(options, function(res) {
    console.log('statusCode: ', res.statusCode);
  });
  req.on('error', function(e) {
    console.error(e);
  });
  req.end(body);
  console.log('send: '+body);
}, 10000);
