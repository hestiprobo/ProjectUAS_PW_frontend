<template>
	<main>
		<v-app-bar app color="#FAFAFA" elevation="1" dark flat>
            <!-- <v-app-bar-nav-icon @click="drawer = true" class="black--text"></v-app-bar-nav-icon> -->
            <v-toolbar-title class="black--text font-weight-lighter">Social Media</v-toolbar-title>
            <v-spacer></v-spacer>
             <v-btn @click="login" depressed rounded color="#FAFAFA" class="text-capitalize black--text">
                Login
            </v-btn>
			<v-btn @click="register" depressed rounded color="#FAFAFA" class="text-capitalize black--text">
                Register
            </v-btn>
        </v-app-bar>
		<v-container fluid fill-height class="posisinya">
			<v-layout flex align-center justify-center>
				<v-flex xs12 sm6 elevation="0" border="red">
					<v-toolbar class="grey lighten-5 rounded-0">
						<v-toolbar-title class="grey--text" >
							<h1>Form Login</h1>
						</v-toolbar-title>
					</v-toolbar>
					<v-card class="rounded-0">
						<v-card-text class="pt-4">
							<div>
								<v-form v-model="valid" ref="form">
									<v-text-field
										label="E-mail"
										v-model="email"
										:rules="emailRules"
										required
										outlined
									></v-text-field>
									<v-text-field
										label="Password"
										v-model="password"
										type="password"
										min="8"
										:rules="passwordRules"
										counter
										required
										outlined
									></v-text-field>
									
									<v-layout justify-end>
										<v-btn
											class="mr-2 pa-5 text-capitalize"
											@click="submit"
											:class="{
												'white--text': valid,
											}"
											elevation="0"
											color="primary"
										>Login</v-btn>
										
									</v-layout>
								</v-form>
							</div>
						</v-card-text>
					</v-card>
					<v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{
						error_message
					}}</v-snackbar>
				</v-flex>
			</v-layout>
		</v-container>
	</main>
</template>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Montserrat&display=swap');
	.grey--text {
		font-family: 'Montserrat', sans-serif;
		font-size: 8px;
		font-weight: 100;
	}

	.posisinya {
		position: fixed;
		background: rgb(255, 255, 255);
		top: 0px;
		left: 0;
		right: 0;
	}
</style>

	<script>
	export default {
		name: "Login",
		data() {
			return {
				load: false,
				snackbar: false,
				error_message: "",
				color: "",
				valid: false,
				password: "",
				passwordRules: [(v) => !!v || "Password tidak boleh kosong :("],
				email: "",
				emailRules: [(v) => !!v || "E-mail tidak boleh kosong :("],
			};
		},
		methods: {
			submit() {
			if (this.$refs.form.validate()) {
				//cek validasi data yang terkirim
				this.load = true;
				this.$http
				.post(this.$api + "/login", {
					email: this.email,
					password: this.password,
				})
				.then((response) => {
					//simpan data id user yang diinput
					console.log(response)
					console.log(response.data.user.access_token)
					

					// simpen usernya
					localStorage.setItem("id", response.data.user.id);
					localStorage.setItem("foto", response.data.user.foto);
					localStorage.setItem("role", response.data.user.role);
					localStorage.setItem("name", response.data.user.name);
					localStorage.setItem("email", response.data.user.email);
					localStorage.setItem("nomor", response.data.user.nomor);
					localStorage.setItem("token", response.data.access_token);


					// snackbar stuff
					this.error_message = response.data.message;
					this.color = "green";
					this.snackbar = true;
					this.load = false;
					this.clear();

					// nek udah push ke Dashboard sesuai sama rolenya

					if(response.data.user.role == "admin") {
						this.$router.push({
							name: "Admin Home",
						});
					}
					else {
						this.$router.push({
							name: "Home",
						});
					}
				})
				.catch((error) => {
					this.error_message = error.response.data.message;
					this.color = "red";
					this.snackbar = true;
					localStorage.removeItem("token");
					this.load = false;
				});
			}
			},
			register() {
				this.$router.push({
					name: "Register",
				});
			},
			login() {
				this.$router.push({
					name: "Login",
				});
			},
			clear() {
				this.$refs.form.reset(); //clear form login
			},
		},
	};
</script>
