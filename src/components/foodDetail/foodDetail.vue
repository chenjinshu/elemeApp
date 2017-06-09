<template>
  <div v-show="showFlag" class="food" transition="move" v-el:clicked-food>   <!-- 用于绑定BetterScroll -->
  	<div class="food-content">
  	  <div class="image-header">
  	  	<img :src="clickedFood.image" alt="">
  	  	<div class="back" @click="hide">
  	  	  <i class="icon-arrow_lift"></i>
  	  	</div>
  	  </div>
  	  <div class="content">
  	  	<h1 class="title">{{ clickedFood.name }}</h1>
  	  	<div class="detail">
  	  	  <span class="sell-count">月售{{ clickedFood.sellCount }}份</span><span class="rating">好评率{{ clickedFood.rating }}%</span>
  	  	</div>
  	  	<div class="price">
  	  	  <span class="now">￥{{ clickedFood.price }}</span>
  	  	  <span class="old" v-show="clickedFood.oldPrice">￥{{ clickedFood.oldPrice }}</span>
  	  	</div>
        <div class="cartctrl-wrapper">
          <cartctrl :food="clickedFood"></cartctrl>
        </div>
        <div class="buy" @click="firstAdd" v-show="!clickedFood.count" transition="fade">加入购物车</div>
  	  </div>
      <split v-show="clickedFood.info"></split>
      <div class="info" v-show="clickedFood.info">
        <h1 class="title">商品信息</h1>
        <p class="text">{{ clickedFood.info }}</p>
      </div>
      <split></split>
      <div class="rating">
        <h1 class="title">商品评价</h1>
        <rating :select-type="selectType"
                :only-content="onlyContent"
                :desc="desc"
                :ratings="clickedFood.ratings">
        </rating>
        <div class="rating-text-wrapper">
          <ul v-show="clickedFood.ratings && clickedFood.ratings.length">
            <li v-for="rating in clickedFood.ratings" v-show="needShow(rating.rateType,rating.text)" class="rating-item border-1px">
              <div class="user">
                <span class="username">{{ rating.username }}</span>
                <img class="avatar" :src="rating.avatar" width="12" height="12" alt="">
              </div>
              <div class="time">{{ rating.rateTime | formatTimeToDate }}</div>
              <p class="text-wrapper">
                <span :class="{'icon-thumb_up':rating.rateType===0, 'icon-thumb_down':rating.rateType===1}"></span>
                <span class="text">{{ rating.text }}</span>
              </p>
            </li>
          </ul>
          <div class="no-rating" v-show="!clickedFood.ratings || !clickedFood.ratings.length">
            <span>暂无评价</span>
          </div>
        </div>
      </div>
  	</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import Vue from 'vue';
  import BetterScroll from 'better-scroll';
  import cartctrl from '../cartctrl/cartctrl.vue';         // 引入cartctrl组件
  import split from '../split/split.vue';                    // 引入分隔组件
  import rating from '../rating/rating.vue';                 // 引入评价组件

  import {formatDate} from '../../common/js/date.js';         // 引入格式化日期方法

  // const POSITIVE = 0;
  // const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      clickedFood: {
        type: Object,
        default() {
          return {};
        }
      }
    },
    data() {
      return {
        showFlag: false,
        selectType: ALL,             // 选择看的评价类型
        onlyContent: false,          // 只看有内容的评价
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        }
      };
    },
    events: {
      'ratingtype.select'(type) {
        this.selectType = type;            // 会触发show函数被重新执行
        this.$nextTick(() => {             //  一定要在Dom更新之后重新计算scroll
          this.scroll.refresh();             // 重新计算scroll
        });
      },
      'content.toggle'(onlyContent) {
        this.onlyContent = onlyContent;    // 会触发show函数被重新执行
        this.$nextTick(() => {
          this.scroll.refresh();
        });
      }
    },
    methods: {
      show() {
        this.showFlag = true;
        this.selectType = ALL;
        this.onlyContent = false;
        this.$nextTick(() => {
          // 绑定BetterScroll务必要在nextTick中绑定
          if (!this.scroll) {
            this.scroll = new BetterScroll(this.$els.clickedFood, {
              click: true
            });
          } else {
            this.scroll.refresh();        // 重新计算
          }
        });
      },
      hide() {
        this.showFlag = false;
      },
      firstAdd(ev) {
        if (!ev._constructed) {
          return;
        }
        this.$dispatch('cart.add', ev.currentTarget);         // 派发事件，用于抛物线小球动画
                                                              // 这里需要注意，由于派发事件时这里传递的对象(加入购物车
                                                              // 按钮)是会被隐藏的，所以小球在执行抛物线动画时该元素
                                                              // 实际上display是为none的，所以调用getBoundingClientRect
                                                              // 得不到正确的结果，抛物线动画会异常。所以，我这里给这个
                                                              // 按钮添加了一个过渡效果，这样在调用getBoundingClientRect
                                                              // 时该元素还没有被隐藏，可以正确计算其位置。
        Vue.set(this.clickedFood, 'count', 1);
      },
      needShow(type, text) {     // 当这个函数中有某个依赖变化时，该函数也会被重新调用，对应视图也会更新
        if (this.selectType === ALL) {     // 如果是显示全部评论
          if (this.onlyContent) {
            if (text === '') {
              return false;
            }
            return true;
          }
          return true;
        }
        if (this.selectType === type) {       // 否则只显示指定的类型
          if (this.onlyContent) {               // 如果指定只看有内容的评价
            if (text === '') {                   // 如果内容为空，不显示
              return false;
            }
            return true;
          }
          return true;
        }
        return false;
      }
    },
    filters: {
      formatTimeToDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    components: {
      cartctrl,           // 注册cartctrl组件
      split,              // 注册分隔组件
      rating              // 注册评价组件
    }
  };
