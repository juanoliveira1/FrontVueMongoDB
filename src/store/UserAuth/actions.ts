import { Commit } from 'vuex'
import router from '@/router'
import axios from 'axios'

import { UserType } from '@/store/UserAuth/types'

export default {
    async login({ commit }: { commit: Commit }, user: UserType) {
        const UserLoginDto = {
            Email: user.email,
            Senha: user.password,
        }
        const headers = {
            'Content-Type': 'application/json',
        }

        try {
            const response = await axios.post('https://apimongodbv-2.azurewebsites.net/Auth/login', UserLoginDto, { headers })
            if (response.status == 200) {
                localStorage.setItem('email', user.email);
                localStorage.setItem('name', response.data.name);
                commit('login', user.email, response.data.name);
            }
        } catch (error) {
            console.error('Erro na requisição:', error);
        }
    },

    logout({ commit }: { commit: Commit }) {
        localStorage.removeItem('email')
        commit('logout')
        router.push('/welcome')
    }
}
