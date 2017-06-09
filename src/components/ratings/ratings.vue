<template>
  <div class="ratings" v-el:user-ratings>
    <div class="ratings-content">
      <div class="overview">
        <div class="overview-left">
          <h1 class="score">{{ seller.score }}</h1>
          <div class="title">综合评分</div>
          <div class="rank">高于周边商家{{ seller.rankRate }}%</div>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{ seller.serviceScore }}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.foodScore"></star>
            <span class="score">{{ seller.foodScore }}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{ seller.deliveryTime }}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <rating :select-type="selectType" 
              :only-content="onlyContent"
              :desc="desc"
              :ratings="ratings">
      </rating>
      <div class="user-ratings-wrapper">
        <ul>
          <li v-for="rating in ratings" class="rating-item" v-show="needShow(rating.rateType,rating.text)">
            <div class="avatar">
              <img :src="rating.avatar" width="28" height="28" alt="">
            </div>
            <div class="content">
              <h1 class="name">{{ rating.username }}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{ rating.deliveryTime }}分钟送达</span>
              </div>
              <p class="text">{{ rating.text }}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <span class="icon-thumb_up"></span>
                <div class="recommend-items-wrapper">
                  <span v-for="item in rating.recommend" class="item">{{ item }}</span>
                </div>
              </div>
              <div class="time">{{ rating.rateTime | formatTimeToDate }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll';
  import star from '../star/star.vue';                       // 引入星星组件
  import split from '../split/split.vue';                    // 引入分隔组件
  import rating from '../rating/rating.vue';                 // 引入评价组件

  import {formatDate} from '../../common/js/date.js';         // 引入格式化日期方法

  const ERR_OK = 0;
  const ALL = 2;

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        selectType: ALL,
        onlyContent: false,
        desc: {
          all: '全部',
          positive: '推荐',
          negative: '吐槽'
        },
        ratings: []
      };
    },
    components: {
      star,
      split,
      rating
    },
    methods: {
      needShow(type, text) {     // 当这个函数中有某个依赖变化时，该函数也会被重新调用，对应视图也会更新
        // console.log(type, text);
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
    filters: {
      formatTimeToDate(time) {
        let date = new Date(time);
        return formatDate(date, 'yyyy-MM-dd hh:mm');
      }
    },
    created() {
      this.$http.get('/api/ratings').then((response) => {          // 后台获取用户评论
        // console.log(response.body);
        response = response.body;
        if (response.errno === ERR_OK) {
          this.ratings = response.data;
          this.$nextTick(() => {
            if (!this.scroll) {
              this.scroll = new BetterScroll(this.$els.userRatings, {
                click: true
              });
            } else {
              this.scroll.refresh();
            }
          });
        }
      });
    }
  };
</script>

<style lang="stylus" type="text/stylus">
  @import '../../common/stylus/mixin.styl';

  .ratings
    position: absolute
    top: 174px
    bottom: 0
    width: 100%
    padding: 6px 0
    overflow: hidden
    .overview
      display: flex
      padding: 18px 0
      .overview-left
        flex: 0 0 137px
        width: 137px
        padding: 6px 0
        border-right: 1px solid rgba(7,17,27,0.1)
        text-align: center
        @media only screen and (max-width: 320px)    /* 为避免在iphone5中出现布局错乱，让左侧的宽度自适应屏幕宽度 */
          flex: 0 0 120px
          width: 120px
        .score
          margin-bottom: 6px
          line-height: 28px
          font-size: 24px
          color: rgb(255,153,0)
        .title
          margin-bottom: 8px
          line-height: 12px
          font-size: 12px
          color: rgb(7,17,27)
        .rank
          font-size: 10px
          line-height: 10px
          color: rgb(147,153,159)
      .overview-right
        flex-grow: 1
        padding: 6px 0 6px 24px
        @media only screen and (max-width: 320px) /* 为避免在iphone5中出现布局错乱，减小右侧padding */
          padding-left: 6px
        .score-wrapper
          margin-bottom: 8px
          font-size: 0
          .title
            display: inline-block
            vertical-align: top
            font-size: 12px
            line-height: 18px
            color: rgb(7,17,27)
          .star
            display: inline-block
            vertical-align: top
            margin: 0 12px
          .score
            display: inline-block
            vertical-align: top
            font-size: 12px
            line-height: 18px
            color: rgb(255,153,0)
        .delivery-wrapper
          font-size: 0
          .title
            font-size: 12px
            line-height: 18px
            color: rgb(7,17,27)
          .delivery
            margin-left: 12px
            font-size: 12px
            color: rgb(147,153,159)
    .user-ratings-wrapper
      padding: 0 18px
      .rating-item
        display: flex
        padding: 18px 0
        border-1px(rgba(7,17,27,0.1))
        .avatar
          flex: 0 0 28px
          width: 28px
          margin-right: 12px
          img
            border-radius: 50%
        .content
          flex-grow: 1
          position: relative
          .name
            margin-bottom: 4px
            line-height: 12px
            font-size: 10px
            color: rgb(7,17,27)
          .star-wrapper
            margin-bottom: 6px
            font-size: 0
            .star
              display: inline-block
              vertical-align: top
              margin-right: 6px
            .delivery
              display: inline-block
              vertical-align: top
              line-height: 12px
              font-size: 10px
              color: rgb(147,153,159


              	)
          .text
            line-height: 18px
            color: rgb(7,17,27)
            font-size: 12px
            margin-bottom: 8px
          .recommend
            display: flex
            .icon-thumb_up
              color: rgb(0,160,220)
              margin-right: 8px
              font-size: 10px
              line-height: 19px
            .recommend-items-wrapper
              flex-grow: 1
              .item
                display: inline-block
                margin: 0 8px 4px 0
                padding: 0 6px
                border: 1px solid rgba(7,17,27,0.1)
                border-radius: 1px
                font-size: 9px
                line-height: 16px
                color: rgb(147,153,159)
                background: #fff
          .time
            position: absolute
            top: 0
            right: 0
            line-height: 12px
            font-size: 10px
            color: rgb(147,153,159)
</style>