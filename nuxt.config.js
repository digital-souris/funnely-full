const isDev = process.env.NODE_ENV !== 'production'

module.exports ={
    ...(!isDev && {
        modern: 'client'
    }),
    telemetry: false,
    rootDir: __dirname + '/client',
    head: {
        htmlAttrs: {
            lang: 'ru'
        },
        title: 'Funnely',
        meta: [
            {name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'},
            {hid: 'og:title', name: 'og:title', content: 'Funnely'},
            {hid: 'og:image', name:'og:image', content: '/system/social.jpg'},
            { hid: 'og:description', name: 'og:description', content: 'Funnely' },
            { hid: 'description', name: 'description', content: 'Funnely' }
        ],
        link: [
            { rel: 'icon', href: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png'},
            { rel: 'icon', href: '/favicon/favicon-16x16.png', sizes: '16x16' , type: 'image/png'},
            { rel: 'apple-touch-icon', href: '/favicon/apple-touch-icon.png', sizes: '180x180'},
            { rel: 'manifest', href: '/favicon/site.webmanifest'},
        ],
        script: [
        ]
    },
    serverMiddleware: [
        // '~~/serverMiddleware/headers'
    ],
    css: [
        '~/assets/css/icons.css',
        '~/assets/css/style.css'
    ],
    router: {
        middleware: [],
        prefetchLinks: false,
        linkActiveClass: 'active',
        linkExactActiveClass: 'active-link'
    },
    loading: { color: '#ddd' },
    plugins: [
        '~~/plugins/vue-validate.js',
        '~~/plugins/vue-axios.js',
        '~~/plugins/vue-modal.js'
    ],
    modules: [
        '@nuxtjs/pwa',
        '@nuxtjs/toast',
        'bootstrap-vue/nuxt',
        '@privyid/nuxt-csrf',
        '@nuxtjs/axios',
        '@nuxtjs/auth-next',
        'cookie-universal-nuxt',
        '@nuxtjs/style-resources',
    ],
    auth: {
        strategies: {
            local: {
                token: {
                    property: 'token',
                    global: true,
                    maxAge: 60 * 60,
                    type: 'Bearer'
                },
                refreshToken: {
                    property: 'remember',
                    data: 'token',
                    maxAge: 60 * 60 * 24 * 30
                },
                user: {
                    property: 'user'
                },
                endpoints: {
                    login: { url: '/auth/login', method: 'post' },
                    logout: { url: '/auth/logout', method: 'post' },
                    refresh: { url: '/auth/remember', method: 'post' },
                    user: { url: '/auth/user', method: 'get' }
                }
            },
        }
    },
    axios: {
        baseUrl: 'http://localhost:3002/api',
    },
    render: {
        resourceHints: false
    },
    build: {
        optimizeCss: false,
        filenames: {
            app: ({ isDev }) => isDev ? '[name].js' : 'js/[contenthash].js',
            chunk: ({ isDev }) => isDev ? '[name].js' : 'js/[contenthash].js',
            css: ({ isDev }) => isDev ? '[name].css' : 'css/[contenthash].css',
            img: ({ isDev }) => isDev ? '[path][name].[ext]' : 'img/[contenthash:7].[ext]',
            font: ({ isDev }) => isDev ? '[path][name].[ext]' : 'fonts/[contenthash:7].[ext]',
            video: ({ isDev }) => isDev ? '[path][name].[ext]' : 'videos/[contenthash:7].[ext]'
        },
        ...(!isDev && {
            html: {
                minify: {
                    collapseBooleanAttributes: true,
                    decodeEntities: true,
                    minifyCSS: true,
                    minifyJS: true,
                    processConditionalComments: true,
                    removeEmptyAttributes: true,
                    removeRedundantAttributes: true,
                    trimCustomFragments: true,
                    useShortDoctype: true
                }
            }
        }),
        splitChunks: {
            layouts: true,
            pages: true,
            commons: true
        },
        optimization: {
            minimize: !isDev
        },
        ...(!isDev && {
            extractCSS: {
                ignoreOrder: true
            }
        }),

        transpile: ['vue-lazy-hydration', 'intersection-observer', 'vee-validate/dist/rules', 'bootstrap-vue/src/icons'],
        postcss: {
            plugins: {
            },
            ...(!isDev && {
                preset: {
                    browsers: 'cover 99.5%',
                    autoprefixer: true
                }
            }),
        },
        extend (config, ctx) {
            config.module.rules.push(
                {
                    test: /\.js$/,
                    loader: 'babel-loader',
                    exclude: /(node_modules)/
                })
        },
        babel: {
            compact: true
        }
    }
}