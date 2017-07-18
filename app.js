const express = require('express'),
    app = express(),
    http = require('http'),
    fs = require('fs'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    async = require('async'),
    url = 'http://www.cangqionglongqi.com/chongmei/',
    handlebars = require('express-handlebars').create({
        extname: 'hbs'
    });
app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
let urls = [];
fs.statSync('novel') || fs.mkdirSync('novel');
let outStream = fs.createWriteStream(__dirname + '/novel/chongmei2.txt');

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
            async.forEachLimit(urls, 1, function (url, callback) {
                getText(url, callback);
            }, function () {
                console.log('Finish.');
                outStream.end();
            });
        });
    });
};
function getText(url, callback) {
    console.log('现在正在抓取的是 ', url);
    http.get(url, function (res) {
        let chunks = [];
        res.on('data', function (chunk) {
            chunks.push(chunk);
        });
        res.on('end', function () {
            let html = iconv.decode(Buffer.concat(chunks), 'gb2312'),
                $ = cheerio.load(html, { decodeEntities: false }),
                txt = $("h1").text() + '\r\n' + $("#content").text().replace(/\s+/g, '\n');
            outStream.write(txt);
            callback(null, url + ' html content');
        });
        res.on('error', function (err) {
            console.log(err);
        });
    });
};

function main() {
    getAllTitleUrls();
}

main();

// app.get('/', function (req, res) {
//     res.render('home');
// });

app.listen(8090);