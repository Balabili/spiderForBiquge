var app = new Vue({
    el: "#spiderContainer",
    delimiters: ['${', '}'],
    data: {
        writeFileName: '',
        progressBar: {
            width: '66.66%',
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
                },
                error: function () { }
            });
        }
    }
});