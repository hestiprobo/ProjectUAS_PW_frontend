<template>
	<main>
		<v-app-bar app color="#FAFAFA" elevation="1" dark flat>
            <!-- <v-app-bar-nav-icon @click="drawer = true" class="black--text"></v-app-bar-nav-icon> -->
            <v-toolbar-title class="black--text font-weight-lighter">Social Media</v-toolbar-title>
            <v-spacer></v-spacer>
             <v-btn @click="loginView" depressed rounded color="#FAFAFA" class="text-capitalize black--text">
                Login
            </v-btn>
			<v-btn @click="registerView" depressed rounded color="#FAFAFA" class="text-capitalize black--text">
                Register
            </v-btn>
        </v-app-bar>
		<v-container fluid fill-height class="posisinya">
			<v-layout flex align-center justify-center>
				<v-flex xs12 sm6 elevation-0>
					<v-toolbar class="grey lighten-5 rounded-0">
						<v-toolbar-title class="grey--text">
							<h1>Form Register</h1>
						</v-toolbar-title>
					</v-toolbar>
					<v-card>
						<v-card-text class="pt-4">
							<div>
								<v-form v-model="valid" ref="form">
									<v-text-field
									label="Nama"
									v-model="name"
									:rules="nameRules"
									required
									outlined
								></v-text-field>
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
								<v-text-field
									label="Nomor Handphone"
									v-model="nomor"
									type="text"
									min="12"
									:rules="nomorRules"
									counter
									required
									outlined
								></v-text-field>
								<v-layout justify-end>
									<v-btn
										class="mr-2 text-capitalize pa-5"
										@click="register"
										:class="{
											'grey darken-1 white--text': valid,
										}"
										color="primary"
										elevation="0"
									>Register</v-btn>
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
		name: "Register",
		data() {
			return {
				load: false,
				snackbar: false,
				error_message: "",
				color: "",
				valid: false,
				name: "",
				nameRules: [(v) => !!v || "Nama tidak boleh kosong :("],
				password: "",
				passwordRules: [(v) => !!v || "Password tidak boleh kosong :("],
				email: "",
				emailRules: [(v) => !!v || "E-mail tidak boleh kosong :("],
				nomor:"",
				nomorRules :[
					v => !!v || 'Nomor telepon is required',
                    v => /^([0][8][0-9]{8,10})$/g.test(v) || 'Format nomor telepon salah',
					],
			};
		},
		methods: {
			register() {
				if (this.$refs.form.validate()) {
					//cek validasi data yang terkirim
					this.load = true;
					this.$http
					.post(this.$api + "/register", {
						name: this.name,
						email: this.email,
						password: this.password,
						nomor: this.nomor,
					})
					.then((response) => {
						//simpan data id user yang diinput
						localStorage.setItem("id", response.data.user.id);
						localStorage.setItem("token", response.data.access_token);
						this.error_message = response.data.message;
						this.color = "green";
						this.snackbar = true;
						this.load = false;
						this.clear();
						this.$router.push({
							name: "Login",
						});
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
			submit(){
				this.$router.push({
					name:'Login',
				});
			},
			registerView() {
				this.$router.push({
					name: "Register",
				});
			},
			loginView() {
				this.$router.push({
					name: "Login",
				});
			},
			clear() {
				this.$refs.form.reset(); //clear form register
			},
		},
	};
</script>