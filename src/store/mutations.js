import {ADD_CONTER, ADD_CART} from './mutation-types' 

export default {
    ADD_CONTER(state, payload) {
        payload.count ++
    },
    ADD_CART(state,payload) {
        payload.checked = true
        state.cartList.push(payload)
    }
}