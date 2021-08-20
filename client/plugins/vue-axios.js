export default function ({ $axios, app, redirect, error }) {
    $axios.onRequest(config => {
        const token = app.$csrfToken()

        if (!config.headers['X-CSRF-Token'] && token)
            config.headers['X-CSRF-Token'] = token

        return config
    })
    $axios.onError(error  => {
        if (error.status === 500) {
            return error({statusCode: 500, message: error.response.data})
        }
        return error.response
    })
}