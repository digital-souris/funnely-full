<template>
    <div></div>
</template>

<script>
    export default {
        name: "verify",
        middleware: 'noAuth',
        async asyncData({query, error, app, redirect}) {
            try {
                if (query && query.token) {
                    const resp = await app.$axios.post('/auth/verify', {
                        token: query.token
                    })
                    if (resp.status == 200) {
                        app.$toast.success(resp.data.message)
                    }
                    else {
                        app.$toast.error(resp.data.message)
                    }
                    return redirect('/')
                }
                else {
                    return error({statusCode: 404})
                }
            }
            catch (e) {
                console.log(e)
            }
        }
    }
</script>

<style scoped>

</style>