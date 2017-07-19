/**
 * Created by 111 on 04.07.2017.
 */
window.onload = function () {

    var sls = new Vue({
        el: '#sls',
        delimiters: ['${', '}'],
        data: {
            sources: [],
            source_customs: [],
            customs: [],
            custom_items: [],
            items: [],
            clients: [],
            source: {'source_name': ''},
            custom: {'custom_name': ''},
            client: {'client_id': 0},
            searchClient: null,
            editClient: {'source_price': 0},
            editCustomItem: {},
            editSource: {},
            sex: [
                {'name': 'Женщина'},
                {'name': 'Мужчина'},
                {'name': 'Девочка'},
                {'name': 'Мальчик'}
            ],
            editCustom: {'custom_name': ''},
            api_url: 'http://localhost/index.php',
            image_url: '/web/images/',
        },
        watch: {
            source: function () {
                this.getSourceCustom(this.source.source_id);
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
                return this.editCustomItem.source_price * 1.2;
            },
        },
        methods: {
            getSource: function () {
                s = this;
                this.$http.get(s.api_url + '/api/v1/rest/source/').then(function (response) {
                    s.sources = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });

            },
            getSourceCustom: function (source_id) {
                s = this;
                this.$http.get(s.api_url + '/api/v1/rest/source/' + source_id + '/custom/').then(function (response) {
                    s.source_customs = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            getCustom: function (source_id) {
                s = this;
                this.$http.get(s.api_url + '/api/v1/rest/custom/').then(function (response) {
                    s.customs = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            getItem: function (source_id) {
                s = this;
                this.$http.get(s.api_url + '/api/v1/rest/item/').then(function (response) {
                    s.items = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },

            getCustomItem: function (custom_id) {
                s = this;
                this.$http.get(s.api_url + '/api/v1/rest/custom/' + custom_id + '/item').then(function (response) {
                    s.custom_items = response.data;
                    console.log(s.custom_items);
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });

            },
            getClient: function () {
                s = this;
                this.$http.get(s.api_url + '/api/v1/rest/client/').then(function (response) {
                    s.clients = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });

            },
            setClient: function () {
                s = this;
                this.$http.post(s.api_url + '/api/v1/rest/client/', s.editClient).then(function (response) {
                    s.clients = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            setCustomItemOnce: function () {
                s = this;
                $custom_id = s.editCustomItem.custom_id;
                this.$http.post(s.api_url + '/api/v1/rest/source/custom/' + $custom_id + '/item/', s.editCustomItem).then(function (response) {
                    s.custom_items = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            setSource: function () {
                s = this;
                this.$http.post(s.api_url + '/api/v1/rest/source/', s.editSource).then(function (response) {
                    s.sources = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            setSourceCustom: function () {
                s = this;
                $source_id = s.editCustom.source_id;
                this.$http.post(s.api_url + '/api/v1/rest/source/' + $source_id + '/custom/post/', s.editCustom).then(function (response) {
                    s.source_customs = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            deleteSourceCustom: function (index) {
                s = this;
                $custom_id = s.source_customs[index].custom_id;
                $source_id = s.source_customs[index].source_id;
                this.$http.delete(s.api_url + '/api/v1/rest/source/' + $source_id + '/custom/' + $custom_id + '/delete/').then(function (response) {
                    s.source_customs = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            deleteSource: function (index) {
                s = this;
                source_id = s.sources[index].source_id;
                this.$http.delete(s.api_url + '/api/v1/rest/source/' + source_id + '/').then(function (response) {
                    s.sources = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            deleteCustomItem: function (index) {
                s = this;
                log_id = s.custom_items[index].log_id;
                $custom_id = s.custom_items[index].custom_id;
                ;
                this.$http.delete(s.api_url + '/api/v1/rest/source/custom/' + $custom_id + 'item/' + log_id).then(function (response) {
                    s.custom_items = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },
            setCustomItemMulti: function () {
                this.setCustomItemOnce();
                this.setEditClientDefault();
            },
            selectClient: function (client) {
                this.client = client;
                this.searchClient = client.client_name;
            },
            clearSearchClient: function () {
                this.client = {'client_id': 0};
            },
            setEditClient: function (index) {
                this.editClient = this.clients[index];
            },
            setEditSource: function (index) {
                this.editSource = this.sources[index];
            },
            setEditSourceDefault: function () {
                this.editSource = {source_id: 0, source_name: '', source_url: '', image_url: ''};
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
            setCustomItem: function (index) {
                this.editCustomItem = this.custom_items[index];
            },
            setCustomItemDefault: function () {
                this.editCustomItem = {
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
                    item_photo: '',
                    sex: '',
                    source_price: null,
                    sale_price: null,
                }
            },
            setEditCustomDefault: function () {
                this.editCustom = {
                    custom_id: 0,
                    source_id: this.source.source_id,
                    custom_numb: null,
                    custom_name: 'Заказ №',
                    send_date: null,
                    delivery_date: null
                };
            },
            editSourceCustom: function (index) {
                this.editCustom = this.source_customs[index];
            },
            getImageUrl: function (imgName) {
                return this.image_url + this.source.image_folder + '/' + imgName;
            },
            getDateFormat: function (dateVal) {
                var date = new Date(dateVal);
                if (date)
                    return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '.' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1))  + '.' + date.getFullYear();
            }
        },
        created: function () {
            this.getSource();
            this.getClient();
            this.getItem();
        }
    })

}