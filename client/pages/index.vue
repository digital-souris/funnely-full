<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <form @submit.prevent="getStates">
                    <div class="form-group row">
                        <div class="col-11">
                            <input class="form-control" v-model="searchText" type="search" value="" id="">
                        </div>
                        <div class="col-1">
                            <button class="btn btn-primary" @click="getStates">Поиск</button>
                        </div>
                    </div>
                </form>
            </div>
            <div class="col-12" v-if="channels && channels.query">
                <div class="card">
                    <div class="card-body">
                        <table id="footable-1" class="table" data-sorting="true">
                            <thead>
                            <tr>
                                <th data-name="firstName">Название</th>
                                <th data-name="lastName">Ссылка</th>
                                <th data-name="jobTitle" data-breakpoints="xs">Нравится</th>
                                <th>Просмотров</th>
                                <th>Дочитываний</th>
                                <th>Дата публикации</th>
                                <th>Управление</th>
                            </tr>
                            </thead>

                            <tr v-for="channel of channels.query" :key="channel._id">
                                <td>{{channel.title}}</td>
                                <td style="max-width: 250px">
                                    <a :href="channel.link" target="_blank">{{channel.link}}</a>
                                </td>
                                <td>{{channel.likes.all}}</td>
                                <td>{{channel.views.all}}</td>
                                <td>{{channel.views.toEnd}}</td>
                                <td>{{getDate(channel.publishDate)}}</td>
                                <td>
                                    <a :href="channel.link" target="_blank" class="mr-2 url-control"><i
                                            class="mdi mdi-eye-circle"></i></a>
                                </td>
                            </tr>
                        </table><!--end table-->
                    </div><!--end card-body-->
                </div><!--end card-->
                <div class="card__loader" v-if="isLoading">
                    <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
                         style="margin: auto; background: rgb(255, 255, 255); display: block; shape-rendering: auto;"
                         width="200px" height="200px" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
                        <g transform="rotate(0 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                         begin="-0.9166666666666666s" repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <g transform="rotate(30 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                         begin="-0.8333333333333334s" repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <g transform="rotate(60 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.75s"
                                         repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <g transform="rotate(90 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                         begin="-0.6666666666666666s" repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <g transform="rotate(120 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                         begin="-0.5833333333333334s" repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <g transform="rotate(150 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.5s"
                                         repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <g transform="rotate(180 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                         begin="-0.4166666666666667s" repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <g transform="rotate(210 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                         begin="-0.3333333333333333s" repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <g transform="rotate(240 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="-0.25s"
                                         repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <g transform="rotate(270 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                         begin="-0.16666666666666666s" repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <g transform="rotate(300 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s"
                                         begin="-0.08333333333333333s" repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <g transform="rotate(330 50 50)">
                            <rect x="47" y="24" rx="3" ry="6" width="6" height="12" fill="#040404">
                                <animate attributeName="opacity" values="1;0" keyTimes="0;1" dur="1s" begin="0s"
                                         repeatCount="indefinite"/>
                            </rect>
                        </g>
                        <!-- [ldio] generated by https://loading.io/ --></svg>
                </div>
            </div><!--end col-->
        </div>
        <paginator v-if="getCount " :count="getCount"></paginator>
    </div>
</template>

<script>
    import moment from 'moment'
    import Paginator from "../components/layout/Pagination";

    export default {
        name: "Index",
        components: {Paginator},
        async asyncData({app, query}) {
            const page = query.page || 1
            const resp = await app.$axios.get(`/states?page=${page}`)
            if (resp.status === 200) {
                console.log(resp.data)
                return {
                    channels: resp.data
                }
            } else {
                return {
                    channels: {
                        query: [],
                        count: 0
                    },
                }
            }
        },
        data() {
            return {
                channels: {},
                searchText: '',
                addChannel: [],
                isLoading: false
            }
        },
        computed: {
            getPage() {
                return this.$route.query.page
            },
            getCount() {
                if (this.channels) {
                    return Math.ceil(this.channels.count / 20)
                }
                return 0
            }
        },
        mounted() {
        },
        methods: {
            getDate(date) {
                return moment(date).format('DD-MM-YYYY')
            },
            async addChannelToUser(id) {
                console.log(id)
                const data = await this.$axios.post('/channels', {
                    id: id
                })
                if (data.status === 200) {
                    this.$store.commit('updateChannels', data.data)
                    this.addChannel.push(data.data._id)
                }
            },
            async getStates() {
                this.isLoading = true
                const page = this.$route.query.page || 1
                const resp = await this.$axios.get(`/states?page=${page}&search=${this.searchText}`)
                this.isLoading = false
                if (resp.status === 200) {
                    return this.channels = resp.data
                } else {
                    return this.channels = {
                        query: [],
                        count: 0
                    }
                }
            }
        },
        watch: {
            getPage() {
                this.getStates()
            }
        }
    }
</script>

<style scoped lang="scss">
    .card__loader {
        position: absolute;
        background-color: #fff;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>