import { Commit } from 'vuex' // commit interface for typescript
import router from '@/router'

import { UserType } from '@/store/UserAuth/types'

export default {
    login({ commit }: { commit: Commit }, user: UserType) {

        const UserLoginDto = {
            Email: user.email,
            Senha: user.password
        };

        fetch('https://apimongodb.azurewebsites.net/Auth/login', {
            method: 'POST',
            body: JSON.stringify(UserLoginDto),
            headers: { 'Content-Type': 'application/json' }
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Erro na solicitação de login')
                }
                return response.json()
            })
            .then((data) => {
               
                if (data.token) {
                    console.log('200')
                    commit('login', user.email)
                    localStorage.setItem('email',user.email)
                    localStorage.setItem('name',user.name)
                    router.push('/welcome')
                }
            })
            .catch((error) => {
                console.error(error)
            });

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
