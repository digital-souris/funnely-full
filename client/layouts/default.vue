<template>
    <div>
        <!-- Top Bar Start -->
        <main-header></main-header>
        <!-- Top Bar End -->
        <div class="clearfix"></div>
        <div class="page-wrapper">
            <div class="page-wrapper-inner">

                <!-- Navbar Custom Menu -->
                <main-navbar></main-navbar>
                <!-- end left-sidenav-->
            </div>
            <!--end page-wrapper-inner -->
            <!-- Page Content-->
            <div class="page-content">
                <nuxt/>
                <main-footer></main-footer>
            </div>
            <!-- end page content -->
        </div>
        <!-- end page-wrapper -->
    </div>
</template>

<script>
    import MainHeader from "../components/default/MainHeader";
    import MainFooter from "../components/default/MainFooter";
    import MainNavbar from "../components/default/MainNavbar";
    export default {
        name: "default",
        components: {MainNavbar, MainFooter, MainHeader}
    }
</script>

<style scoped>

</style>