<template>
    <div class="auth-wrapper auth-v1 px-2">
        <div class="auth-inner py-2">

            <!-- Forgot Password v1 -->
            <b-card class="mb-0" v-if="reset">
                <b-link class="brand-logo" to="/">
                    <!-- logo -->
                    <logo/>

                    <h2 class="brand-text text-primary ml-1">
                        Vuexy
                    </h2>
                </b-link>

                <b-card-title class="mb-1">
                    Forgot Password? 🔒
                </b-card-title>
                <b-card-text class="mb-2">
                    Enter your email and we'll send you instructions to reset your password
                </b-card-text>

                <!-- form -->
                <validation-observer ref="simpleRules">
                    <b-form
                            class="auth-forgot-password-form mt-2"
                            @submit.prevent="submitForm"
                    >
                        <!-- email -->
                        <b-form-group
                                label="Email"
                                label-for="forgot-password-email"
                        >
                            <validation-provider
                                    #default="{ errors }"
                                    name="Email"
                                    rules="required|email"
                            >
                                <b-form-input
                                        id="forgot-password-email"
                                        v-model="email"
                                        :state="errors.length > 0 ? false:null"
                                        name="forgot-password-email"
                                        placeholder="john@example.com"
                                />
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>

                        <!-- submit button -->
                        <b-button
                                variant="primary"
                                block
                                type="submit"
                        >
                            Send reset link
                        </b-button>
                    </b-form>
                </validation-observer>

                <b-card-text class="text-center mt-2">
                    <b-link :to="'/auth/login'">
                        <feather-icon icon="ChevronLeftIcon"/>
                        Back to login
                    </b-link>
                </b-card-text>

            </b-card>
            <!-- /Forgot Password v1 -->
            <b-card class="mb-0" v-else>

                <!-- logo -->
                <b-link class="brand-logo" to="/">
                    <logo/>

                    <h2 class="brand-text text-primary ml-1">
                        Vuexy
                    </h2>
                </b-link>

                <b-card-title class="mb-1">
                    Reset Password 馃敀
                </b-card-title>
                <b-card-text class="mb-2">
                    Your new password must be different from previously used passwords
                </b-card-text>

                <!-- form -->
                <validation-observer ref="simpleRules">
                    <b-form
                            method="POST"
                            class="auth-reset-password-form mt-2"
                            @submit.prevent="submitForm"
                    >

                        <!-- password -->
                        <b-form-group
                                label="New Password"
                                label-for="reset-password-new"
                        >
                            <validation-provider
                                    #default="{ errors }"
                                    name="Password"
                                    vid="Password"
                                    rules="required"
                            >
                                <b-input-group
                                        class="input-group-merge"
                                        :class="errors.length > 0 ? 'is-invalid':null"
                                >
                                    <b-form-input
                                            id="reset-password-new"
                                            v-model="password"
                                            :type="passwordFieldType"
                                            :state="errors.length > 0 ? false:null"
                                            class="form-control-merge"
                                            name="reset-password-new"
                                            placeholder="路路路路路路路路路路路路"
                                    />
                                    <b-input-group-append is-text>
                                        <feather-icon
                                                class="cursor-pointer"
                                                :icon="passwordToggleIcon"
                                                @click="passwordFieldType === 'password' ? passwordFieldType = 'text' : passwordFieldType ='password'"
                                        />
                                    </b-input-group-append>
                                </b-input-group>
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>

                        <!-- confirm password -->
                        <b-form-group
                                label-for="reset-password-confirm"
                                label="Confirm Password"
                        >
                            <validation-provider
                                    #default="{ errors }"
                                    name="Confirm Password"
                                    rules="required|confirmed:Password"
                            >
                                <b-input-group
                                        class="input-group-merge"
                                        :class="errors.length > 0 ? 'is-invalid':null"
                                >
                                    <b-form-input
                                            id="reset-password-confirm"
                                            v-model="cPassword"
                                            :type="passwordFieldType"
                                            class="form-control-merge"
                                            :state="errors.length > 0 ? false:null"
                                            name="reset-password-confirm"
                                            placeholder="路路路路路路路路路路路路"
                                    />
                                    <b-input-group-append is-text>
                                        <feather-icon
                                                class="cursor-pointer"
                                                :icon="passwordToggleIcon"
                                                @click="passwordFieldType === 'password' ? passwordFieldType = 'text' : passwordFieldType ='password'"
                                        />
                                    </b-input-group-append>
                                </b-input-group>
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>

                        <!-- submit button -->
                        <b-button
                                block
                                type="submit"
                                variant="primary"
                        >
                            Set New Password
                        </b-button>
                    </b-form>
                </validation-observer>

                <p class="text-center mt-2">
                    <b-link :to="{name:'auth-login-v1'}">
                        <feather-icon icon="ChevronLeftIcon"/>
                        Back to login
                    </b-link>
                </p>

            </b-card>
        </div>
    </div>
</template>

<script>
    import {ValidationProvider, ValidationObserver} from 'vee-validate'
    import FeatherIcon from "../../components/FeatherIcon";
    import Logo from "../../components/Logo";

    export default {
        async asyncData({query}) {
            if (query && query.token) {
                return {reset: false}
            }
        },
        name: "reset",
        middleware: 'noAuth',
        components: {
            Logo,
            ValidationProvider,
            ValidationObserver,
            FeatherIcon
        },
        data() {
            return {
                reset: true,
                email: '',
                passwordFieldType: 'password',
                password: '',
                cPassword: ''
            }
        },
        computed: {
            passwordToggleIcon() {
                return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
            }
        },
        methods: {
            async submitForm() {
                try {
                    const validate = await this.$refs.simpleRules.validate()
                    if (validate) {
                        let resp
                        if (this.reset) {
                            resp = await this.$axios.post('/auth/reset', {
                                email: this.email
                            })
                        }
                        else {
                            if (this.$route.query &&  this.$route.query.token) {
                                resp = await this.$axios.post('/auth/reset', {
                                    token: this.$route.query.token,
                                    password: this.password
                                })
                            }
                        }
                        if (resp.status === 200) {
                            return this.$router.replace({path: '/auth/login'})
                        }
                        else {
                            this.$toast.error(resp.data.message)
                        }
                    }
                } catch (e) {
                    console.log(e)
                }
            },
        }
    }
</script>

<style lang="scss" scoped>
    @import '~~/assets/scss/@core/scss/vue/pages/page-auth.scss';
</style>
