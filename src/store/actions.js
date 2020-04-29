import {ADD_CONTER, ADD_CART} from './mutation-types' 

export default {
    addCart(context, payload) {
        // 新加商品(判断是否是同一商品)
        // let oldProduct = null
        // for(let item of state.cartList) {
        //     if(item.iid === payload.idd) {
        //         oldProduct = item
        //     }
        // }

        // 换方法
        return new Promise((resolve, reject) => {
            let oldProduct = context.state.cartList.find(item => item.iid === payload.iid)
            // 判断oldProduct
            if(oldProduct) {
                context.commit('ADD_CONTER', oldProduct)
                resolve('商品 +1 ')
            }else{
                payload.count = 1 
                context.commit('ADD_CART', payload)
                resolve('加入新的商品')
            }
        })
    }
}