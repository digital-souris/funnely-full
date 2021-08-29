<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="form-group row">
                    <label class="col-sm-2 col-form-label">Поиск по каналам</label>
                    <div class="col-sm-10">
                        <input class="form-control" v-model="searchText" type="search" value="" id="">
                    </div>
                </div>
            </div>
            <div class="col-12" v-if="channels && channels.query">
                <div class="card">
                    <div class="card-body">
                        <table id="footable-1" class="table" data-sorting="true">
                            <thead>
                            <tr>
                                <th data-name="firstName">Название</th>
                                <th data-name="lastName">Ссылка</th>
                                <th data-name="jobTitle" data-breakpoints="xs">Подписчиков</th>
                                <th>Аудитория</th>
                                <th>Кол-во статей</th>
                                <th>Последнее обновление</th>
                                <th>Управление</th>
                            </tr>
                            </thead>

                            <tr v-for="channel of channels.query" :key="channel._id">
                                <td>{{channel.name}}</td>
                                <td>
                                    <a :href="channel.link" target="_blank">{{channel.link}}</a>
                                </td>
                                <td>{{channel.settings.subscribers}}</td>
                                <td>{{channel.settings.auditory}}</td>
                                <td>{{channel.settings.statesCount}}</td>
                                <td>{{getDate(channel.updatedAt)}}</td>
                                <td>
                                    <a v-if="$auth.user && !channel.user && addChannel.indexOf(channel._id) === -1" href="#" @click.prevent="addChannelToUser(channel._id)" class="mr-2 url-control"><i class="mdi mdi-bookmark-plus"></i></a>
                                    <a :href="channel.link" target="_blank" class="mr-2 url-control"><i class="mdi mdi-eye-circle"></i></a></td>
                            </tr>
                        </table><!--end table-->
                    </div><!--end card-body-->
                </div><!--end card-->
            </div><!--end col-->
        </div>
        <paginator v-if="getCount " :count="getCount"></paginator>
    </div>
</template>

<script>
    import moment from 'moment'
    import _ from 'lodash'
    import Paginator from "../components/layout/Pagination";
    export default {
        name: "Index",
        components: {Paginator},
        data() {
            return {
                channels: {},
                searchText: '',
                addChannel: []
            }
        },
        computed: {
            getPage() {
                return this.$route.query.page
            },
            getCount() {
                if (this.channels) {
                    return Math.floor(this.channels.count / 20)
                }
                return 0
            }
        },
        mounted() {
            this.getStates()
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
                const page = this.$route.query.page || 1
                const resp = await this.$axios.get(`/channels?page=${page}&search=${this.searchText}`)
                if (resp.status === 200) {
                    return this.channels = resp.data
                }
                else {
                    return this.channels = {
                        query: [],
                        count: 0
                    }
                }
            }
        },
        watch: {
            searchText() {
                this.getStates()
            },
            getPage() {
                this.getStates()
            }
        }
    }
</script>

<style scoped>

</style>