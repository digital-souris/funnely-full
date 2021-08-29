<template>
    <footer class="footer text-center text-sm-left">
        &copy; {{getYear}} Funnelly <span class="text-muted d-none d-sm-inline-block float-right"></span>
    </footer>
</template>

<script>
    export default {
        name: "MainFooter",
        computed: {
            getYear() {
                const date = new Date()
                return date.getFullYear()
            }
        }
    }
</script>

<style scoped>

</style>