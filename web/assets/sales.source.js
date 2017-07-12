/**
 * Created by 111 on 04.07.2017.
 */
window.onload = function () {

    var sls = new Vue({
        el: '#sls',
        delimiters: ['${', '}'],
        data: {
            sources: [],
            customs: [],
            items: [],
            clients: [],
            source: null,
            custom: null,
            client: null,
            searchClient: null,
            editClient: {},
            api_url: 'http://localhost/index.php'
        },
        watch: {
            source: function () {
                this.getCustom(this.source);
            },
            custom: function () {
                this.getItem(this.custom);
            },
        },
        computed: {
            // Вычисленное свойство, которое содержит только тех клиентов, которые соответствуют searchClient.
            filteredClients: function () {
                var client_array = this.clients,
                    searchString = this.searchClient;

                if (!searchString) {
                    return client_array;
                }

                searchString = searchString.trim().toLowerCase();

                client_array = client_array.filter(function (item) {
                    if (item.client_name.toLowerCase().indexOf(searchString) !== -1) {
                        return item;
                    }
                })

                // Возвращает массив с отфильтрованными данными.
                return client_array;
            }
        },
        methods: {
            getSource: function () {
                s = this;
                $.get(s.api_url + '/api/v1/rest/source/').then(function (response) {
                    s.sources = response;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });

            },
            getCustom: function (source_id) {
                s = this;
                $.get(s.api_url + '/api/v1/rest/source/' + source_id).then(function (response) {
                    s.customs = response;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });

            },
            getItem: function (custom_id) {
                s = this;
                $.get(s.api_url + '/api/v1/rest/custom/' + custom_id).then(function (response) {
                    s.items = response;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });

            },
            getClient: function () {
                s = this;
                $.get(s.api_url + '/api/v1/rest/client/').then(function (response) {
                    s.clients = response;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });

            },
            setClient: function () {
                s = this;
                $.post(s.api_url + '/api/v1/rest/client/', s.editClient).then(function (response) {
                    s.clients = response;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            selectClient: function (id, name) {
                this.client = id;
                this.searchClient = name;
            },
            clearSearchClient: function () {
                this.client = null;
            },
            setEditClient: function (index) {
                this.editClient = this.clients[index];
            },
            setEditClientDefault: function () {
                this.editClient = {
                    client_id: 0,
                    client_name: '',
                    profile_link: '',
                    region: '',
                    client_honor: '',
                    client_greeting: 'Здравствуйте'
                };
            }
        },

        created: function () {
            this.getSource();
            this.getClient();
        }
    })

}