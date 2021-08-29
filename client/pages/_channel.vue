<template>
    <div class="container-fluid">
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-md-12">
                                <h4 class="mt-0">Канал {{channel.name}}</h4>
                                <p class="text-muted"></p>
                                <div class="row justify-content-center">
                                    <div class="col-md-3">
                                        <div class="card mb-0">
                                            <div class="card-body">
                                                <div class="float-right">
                                                    <i class="dripicons-user-group font-24 text-secondary"></i>
                                                </div>
                                                <span class="badge badge-danger">Аудитория</span>
                                                <h3 class="font-weight-bold">{{channel.settings.auditory.toLocaleString()}}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="card mb-0">
                                            <div class="card-body">
                                                <div class="float-right">
                                                    <i class="dripicons-user-group font-24 text-secondary"></i>
                                                </div>
                                                <span class="badge badge-info">Подписчиков</span>
                                                <h3 class="font-weight-bold">{{channel.settings.subscribers.toLocaleString()}}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="card mb-0">
                                            <div class="card-body">
                                                <div class="float-right">
                                                    <i class="dripicons-jewel font-20 text-secondary"></i>
                                                </div>
                                                <span class="badge badge-warning">Кол-во статей</span>
                                                <h3 class="font-weight-bold">{{getAllStates.length.toLocaleString()}}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-3">
                                        <div class="card mb-0">
                                            <div class="card-body">
                                                <div class="float-right">
                                                    <i class="dripicons-wallet font-20 text-secondary"></i>
                                                </div>
                                                <span class="badge badge-success">Дата обновления</span>
                                                <h3 class="font-weight-bold">{{getDate}}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div><!--end card-body-->

                </div><!--end card-->
            </div> <!--end col-->
        </div><!--end row-->
        <div class="row" v-if="states.length">
            <div class="col-12">
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

                            <tr v-for="channel of getStates" :key="channel._id">
                                <td>{{channel.title}}</td>
                                <td style="max-width: 250px">
                                    <a :href="channel.link" target="_blank">{{channel.link}}</a>
                                </td>
                                <td>{{channel.likes.all}}</td>
                                <td>{{channel.views.all}}</td>
                                <td>{{channel.views.toEnd}}</td>
                                <td>{{dateTo(channel.publishDate)}}</td>
                                <td>
                                    <a :href="channel.link" target="_blank" class="mr-2 url-control"><i
                                            class="mdi mdi-eye-circle"></i></a>
                                </td>
                            </tr>
                        </table><!--end table-->
                    </div><!--end card-body-->
                </div><!--end card-->
            </div>
        </div>
        <paginator v-if="getCount " :count="getCount"></paginator>
    </div>
</template>

<script>
    import moment from 'moment'
    import Paginator from "../components/layout/Pagination";
    export default {
        name: "Channel",
        components: {Paginator},
        async asyncData({app, params, error}) {
            const resp = await app.$axios.get('/channels/' + params.channel)
            if (resp.status === 200) {
                return  resp.data
            }
            else {
                return error({
                    statusCode: 404
                })
            }
        },
        computed: {
            getDate() {
                return moment(this.channel.updatedAt).format('DD-MM-YYYY')
            },
            getAllStates() {
                return this.states.filter(item => {
                    return item.title !== undefined
                })
            },
            getCount() {
                return Math.ceil(this.getAllStates.length / 20)
            },
            getStates() {
                const page = this.$route.query.page || 1
                const all = this.getAllStates
                const states = all.slice((page - 1) * 20, page * 20)
                return states
            }
        },
        methods: {
            dateTo(date) {
                return moment(date).format('DD-MM-YYYY')
            }
        }

    }
</script>

<style scoped>

</style>