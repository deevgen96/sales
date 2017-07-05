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
                $.get(s.api_url + '/api/v1/rest/source/').then(function (response) {
                    s.sources = response;
                }).catch(function(){
                    console.log('Ошибка запроса данных');
                });

            }
        },
        created: function(){
            this.getSource();
        }
    })

}