<template>
  <div class="cartctrl">
  	<div class="cart-decrease" v-show="food.count>0" @click="decreaseCart" transition="move">
      <i class="inner icon-remove_circle_outline"></i>
  	</div>
  	<div class="cart-count" v-show="food.count>0">{{ food.count }}</div>
  	<div class="cart-add" @click="addCart($event)">
  	  <i class="inner icon-add_circle"></i>
  	</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  export default {
    props: {
      food: {
        type: Object
      }
    },
    methods: {
      addCart(ev) {
        if (!ev._constructed) {
          return;                // 过滤掉原生的事件，只处理BetterScroll派发的事件，保证pc和手机端均只响应一次
        }
        if (this.food.count === undefined) {
          Vue.set(this.food, 'count', 1);           // 注意不能在这里直接写为this.food.count = 1。因为count属性本身
                                                    // 是不存在于this.food对象中的，如果直接这样添加，Vue将不能对这
                                                    // 个属性进行监测，必须使用Vue.set全局方法添加这个属性，使Vue可以
                                                    // 对其进行跟踪
        } else {
          this.food.count += 1;
        }
        // console.log(ev.currentTarget);
        this.$dispatch('cart.add', ev.currentTarget);           // 分发事件,第一个参数为事件名,第二个参数为事件对象
                                                               // 在此组件及其上级组件中的events中可以接收并响应事件
      },
      decreaseCart(ev) {
        if (!ev._constructed) {
          return;
        }
        this.food.count -= 1;
      }
    }
  };
</script>

<style lang="stylus" type="text/stylus">
  .cartctrl
    font-size: 0
    .cart-decrease,.cart-count,.cart-add
      display: inline-block
      vertical-align: middle
    .cart-decrease,.cart-add
      padding: 6px
      color: rgb(0,160,220)
      .inner
        display: inline-block
        font-size: 24px
        line-height: 24px 
    .cart-decrease
      transition: all 0.4s linear
      &.move-transition
        opacity: 1
        transform: translate3D(0,0,0) rotate(0)
      &.move-enter,&.move-leave
        opacity: 0
        transform: translate3D(24px,0,0) rotate(180deg)     
    .cart-count
      width: 10px
      text-align: center
      font-size: 10px
      color: rgb(147,153,159)
</style>