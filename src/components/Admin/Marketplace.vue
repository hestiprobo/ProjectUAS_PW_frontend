<template>
    <v-main class="list" >

        <v-card
            class="mx-auto"
            max-width="1200"
            elevation="0">
            <v-row>
                <v-col>
                    <v-card-text >
                        <v-img
                            lazy-src="https://picsum.photos/id/11/10/6"
                            height="300"
                            width="300"
                            src="https://picsum.photos/id/11/500/300"
                            class="mx-auto rounded-circle"
                        ></v-img>
                    </v-card-text>
                </v-col>
                <v-col>
                    <v-card-text>
                        <v-text-field
                            label="Judul item"
                            placeholder="Masukkan judul disini"
                            filled
                            v-model="form.title"
                        ></v-text-field>
                        <v-text-field
                            label="Harga item"
                            placeholder="Rp."
                            filled
                            v-model="form.harga"
                            type="number"
                        ></v-text-field>
                        <v-textarea
                            filled
                            name="input-7-4"
                            label="Caption"
                            @change="cekCaption"
                            v-model="form.deskripsi"
                        ></v-textarea>
                        <v-file-input
                            :rules="imageRules"
                            accept="image/png, image/jpeg, image/bmp"
                            placeholder="Masukkan foto barang"
                            prepend-icon="mdi-camera"
                            label="Masukkan foto barang"
                            @change="cekCaption"
                            filled
                            v-model="form.foto"
                        ></v-file-input>

                        <v-btn
                            class="text-capitalize"
                            color="primary"
                            @click="save"                 
                        >
                            Kirim
                        </v-btn>
                    </v-card-text>
                </v-col>
            </v-row>
        </v-card>

        
        <v-container class="mt-12 px-16">
            <v-row>
                <v-col cols="12" v-for="(post, index) in posts" :key="index" >
                    
                    <v-card class="my-0">

                        <template slot="progress">
                            <v-progress-linear
                                color="deep-purple"
                                height="10"
                                indeterminate
                            ></v-progress-linear>
                        </template>

                        <v-img
                            height="250"
                            :src="'http://127.0.0.1:8000'+post.foto"
                        ></v-img>

                        <v-card-title style="display:flex; justify-content:center; align-items:center;" class="pa-0 mt-4 text-center">{{ post.title }}</v-card-title>
                        <v-card-text>
                            <div class="my-4 text-subtitle-1">
                                Rp. {{ post.harga }}
                            </div>

                            <div>{{ post.deskripsi }}</div>
                        </v-card-text>

                        <span v-if="post.keterangan == 'available'">
                            <v-chip class="mb-5" color="primary">Stok Tersedia</v-chip>
                        </span>
                        <span v-else>
                            <v-chip class="mb-5" color="red white--text">Stok Kosong</v-chip>
                        </span>

                        <v-divider class="mx-4"></v-divider>
                            <v-row class="my-5">
                                <v-col>
                                    <span v-if="post.get_user != null">
                                        <v-img
                                        height="70"
                                        width="70"
                                        rounded
                                        class="rounded-circle my-2 mx-auto"
                                        :src="'http://127.0.0.1:8000/'+post.get_user.foto"
                                        ></v-img>
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
                            <v-card-actions>
                                <v-btn
                                    color="primary"
                                    class="mx-auto text-capitalize white--text"
                                    elevation="0"
                                    @click="showDialogEditPost(post.id)"
                                >
                                    Edit
                                </v-btn>
                                <v-btn
                                    color="red"
                                    class="mx-auto text-capitalize white--text"
                                    elevation="0"
                                    @click="deleteMarketplace(post.id)"
                                >
                                    Hapus
                                </v-btn>
                            </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
        
            
            
        <!-- dialog untuk ngedit post -->
        <v-dialog v-model="dialogEditPost" max-width="1200px">
            <v-card>
                <v-card-title  color="blue-grey lighten-4">
                    <span class="headline">Edit Post</span>
                </v-card-title>
                <v-card-text>
                    <v-container>
                        <v-row>
                            <v-col>
                                <v-text-field
                                    filled
                                    name="input-7-4"
                                    label="Captions"
                                    v-model="post.title"
                                    @change="cekCaption"
                                ></v-text-field>

                                <v-text-field
                                    filled
                                    name="input-7-4"
                                    label="Captions"
                                    type="number"
                                    v-model="post.harga"
                                    @change="cekCaption"
                                ></v-text-field>

                                 <v-textarea
                                    filled
                                    name="input-7-4"
                                    label="Captions"
                                    v-model="post.deskripsi"
                                    @change="cekCaption"
                                ></v-textarea>


                                <!-- <v-file-input
                                    :rules="imageRules"
                                    accept="image/png, image/jpeg, image/bmp"
                                    placeholder="Upload an image"
                                    prepend-icon="mdi-camera"
                                    label="Upload an image"
                                    v-model="post.gambar"
                                    @change="cekCaption"
                                    filled
                                ></v-file-input> -->

                                <input
                                    type="file"
                                    label="Ubah fotoPost  disini"
                                    :state="Boolean(post.foto)"
                                    @change="onImageChange"
                                    class="mt-9"
                                />
                            </v-col>
                            <v-col>
                                <v-img
                                    height="320"
                                    width="420"
                                    class="my-2 mx-auto"
                                    :src="'http://127.0.0.1:8000'+post.foto"
                                ></v-img>
                            </v-col>
                        </v-row>
                    </v-container>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="blue darken-1" text @click="cancel">Cancel</v-btn>
                    <v-btn color="blue darken-1" text @click="editPost">Save</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>


        <!-- dialog ngeliat comment dari sebuah item marketplace -->
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
                                    
                                    <v-img :src="'http://127.0.0.1:8000'+postsWithComments.foto" alt="heo"></v-img>
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

                                    <!-- card komentar -->
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
                                                    <div style="display:flex; align-items:flex-start; padding:4px;">
                                                        <v-btn text color="primary" class="mr-3" @click="editKomentarShow(comment.id)" >Edit</v-btn>
                                                        <v-btn text color="red" @click="hapusKomentarShow(comment.id)" >Hapus</v-btn>
                                                        <v-spacer></v-spacer>
                                                    </div>
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


        <!-- snackbar stuff -->
        <v-snackbar v-model="snackbar" :color="color" timeout="2000" bottom>{{ error_message }} </v-snackbar> 
    </v-main>
