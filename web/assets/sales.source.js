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
            payments: [],
            source: {'source_name': ''},
            custom: {'custom_name': ''},
            client: {'client_id': 0},
            payment: {},
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
            editPayment: {},
            api_url: 'http://localhost/index.php',
            image_url: '/web/images/',
            customItemOrder: {
                'asc': 1,
                'field': ''
            },
        },
        watch: {
            source: function () {
                this.getSourceCustom(this.source.source_id);
            },
            custom: function () {
                this.getCustomItem(this.custom.custom_id);
                this.getPayment(this.custom.custom_id);
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
            customItemOrderByArticle: function () {
                // Apply filter first
                let result = this.custom_items;
                // Sort the remaining values
                let ascDesc = this.customItemOrder.asc ? 1 : -1;
                return result.sort((a, b) => ascDesc * a.article.localeCompare(b.article));
            },
            customItemOrderByName: function () {
                // Apply filter first
                let result = this.custom_items;
                // Sort the remaining values
                let ascDesc = this.customItemOrder.asc ? 1 : -1;
                return result.sort((a, b) => ascDesc * a.client_name.localeCompare(b.client_name));
            },
            sortClassArticle: function () {
                return {
                    'fa-sort-amount-asc': this.customItemOrder.asc && this.customItemOrder.field === 'article',
                    'fa-sort-amount-desc': !this.customItemOrder.asc && this.customItemOrder.field === 'article'
                }
            },
            sortClassClientName: function () {
                return {
                    'fa-sort-amount-asc': this.customItemOrder.asc && this.customItemOrder.field === 'client_name',
                    'fa-sort-amount-desc': !this.customItemOrder.asc && this.customItemOrder.field === 'client_name'
                }
            }
            ,
            declineCustomItem: function () {
                return {
                    'danger': this.customItemOrder.asc && this.customItemOrder.field === 'client_name',
                }
            },
            make_payment: function () {
                var s = this;
                let custom = {};
                let payment = {};

                s.custom_items.reduce(function (res, value) {
                    if ((value.decline_before_send == 0) && (value.decline_after_sale == 0)) {
                        if (!res[value.client_id]) {
                            res[value.client_id] = {
                                client_name: value.client_name,
                                custom_sum: 0.00,
                                payment_sum: 0.00
                            };
                            custom[value.client_id] = (res[value.client_id]);
                        }
                        res[value.client_id].custom_sum += parseFloat(value.total);
                    }
                    return res;
                }, {});

                s.payments.reduce(function (res, value) {
                        if (!res[value.client_id]) {
                            res[value.client_id] = {
                                client_id: value.client_id,
                                payment_sum: 0.00
                            };
                            payment[value.client_id] = (res[value.client_id])
                        }
                        res[value.client_id].payment_sum += parseFloat(value.payment_sum);
                    return res;
                }, {});

                $.each(custom, function(index, value) {
                    if (payment[index]){
                        custom[index].payment_sum = payment[index].payment_sum
                    };

                });
                return custom;
            },
        },

        filteredAndSortedData() {


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

            getPayment: function (custom_id) {
                s = this;
                source_id = s.source.source_id;
                this.$http.get(s.api_url + '/api/v1/rest/source/' + source_id + '/custom/' + custom_id + '/payment/').then(function (response) {
                    s.payments = response.data;
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

            setPayment: function () {
                s = this;
                source_id = s.source.source_id;
                custom_id = s.custom.custom_id;
                this.$http.post(s.api_url + '/api/v1/rest/source/' + source_id + '/custom/' + custom_id + '/payment/', s.editPayment).then(function (response) {
                    s.payments = response.data;
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
                custom_id = s.custom_items[index].custom_id;
                ;
                this.$http.delete(s.api_url + '/api/v1/rest/source/custom/' + custom_id + '/item/' + log_id + '/delete/').then(function (response) {
                    s.custom_items = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                });
            },

            deletePayment: function (index) {
                s = this;
                payment_id = s.payment[index].payment_id;
                custom_id = s.custom.custom_id;
                source_id = s.source.source_id;
                ;
                this.$http.delete(s.api_url + '/api/v1/rest/source/' + source_id + '/custom/' + $custom_id + '/payment/' + payment_id).then(function (response) {
                    s.payments = response.data;
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
                return this.image_url + this.source.image_folder + '/' + this.custom.custom_numb + '/' + imgName;
            },
            getDateFormat: function (dateVal) {
                var date = new Date(dateVal);
                console.log(dateVal);
                if (date)
                    return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '.' + ((date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '.' + date.getFullYear();
            },
            setPaymentDefault: function () {
                this.editPayment = {
                    payment_id: 0,
                    custom_id: this.custom.custom_id,
                    client_id: this.client.client_id,
                    payment_date: '',
                    payment_sum: 0.00
                };
            },
            invertSortArticle: function () {
                var s = this;
                s.customItemOrder.asc = !s.customItemOrder.asc;
                s.customItemOrder.field = 'article';
                s.custom_items = s.customItemOrderByArticle;
            },
            invertSortName: function () {
                var s = this;
                s.customItemOrder.asc = !s.customItemOrder.asc;
                s.customItemOrder.field = 'client_name';
                s.custom_items = s.customItemOrderByName;
            },
            getImageName: function (e) {
                var files = e.target.files;
                this.editCustomItem.item_photo = files[0].name;
            }

        },
        created: function () {
            this.getSource();
            this.getClient();
            this.getItem();
        }
    })

}