import { Commit } from 'vuex'
import router from '@/router'
import axios from 'axios'
import { useStore } from '@/store'
import { UserType } from '@/store/UserAuth/types'
import toastr from 'toastr'

import 'toastr/build/toastr.css'

export default {
    setup() {
        const store = useStore();
        return {
            store
        };
    },

    async login({ commit }: { commit: Commit }, user: UserType) {
        const UserLoginDto = {
            Email: user.email,
            Senha: user.password,
        }
        const headers = {
            'Content-Type': 'application/json',
        }

        try {
            await axios
                .post(
                    'https://apimongodb.azurewebsites.net/Auth/login',
                    UserLoginDto,
                    { headers }
                )
                .then((response) => {
                    if (response.status == 200) {
                        localStorage.setItem('email', user.email)
                        localStorage.setItem('name', response.data.name)
                        console.log(localStorage.getItem('email'));
                        console.log(localStorage.getItem('name'));
                        commit('login', user.email, response.data.name)
                        router.push('/welcome')
                    }
                })
        } catch (error: any) {
            if (error.response.status == 401) {
                toastr.error('Email e/ou senha incorretos.', 'Aviso')
            } else {
                toastr.error('Erro na requisição de login', 'Erro')
            }
        }
    },

    logout({ commit }: { commit: Commit }) {
        localStorage.removeItem('email')
        commit('logout')
        router.push('/welcome')
    },
}
