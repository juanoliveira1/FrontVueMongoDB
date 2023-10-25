import { State } from '@/store/state'

export default {
    login(state: State, { userEmail, name }: { userEmail: string, name: string }){
        state.user = userEmail
        state.isAuthenticated = true
        state.name = name
    },

    logout(state: State) {
        state.user = ''
        state.isAuthenticated = false
        state.name = ''
    },
}
