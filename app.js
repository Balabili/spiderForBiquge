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
    currentNovelSections = null,
    novelname = '',
    filepath = '',
    q = async.queue(function (task, cb) {
        getText(task, cb);
    });

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
            let urlContainer = {};
            urlContainer.id = i + 1;
            urlContainer.url = url + '/' + allList[i].childNodes[0].attribs.href;
            urlContainer.title = allList[i].childNodes[0].childNodes[0].data;
            urls.push(urlContainer);
        }
        for (let index in urls) {
            q.push(urls[index]);
        }
    });
};
function getText(urlContainer, cb) {
    // let delay = parseInt((Math.random() * 10000000) % 1000, 10);
    // console.log('现在正在抓取的是 ' + urlContainer.title + ';延时 ' + delay);
    // setTimeout(function () {
    // }, delay);
    request({ url: urlContainer.url, method: 'GET', encoding: 'binary', timeout: 10000 }, function (err, res, body) {
        if (err || res.statusCode !== 200) {
            err ? console.log(err) : console.log(res.statusCode);
            cb();
            q.push(urlContainer);
        } else {
            console.log('现在正在抓取的是 ' + urlContainer.title);
            let html = iconv.decode(new Buffer(body, 'binary'), 'gb2312'),
                $ = cheerio.load(html, { decodeEntities: false });
            txt = $("h1").text() + '\r\n' + $("#content").text().replace(/\s+/g, '\n');
            currentNovelSections = urlContainer;
            fs.appendFileSync(filepath, txt);
            cb();
        }
    });
};



app.get('/', function (req, res) {
    res.render('home');
});
app.post('/writeFile/:novelName', function (req, res) {
    urls = [];
    novelname = req.params.novelName;
    url = url + novelname;
    let filename = novelname + new Date().getTime() + '.txt';
    filepath = __dirname + '/novel/' + filename;
    getAllTitleUrls();
    res.send(filename);
});
app.post('/writeProcess', function (req, res) {
    let data = {};
    if (currentNovelSections) {
        data.process = ((currentNovelSections.id / urls.length) * 100).toFixed(2);
        data.section = currentNovelSections.title;
    } else {
        data.process = 0;
    }
    res.send(data);

});

app.listen(8090);