</template>

<script>
    export default{
    name: "List",
    data() {
        return{
            user_id : localStorage.getItem("id"),
            user_name: localStorage.getItem("name"),
            inputType: 'Tambah',
            dialogDetailPost:false,
            load: false,
            snackbar:false,
            error_message: '',
            color: '',
            search: null,
            dialogEditPost: false,
            dialogConfirm:false,
            dialogEditKomentar:false,
            dialogDeleteKomentar:false,
            headers: [
                { text: "Nama User", align:"start", sortable: true, value: "name"},
                { text: "Email", value: 'email'},
                { text: "Actions", value: 'actions'},
            ],
            user: new FormData,
            posts: [],
            post: {
                id_user: localStorage.getItem("id"),
                title:"",
                harga:0,
                deskripsi:"",
                foto: null,
            },
            formData: new FormData(),
            form: {
                id_user: localStorage.getItem("id"),
                deskripsi:"",
                foto: null,
                harga:0,
                title:""
            },
            postsWithComments: {
                id: "",
                id_user: "",
                title: "",
                deskripsi: "",
                foto: "",
                harga: "",
                keterangan: "",
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
                id_market:0,
                komentar:"",
            },
            komentarAmbil : {
                id: "",
                id_user: "",
                id_market: "",
                komentar: "",
                created_at: "",
                updated_at: "",
                get_market: {
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
            deleteId: '',
            editId: '',
            imageRules: [
                value => !value || value.size < 2000000 || 'Avatar size should be less than 2 MB!',
            ],
    };
},
    methods: {
        cekCaption() {
            console.log(this.form);
        },
        hapusKomentarShow(id_komentar) {
            this.deleteId = id_komentar;
            this.dialogDeleteKomentar = true
        },
        editKomentarShow(id_komentar){
            var url = this.$api +'/marketplaces/komentar/view/' + id_komentar;
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
            var url = this.$api + '/marketplaces/komentar/hapus/' + this.deleteId;
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
                this.readDataMarketplace(); // baca data
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
            var url = this.$api + '/marketplaces/komentar/edit/' + this.komentarAmbil.id;
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
                this.readDataMarketplace(); // baca data
                this.dialogEditKomentar = false;
                this.dialogDetailPost = false;
            }).catch(error => {
                this.error_message = error.response.data.pesan;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        showDialogEditPost(id) {
            var url = this.$api +'/marketplaces/view/' + id;
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                console.log(response.data);
                this.post = response.data.data;
                console.log(this.post.deskripsi);
                this.dialogEditPost = true;
            })
        },
        setForm(){
           if(this.inputType !== 'Tambah') {
               this.update();
           }else{
               this.save();
           }
        },
        //read data users
        readDataMarketplace() {
            var url = this.$api +'/marketplaces/list/';
            this.$http.get(url, {
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response => {
                this.posts = response.data.data;
                console.log(this.posts)
                this.posts.forEach(element => {
                    console.log(element.get_user.foto);
                });
            })
        },
        save(){
            this.formData.append("id_user", this.form.id_user);
            this.formData.append("deskripsi", this.form.deskripsi);
            this.formData.append("foto", this.form.foto);
            this.formData.append("harga", this.form.harga);
            this.formData.append("title", this.form.title);

            var url = this.$api + '/marketplaces/tambah'
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
                this.readDataMarketplace(); // baca data
                this.resetForm();
                this.dialogEditPost = false;
            }).catch(error => {
                this.error_message = error.response.data.pesan;
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        //ubah data user
        editPost(){
            
            let newData= {
                id : this.post.id,
                id_user : this.post.id_user,
                title : this.post.title,
                deskripsi : this.post.deskripsi,
                harga : this.post.harga,
                foto: this.post.foto
            };
            
            var url = this.$api + '/marketplaces/edit/' + this.post.id;
        
            this.load = true;
            this.$http.put(url, newData, {
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
                this.readDataMarketplace(); // baca data
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message = error.response.data.pesan;
                console.log(error.response);
                this.color = "red";
                this.snackbar = true;
                this.load = false;
            });
        },
        //hapus data produk
        deleteMarketplace(id){
          //menghapus data
            console.log(id);
            var url = this.$api + '/marketplaces/hapus/' + id;
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
                this.readDataMarketplace(); // baca data
                this.resetForm();
                this.inputType = 'Tambah';
            }).catch(error => {
                this.error_message = error.response.data.message;
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
             this.dialogEditKomentar = false;
             this.dialogDeleteKomentar = false;
             this.dialogDetailPost = false;
             this.dialogEditPost = false;
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
        openDetailPostWithComments(id) {
            var url = this.$api +'/marketplaces/view/' + id;
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
        kirimKomentar(id_market) {
            var url = this.$api + '/marketplaces/komentar/tambah'
            this.load = true;
            this.komentarBaru.id_market = id_market;
            this.$http.post(url, this.komentarBaru,{
                headers: {
                    'Authorization' : 'Bearer ' + localStorage.getItem('token')
                }
            }).then(response =>{
                this.error_message = response.data.pesan;
                this.color = "green";
                this.snackbar = true;
                this.load = true;
                this.readDataMarketplace(); // baca data

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
                this.post.foto = e.target.result
            }
            reader.readAsDataURL(file)
            
        },
       },
       computed: {
           formTitle(){
               return this.inputType;
           },
       },
       mounted(){
           this.readDataMarketplace();
       },
    };
</script>