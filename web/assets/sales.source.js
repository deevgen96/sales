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
            searchFormClient: null,
            editClient: {'source_price': 0},
            editCustomItem: {},
            copyCustomItem: {},
            editSource: {},
            sex: [
                {'name': '-'},
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
            showTotal: 1,
            searchArticle: '',
            showImage: 1,
            article_item: [],
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
            // Вычисленное свойство, которое содержит только тех клиентов, которые соответствуют searchClient.
            filteredFormClients: function () {
                var client_array = this.clients,
                    searchString = this.searchFormClient;

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
                var s = this,
                    result = [];
                let custom = {};
                let payment = {};
                let client = {};

                s.clients.forEach(function (item) {
                    client[item.client_id] = item;
                });

                s.custom_items.reduce(function (res, value) {
                    if ((value.decline_before_send == 0) && (value.decline_after_sale == 0)) {
                        if (value.client_id) {
                            if (!res[value.client_id]) {
                                res[value.client_id] = client[value.client_id];
                                res[value.client_id].custom_sum = 0.00;
                                res[value.client_id].payment_sum = 0.00;

                                custom[value.client_id] = (res[value.client_id]);
                            }

                            res[value.client_id].custom_sum += parseFloat(value.total);
                        }
                    }
                    return res;
                }, {});

                s.payments.reduce(function (res, value) {
                    if (value.client_id) {
                        if (!res[value.client_id]) {
                            res[value.client_id] = {
                                client_id: value.client_id,
                                payment_sum: 0.00
                            };
                            payment[value.client_id] = (res[value.client_id])
                        }
                        res[value.client_id].payment_sum += parseFloat(value.payment_sum);
                    }
                    return res;
                }, {});

                $.each(custom, function (index, value) {
                    if (payment[index]) {
                        custom[index].payment_sum = payment[index].payment_sum
                    }
                });

                result = $.map(custom, function (value, index) {
                    return [value];
                });

                return result.sort((a, b) => a.client_name.localeCompare(b.client_name));
            },
            total: function () {
                var s = this,
                    result = [];
                if (s.make_item_people.length > 0) {
                    result = s.make_item_people.reduce(function (res, value) {
                        if (!res['source_total']) {
                            res['source_total'] = 0.00;
                            res['sale_total'] = 0.00;
                            res['item_count'] = 0;
                        }
                        res['source_total'] += parseFloat(value.source_price * value.item_count);
                        res['sale_total'] += parseFloat(value.total);
                        res['item_count'] += parseInt(value.item_count);

                        return res;
                    }, {});

                    if (s.payments.length > 0) {

                        payment_total = s.payments.reduce(function (res, value) {

                            if (!res['payment_total']) {
                                res['payment_total'] = 0.00;
                            }
                            res['payment_total'] += parseFloat(value.payment_sum);

                            return res;
                        }, {});
                        result['payment_total'] = payment_total.payment_total;
                    }
                    else {
                        result['payment_total'] = 0;
                    }
                }
                else {
                    result['source_total'] = 0;
                    result['sale_total'] = 0;
                    result['payment_total'] = 0;
                    result['item_count'] = 0;
                }

                return result;
            },
            make_item_people: function () {
                var s = this,
                    result = [];
                if (s.custom_items.length > 0) {
                    s.custom_items.reduce(function (res, value) {
                        if ((value.decline_before_send == 0) &&
                            (value.decline_after_sale == 0) &&
                            ((!s.searchArticle) || value.article.indexOf(s.searchArticle) > -1) &&
                            (((s.client.client_id) && value.client_id == s.client.client_id) || (!s.client.client_id))
                        ) {
                            result.push(value);
                        }
                    }, {});
                }

                return result;
            },
        },
        methods: {
            //get data
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

            //set data
            setClient: function () {
                s = this;
                this.$http.post(s.api_url + '/api/v1/rest/client/', s.editClient).then(function (response) {
                    s.clients = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                    s.getClient();
                });
            },
            setCustomItemOnce: function () {
                s = this;
                $custom_id = s.editCustomItem.custom_id;

                s.editCustomItem.decline_before_send = (s.editCustomItem.decline_before_send == false) ? 0 : 1;
                s.editCustomItem.decline_after_sale = (s.editCustomItem.decline_after_sale == false) ? 0 : 1;
                s.editCustomItem.comment = (s.editCustomItem.comment ? s.editCustomItem.comment : "");
                s.editCustomItem.sex = (s.editCustomItem.sex ? s.editCustomItem.sex : "-");
                s.editCustomItem.item_size = (s.editCustomItem.item_size ? s.editCustomItem.item_size : 0);
                this.$http.post(s.api_url + '/api/v1/rest/source/custom/' + $custom_id + '/item/', s.editCustomItem).then(function (response) {
                    s.custom_items = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                    s.getCustomItem($custom_id);
                });
            },
            declineCustomItem: function (item) {
                s = this;
                s.editCustomItem = item;
                $custom_id = s.editCustomItem.custom_id;
                s.editCustomItem.decline_after_sale = !parseInt(s.editCustomItem.decline_after_sale);
                s.editCustomItem.decline_after_sale = (s.editCustomItem.decline_after_sale == false) ? 0 : 1;
                s.editCustomItem.comment = (s.editCustomItem.comment ? s.editCustomItem.comment : "");
                s.editCustomItem.sex = (s.editCustomItem.sex ? s.editCustomItem.sex : "-");
                s.editCustomItem.item_size = (s.editCustomItem.item_size ? s.editCustomItem.item_size : 0);

                this.$http.post(s.api_url + '/api/v1/rest/source/custom/' + $custom_id + '/item/', s.editCustomItem).then(function (response) {
                    s.custom_items = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                    s.getCustomItem($custom_id);
                });
            },
            setSource: function () {
                s = this;
                this.$http.post(s.api_url + '/api/v1/rest/source/', s.editSource).then(function (response) {
                    s.sources = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                    s.getSource();
                });
            },
            setSourceCustom: function () {
                s = this;
                $source_id = s.editCustom.source_id;
                if (s.editCustom.send_date == "")
                    s.editCustom.send_date = null;
                if (s.editCustom.delivery_date == "")
                    s.editCustom.delivery_date = null;
                if (s.editCustom.issue_date == "")
                    s.editCustom.issue_date = null;

                this.$http.post(s.api_url + '/api/v1/rest/source/' + $source_id + '/custom/post/', s.editCustom).then(function (response) {
                    s.source_customs = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                    s.getSourceCustom($source_id);
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
                    s.getPayment(custom_id);
                });
            },
            setCopyCustomItem: function (index) {
                s = this;
                $copyCustomItem = s.custom_items[index];
                $copyCustomItem.log_id = 0;
                $custom_id = $copyCustomItem.custom_id;
                this.$http.post(s.api_url + '/api/v1/rest/source/custom/' + $custom_id + '/item/', $copyCustomItem).then(function (response) {
                    s.custom_items = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                    s.getCustomItem($custom_id);
                });
            },
            //delete data
            deleteSourceCustom: function (index) {
                s = this;
                $custom_id = s.source_customs[index].custom_id;
                $source_id = s.source_customs[index].source_id;
                this.$http.delete(s.api_url + '/api/v1/rest/source/' + $source_id + '/custom/' + $custom_id + '/delete/').then(function (response) {
                    s.source_customs = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                    s.getSourceCustom($source_id);
                });
            },
            deleteSource: function (index) {
                s = this;
                source_id = s.sources[index].source_id;
                this.$http.delete(s.api_url + '/api/v1/rest/source/' + source_id + '/').then(function (response) {
                    s.sources = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                    s.getSource();
                });
            },
            deleteCustomItem: function (index) {
                s = this;
                log_id = s.custom_items[index].log_id;
                custom_id = s.custom_items[index].custom_id;
                this.$http.delete(s.api_url + '/api/v1/rest/source/custom/' + custom_id + '/item/' + log_id + '/delete/').then(function (response) {
                    s.custom_items = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                    s.getCustomItem(custom_id);
                });
            },
            deletePayment: function (index) {
                s = this;
                payment_id = s.payments[index].payment_id;
                custom_id = s.custom.custom_id;
                this.$http.delete(s.api_url + '/api/v1/rest/source/custom/' + custom_id + '/payment/' + payment_id + '/delete').then(function (response) {
                    s.payments = response.data;
                }).catch(function () {
                    console.log('Ошибка запроса данных');
                    s.getPayment(custom_id);
                });
            },
            //helpers for processing data
            setCustomItemMulti: function () {
                this.setCustomItemOnce();
                this.setCustomItemDefault();
            },
            setSearchClient: function (item) {
                this.client.client_id = item.client_id;
                this.client.client_name = item.client_name;
                this.searchClient = item.client_name;
            },
            selectClient: function (client) {
                this.client = client;
                this.searchClient = client.client_name;
            },
            selectFormClient: function (client) {
                this.editCustomItem.client_id = client.client_id;
                this.editCustomItem.client_name = client.client_name;
                this.searchFormClient = client.client_name;
            },
            selectPaymentFormClient: function (client) {
                this.editPayment.client_id = client.client_id;
                this.editPayment.client_name = client.client_name;
                this.searchFormClient = client.client_name;
            },
            clearSearchClient: function () {
                this.client = {'client_id': 0};
            },
            clearFormSearchClient: function () {
                this.editCustomItem.client_id = 0;
                this.editCustomItem.client_name = '';
                this.searchFormClient = '';
            },
            setEditClient: function (index) {
                this.editClient = this.clients[index];
            },
            setEditSource: function (index) {
                this.editSource = this.sources[index];
            },
            setCustomItem: function (index) {
                this.editCustomItem = this.custom_items[index];
                this.searchFormClient = this.custom_items[index].client_name;
            },
            editSourceCustom: function (index) {
                this.editCustom = this.source_customs[index];
            },
            setEditPayment: function (index) {
                s = this;
                s.editPayment = s.payments[index];
                s.searchFormClient = s.editPayment.client_name;
            },
            //set new items
            //custom_item
            setCustomItemDefault: function () {
                this.editCustomItem = {};
                this.editCustomItem.log_id = 0;
                this.editCustomItem.custom_id = this.custom.custom_id;
                this.editCustomItem.custom_name = this.custom.custom_name;
                this.editCustomItem.item_id = 0;
                this.editCustomItem.article = '';
                this.editCustomItem.item_link = '';
                this.editCustomItem.item_size = 0;
                this.editCustomItem.item_count = 1;
                this.editCustomItem.item_photo = '';
                this.editCustomItem.sex = '-';
                this.editCustomItem.source_price = null;
                this.editCustomItem.sale_price = null;
                this.editCustomItem.comment = '';
                this.editCustomItem.decline_before_send = 0;
                this.editCustomItem.decline_after_sale = 0;
            },
            //custom
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
            //payment
            setPaymentDefault: function () {
                this.editPayment = {
                    payment_id: 0,
                    custom_id: this.custom.custom_id,
                    client_id: this.payment.client_id,
                    payment_date: '',
                    payment_sum: 0.00
                };
                this.searchFormClient = this.client.client_name;
            },
            //client
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
            //source
            setEditSourceDefault: function () {
                this.editSource = {source_id: 0, source_name: '', source_url: '', image_url: ''};
            },
            //sorting articles
            invertSortArticle: function (order) {
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
            //helpers
            getImageName: function (e) {
                var files = e.target.files;
                this.editCustomItem.item_photo = files[0].name;
            },
            formatPrice(value) {
                let val = (value / 1).toFixed(2).replace('.', ',')
                return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
            },
            getImageUrl: function (imgName) {
                return this.image_url + this.source.image_folder + '/' + this.custom.custom_numb + '/' + imgName;
            },
            getDateFormat: function (dateVal) {
                if (dateVal) {
                    var date = new Date(dateVal);
                    day = date.getDate();
                    mon = date.getMonth() + 1;
                    year = date.getFullYear();
                    if (date)
                        return (day < 10 ? '0' + day : day) + '.' + (mon < 10 ? '0' + mon : mon) + '.' + year;
                }
            },
            checkCustomSending: function (custom_id) {
                if (this.custom.send_date)
                    return false;
                return true;
            },
            //customs
            goToUp: function () {
                window.scrollTo(0, 0);
            },
            goToDown: function () {
                window.scrollTo(0, document.body.scrollHeight);
            },
            customItemPayment: function (client_id) {
                let payment = [];
                s.payments.reduce(function (res, value) {
                    if (value.client_id) {
                        if (!res[value.client_id]) {
                            res[value.client_id] = {
                                client_id: value.client_id,
                                payment_sum: 0.00
                            };
                            payment[value.client_id] = (res[value.client_id])
                        }
                        res[value.client_id].payment_sum += parseFloat(value.payment_sum);
                    }
                    return res;
                }, {});
                if (payment[client_id])
                    return payment[client_id].payment_sum;
                else
                    return 0;
            },

            customItemSum: function (client_id) {
                let custom = [];
                s.custom_items.reduce(function (res, value) {
                    if ((value.decline_before_send == 0) && (value.decline_after_sale == 0)) {
                        if (value.client_id) {

                            if (!res[value.client_id]) {
                                res[value.client_id] = {
                                    client_id: value.client_id,
                                    custom_sum: 0.00
                                };
                                custom[value.client_id] = (res[value.client_id])
                            }
                            res[value.client_id].custom_sum += parseFloat(value.sale_price * value.item_count);
                        }
                    }
                    return res;
                }, {});

                if (custom[client_id])
                    return custom[client_id].custom_sum;
                else
                    return 0;
            },

            customItemCount: function (client_id) {
                let custom = [];
                s.custom_items.reduce(function (res, value) {
                    if (value.client_id) {
                        if (!res[value.client_id]) {
                            res[value.client_id] = {
                                client_id: value.client_id,
                                custom_count: 0
                            };
                            custom[value.client_id] = (res[value.client_id])
                        }
                        res[value.client_id].custom_count += parseInt(value.item_count);
                    }
                    return res;
                }, {});

                if (custom[client_id])
                    return custom[client_id].custom_count;
                else
                    return 0;
            },
            getDateToStr: function (dateVal) {
                var d = new Date(dateVal);
                var month = new Array(12),
                    week = new Array(7);
                month[0] = "января";
                month[1] = "февраля";
                month[2] = "марта";
                month[3] = "апреля";
                month[4] = "мая";
                month[5] = "июня";
                month[6] = "июля";
                month[7] = "августа";
                month[8] = "сентября";
                month[9] = "октября";
                month[10] = "ноября";
                month[11] = "декабря";

                week[0] = 'в воскресенье';
                week[1] = 'в понедельник';
                week[2] = 'во вторник';
                week[3] = 'в среду';
                week[4] = 'в четверг';
                week[5] = 'в пятницу';
                week[6] = 'в субботу';

                return week[d.getDay() - 1] + ', ' + d.getDate() + ' ' + month[d.getMonth()];
            },
            setArticleItem: function (article) {
                var s = this;
                if (s.checkArticleItem(article))
                    s.article_item.splice(s.article_item.indexOf(article))
                else
                    s.article_item.push(article);
            },
            checkArticleItem: function(article){
                if (s.article_item.indexOf(article) > -1)
                    return true;
                return false;
            }
        },
        created: function () {
            this.getSource();
            this.getClient();
            this.getItem();
        }
    })

}