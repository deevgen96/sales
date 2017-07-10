/**
 * Created by 111 on 04.07.2017.
 */
window.onload = function(){
    var sls = new Vue({
        el: '#sls',
        delimiters: ['${', '}'],
        data: {
            sources: [],
            customs: [],
            items: [],
            source: '',
            custom: '',
            api_url: 'http://localhost/index.php'
        },
        watch: {
            source: function(){
                this.getCustom(this.source);
            },
            custom: function(){
                this.getItem(this.custom);
            }
        },
        methods: {
            getSource: function () {
                s = this;
                $.get(s.api_url + '/api/v1/rest/source/').then(function (response) {
                    s.sources = response;
                }).catch(function(){
                    console.log('Ошибка запроса данных');
                });

            },
            getCustom: function (source_id) {
                s = this;
                $.get(s.api_url + '/api/v1/rest/source/' + source_id).then(function (response) {
                    s.customs = response;
                }).catch(function(){
                    console.log('Ошибка запроса данных');
                });

            },
            getItem: function (custom_id) {
                s = this;
                $.get(s.api_url + '/api/v1/rest/custom/' + custom_id).then(function (response) {
                    s.items = response;
                    console.log(s.items);
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