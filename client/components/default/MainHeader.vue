<template>
    <div class="topbar">
        <!-- Navbar -->
        <nav class="navbar-custom">
            <!-- LOGO -->
            <div class="topbar-left">
                <a href="index.html" class="logo">
                        <span>
                            <img :src="require('~/assets/images/logo-sm.png')" alt="logo-small" class="logo-sm">
                        </span>
                    <span>
                            <img :src="require('~/assets/images/logo-dark.png')" alt="logo-large" class="logo-lg">
                        </span>
                </a>
            </div>

            <ul class="list-unstyled topbar-nav float-right">
                <li v-if="$auth.user">
                    <div class="float-right align-item-center mt-3 mr-4">
                        <button @click="goToAddChannel" class="btn btn-info px-4 align-self-center report-btn">Добавить канал</button>
                    </div>
                </li>
                <li class="dropdown">
                    <!--<a class="nav-link dropdown-toggle arrow-none waves-light waves-effect" data-toggle="dropdown"
                       href="#" role="button"
                       aria-haspopup="false" aria-expanded="false">
                        <i class="mdi mdi-bell-outline nav-icon"></i>
                        <span class="badge badge-danger badge-pill noti-icon-badge"></span>
                    </a>-->
                    <div class="dropdown-menu dropdown-menu-right dropdown-lg">
                        <!-- item-->
                        <h6 class="dropdown-item-text">
                            Notifications (258)
                        </h6>
                        <div class="slimscroll notification-list">
                            <!-- item-->
                            <a href="javascript:void(0);" class="dropdown-item notify-item active">
                                <div class="notify-icon bg-success"><i class="mdi mdi-cart-outline"></i></div>
                                <p class="notify-details">Your order is placed<small class="text-muted">Dummy text of
                                    the printing and typesetting industry.</small></p>
                            </a>
                            <!-- item-->
                            <a href="javascript:void(0);" class="dropdown-item notify-item">
                                <div class="notify-icon bg-warning"><i class="mdi mdi-message"></i></div>
                                <p class="notify-details">New Message received<small class="text-muted">You have 87
                                    unread messages</small></p>
                            </a>
                            <!-- item-->
                            <a href="javascript:void(0);" class="dropdown-item notify-item">
                                <div class="notify-icon bg-info"><i class="mdi mdi-glass-cocktail"></i></div>
                                <p class="notify-details">Your item is shipped<small class="text-muted">It is a long
                                    established fact that a reader will</small></p>
                            </a>
                            <!-- item-->
                            <a href="javascript:void(0);" class="dropdown-item notify-item">
                                <div class="notify-icon bg-primary"><i class="mdi mdi-cart-outline"></i></div>
                                <p class="notify-details">Your order is placed<small class="text-muted">Dummy text of
                                    the printing and typesetting industry.</small></p>
                            </a>
                            <!-- item-->
                            <a href="javascript:void(0);" class="dropdown-item notify-item">
                                <div class="notify-icon bg-danger"><i class="mdi mdi-message"></i></div>
                                <p class="notify-details">New Message received<small class="text-muted">You have 87
                                    unread messages</small></p>
                            </a>
                        </div>
                        <!-- All-->
                        <a href="javascript:void(0);" class="dropdown-item text-center text-primary">
                            View all <i class="fi-arrow-right"></i>
                        </a>
                    </div>
                </li>

                <li class="dropdown" :class="showAccount ? 'show' : ''">
                    <a class="nav-link dropdown-toggle waves-effect waves-light nav-user" data-toggle="dropdown"
                       href="#" role="button"
                       @click="showAccount = !showAccount"
                       aria-haspopup="false" aria-expanded="false">
                        <img :src="require('~/assets/images/users/user-1.jpg')" alt="profile-user"
                             class="rounded-circle"/>
                        <span class="ml-1 nav-user-name hidden-sm"> <i class="mdi mdi-chevron-down"></i> </span>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right" v-if="$auth.user" :class="showAccount ? 'show' : ''">
                        <!--<a class="dropdown-item" href="#"><i class="dripicons-user text-muted mr-2"></i> Profile</a>
                        <a class="dropdown-item" href="#"><i class="dripicons-wallet text-muted mr-2"></i> My Wallet</a>
                        <a class="dropdown-item" href="#"><i class="dripicons-gear text-muted mr-2"></i> Settings</a>
                        <a class="dropdown-item" href="#"><i class="dripicons-lock text-muted mr-2"></i> Lock screen</a>
                        <div class="dropdown-divider"></div>-->
                        <a class="dropdown-item" href="#" @click.prevent="logout"><i class="dripicons-exit text-muted mr-2" ></i>Выйти</a>
                    </div>
                    <div class="dropdown-menu dropdown-menu-right" v-else :class="showAccount ? 'show' : ''">
                        <nuxt-link class="dropdown-item" to="/auth/login">Войти</nuxt-link>
                        <nuxt-link class="dropdown-item" to="/auth/register">Регистрация</nuxt-link>
                    </div>
                </li>
            </ul>

        </nav>
        <!-- end navbar-->
    </div>
</template>

<script>
    export default {
        name: "MainHeader",
        data() {
            return {
                showAccount: false
            }
        },
        methods: {
            goToAddChannel() {
                this.$router.push({name: ''})
            },
            async logout() {
                await this.$auth.logout()
            }
        }
    }
</script>

<style scoped>

</style>