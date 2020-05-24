<template>
  <div id="detail">
      <detail-nav-bar class="detail-nav" ref="nav" @titleClick="titleClick"></detail-nav-bar>
      <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
        <detail-swiper :top-images="topImages"></detail-swiper>
        <detail-base-info :bgoods="goods"></detail-base-info>
        <detail-shop-info :shop="shop"></detail-shop-info>
        <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad" />
        <detail-param-info ref="param" :param-info="paramInfo"></detail-param-info>
        <detail-comment-info ref="comment" :comment-info="commentInfo"></detail-comment-info>
        <goods-list ref="recommend" :goods="recommends"></goods-list>
      </scroll>
      <detail-button-bar @addToCart="addToCart"></detail-button-bar>
      <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
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
import DetailButtonBar from "./childComps/DetailButtonBar"

import Scroll from "components/common/scroll/Scroll"
import GoodsList from "components/content/goods/GoodsList"

import {getDetail, getRecommend, Goods, Shop, GoodsParam} from "network/detail"
import {itemListenerMixin, backTopMixin} from "common/mixin"
import {debounce} from "common/utils.js"
import {BACKTOP_DISTANCE} from "common/const"


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
        DetailButtonBar,

        Scroll,
        GoodsList,
    },
    mixins: [itemListenerMixin,backTopMixin],
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
            themeTopYs: [],
            getThemeTopY: null,
            currnetIndex: 0,
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
            // 执行完上面的获取并渲染完回调此函数
            // this.$nextTick(() => {
            //     // 根据最新的数据，对应的DOM已经被渲染，但图片未加载完（有问题）
            //     this.themeTopYs = []
            //     this.themeTopYs.push(0);
            //     this.themeTopYs.push(this.$refs.param.$el.offsetTop)
            //     this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            //     this.themeTopYs.push(this.$refs.ercommend.$el.offsetTop)
            // })
        })
        // 请求推荐数据
        getRecommend().then(res => {
            this.recommends = res.data.list
        })
        // 给getThemeTopY赋值
        this.getThemeTopY = debounce( () => {  
            this.themeTopYs.push(0);
            this.themeTopYs.push(this.$refs.param.$el.offsetTop - 44)
            this.themeTopYs.push(this.$refs.comment.$el.offsetTop - 44)
            this.themeTopYs.push(this.$refs.recommend.$el.offsetTop - 44)
            this.themeTopYs.push(Number.MAX_VALUE)
        })
    },
    mounted() {
    },
    destroyed() {
        this.$bus.$off('itemImageLoad', this.itemImgListener)
    },
    methods: {
        imageLoad() {
            // 防抖刷新
            this.newRefresh()
            // 调用防抖获取themeTopYs
            this.getThemeTopY()
            
            // 可以加这里，但使用频繁
            // this.themeTopYs = []
            // this.themeTopYs.push(0);
            // this.themeTopYs.push(this.$refs.param.$el.offsetTop)
            // this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
            // this.themeTopYs.push(this.$refs.ercommend.$el.offsetTop)
        },
        titleClick(index) {
            this.$refs.scroll.scrollTo(0, -this.themeTopYs[index],200)
        },
        contentScroll(position) {
            let positionY = -position.y
            let length = this.themeTopYs.length
            for(let i=0; i<length-1; i++) {
                if(this.currnetIndex !== i && (positionY >= this.themeTopYs[i] &&
                positionY < this.themeTopYs[i+1])) {
                    this.currnetIndex = i;
                    this.$refs.nav.currentIndex = this.currnetIndex
                }
            }
            
            // 判断backTop是否显示
            this.isShowBackTop = -position.y > BACKTOP_DISTANCE;


            // 普通做法
            //     for(let i=0; i<length; i++) {
            //         if(this.currnetIndex !== i && ((i < length - 1 && positionY >= this.themeTopYs[i] && positionY < 
            //         this.themeTopYs[i+1]) ||(i ===length - 1 && positionY >= this.themeTopYs[i]))) {
            //             this.currnetIndex = i;
            //             this.$refs.nav.currentIndex = this.currnetIndex
            //         }
            //     }
            
        },
        addToCart() {
            // 获取商品数据
            const produst = {}
            produst.image = this.topImages[0]
            produst.title = this.goods.title
            produst.desc = this.goods.desc
            produst.price = this.goods.realPrice
            produst.iid = this.iid
            // 将商品加入购物车
            // this.$store.cartList.push(produst)要用mutation改state
            this.$store.dispatch('addCart', produst).then(res => {
                this.$toast.show(res)
                
            })
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
    height: calc(100% - 44px - 49px);
}
</style>