<template>
    <div class="dashboard" >
        <v-navigation-drawer class="fullheight" width="190" color="grey lighten-3" permanent app fixed>

            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="title">Sosial Media</v-list-item-title>
                </v-list-item-content>
            </v-list-item>

            <v-list dense nav>
                <v-list-item
                    v-for="item in items"
                    :key="item.title"
                    link
                    tag="router-link"
                    :to="item.to"
                >
                    <v-list-item-content >
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-list-item @click="logout">
                    <v-list-item-content >
                        <v-list-item-title>Logout</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
            </v-list>

        </v-navigation-drawer >
        <v-app-bar app fixed height="75px" elevation="0" color="grey lighten-3">
            <VSpacer />
            <v-btn text @click="routeMyProfile" class="text-capitalize">
                <p class="ma-0 mr-5">{{ user_name }}</p>
                <v-img
                    height="45"
                    width="45"
                    class="my-2 mx-auto rounded-circle"
                    :src="'http://127.0.0.1:8000/'+user_foto"
                ></v-img>
            </v-btn>
        </v-app-bar>
       <div class="white fullheight pa-5"  >
            <router-view color="white"></router-view>
        </div>
    </div>
</template>

<script>
export default {
    name: "Dashboard",
    data() {
        return {
            user_foto: localStorage.getItem("foto"),
            user_name: localStorage.getItem("name"),
            user_role: localStorage.getItem("role"),
            drawer: true,
            items:[
                
            ],
        };     
    },
    methods: {
        logout(){
            localStorage.removeItem('id');
            localStorage.removeItem('token');
            location.reload();
        },
        routeMyProfile() {
            this.$router.push({
                name: "Profil Pengguna",
            });
        }
    },
    mounted() {
        if(this.user_role == "admin") {
            this.items = [
                { title: "Admin Beranda", to: "/admin/home" },
                { title: "Admin Marketplace", to: "/admin/marketplace" },
            ];
        }
        else {
            this.items = [
                { title: "Beranda", to: "/home" },
                { title: "Marketplace", to: "/marketplace" },
            ];
        }
    },
};
</script>

<style scoped>
.fullheight{
    min-height: 100vh !important;
}
.router{
    text-decoration: none;
    color: black;
}
</style>