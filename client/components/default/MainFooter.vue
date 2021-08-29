<template>
    <div>
        <footer class="footer text-center text-sm-left">
            &copy; {{getYear}} Funnelly <span class="text-muted d-none d-sm-inline-block float-right"></span>
        </footer>
        <modal name="addChannel" height="auto">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title mt-0">Добавить канал</h5>
                </div>
                <form @submit.prevent="sendForm">
                    <div class="modal-body">
                        <div class="form-group row">
                            <label for="example-text-input" class="col-sm-2 col-form-label text-right">Ссылка</label>
                            <div class="col-sm-10">
                                <input class="form-control" type="text" v-model="link" id="example-text-input">
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button class="btn btn-primary">Добавить</button>
                        </div>
                    </div>
                </form>
            </div>
        </modal>
    </div>

</template>

<script>
    export default {
        name: "MainFooter",
        data() {
            return {
                link: ''
            }
        },
        computed: {
            getYear() {
                const date = new Date()
                return date.getFullYear()
            }
        },
        methods: {
            async sendForm() {
                const resp = await this.$axios.post('/channels/add', {
                    link: this.link
                })
                if (resp.status === 200) {
                    this.$toast.success('Канал успешно добавлен', {duration: 2000})
                    this.$modal.hide('addChannel')
                    this.$store.commit('updateChannels', resp.data)
                }
                else if (resp.status === 500) {
                    this.$toast.error('Неверно указанные данные', {duration: 2000})
                }
                else {
                    this.$toast.error(resp.data.message, {duration: 2000})
                }
            }
        }
    }
</script>

<style scoped lang="scss">
    .modal-content {
        background-color: #fff;
        border: none;
    }
    .modal-footer {
        background-color: #fff;
    }
</style>