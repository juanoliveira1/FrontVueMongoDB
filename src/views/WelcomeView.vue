<template>
    <div style="width: 100%">
        <header class="bg-black">
            <b-row>
                <b-col sm="6" lg="3">
                    <img
                        class="login-header_logo_img"
                        src="@/assets/imgs/coracao_verde.svg"
                    />
                </b-col>
                <b-col sm="6" lg="9" class="text-end">
                    <nav>
                        <button
                            class="verde-btn"
                            v-on:click="abrirModal"
                            type="button"
                        >
                            Upload
                        </button>
                        <button
                            data-cy="logoutBtn"
                            class="verde-btn"
                            @click="logout"
                            type="button"
                        >
                            Log out
                        </button>
                    </nav>
                </b-col>
            </b-row>
        </header>
        <div style="background-color: #000000">
            <b-row class="full-width">
                <b-col
                    sm="6"
                    md="4"
                    lg="3"
                    v-for="(blob, blobIndex) in blobList"
                    :key="blobIndex"
                >
                    <b-card class="mb-3">
                        <div class="media-container">
                            <template
                                v-if="
                                    blob.uri.endsWith('.mp4') ||
                                    blob.uri.endsWith('.MOV') ||
                                    blob.uri.endsWith('.mov')
                                "
                            >
                                <video style="width: 100%" loop autoplay muted>
                                    <source :src="blob.uri" type="video/mp4" />
                                </video>
                            </template>
                            <template v-else>
                                <img
                                    :src="blob.uri"
                                    class="img-fluid"
                                    alt="Imagem"
                                />
                            </template>
                            <div
                                class="media-description"
                                @mouseover="showDescription(blob)"
                                @mouseleave="cancelEditing(blob)"
                                @click="startEditing(blob)"
                            >
                                <template v-if="blob.editing">
                                    <div class="input-button-jogada">
                                        <input
                                            type="text"
                                            v-model="blob.novoComentario"
                                            class="input-transparent"
                                            :size="blob.novoComentario.length"
                                        />
                                        <button
                                            class="verde-btn-small"
                                            @click="saveComment(blob)"
                                        >
                                            Editar
                                        </button>
                                    </div>
                                </template>
                                <template v-else>
                                    <span class="break-word">{{
                                        blob.novoComentario || blob.comentario
                                    }}</span>
                                </template>
                            </div>
                        </div>
                    </b-card>
                </b-col>
            </b-row>
        </div>
        <div class="full-width" style="background-color: #000000">
            <footer class="text-center">
                <button
                    class="verde-btn"
                    style="margin-bottom: 30px"
                    v-on:click="carregarMais"
                >
                    Carregar mais
                </button>
            </footer>
        </div>
        <div>
            <b-modal
                v-model="showModal"
                centered
                title="Upload mídia"
                header-bg-variant="black"
                header-text-variant="light"
                @ok="enviarArquivo"
                @cancel="limparModal"
            >
                <div class="mb-3">
                    <label for="fileInput" class="form-label"
                        >Selecionar arquivo:</label
                    >
                    <input
                        type="file"
                        id="fileInput"
                        class="form-control"
                        v-on:change="handleFileChange"
                    />
                </div>

                <div class="mb-3">
                    <label for="descricaoInput" class="form-label"
                        >Descrição:</label
                    >
                    <input
                        type="text"
                        maxlength="200"
                        id="descricaoInput"
                        class="form-control"
                        v-model="descricao"
                    />
                </div>
            </b-modal>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import { useStore } from '@/store'
import router from '@/router'
import { ref, onMounted, Vue } from 'vue'
import toastr from 'toastr'

import 'bootstrap/dist/css/bootstrap.css'
import '@/assets/css/toastr-styles.css'

const blobList = ref([])
const currentPage = ref(0)

