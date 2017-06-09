<template>
  <div class="shopcar">
    <div class="content">
      <div class="content-left">
      	<div class="logo-wrapper">
      	  <div class="logo" :class="{highlight: totalCount > 0}" @click="toggleList">
      	  	<i class="icon-shopping_cart" :class="{highlight: totalCount>0}"></i>
      	  </div>
      	  <div class="num" v-show="totalCount>0">{{ totalCount }}</div>
      	</div>
      	<div class="price" :class="{highlight: totalPrice>0}">￥{{ totalPrice }}</div>
      	<div class="desc">另需配送费{{ deliveryPrice }}元</div>
      </div>
      <div class="content-right">
        <div v-if="totalPrice<=0" class="not-enough">￥{{ minPrice }}起送</div>
        <div v-if="totalPrice>0 && totalPrice<minPrice" class="not-enough">还差{{ minPrice-totalPrice }}元起送</div>
        <div v-if="totalPrice>=minPrice" class="enough" @click="pay">去结算</div>
      </div>
    </div>
    <div class="ball-wrapper">        <!-- 抛物线小球 -->
      <div v-for="ball in balls" v-show="ball.show" transition="drop" class="ball">
      	<div class="inner inner-hook"></div>
      </div>
    </div>
    <div class="shopcar-list" v-show="shopcarListShow" transition="fold">  <!-- 购物车商品列表 -->
      <div class="list-header">
      	<h1 class="title">购物车</h1>
      	<span class="empty" @click="empty">清空</span>
      </div>	
      <div class="list-content" v-el:list-content>
      	<ul>
      	  <li class="food" v-for="food in selectedFoods">
      	    <span class="name">{{ food.name }}</span>
      	    <div class="price">
      	      <span>{{ food.count * food.price }}</span>
      	    </div>
      	    <div class="cartctrl-wrapper">
      	      <cartctrl :food="food"></cartctrl>
      	    </div>
      	  </li>
      	</ul>
      </div>
    </div>
    <div class="list-mask" v-show="shopcarListShow" transition="fade" @click="hideList"></div>      
  </div>
</template>

<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll';           // 引入better-scroll插件用于食品列表的滚动
  import cartctrl from '../cartctrl/cartctrl.vue';   // 引入商品的添加和删除组件
  export default {
    data () {
      return {
        balls: [
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          },
          {
            show: false
          }
        ],
        dropBalls: [],
        shopcarListShow: true,
        fold: true         // 购物车默认为折叠状态
      };
    },
    components: {
      cartctrl
    },
    props: {
      selectedFoods: {
        type: Array,
        default () {
          return {};
        }
      },
      deliveryPrice: {
        type: Number,
        default: 0        // 如果父组件没有传递deliveryPrice，则这个参数默认值为0
      },
      minPrice: {
        type: Number,
        default: 0
      }
    },
    methods: {
      _drop(el) {
        // console.log(el);
        for (let i = 0; i < this.balls.length; i++) {
          let ball = this.balls[i];
          if (!ball.show) {
            ball.el = el;
            ball.show = true;
            this.dropBalls.push(ball);
            return;
          }
        }
      },
      toggleList() {
        if (!this.totalCount) {
          return;
        }
        this.fold = !this.fold;
      },
      empty() {
        this.selectedFoods.forEach((item) => {
          item.count = 0;               // 清空购物车
        });
      },
      hideList() {
        this.fold = true;
      },
      pay() {
        window.confirm(`确认支付${this.totalPrice + this.deliveryPrice}元?`);
      }
    },
    transitions: {
      drop: {
        beforeEnter(el) {
          // console.log(el);
          let count = this.balls.length;
          while (count--) {
            let ball = this.balls[count];
            if (ball.show) {
              let rect = ball.el.getBoundingClientRect();      // 此方法可以获得被点击的元素相对于视口的偏移
              // console.log(rect);
              let x = rect.left - 32;     // 这里的32是小球距离落入位置距离左侧的距离
              let y = -(window.innerHeight - rect.top - 22);  // 这里的22是小球距离落入位置距离底部的距离
              el.style.transform = `translate3D(0,${y}px,0)`;
              el.style.webkitTransform = `translate3D(0,${y}px,0)`;
              let inner = el.getElementsByClassName('inner-hook')[0];
              inner.style.transform = `translate3D(${x}px,0,0)`;
              inner.style.webkitTransform = `translate3D(${x}px,0,0)`;
            }
          }
        },
        enter(el) {
          /* eslint-disable no-unused-vars */
          let rf = el.offsetHeight;    // 触发浏览器重绘，由于rf变量不会被用到，所以需要添加eslint注释，避免报错
          this.$nextTick(() => {       // 当浏览器重绘完毕，Dom元素更新后再设置transform，否则不会有动画效果
            el.style.transform = 'translate3D(0,0,0)';
            el.style.webkitTransform = 'translate3D(0,0,0)';
            let inner = el.getElementsByClassName('inner-hook')[0];
            inner.style.transform = 'translate3D(0,0,0)';
            inner.style.webkitTransform = 'translate3D(0,0,0)';
          });
        },
        afterEnter(el) {
          let ball = this.dropBalls.shift();      // 动画结束后将ball隐藏
          if (ball.show) {
            ball.show = false;         // 将ball的show置为false，但是注意在这里并不会使小球隐藏
            el.style.display = 'none';   // 要想真正隐藏小球还需手动设置display为none。
          }
          // console.log(this.balls);
        }
      }
    },
    computed: {
      totalCount () {
        let count = 0;
        this.selectedFoods.forEach((item) => {
          count += item.count;
        });
        return count;
      },
      totalPrice () {
        let total = 0;
        this.selectedFoods.forEach((item) => {
          total += item.count * item.price;
        });
        return total;
      },
      shopcarListShow() {
        if (!this.totalCount) {
          this.fold = true;
          return false;
        }
        let show = !this.fold;
        if (show) {      // 如果购物列表没有显示，则没有必要对其进行滚动渲染
          this.$nextTick(() => {
            if (!this.shopcarListScroll) {
              this.shopcarListScroll = new BetterScroll(this.$els.listContent, {
                click: true
              });
              // 添加列表滚动
              // 之所以再这里给列表添加滚动，是因为这个列表内容是动态的，而列表的变化
              // 是与this.totalCount相依赖的，所以当this.totalCount变化时，就会重新
              // 将新的列表进行滚动渲染
            } else {
              this.shopcarListScroll.refresh();    // refresh接口也会重新计算滚动，而不必每次都new一次
            }
          });
        }
        return show;
      }
    }
  };
