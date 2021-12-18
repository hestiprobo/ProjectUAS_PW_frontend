import Vue from "vue";

import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
return () => import(`./components/${path}.vue`);
}

const router = new VueRouter({
	mode: 'history',
	routes: [
		{
			path: '/',
			component: importComponent("DashboardLayout"),
			children: [

				//Dashboard
				{
					path: '/home',
					name: 'Home',
					meta: { title: 'Dashboard' },
					component: importComponent('DataMaster/Posts'),
				},
				//Courses
				{
					path: '/marketplace',
					name: 'Marketplace',
					meta: { title: 'Marketplace' },
					component: importComponent('DataMaster/Marketplace'),
				},
				{
					path: '/profil',
					name: 'Profil Pengguna',
					meta: { title: 'ProfilPengguna' },
					component: importComponent('MyProfile'),
				},
				//Dashboard
				{
					path: '/admin/home',
					name: 'Admin Home',
					meta: { title: 'Admin Dashboard' },
					component: importComponent('Admin/Posts'),
				},
				//Courses
				{
					path: '/admin/marketplace',
					name: 'Admin Marketplace',
					meta: { title: 'Marketplace' },
					component: importComponent('Admin/Marketplace'),
				},
			]
		},

		//Login
		{
			path: '/login',
			name: 'Login',
			meta: { title: 'Login' },
			component: importComponent('Login'),
		},
		{
			path: "*",
			redirect: "/",
		},

		{
			path: '/register',
			name: 'Register',
			meta: { title: 'Register' },
			component: importComponent('Register'),
		},

		{
			path: "*",
			redirect: "/",
		},

	],

});


//set judul
router.beforeEach((to, from, next) => {
	document.title = to.meta.title;
	if(to.name !== "Login" && localStorage.getItem("token") == null && to.name !== "Register"){
		next({name: 'Login'});
	}
	else{
		next();
	}
});
export default router;