const express = require('express'),
    app = express(),
    fs = require('fs'),
    cheerio = require('cheerio'),
    iconv = require('iconv-lite'),
    async = require('async'),
    request = require('request'),
    handlebars = require('express-handlebars').create({
        extname: 'hbs'
    });
let urls = [],
    url = 'http://www.cangqionglongqi.com/',
    currentUrl = '',
    novelname = '',
    outStream = null;

app.engine('hbs', handlebars.engine);
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'));
fs.statSync('novel') || fs.mkdirSync('novel');

function getAllTitleUrls() {
    request({ url: url, method: 'GET', encoding: 'binary' }, function (err, res, body) {
        let html = iconv.decode(new Buffer(body, 'binary'), 'gb2312'),
            $ = cheerio.load(html, { decodeEntities: false }),
            allList = $("#list dd");
        for (let i = 0; i < allList.length; i++) {
            urls.push(url + '/' + allList[i].childNodes[0].attribs.href);
        }
        async.mapLimit(urls, 1, function (url, callback) {
            getText(url, callback);
        }, function () {
            console.log('Finish.');
            outStream.end();
        });
    });
};
function getText(url, callback) {
    let delay = parseInt((Math.random() * 10000000) % 1000, 10);
    console.log('现在正在抓取的是 ' + url + ',延时 ' + delay);
    request({ url: url, method: 'GET', encoding: 'binary' }, function (err, res, body) {
        if (err || res.statusCode !== 200) {
            console.log(res.statusCode);
            console.log(err);
        } else {
            let html = iconv.decode(new Buffer(body, 'binary'), 'gb2312'),
                $ = cheerio.load(html, { decodeEntities: false });
            txt = $("h1").text() + '\r\n' + $("#content").text().replace(/\s+/g, '\n');
            outStream.write(txt);
        }
        setTimeout(function () {
            callback(null, url + ' html content');
        }, delay);
    });
};

app.get('/', function (req, res) {
    res.render('home');
});
app.post('/writeFile/:novelName', function (req, res) {
    novelname = req.params.novelName;
    url = url + novelname;
    let filename = novelname + new Date().getTime() + '.txt';
    outStream = fs.createWriteStream(__dirname + '/novel/' + filename);
    getAllTitleUrls();
    res.send(filename);
});

app.listen(8090);