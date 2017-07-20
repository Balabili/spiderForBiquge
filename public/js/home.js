var app = new Vue({
    el: "#spiderContainer",
    delimiters: ['${', '}'],
    data: {
        writeFileName: '',
        currentSection: '',
        process: 0,
        progressBar: {
            'min-width': '5em',
            width: '0%',
        }
    },
    methods: {
        writeFile: function () {
            var self = this,
                novelName = $("#novelUrl").val().replace('http://www.cangqionglongqi.com/', '').replace('/', '');
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
                    self.currentSection = result.section;
                    self.process = result.process;
                    setTimeout(function () {
                        self.getWriteProcess();
                    }, 5000);
                }, error: function () { }
            });
        }
    },
    watch: {
        process: function () {
            this.progressBar.width = Number.parseFloat(this.process) + "%";
        }
    }
});