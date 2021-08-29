<template>
    <ul class="pagination justify-content-center">
        <nuxt-link exact class="page-item" :key="i"  v-for="i in getPages" tag="li" :to="{query: {page: i}}"><a class="page-link">{{i}}</a></nuxt-link>
    </ul>
</template>

<script>
    export default {
        name: "Paginator",
        props: ['count'],
        computed: {
            getPages() {
                let pages = []
                const page = Number(this.$route.query.page) || 1
                if (page > 5) {
                    pages.push(1)
                }
                for (let i = page - 2; i<= page + 2;i++) {
                    if (i <= this.count && i > 0) {
                        pages.push(i)
                    }
                }
                if (this.count - 3 > page) {
                    pages.push(this.count)
                }
                return pages
            },

        },
    }
</script>

<style scoped lang="scss">
</style>