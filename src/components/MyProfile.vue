<template>
    <v-main>

        <!-- card profil -->
        <v-card
            class="mx-auto pa-4"
            max-width="1200"
            elevation="2"
            color="teal accent-2">
            <v-card-title>
                <h1>Edit Profile</h1>
            </v-card-title>
            <v-row>
                <v-col cols="6">
                    <v-card-text >
                        <v-img
                            :lazy-src="'http://127.0.0.1:8000/'+user_foto"
                            height="260"
                            width="260"
                            :src="'http://127.0.0.1:8000/'+user_foto"
                            class="mx-auto rounded-circle my-auto"
                        ></v-img>
                        <input
                            type="file"
                            label="Ubah foto profil disini"
                            :state="Boolean(profileInput.foto)"
                            @change="onImageChange"
                            class="mt-9"
                        />
                    </v-card-text>
                </v-col>
                <v-col cols="6">
                    <v-card-text>
                        <v-text-field
                            filled
                            name="input-7-4"
                            label="Nama"
                            :value="user_name"
                            v-model="profileInput.name"
                            :disabled="disableInputProfil"
                        ></v-text-field>
                        <v-text-field
                            filled
                            name="input-7-4"
                            label="Email"
                            :value="user_email"
                            type="email"
                            v-model="profileInput.email"
                            :disabled="disableInputProfil"
                        ></v-text-field>
                        <v-text-field
                            filled
                            name="input-7-4"
                            label="Handphone"
                            type="number"
                            :value="user_hp"
                            v-model="profileInput.nomor"
                            :disabled="disableInputProfil"
                        ></v-text-field>
                        
                        <span v-if="disableInputProfil == true">
                            <v-btn
                                class="text-capitalize mx-2"
                                color="primary"
                                @click="enableInput"                 
                            >
                                Edit Profil
                            </v-btn>
                        </span>
                        <span v-else>
                            <v-btn
                                class="text-capitalize mx-2"
                                color="primary"
                                @click="editProfileKuy"                 
                            >
                                Simpan Perubahan
                            </v-btn>
                            <v-btn
                                class="text-capitalize white--text mx-2"
                                color="red"
                                @click="disableInput"                 
                            >
                                Cancel
                            </v-btn>
                        </span>

                    </v-card-text>
                </v-col>
            </v-row>
        </v-card>





        <!-- postingan anda hey -->
        <v-card
            class="mx-auto mt-10"
            max-width="1200"
            elevation="0">
            <v-card-title>
                <!-- <h2 class="ma-0 pa-0">Edit Profile</h2> -->
            </v-card-title>
            <v-row>
                <v-col>
                    <v-card-text>
                        <v-textarea
                        filled
                        name="input-7-4"
                        label="Apa yang kamu pikirkan"
                        v-model="form.caption"
                        ></v-textarea>

                        <v-file-input
                            :rules="imageRules"
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Upload an image"
                            prepend-icon="mdi-camera"
                            label="Upload an image"
                            v-model="form.gambar"
                            filled
                        ></v-file-input>

                        <v-btn
                            class="text-capitalize"
                            color="primary"               
                            @click="save"
                        >
                            Submit Post
                        </v-btn>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-card>





        <!-- semua post kita -->
        <span v-for="(post, index) in posts" :key="index" class="mt-8">
            <!-- <span v-if="post.id_user == user_id"> -->
                <v-card class="mb-9 mx-10">
                    <template slot="progress">
                        <v-progress-linear
                            color="deep-purple"
                            height="10"
                            indeterminate
                        ></v-progress-linear>
                    </template>

                    <v-img height="250" :src="'http://127.0.0.1:8000'+post.gambar" ></v-img>

                    <p class="my-5">{{ post.caption }}</p>

                    <v-divider class="mx-4"></v-divider>
                        <v-row class="my-5">
                            <v-col>
                                <span v-if="post.get_user != null">
                                    <v-img height="70" width="70" rounded class="rounded-circle my-2 mx-auto" :src="'http://127.0.0.1:8000/'+post.get_user.foto"></v-img>
                                    <p class="my-2">By : {{ post.get_user.name }}</p>
                                </span>
                            </v-col>
                            <v-col style="display:flex; justify-content: center; align-items:center;">
                                
                                <span v-if="post.get_komentar != null">

                                    <!-- ini buat ngeklik ngebuka dialog detail komentar -->
                                    <v-btn text color="black" class="text-capitalize" dark @click.stop="openDetailPostWithComments(post.id)">
                                        <h3>{{ post.get_komentar.length }} Komentar</h3>
                                    </v-btn>


                                </span>

                            </v-col>
                        </v-row>
                        
                        
                    <v-divider class="mx-4"></v-divider>
                    
                    <span v-if="(post.get_user != null && post.get_user.id == user_id) || user_role == 'admin'">
                        <v-card-actions>
                            <v-btn color="primary" class="mx-auto" @click="showDialogEditPost(post.id)">
                                Edit
                            </v-btn>

                            <v-btn color="red" class="mx-auto" @click="deletePost(post.id)">
                                Hapus
                            </v-btn>
                        </v-card-actions>
                    </span>
                </v-card>
            <!-- </span> -->
        </span>

            




        <!-- dialog mengedit postingan -->
        <v-dialog v-model="dialogEditPost" max-width="1200px">
            <v-card>
                <v-card-title  color="blue-grey lighten-4">
                    <span class="headline">Edit Post</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-textarea
                                    filled
                                    name="input-7-4"
                                    label="Captions"
                                    v-model="post.caption"
                                    @change="cekCaption"
                                ></v-textarea>

                                <v-file-input
                                    :rules="imageRules"
                                    accept="image/png, image/jpeg, image/bmp"
                                    placeholder="Upload an image"
                                    prepend-icon="mdi-camera"
                                    label="Upload an image"
                                    v-model="post.gambar"
                                    @change="cekCaption"
                                    filled
                                ></v-file-input>
                            </v-col>
                            <v-col>
                                <v-img
                                    height="320"
                                    width="420"
                                    class="my-2 mx-auto"
                                    :src="'http://127.0.0.1:8000'+post.gambar"
                                ></v-img>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="dialogEditPost = false">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="editPost">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>




        <!-- dialog ngeliat comment dari sebuah post -->
        <template>
            <v-row justify="center">
                <v-dialog v-model="dialogDetailPost" fullscreen hide-overlay transition="dialog-bottom-transition" class="rounded-0">
                    <v-card class="rounded-0">


                        <v-toolbar dark color="blue-grey lighten-1">
                            <v-toolbar-title>Detail Post</v-toolbar-title>
                            <v-spacer></v-spacer>
                            
                            <v-toolbar-items>
                                <v-btn dark text @click="dialogDetailPost = false">
                                    <v-icon>mdi-close</v-icon>
                                </v-btn>
                            </v-toolbar-items>
                        </v-toolbar>                        
                        


                        <v-container fluid>
                            <v-row style="min-height:100vh; padding:40px;">
                                <v-col cols="7">
                                    
                                    <v-img :src="'http://127.0.0.1:8000'+postsWithComments.gambar" alt="heo"></v-img>
                                    <p class="ma-0" style="text-align:start; padding:10px">{{ postsWithComments.caption }}</p>

                                    <v-container fluid style="border: 1px grey solid; border-radius:5px;">
                                        <v-row>
                                            <v-col cols="1">
                                                <v-img height="50" width="50" rounded class="rounded-circle me-auto" :src="'http://127.0.0.1:8000/'+postsWithComments.get_user.foto"></v-img>
                                            </v-col>
                                            <v-col cols="11" style="display:flex; justify-content:center; align-items:center;">
                                                <p class="ma-0 me-auto">Posted by : {{ postsWithComments.get_user.name }}</p>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    
                                </v-col>
                                <v-col cols="5">
                                    <v-card class="mx-auto" elevation="0" outlined style="padding:20px;">
                                        <v-text-field label="Tulis Komentar" placeholder="Komentar" filled v-model="komentarBaru.komentar"></v-text-field>
                                       
                                        <v-card-actions>
                                            <v-btn elevation="0" color="primary" width="100%" class="text--capitalize" @click="kirimKomentar(postsWithComments.id)" >
                                                Kirim
                                            </v-btn>
                                        </v-card-actions>
                                    </v-card>

                                    <h3 class="text-start mt-4">Komentar</h3>

                                    <span v-if="postsWithComments.get_komentar.length > 0">
                                        <span v-for="(comment, index) in postsWithComments.get_komentar" :key="index">
                                            <v-card class="mx-auto mb-2" elevation="0" outlined style="padding:0px;">
                                                <v-card-text>
                                                    <h4 class="text-start black--text">{{ comment.get_commented_user.name }}</h4>
                                                    <p class="text-start black--text ma-0">{{ comment.komentar }}</p>
                                                    <p class="text-start black--text ma-0">{{ comment.created_at }}</p>
                                                    
                                                    <span v-if="user_role == 'admin' || (user_role != 'admin' && comment.get_commented_user.id == user_id)">
                                                        <div style="display:flex; align-items:flex-start; padding:4px;">
                                                            <v-btn text color="primary" class="mr-3" @click="editKomentarShow(comment.id)" >Edit</v-btn>
                                                            <v-btn text color="red" @click="hapusKomentarShow(comment.id)" >Hapus</v-btn>
                                                            <v-spacer></v-spacer>
                                                        </div>
                                                    </span>

                                                </v-card-text>
                                            </v-card>
                                        </span>
                                    </span>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card>
                </v-dialog>


                <v-dialog v-model="dialogEditKomentar" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Edit Komentar
                    </v-card-title>

                    <v-card-text class="pa-5">
                        <v-textarea
                            label="Komentar"
                            placeholder="Masukkan komentar"
                            filled
                            v-model="komentarAmbil.komentar"
                        ></v-textarea>
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn
                            color="primary"
                            text
                            @click="editKomentar"
                            class="text-capitalize"
                        >
                            Simpan
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            
            <v-dialog v-model="dialogDeleteKomentar" width="500">
                <v-card>
                    <v-card-title class="text-h5 grey lighten-2">
                        Hapus komentar
                    </v-card-title>

                    <v-card-text class="py-0">
                        <p class="ma-0 pa-4 black--text text-start">Yakin ingin hapus komentar ?</p>
                    </v-card-text>                    

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="red" text @click="hapusKomentar">
                            Hapus
                        </v-btn>
                        <v-btn color="success" elevation="0"  @click="dialogDeleteKomentar = false, deleteId = ''">
                            Cancel
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>


            </v-row>
        </template>


        <v-snackbar v-model="snackbar" :color="color" timeout="5000" bottom>{{
            error_message
        }}</v-snackbar>
    </v-main>