</script>

<style lang="stylus" type="text/stylus">
  @import '../../common/stylus/mixin.styl'; 
  .shopcar
    position: fixed
    left: 0
    bottom: 0
    width: 100%
    height: 48px
    z-index: 10
    .content
      display: flex
      flex-direction: row
      background: #141d27
      font-size: 0
      color: rgba(255,255,255,0.4)
      .content-left
        flex-grow: 1
        .logo-wrapper
          display: inline-block
          vertical-align: top
          position: relative
          top: -10px
          margin: 0 12px
          padding: 6px
          width: 56px
          height: 56px
          box-sizing: border-box
          border-radius: 50%
          background: #141d27
          .logo
            width: 100%
            height: 100%
            border-radius: 50%
            background: #2b343c
            text-align: center
            &.highlight
              background: rgb(0,160,220)
            .icon-shopping_cart
              font-size: 24px
              color: #80858a
              line-height: 44px
              &.highlight
                color: #fff
          .num
            position: absolute
            top: 0
            right: 0
            width: 24px
            height: 16px
            line-height: 16px
            text-align: center
            border-radius: 16px
            background: rgb(240,20,20)
            font-size: 9px
            font-weight: 400
            color: #fff
            box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4)
        .price
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin-top: 12px
          padding-right: 12px
          box-sizing: border-box
          border-right: 1px solid rgba(255,255,255,0.1)
          font-size: 16px
          font-weight: 700
          &.highlight
            color: #fff
        .desc
          display: inline-block
          vertical-align: top
          line-height: 24px
          margin: 12px 0 0 12px
          font-size: 10px
      .content-right
        flex: 0 0 105px
        width: 105px
        .not-enough,.enough
          width: 100%
          height: 48px
          line-height: 48px
          text-align: center
          font-size: 12px
          font-weight: 700
        .not-enough
          background: #2b333b
        .enough
          background: #00b43c
          color: #fff
    .ball-wrapper
      .ball
        position: fixed
        left: 32px
        bottom: 22px
        z-index: 100
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
        .inner
          width: 16px
          height: 16px
          border-radius: 50%
          background: rgb(0,160,220)
          transition: all 0.4s linear         
    .shopcar-list
      position: absolute
      top: 0
      left: 0
      z-index: -1
      width: 100%
      &.fold-transition
        transition: all 0.5s
        transform: translate3d(0,-100%,0)
      &.fold-enter,&.fold-leave
        transform: translate3d(0,0,0)
      .list-header
        height: 40px
        line-height: 40px
        padding: 0 18px
        background: #f3f5f7
        border-bottom: 1px solid rgba(7,17,27,0.1)
        .title
          float: left
          font-size: 14px
          color: rgb(7,17,27)
        .empty
          float: right
          font-size: 12px
          color: rgb(0,160,220)
      .list-content
        padding: 0 18px
        max-height: 217px
        background: #fff
        overflow: hidden
        .food
          position: relative
          padding: 12px 0
          box-sizing: border-box
          border-1px(rgba(7,17,27,0.1))
          .name
            line-height: 24px
            font-size: 14px
            color: rgb(7,17,27)
          .price
            position: absolute
            right: 90px
            bottom: 12px
            line-height: 24px
            font-size: 14px
            font-weight: 700
            color: rgb(240,20,20)
          .cartctrl-wrapper
            position: absolute
            right: 0
            bottom: 6px
    .list-mask
      position: fixed
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -10
      backdrop-filter: blur(10px)
      transition: all 0.2s
      &.fade-transition
        opacity: 1
        background: rgba(7,17,27,0.6)
      &.fade-enter,&.fade-leave
        opacity: 0
        background: rgba(7,17,27,0)

</style>