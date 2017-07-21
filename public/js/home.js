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
                novelName = $("#novelUrl").val();
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
            var self = this, appendFilename = $("#filename").val(), appdenSectionId = $("#currentSectionId").val();
            $.ajax({
                url: '/appendFile' + novelName,
                type: 'POST',
                data: { name: appendFilename, id: appdenSectionId },
                success: function (result) {
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