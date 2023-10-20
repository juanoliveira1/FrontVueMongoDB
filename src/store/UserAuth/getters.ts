import { State } from '@/store/state'

export default {
    userEmail(state: State) {
        return state.user ? state.user : ''
    },

    isAuth(state: State) {
        return state.isAuthenticated
    },

    name(state: State){
        return state.name ? state.name : ''
    }
}
