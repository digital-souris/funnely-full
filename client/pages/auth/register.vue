<template>
    <div class="auth-wrapper auth-v1 px-2">
        <div class="auth-inner py-2">

            <!-- Register v1 -->
            <b-card class="mb-0">
                <b-link class="brand-logo" to="/">
                    <logo></logo>
                    <h2 class="brand-text text-primary ml-1">
                        Vuexy
                    </h2>
                </b-link>

                <b-card-title class="mb-1">
                    Adventure starts here 🚀
                </b-card-title>
                <b-card-text class="mb-2">
                    Make your app management easy and fun!
                </b-card-text>

                <!-- form -->
                <validation-observer ref="registerForm">
                    <b-form
                            class="auth-register-form mt-2"
                            @submit.prevent="validationForm"
                    >
                        <!-- username -->
                        <b-form-group
                                label="Имя"
                                label-for="username"
                        >
                            <validation-provider
                                    #default="{ errors }"
                                    name="Имя"
                                    rules="required"
                            >
                                <b-form-input
                                        id="username"
                                        v-model="register.name"
                                        :state="errors.length > 0 ? false:null"
                                        name="register-username"
                                        placeholder="johndoe"
                                />
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>

                        <!-- email -->
                        <b-form-group
                                label="Email"
                                label-for="email"
                        >
                            <validation-provider
                                    #default="{ errors }"
                                    name="Email"
                                    rules="required|email"
                            >
                                <b-form-input
                                        id="email"
                                        v-model="register.email"
                                        :state="errors.length > 0 ? false:null"
                                        name="register-email"
                                        placeholder="john@example.com"
                                />
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>

                        <!-- password -->
                        <b-form-group
                                label="Password"
                                label-for="password"
                        >
                            <validation-provider
                                    #default="{ errors }"
                                    name="Password"
                                    rules="required"
                            >
                                <b-input-group
                                        class="input-group-merge"
                                        :class="errors.length > 0 ? 'is-invalid':null"
                                >
                                    <b-form-input
                                            id="password"
                                            v-model="register.password"
                                            :type="passwordFieldType"
                                            :state="errors.length > 0 ? false:null"
                                            class="form-control-merge"
                                            name="register-password"
                                            placeholder="············"
                                    />
                                    <b-input-group-append is-text>
                                        <feather-icon
                                                :icon="passwordToggleIcon"
                                                class="cursor-pointer"
                                                @click="passwordFieldType === 'password' ? passwordFieldType = 'text' : passwordFieldType ='password'"
                                        />
                                    </b-input-group-append>
                                </b-input-group>
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>
                        </b-form-group>

                        <!-- checkbox -->
                        <b-form-group>
                            <validation-provider
                                    #default="{ errors }"
                                    name="Policy"
                                    :rules="{ required: { allowFalse: false } }">
                                <b-form-checkbox
                                        id="register-privacy-policy"
                                        v-model="status"
                                        name="checkbox-1"
                                >
                                    I agree to
                                    <b-link>privacy policy & terms</b-link>
                                </b-form-checkbox>
                                <small class="text-danger">{{ errors[0] }}</small>
                            </validation-provider>

                        </b-form-group>
                        <p v-if="message.length">{{message}}</p>
                        <!-- submit button -->
                        <b-button
                                variant="primary"
                                block
                                type="submit"
                        >
                            Sign up
                        </b-button>
                    </b-form>
                </validation-observer>

                <b-card-text class="text-center mt-2">
                    <span>Already have an account? </span>
                    <b-link :to="'/auth/login'">
                        <span>Sign in instead</span>
                    </b-link>
                </b-card-text>

                <div class="divider my-2">
                    <div class="divider-text">
                        or
                    </div>
                </div>

                <!-- social buttons -->
                <div class="auth-footer-btn d-flex justify-content-center">
                    <b-button
                            variant="facebook"
                            href="javascript:void(0)"
                    >
                        <feather-icon icon="FacebookIcon"/>
                    </b-button>
                    <b-button
                            variant="twitter"
                            href="javascript:void(0)"
                    >
                        <feather-icon icon="TwitterIcon"/>
                    </b-button>
                    <b-button
                            variant="google"
                            href="javascript:void(0)"
                    >
                        <feather-icon icon="MailIcon"/>
                    </b-button>
                    <b-button
                            variant="github"
                            href="javascript:void(0)"
                    >
                        <feather-icon icon="GithubIcon"/>
                    </b-button>
                </div>
            </b-card>
            <!-- /Register v1 -->
        </div>
    </div>

</template>

<script>
    import {ValidationProvider, ValidationObserver} from 'vee-validate'
    import FeatherIcon from "../../components/FeatherIcon";
    import Logo from "../../components/Logo";

    export default {
        name: 'Register',
        middleware: 'noAuth',
        layout: 'empty',
        components: {
            Logo,
            ValidationProvider,
            ValidationObserver,
            FeatherIcon
        },
        data() {
            return {
                register: {
                    name: '',
                    email: '',
                    password: ''
                },
                status: '',
                message: '',
                passwordFieldType: 'password',
            }
        },
        computed: {
            passwordToggleIcon() {
                return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon'
            },
        },
        methods: {
            async validationForm() {
                try {
                    const success = await this.$refs.registerForm.validate()
                    if (success) {
                        const resp = await this.$axios.post('/auth/register', this.register)
                        if (resp.status == 200) {
                            await this.$router.replace({path:'/auth/login'})
                            await this.$toast.success('Регистрация прошла успешно')
                        }
                        else {
                            return this.message = resp.data.message
                        }
                    }
                } catch (e) {
                    console.log(e)
                }

            },
        },
    }
</script>

<style lang="scss" scoped>
    @import '~~/assets/scss/@core/scss/vue/pages/page-auth.scss';
</style>