</script>

<style lang="stylus" type="text/stylus">
  @import '../../common/stylus/mixin.styl';

  .food
    position: fixed
    left: 0
    top: 0
    bottom: 48px
    z-index: 5
    width: 100%
    background: #fff  
    &.move-transition
      transition: all 0.4s ease
      transform: translate3d(0,0,0)	
    &.move-enter,&.move-leave
      transform: translate3d(100%,0,0)
    .food-content
      .image-header
        position: relative
        width: 100%
        height: 0
        padding-top: 100%   /* padding: 100% 是相对于盒子的宽度而言的，这样做可以使image-header是一个正方形; */
        img
          position: absolute;
          top: 0
          left: 0
          width: 100%
          height: 100%
        .back
          position: absolute
          top: 10px
          left: 10px
          .icon-arrow_lift
            display: inline-block
            padding: 8px
            font-size: 20px
            color: #fff
      .content
        padding: 18px
        position: relative
        .title
          line-height: 14px
          margin-bottom: 8px
          font-size: 14px
          font-weight: 700
          color: rgb(7,17,27)
        .detail
          margin-bottom: 18px
          line-height: 10px
          height: 10px
          font-size: 0
          .sell-count,.rating
            font-size: 10px
            color: rgb(147,153,159)
          .sell-count
            margin-right: 12px
        .price
          font-weight: 700
          line-height: 24px
          .now
            margin-right: 18px
            font-size: 10px
            color: rgb(240,20,20)
          .old
            text-decoration: line-through
            color: rgb(147,153,159)
            font-size: 10px
        .cartctrl-wrapper
          position: absolute
          right: 12px
          bottom: 12px
        .buy
          position: absolute
          right: 18px
          bottom: 18px
          z-index: 10
          height: 24px
          line-height: 24px
          padding: 0 12px
          box-sizing: border-box
          font-size: 10px
          border-radius: 12px
          color: #fff
          background: rgb(0,160,220)
          &.fade-transition
            transition: all 0.4s
            opacity: 1
          &.fade-enter,&.fade-leave
            opacity: 0
      .info
        padding: 18px
        .title
          line-height: 14px
          margin-bottom: 6px
          font-size: 14px
          color: rgb(7,17,27)
        .text
          line-height: 24px
          padding: 0 8px
          font-size: 12px
          color: rgb(77,85,93)
      .rating
        padding-top: 18px
        .title
          line-height: 14px
          margin-left: 18px
          font-size: 14px
          color: rgb(7,17,27)
        .rating-text-wrapper
          padding: 0 18px
          .rating-item
            position: relative
            padding: 16px 0
            border-1px(rgba(7,17,27,0.1))
            .user
              position: absolute
              right: 0
              top: 16px
              line-height: 12px
              font-size: 0
              .username
                display: inline-block
                vertical-align: top
                margin-right: 6px
                font-size: 10px
                color: rgb(147,153,159)
              .avatar
                border-radius: 50%
            .time
              line-height: 12px
              font-size: 10px
              color: rgb(147,153,159)
              margin-bottom: 6px
            .text-wrapper
              line-height: 16px
              font-size: 12px
              .icon-thumb_up,.icon-thumb_down
                line-height: 16px
                margin-right: 4px
                font-size: 12px
              .icon-thumb_up
                color: rgb(0,160,220)
              .icon-thumb_down
                color: rgb(147,153,159)
              .text
                color: #333
          .no-rating
            padding: 16px 0
            font-size: 12px
            color: rgb(147,153,159)


</style>