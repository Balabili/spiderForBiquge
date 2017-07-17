const http = require('http'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    async = require('async'),
    url = 'http://www.cangqionglongqi.com/chongmei/';
let urls = [], text = [];
fs.statSync('novel') || fs.mkdirSync('novel');
let outStream = fs.createWriteStream(__dirname + '/novel/chongmei.txt', { flags: 'r+' });

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ' + err);
});

function getAllTitleUrls() {
    http.get(url, function (res) {
        let chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on('end', function () {
            let html = iconv.decode(Buffer.concat(chunks), 'gb2312'),
                $ = cheerio.load(html, { decodeEntities: false }),
                allList = $("#list dd");
            for (let i = 0; i < allList.length; i++) {
                urls.push(url + allList[i].childNodes[0].attribs.href);
            }
            async.eachLimit(urls, 1, function (url, callback) {
                getText(url, callback);
            }, function () {
                console.log('Finish.');
            });
        });
    });
};
function getText(url, callback) {
    // 并发连接数的计数器
    var concurrencyCount = 0;
    // delay 的值在 2000 以内，是个随机的整数
    var delay = parseInt((Math.random() * 10000000) % 2000, 10);
    concurrencyCount++;
    console.log('现在的并发数是', concurrencyCount, '，正在抓取的是', url, '，耗时' + delay + '毫秒');
    http.get(url, function (res) {
        let chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on('end', function () {
            let html = iconv.decode(Buffer.concat(chunks), 'gb2312'),
                $ = cheerio.load(html, { decodeEntities: false }),
                txt = $("#content").html().replace(/\<br\>/g, '\n');
            text.push(txt);
            outStream.write(txt);
            setTimeout(function () {
                concurrencyCount--;
                callback(null, url + ' html content');
            }, delay);
        });
    });
};

function main() {
    getAllTitleUrls();
}

main();