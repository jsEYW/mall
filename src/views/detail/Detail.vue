<template>
  <div id="detail">
      <detail-nav-bar class="detail-nav"></detail-nav-bar>
      <scroll class="content" ref="scroll">
        <detail-swiper :top-images="topImages"></detail-swiper>
        <detail-base-info :bgoods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
        <detail-param-info :param-info="paramInfo"></detail-param-info>
        <detail-comment-info :comment-info="commentInfo"></detail-comment-info>
        <goods-list :goods="recommends"></goods-list>
      </scroll>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar"
import DetailSwiper from "./childComps/DetailSwiper"
import DetailBaseInfo from "./childComps/DetailBaseInfo"
import DetailShopInfo from "./childComps/DetailShopInfo"
import DetailGoodsInfo from "./childComps/DetailGoodsInfo"
import DetailParamInfo from "./childComps/DetaiParamInfo"
import DetailCommentInfo from "./childComps/DetailCommentInfo"

import Scroll from "components/common/scroll/Scroll"
import GoodsList from "components/content/goods/GoodsList"

import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail"
import {itemListenerMixin} from "common/mixin"

export default {
    name: 'Detail',
    components: {
        DetailNavBar,
        DetailSwiper,
        DetailBaseInfo,
        DetailShopInfo,
        DetailGoodsInfo,
        DetailParamInfo,
        DetailCommentInfo,

        Scroll,
        GoodsList
    },
    mixins: [itemListenerMixin],
    data() {
        return {
            iid: null,
            topImages: [],
            goods: {},
            shop: {},
            detailInfo: {},
            paramInfo: {},
            commentInfo: {},
            recommends: [],
        }
    },
    created() {
        // 保存传入的iid
        this.iid = this.$route.params.iid
        // 根据iid请求数据
        getDetail(this.iid).then(res => {
            const data = res.result
            // 获取顶部的图片轮播数据
            this.topImages = data.itemInfo.topImages
            // 获取商品信息
            this.goods = new Goods(data.itemInfo, data.columns,data.shopInfo.services)
            // 获取店铺信息
            this.shop = new Shop(data.shopInfo)
            // 获取商品详情数据
            this.detailInfo = data.detailInfo
            // 获取参数信息
            this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)
            // 获取评论信息
            if (data.rate.Crate !==0) {
                this.commentInfo  = data.rate.list[0]
            }
        })
        // 请求推荐数据
        getRecommend().then(res => {
            this.recommends = res.data.list
            
        })
    },
    mounted() {
    },
    destroyed() {
        this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    methods: {
        imageLoad() {
            this.$refs.scroll.refresh()
        }
    }
}
</script>

<style scoped>
#detail {
    height: 100vh;

    position: relative;
    z-index: 9;
    background-color: #fff;
}
.detail-nav {
    position: relative;
    z-index: 9;
    background-color: #fff;
}
.content {
    height: calc(100% - 44px);
}
</style>