</template>

<script>
export default {
    name: "Profile",
    data() {
        return {
            // snackbar
            snackbar:false,
            color: "",
            error_message:"",

            // dialog atau status
            editProfil: false,
            disableInputProfil : true,
            dialogConfirm:false,
            dialogEditPost: false,
            dialogDetailPost:false,
            dialogEditKomentar:false,
            dialogDeleteKomentar:false,

            
            user_id: localStorage.getItem("id"),
            user_foto: localStorage.getItem("foto"),
            user_name: localStorage.getItem("name"),
            user_email: localStorage.getItem("email"),
            user_hp: localStorage.getItem("nomor"),
            user_role: localStorage.getItem("role"),


            
            // form: {
            //     id_user: localStorage.getItem("id"),
            //     caption:"",
            //     gambar: null,
            // },

            posts: [],
            post: {
                id_user: localStorage.getItem("id"),
                caption:"",
                gambar: null, 
            },
            profileInput : {
                name : localStorage.getItem("name"),
                email : localStorage.getItem("email"),
                nomor: localStorage.getItem("nomor"),
                foto : null,
            },
            postsWithComments: {
                id: "",
                id_user: "",
                gambar: "",
                caption: "",
                created_at: "",
                updated_at: "",
                get_komentar: [],
                get_user: {
                    id: "",
                    name: "",
                    email: "",
                    email_verified_at: "",
                    role: "",
                    foto: "",
                    nomor: "",
                    created_at: "",
                    updated_at: "",
                }
            },
            komentarBaru: {
                id_user:localStorage.getItem("id"),
                id_post:0,
                komentar:"",
            },
            komentarAmbil : {
                id: "",
                id_user: "",
                id_post: "",
                komentar: "",
                created_at: "",
                updated_at: "",
                get_post: {
                    id: "",
                    id_user: "",
                    title: "",
                    deskripsi: "",
                    foto: "",
                    harga: "",
                    keterangan: "",
                    created_at: "",
                    updated_at: "",
                },
                "get_commented_user": {
                    id: "",
                    name: "",
                    email: "",
                    email_verified_at: "",
                    role: "",
                    foto: "",
                    nomor: "",
                    created_at: "",
                    updated_at: "",
                }
            },


            formData: new FormData(),
            form: {
                id_user: localStorage.getItem("id"),
                caption:"",
                gambar: null,
            },

            // rules
            imageRules: [
                value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
            ],
        };     
    },
    methods: {
        enableInput() {
            this.disableInputProfil = false;
        },
        disableInput() {
            this.disableInputProfil = true;
        },
       
        //read data users
        readDataPostingan() {
            var url = this.$api +'/posting/list';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.posts = response.data.data;                

                if(this.user_role != "admin") {
                    for(var i=0 ; i<this.posts.length ; i++)
                    {
                        if(this.posts[i].id == this.user_id) {
                            this.posts.splice(this.posts.indexOf(this.posts[i]),1);
                        }
                    }
                }
            })
        },
        save(){
            // this.user.append('name', this.form.name);
            // this.user.append('email', this.form.email);
            // this.user.append('password', this.form.password);
            // this.user.append('kapasitas', this.form.kapasitas);

            this.formData.append("id_user", this.form.id_user);
            this.formData.append("caption", this.form.caption);
            this.formData.append("gambar", this.form.gambar);

            var url = this.$api + '/posting/tambah'
            this.load = true;
            this.$http.post(url, this.formData,{
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response =>{
                this.error_message = response.data.pesan;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.close();
                this.readDataPostingan(); // baca data
                this.resetForm();
                this.dialogEditPost = false;
            }).catch(error => {
                this.error_message = error.response.data.pesan;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        editProfileKuy() {
            console.log(this.profileInput)
            var url = this.$api + '/profil/update/' + this.user_id
            this.$http.put(
                url, 
                this.profileInput,
            {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.pesan;
                this.color = "green"
                this.snackbar = true;
                this.overlay = false

                // simpen ulang usernya
                localStorage.setItem("name", this.profileInput.name);
                localStorage.setItem("email", this.profileInput.email);
                localStorage.setItem("nomor", this.profileInput.nomor);
                // localStorage.setItem("foto", response.data.user.foto);
            }).catch(error => {
                this.error_message = error.response.data.pesan;
                this.color = "red"
                this.snackbar = true;
                this.load = false;
                this.overlay = false
            })
        },
        routeMyProfile() {
            this.$router.push({
                name: "Profil Pengguna",
            });
        },
        onImageChange(e) {
            const files = e.target.files || e.dataTransfer.files
            if (!files.length){
                return
            }
            this.createImage(files[0])
        },
        createImage(file) {
            const reader = new FileReader()
            reader.onload = (e) => {                
                this.profileInput.foto = e.target.result
            }
            reader.readAsDataURL(file)
            
        },
        showDialogEditPost(id) {
            var url = this.$api +'/posting/view/' + id;
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                console.log(response.data);
                this.post = response.data.data;
                console.log(this.post.caption);
                this.dialogEditPost = true;
            })
        },
        //hapus data produk
        deletePost(id){
          //menghapus data
            console.log(id);
            var url = this.$api + '/posting/hapus/' + id;
            this.load = true;
            
            this.$http.delete(url,{
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.message;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.close();
                this.readDataPostingan(); // baca data
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        
















        cekCaption() {
            console.log(this.form);
        },
        hapusKomentarShow(id_komentar) {
            this.deleteId = id_komentar;
            this.dialogDeleteKomentar = true
        },
        editKomentarShow(id_komentar){
            var url = this.$api +'/komentar/' + id_komentar;
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.komentarAmbil = response.data.data;
                this.dialogEditKomentar = true;
                console.log(this.komentarAmbil)
            })
        },
        hapusKomentar() {
            var url = this.$api + '/komentar/hapus/' + this.deleteId;
            this.load = true;
            this.$http.delete(url,{
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.error_message = response.data.pesan;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.readDataPostingan(); // baca data
                this.dialogDeleteKomentar = false;
                this.dialogDetailPost = false;
            }).catch(error => {
                this.error_message = error.response.data.message;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        editKomentar() {
            var url = this.$api + '/komentar/edit/' + this.komentarAmbil.id;
            this.load = true;
            this.$http.put(url, this.komentarAmbil, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response =>{
                this.error_message = response.data.pesan;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.readDataPostingan(); // baca data
                this.dialogEditKomentar = false;
                this.dialogDetailPost = false;
            }).catch(error => {
                this.error_message = error.response.data.pesan;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        setForm(){
           if(this.inputType !== 'Tambah') {
               this.update();
           }else{
               this.save();
           }
        },
        // save(){
        //     // this.user.append('name', this.form.name);
        //     // this.user.append('email', this.form.email);
        //     // this.user.append('password', this.form.password);
        //     // this.user.append('kapasitas', this.form.kapasitas);

        //     this.formData.append("id_user", this.form.id_user);
        //     this.formData.append("caption", this.form.caption);
        //     this.formData.append("gambar", this.form.gambar);

        //     var url = this.$api + '/posting/tambah'
        //     this.load = true;
        //     this.$http.post(url, this.formData,{
        //         headers: {
        //             'Authorization' : 'Bearer ' + localStorage.getItem('token'),
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     }).then(response =>{
        //         this.error_message = response.data.message;
        //         this.color = "green";
        //         this.snackbar = true;
        //         this.load = true;
        //         this.close();
        //         this.readDataPostingan(); // baca data
        //         this.resetForm();
        //         this.dialogEditPost = false;
        //     }).catch(error => {
        //         this.error_message = error.response.data.message;
        //         this.color = "red";
        //         this.snackbar = true;
        //         this.load = false;
        //     });
        // },
        //ubah data user
        editPost(){
            let newData= {
                id : this.post.id,
                id_user : this.post.post,
                caption : this.post.caption,
                gambar: this.post.gambar
            };
            
            var url = this.$api + '/posting/edit/' + this.post.id + '?_method=PUT';
            // alert(url)
            this.load = true;
            this.$http.post(url, newData, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token'),
                    // 'Content-Type': 'multipart/form-data'
                }
            }).then(response =>{
                this.error_message = response.data.pesan;
                this.color = "green";
                this.snackbar = true;
                this.load = false;
                this.close();
                this.readDataPostingan(); // baca data
                this.resetForm();
                this.dialogEditPost = false;
            }).catch(error => {
                this.error_message = error.response.data.pesan;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        
        openDetailPostWithComments(id) {
            var url = this.$api +'/posting/view/' + id;
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.postsWithComments = response.data.data;
                console.log(this.postsWithComments);
                this.dialogDetailPost = true;
            })
        },
        kirimKomentar(id_post) {
            var url = this.$api + '/komentar/kirim'
            this.load = true;
            this.komentarBaru.id_post = id_post;
            this.$http.post(url, this.komentarBaru,{
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response =>{
                this.error_message = response.data.pesan;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.readDataPostingan(); // baca data

                // bersihkan variabel
                this.komentarBaru.id_post = 0;
                this.komentarBaru.komentar = "";
                this.komentarBaru.id_user = localStorage.getItem("id");

                // tutup dialog detail post
                this.dialogDetailPost = false;
            }).catch(error => {
                this.error_message = error.response.data.pesan;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        editHandler(item){
            this.inputType = 'Ubah';
            this.editId = item.id;
            this.form.name= item.name;
            this.form.email = item.email;
            this.form.password= item.password;
            // this.form.kapasitas = item.kapasitas;
            this.dialog = true;
        },
        deleteHandler(id){
            this.deleteId = id;
            this.dialogConfirm = true;
        },
        close(){
             this.dialog = false;
             this.inputType = 'Tambah';
             this.dialogConfirm = false;
            //  this.readData();
        },
        cancel(){
             this.resetForm();
            //  this.readData();
             this.dialog = false;
             this.dialogConfirm = false;
             this.inputType = 'Tambah';
        },
        resetForm(){
            this.form = {
                name: null,
                email: null,
                password: null
                // kapasitas: null
            };
        },
    },
    mounted(){
        this.readDataPostingan();
    },
};
</script>