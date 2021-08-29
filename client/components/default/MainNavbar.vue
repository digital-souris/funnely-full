<template>
    <div class="navbar-custom-menu" >

        <div class="container-fluid" v-if="$auth.user">
            <div id="navigation">
                <!-- Navigation Menu-->
                <ul class="navigation-menu list-unstyled">

                    <li class="has-submenu">
                        <a href="#">
                            <i class="mdi mdi-newspaper"></i>
                            Мои каналы
                        </a>
                        <ul class="submenu">
                            <nuxt-link v-for="item in getChannels" :key="item._id" :to="item._id" tag="li"><a>{{item.name}}</a></nuxt-link>
                            <li><a href="#" @click.prevent="$modal.show('addChannel')">Добавить канал</a></li>
                        </ul>
                    </li>

                    <li class="has-submenu">
                        <a href="#"><i class="mdi mdi-database"></i>База данных</a>
                        <ul class="submenu">
                            <li><a href="app-chat.html">Chat</a></li>
                            <li><a href="app-calendar.html">Calendar</a></li>
                            <li class="has-submenu">
                                <a href="#">ECommerce</a>
                                <ul class="submenu">
                                    <li><a href="app-ecommerce-product.html">Product</a></li>
                                    <li><a href="app-ecommerce-product-list.html">Product List</a></li>
                                    <li><a href="app-ecommerce-product-detail.html">Product Detail</a></li>
                                    <li><a href="app-ecommerce-cart.html">Cart</a></li>
                                    <li><a href="app-ecommerce-checkout.html">Checkout</a></li>
                                </ul>
                            </li>
                            <li><a href="app-contact-list.html">Contact List</a></li>
                            <li class="has-submenu">
                                <a href="#">Email</a>
                                <ul class="submenu">
                                    <li><a href="app-email-inbox.html">Inbox</a></li>
                                    <li><a href="app-email-read.html">Read Email</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li class="has-submenu">
                        <a href="#"><i class="mdi mdi-calendar-check-outline"></i>Контент план</a>
                        <ul class="submenu">
                            <li><a href="advanced-rangeslider.html">Range Slider</a></li>
                            <li><a href="advanced-sweetalerts.html">Sweet Alerts</a></li>
                            <li><a href="advanced-nestable.html">Nestable List</a></li>
                            <li><a href="advanced-ratings.html">Ratings</a></li>
                            <li><a href="advanced-highlight.html">Highlight</a></li>
                            <li><a href="advanced-session.html">Session Timeout</a></li>
                            <li><a href="advanced-idle-timer.html">Idle Timer</a></li>
                        </ul>
                    </li>

                    <li class="has-submenu">
                        <a href="#"><i class="mdi mdi-play-circle-outline"></i>Как пользоваться</a>
                        <ul class="submenu megamenu">
                            <li>
                                <ul>
                                    <li><a href="ui-alerts.html">Alerts</a></li>
                                    <li><a href="ui-buttons.html">Buttons</a></li>
                                    <li><a href="ui-cards.html">Cards</a></li>
                                    <li><a href="ui-dropdowns.html">Dropdowns</a></li>
                                    <li><a href="ui-modals.html">Modals</a></li>
                                    <li><a href="ui-typography.html">Typography</a></li>
                                    <li><a href="ui-progress.html">Progress</a></li>
                                    <li><a href="ui-tabs-accordions.html">Tabs & Accordions</a></li>
                                </ul>
                            </li>
                            <li>
                                <ul>
                                    <li><a href="ui-tooltips-popovers.html">Tooltips & Popover</a></li>
                                    <li><a href="ui-carousel.html">Carousel</a></li>
                                    <li><a href="ui-pagination.html">Pagination</a></li>
                                    <li><a href="ui-grid.html">Grid System</a></li>
                                    <li><a href="ui-scrollspy.html">Scrollspy</a></li>
                                    <li><a href="ui-spinners.html">Spinners</a></li>
                                    <li><a href="ui-toasts.html">Toasts</a></li>
                                </ul>
                            </li>
                            <li>
                                <ul>
                                    <li><p class="font-12 mb-0 py-2 rounded-pill mt-2 badge badge-soft-success">Extra Components</p></li>
                                    <li><a href="ui-other-animation.html">Animation</a></li>
                                    <li><a href="ui-other-avatar.html">Avatar</a></li>
                                    <li><a href="ui-other-clipboard.html">Clip Board</a></li>
                                    <li><a href="ui-other-files.html">File Meneger</a></li>
                                    <li><a href="ui-other-ribbons.html">Ribbons</a></li>
                                    <li><a href="ui-other-dragula.html">Dragula</a></li>
                                    <li><a href="ui-other-check-radio.html">Check & Radio Buttons</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li class="has-submenu">
                        <a href="#"><i class="mdi mdi-message-alert"></i>Обратная связь</a>
                        <ul class="submenu">
                            <li class="has-submenu">
                                <a href="#">Icons</a>
                                <ul class="submenu">
                                    <li><a href="icons-materialdesign.html">Material Design</a></li>
                                    <li><a href="icons-dripicons.html">Dripicons</a></li>
                                    <li><a href="icons-fontawesome.html">Font awesome</a></li>
                                    <li><a href="icons-themify.html">Themify</a></li>
                                    <li><a href="icons-typicons.html">Typicons</a></li>
                                </ul>
                            </li>
                            <li class="has-submenu">
                                <a href="#">Tables </a>
                                <ul class="submenu">
                                    <li><a href="tables-basic.html">Basic</a></li>
                                    <li><a href="tables-datatable.html">Datatables</a></li>
                                    <li><a href="tables-responsive.html">Responsive</a></li>
                                    <li><a href="tables-footable.html">Footable</a></li>
                                    <li><a href="tables-jsgrid.html">Jsgrid</a></li>
                                    <li><a href="tables-editable.html">Editable</a></li>
                                </ul>
                            </li>
                            <li class="has-submenu">
                                <a href="#">Forms</a>
                                <ul class="submenu">
                                    <li><a href="forms-elements.html">Basic Elements</a></li>
                                    <li><a href="forms-advanced.html">Advance Elements</a></li>
                                    <li><a href="forms-validation.html">Validation</a></li>
                                    <li><a href="forms-wizard.html">Wizard</a></li>
                                    <li><a href="forms-editors.html">Editors</a></li>
                                    <li><a href="forms-repeater.html">Repeater</a></li>
                                    <li><a href="forms-x-editable.html">X Editable</a></li>
                                    <li><a href="forms-uploads.html">File Upload</a></li>
                                    <li><a href="forms-img-crop.html">Image Crop</a></li>
                                </ul>
                            </li>
                            <li class="has-submenu">
                                <a href="#">Maps</a>
                                <ul class="submenu">
                                    <li><a href="maps-google.html">Google Maps</a></li>
                                    <li><a href="maps-vector.html">Vector Maps</a></li>
                                </ul>
                            </li>
                            <li class="has-submenu">
                                <a href="#">Email Templates</a>
                                <ul class="submenu">
                                    <li><a href="email-templates-basic.html">Basic Action Email</a></li>
                                    <li><a href="email-templates-alert.html">Alert Email</a></li>
                                    <li><a href="email-templates-billing.html">Billing Email</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>

                    <li class="has-submenu">
                        <a href="#"><i class="mdi mdi-chart-bar"></i>Charts</a>
                        <ul class="submenu">
                            <li><a href="charts-apex.html">Apex</a></li>
                            <li><a href="charts-morris.html">Morris</a></li>
                            <li><a href="charts-chartist.html">Chartist</a></li>
                            <li><a href="charts-flot.html">Flot</a></li>
                            <li><a href="charts-peity.html">Peity</a></li>
                            <li><a href="charts-chartjs.html">Chartjs</a></li>
                            <li><a href="charts-sparkline.html">Sparkline</a></li>
                            <li><a href="charts-knob.html">Jquery Knob</a></li>
                            <li><a href="charts-justgage.html">JustGage</a></li>
                        </ul>
                    </li>

                    <li class="has-submenu">
                        <a href="#"><i class="mdi mdi-book-open-page-variant"></i>Pages</a>
                        <ul class="submenu megamenu">
                            <li>
                                <ul>
                                    <li><a href="page-tour.html">Tour</a></li>
                                    <li><a href="page-timeline.html">Timeline</a></li>
                                    <li><a href="page-invoice.html">Invoice</a></li>
                                    <li><a href="page-treeview.html">Treeview</a></li>
                                    <li><a href="page-profile.html">Profile</a></li>
                                    <li><a href="page-pricing.html">Pricing</a></li>
                                    <li><a href="page-blogs.html">Blogs</a></li>

                                    <li><a href="page-gallery.html">Gallery</a></li>
                                </ul>
                            </li>
                            <li>
                                <ul>
                                    <li><a href="page-faq.html">FAQs</a></li>
                                    <li><a href="page-starter.html">Starter Page</a></li>
                                    <li><a href="auth-login.html">Login</a></li>
                                    <li><a href="auth-register.html">Register</a></li>
                                    <li><a href="auth-recoverpw.html">Recover Password</a></li>
                                    <li><a href="auth-lock-screen.html">Lock Screen</a></li>
                                    <li><a href="auth-404.html">Error 404</a></li>
                                    <li><a href="auth-500.html">Error 500</a></li>
                                </ul>
                            </li>
                        </ul>
                    </li>
                </ul>
                <!-- End navigation menu -->
            </div> <!-- end navigation -->
        </div> <!-- end container-fluid -->
    </div>
</template>

<script>
    export default {
        name: "MainNavbar",
        computed: {
            getChannels() {
                if (!this.$auth.user) {
                    return []
                }
                if (!this.$auth.user.channels.length) {
                    return []
                }
                return this.$auth.user.channels
            }
        }
    }
</script>

<style scoped>

</style>