const loadMoreBlobs = async () => {
    currentPage.value++
    await axios
        .get('https://localhost:5000/Blob/list', {
            params: {
                page: currentPage.value,
                pageSize: 12,
            },
        })
        .then((response) => {
            blobList.value = blobList.value.concat(response.data);
        })
        .catch((error) => {
            toastr.error(
                'Sem mais publicações para carregar/ ou erro no get dos blobs',
                'Aviso'
            )
        })
}

export default {
    setup() {
        const store = useStore()
        const showModal = ref(false)
        const descricao = ref('')
        let arquivo = null

        function handleFileChange(event) {
            arquivo = event.target.files[0]
        }

        function logout() {
            currentPage.value = 0
            blobList.value = null
            store.dispatch('logout')
            router.push('/login')
        }

        async function carregarMais() {
            loadMoreBlobs()
        }

        function abrirModal() {
            showModal.value = true
        }

        async function enviarArquivo() {

            if (!arquivo || !descricao.value) {
                toastr.warning('Preencher arquivo e descrição !', 'Erro')
                limparModal()
                return
            }
            const request = {
                file: arquivo,
            }

            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }
            const userName = localStorage.getItem('name');

            await axios
                .post(
                    'https://localhost:5000/Blob/upload?userName=' + userName + '&comentario=' + descricao.value,
                    request,
                    config
                )
                .then((response) => {
                    if (response.status == 200) {
                        currentPage.value = 0
                        blobList.value = []
                        loadMoreBlobs()
                        limparModal()
                        toastr.success('Arquivo Adicionado !', 'Sucesso')
                    }
                })
                .catch((error) => {
                    toastr.error('Erro ao adicionar arquivo', 'Erro')
                })
        }

        function limparModal() {
            arquivo = null
            descricao.value = ''
        }

        function showDescription(blob) {
            blob.showDescription = true;
        }

        function startEditing(blob) {
            blob.editing = true;
            blob.novoComentario = blob.comentario;
        }

        function cancelEditing(blob) {
            if (blob.editing) {
                blob.editing = false;
                blob.novoComentario = blob.comentario;
            }
        }

        async function saveComment(blob) {
            blob.editing = false;
            const novoComentario = blob.novoComentario;
            const userName = localStorage.getItem('name');
            const request = {
                Id : blob.id,
                NovoComentario : novoComentario,
                UsuarioAlteracao : userName
            }

            try{
                const response = await axios.put('https://localhost:5000/Blob/editComentario',request);
            if(response.status == 200){
               blob.comentario = novoComentario;
               toastr.success('Comentário alterado com sucesso','Sucesso');
            }
            }catch(error){
                toastr.error(error.response.data);
            }
        }

        onMounted(() => {
            loadMoreBlobs()
        })

        return {
            logout,
            carregarMais,
            abrirModal,
            descricao,
            arquivo,
            blobList,
            currentPage,
            showModal,
            handleFileChange,
            enviarArquivo,
            limparModal,
            showDescription,
            startEditing,
            saveComment,
            cancelEditing
        }
    },
}
</script>

<style lang="scss" scoped>
.input-transparent {
    background: transparent;
    border: none;
    font-size: 18px;
    color: white;
    outline: none;
    display: block;
}

.break-word {
    overflow-wrap: break-word;
    word-wrap: break-word;
}

.input-button-jogada {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.media-description {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 18px;
    opacity: 0;
    transition: opacity 0.3s;
}

.media-container:hover .media-description {
    opacity: 1;
}

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

.verde-btn-small {
    width: fit-content;
    margin: 0 auto;
    padding: 10px 15px;
    border: none;
    background-color: #b1cc33;
    color: black;
    border-radius: 20px;
    cursor: pointer;
}

.verde-btn {
    width: fit-content;
    margin: 0 auto;
    padding: 22px 34px;
    border: none;
    background-color: #b1cc33;
    color: black;
    border-radius: 20px;
    cursor: pointer;
    margin-top: 20px;
    margin-left: 10px;
}

.modal-body {
    background-color: black;
}
</style>
