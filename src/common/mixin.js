import {debounce} from "common/utils.js"

export const itemListenerMixin = {
    data() {
        return {
            itemImgListener: null
        }
    },
    mounted() {
        let refresh = debounce(this.$refs.scroll.refresh,500);
        this.itemImgListener = () => {
            refresh()
        }
        this.$bus.$on('itemImageLoad', this.itemImgListener)
    }
}