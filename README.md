# spiderForBiquge

近期沉迷于全职高手无法自拔去补小说，网上下载的小说又残缺不全，于是自己搞了个小说爬虫把在线阅读的小说下载出来，纯属个人娱乐外加练习nodejs语法.

不幸被我选中做小白鼠的小说网站是笔趣阁，全职高手网址：http://www.biquzi.com/0_32/ ,每5s获取一次进度，前台显示爬到哪一篇以及总进度，所有章节都写入txt文件之后会在浏览器端下载文件。

使用request + async + cheerio完成小说爬虫，首先获取小说的所有章节的url，在通过async.queue方法将获取到的所有小说章节的内容按顺序写入文件。若中途停止，可通过记住刚刚写入文件的文件名和终止章节的id进行续写。

当前问题：若是请求超时，请求超时的文章会被跳过没有写入到文件中。

![写入文件](https://github.com/Balabili/spiderForBiquge/tree/master/public/img/novel.png)