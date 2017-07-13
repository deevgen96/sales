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
            custom_items: [],
            items: [],
            clients: [],
            source: {'source_name': ''},
            custom: {'custom_name': ''},
            client: {'client_id': 0},
            searchClient: null,
            editClient: {'source_price': 0},
            editItem: {},
            sex: [
                {'name': 'Женщина'},
                {'name': 'Мужчина'},
                {'name': 'Девочка'},
                {'name': 'Мальчик'}
            ],
            api_url: 'http://localhost/index.php'
        },
        watch: {
            source: function () {
                this.getCustom(this.source.source_id);
            },
            custom: function () {
                this.getCustomItem(this.custom.custom_id);
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
            },
            salePrice: function () {
                return this.editItem.source_price * 1.2;
            },
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
            getItem: function (source_id) {
                s = this;
                $.get(s.api_url + '/api/v1/rest/item/').then(function (response) {
                    s.items = response;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },

            getCustomItem: function (custom_id) {
                s = this;
                $.get(s.api_url + '/api/v1/rest/custom/' + custom_id).then(function (response) {
                    s.custom_items = response;
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
            setItemOnce: function () {
                s = this;
                $.post(s.api_url + '/api/v1/rest/custom/item', s.editItem).then(function (response) {
                    s.custom_items = response;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            setItemMulti: function () {
                this.setItemOnce();
                this.setEditItemDefault();
            },
            selectClient: function (client) {
                this.client = client;
                this.searchClient = client.client_name;
            },
            deleteItem: function (index) {
                s = this;
                log_id = this.custom_items[index].log_id;
                $.delete(s.api_url + '/api/v1/rest/custom/item/' + log_id).then(function (response) {
                    s.custom_items = response;

                    console.log(s.custom_items);
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            clearSearchClient: function () {
                this.client = {'client_id': 0};
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
            },
            setEditItem: function (index) {
                this.editItem = this.custom_items[index];
                console.log(this.editItem);
            },
            setEditItemDefault: function () {
                this.editItem = {
                    log_id: 0,
                    client_id: this.client.client_id,
                    client_name: this.client.client_name,
                    custom_id: this.custom.custom_id,
                    custom_name: this.custom.custom_name,
                    item_id: 0,
                    article: '',
                    item_link: '',
                    item_size: '',
                    item_count: 1,
                    sex: '',
                    source_price: 0.00,
                    sale_price: 0.00,
                }
            }
        },
        created: function () {
            this.getSource();
            this.getClient();
            this.getItem();
        }
    })

}