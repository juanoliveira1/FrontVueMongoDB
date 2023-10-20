import { Commit } from 'vuex' // commit interface for typescript
import router from '@/router'
import axios from 'axios'

import { UserType } from '@/store/UserAuth/types'

export default {
    login({ commit }: { commit: Commit }, user: UserType) {
        const UserLoginDto = {
            Email: user.email,
            Senha: user.password,
        }
        const headers = {
            'Content-Type': 'application/json',
        }

        axios
            .post('apimongodb.azurewebsites.net/Auth/login', UserLoginDto, {
                headers,
            })
            .then((response) => {
                console.log(response);
                if (response.status == 200) {
                    if (response.data.token) {
                        console.log('200');
                        commit('login', user.email);
                        localStorage.setItem('email', user.email);
                        localStorage.setItem('name', user.name);
                        router.push('/welcome');
                    }
                }
            })
            .catch((error) => {

                console.error('Erro na requisição:', error)
            })      

        // const userIndex = registeredUsers.findIndex(
        //     (usersData) =>
        //         usersData.email === user.email &&
        //         usersData.password === user.password
        // )

        // if (userIndex !== -1) {
        //     commit('login', user.email)
        //     localStorage.setItem('email', user.email)
        // }
    },

    logout({ commit }: { commit: Commit }) {
        localStorage.removeItem('email')
        commit('logout')
        router.push('/welcome')
    },

    autoLogin({ commit }: { commit: Commit }) {
        const userEmail = localStorage.getItem('email')
        if (userEmail) {
            commit('login', userEmail)
            console.log(userEmail)
        }
    },
}
