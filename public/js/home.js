var app = new Vue({
    el: "#spiderContainer",
    delimiters: ['${', '}'],
    data: {
        writeFileName: '',
        currentSection: '',
        currentSectionId: 1,
        isStart: false,
        writeNewFile: true,
        process: 0,
        progressBar: {
            'min-width': '3em',
            width: '0%',
        }
    },
    methods: {
        writeFile: function () {
            var self = this,
                novelName = $("#novelUrl").val().replace('http://www.biquzi.com/', '').replace('/', '').replace(/(^\s*)|(\s*$)/g, '');
            self.process = 0;
            $.ajax({
                url: '/writeFile/' + novelName,
                type: 'POST',
                data: {},
                success: function (result) {
                    self.writeFileName = result;
                    setTimeout(function () {
                        self.getWriteProcess();
                    }, 2000);
                },
                error: function () { }
            });
        },
        getWriteProcess: function () {
            var self = this;
            $.ajax({
                url: '/writeProcess',
                type: 'POST',
                data: {},
                success: function (result) {
                    if (result === false) {
                        alert('当前输入的url错误');
                        return;
                    }
                    if (result === true) {
                        self.isStart = false;
                        self.process = 100;
                        window.location.href = '/downloadFile';
                    } else {
                        if (!self.isStart) {
                            self.isStart = true;
                        }
                        self.currentSection = result.section;
                        self.process = result.process;
                        self.currentSectionId = result.id;
                        setTimeout(function () {
                            self.getWriteProcess();
                        }, 5000);
                    }
                }, error: function () { }
            });
        },
        appendExistFile: function () {
            var self = this, novelUrl = $("#novelUrl").val(),
                appendFilename = $("#filename").val(), appdenSectionId = $("#currentSectionId").val();
            $.ajax({
                url: '/appendFile',
                type: 'POST',
                data: { novelUrl: novelUrl, name: appendFilename, id: appdenSectionId },
                success: function (result) {
                    if (result === '文件不存在') {
                        alert('文件不存在');
                        return;
                    }
                    self.writeFileName = result;
                    setTimeout(function () {
                        self.getWriteProcess();
                    }, 2000);
                },
                error: function () { }
            });
        }
    },
    watch: {
        process: function () {
            this.progressBar.width = Number.parseFloat(this.process) + "%";
        }
    }
});

window.onload = function () {
    $('#writeNewNocel').on('click', function () {
        let newFileTab = document.getElementById('writeNewNocel'),
            appendFileTab = document.getElementById('appdenExistNovel');
        if (newFileTab.className === 'active') {
            return;
        } else {
            newFileTab.className = 'active';
            appendFileTab.className = '';
            app.writeNewFile = true;
        }
    });

    $('#appdenExistNovel').on('click', function () {
        let newFileTab = document.getElementById('writeNewNocel'),
            appendFileTab = document.getElementById('appdenExistNovel');
        if (appendFileTab.className === 'active') {
            return;
        } else {
            appendFileTab.className = 'active';
            newFileTab.className = '';
            app.writeNewFile = false;
        }
    });
}