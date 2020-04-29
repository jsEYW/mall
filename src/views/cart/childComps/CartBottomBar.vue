<template>
  <div class="bottom-bar">
    <div class="check-content">
      <check-button :is-checked="isSelectAll" 
      class="check-button" @click.native="checkClick"></check-button>
      <span>全选</span>
    </div>
    <div class="price">
      合计：{{totlePrice}}
    </div>
    <div class="calculate" @click="calcClick">
      去计算({{checkLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from 'components/content/checkButton/CheckButton'

export default {
    name:'CartBottomBar',
    components: {
      CheckButton
    },
    computed: {
      totlePrice() {
        return '￥' + this.$store.state.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        },0).toFixed(2)
      },
      checkLength() {
        return this.$store.state.cartList.filter(item => item.checked).length
      },
      isSelectAll() {
        if(this.$store.state.cartList.length === 0) return false
        // return !(this.$store.state.cartList.filter(item => !item.checked).length) 或
        return !this.$store.state.cartList.find(item => !item.checked)
      }
    },
    methods: {
      checkClick() {
        if(this.isSelectAll) {
          this.$store.state.cartList.forEach(item => item.checked = false)
        }else{
          this.$store.state.cartList.forEach(item => item.checked = true)
        }
        // 下面的简化无效
        // this.$store.state.cartList.forEach(item => item.checked = !this.isSelectAll)
      },
      calcClick() {
        if(!this.isSelectAll) {
          this.$toast.show('请选择商品')
        }
      }
    }
}
</script>

<style scoped>
.bottom-bar {
    height: 40px;
    background-color: #eee;
    position: relative;
    display: flex;
    line-height: 40px;

}
.check-content {
  display: flex;
  align-items: center;
  margin: 0 4px;
  width: 70px;
}
.check-button {
  width: 25px;
  height: 25px;
  line-height: 20px;
  margin-right: 5px;
}
.price {
  margin-left: 15px;
  flex: 1;
}
.calculate {
  width: 90px;
  background-color: red;
  color: #fff;
  text-align: center;
}
</style>