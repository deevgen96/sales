/**
 * Created by 111 on 04.07.2017.
 */
window.onload = function(){
    var sls = new Vue({
        el: '#sls',
        delimiters: ['${', '}'],
        data: {
            sources: [],
            source: '',
            api_url: 'http://localhost/index.php'
        },
        methods: {
            getSource: function () {
                s = this;
                console.log(s.api_url + '/api/v1/rest/source/');
                $.get(s.api_url + '/api/v1/rest/source/').then(function (response) {
                    console.log(s.api_url + '/api/v1/rest/source/');

                    s.sources = response;
                    console.log(s.sources);
                }).catch(function(){
                    console.log('Ошибка запроса данных');
                });

            }
        },
        started: function(){
            this.getSource();
        }
    })

}