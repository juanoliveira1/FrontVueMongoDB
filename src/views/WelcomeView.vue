<template>
    <div style="width: 100%;">
        <header class="bg-black">
            <b-row>
                <b-col sm="6" lg="3">
                    <img class="login-header_logo_img" src="@/assets/imgs/coracao_verde.svg" />
                </b-col>
                <b-col sm="6" lg="9" class="text-end">
                    <nav>
                        <button class="verde-btn" @click="upload" type="button">
                            Upload
                        </button>
                        <button data-cy="logoutBtn" class="verde-btn" @click="logout" type="button">
                            Log out
                        </button>
                    </nav>
                </b-col>
            </b-row>
        </header>
        <div style="background-color: #03000f;">
            <b-row class="full-width">
                <b-col sm="6" md="4" lg="3" v-for="(blob, blobIndex) in blobList" :key="blobIndex">
                    <b-card :title="blob.descricao" class="mb-3">
                        <template v-if="blob.uri.endsWith('.mp4')">
                            <video style="width: 100%" controls loop autoplay>
                                <source :src="blob.uri" type="video/mp4">
                            </video>
                        </template>
                        <template v-else>
                            <img :src="blob.uri" class="img-fluid" alt="Imagem" />
                        </template>
                    </b-card>
                </b-col>
            </b-row>
        </div>
    </div>
</template>
  
<script>
import axios from "axios";
import { useStore } from '@/store'
import router from '@/router'
import { ref, onMounted, Vue } from "vue";
import toastr from 'toastr'
import 'toastr/build/toastr.css'

const blobList = ref([]);
const currentPage = ref(0);


const loadMoreBlobs = async () => {
    currentPage.value++;
    await axios.get('https://apimongodb.azurewebsites.net/Blob/list', {
        params: {
            page: currentPage.value,
            pageSize: 12,
        },
    }).
        then(response => {
            blobList.value = blobList.value.concat(response.data);
        }).
        catch(error => {
            toastr.error('Erro ao buscar Blobs', 'Erro');
        })
};

export default {
    setup() {
        const store = useStore()
        const email = store.getters.userEmail
        const name = store.getters.name

        function logout() {
            currentPage.value = 0;
            blobList.value = null;
            store.dispatch('logout')
            router.push('/login')
        }

        function upload() {
            console.log('Upload click');
        }

        onMounted(() => {
            loadMoreBlobs();
        });

        return {
            logout,
            email,
            name,
            blobList,
            currentPage
        }
    },
};
</script>
  
<style lang="scss" scoped>
.full-width {
    width: 100%;
}

.login-header {
    &_logo_img {
        width: 100px;
        height: 100px;
        margin-bottom: 18px;
    }
}

.verde-btn {
    width: fit-content;
    margin: 0 auto;
    padding: 22px 34px;
    border: none;
    background-color: #B1CC33;
    color: black;
    border-radius: 20px;
    cursor: pointer;
    margin-top: 20px;
    margin-left: 10px;
}
</style>