<template>
  <div class="seller" v-el:seller>
    <div class="seller-content">
      <div class="overview">
        <h1 class="title">{{ seller.name }}</h1>
        <div class="desc border-1px">
          <star :size="36" :score="seller.score"></star>
          <span class="text">({{ seller.ratingCount }}条评论)</span>
          <span class="text">月售{{ seller.sellCount }}单</span>
        </div>
        <ul class="remark">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">{{ seller.minPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryPrice }}</span>元
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">{{ seller.deliveryTime }}</span>分钟
            </div>
          </li>
        </ul>
        <div class="collect">
          <i class="icon-favorite" :class="{'active': collected}" @click="toggleCollect"></i>
          <span class="text">{{ collectedText }}</span>
        </div>
      </div>
      <split></split>
      <div class="bulletin">
        <h2 class="title">公告与活动</h2>
        <div class="content-wrapper">
          <p class="content">{{ seller.bulletin }}</p>
        </div>
	    <ul v-if="seller.supports" class="supports">
	      <li class="support-item border-1px" v-for="support in seller.supports">
	        <span class="icon" :class="classMap[support.type]"></span>
	        <span class="text">{{ support.description }}</span>
	      </li>
	    </ul>  
      </div>
      <split></split>
      <div class="pictures">
        <h2 class="title">商家实景</h2>
        <div class="picture-wrapper" v-el:picture-wrapper>
          <ul class="picture-list" v-el:picture-list>
            <li class="picture-item" v-for="picture in seller.pics">
              <img :src="picture" width="120" height="90" alt="">
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h2 class="title border-1px">商家信息</h2>
        <ul>
          <li class="info-item" v-for="info in seller.infos">{{ info }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll';
  import star from '../star/star.vue';
  import split from '../split/split.vue';
  import {saveToLocalStorage, readFromLocalStorage} from '../../common/js/storage.js';

  export default {
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        collected: readFromLocalStorage(this.seller.id, 'collected', false)  // 从本地读取该商家的收藏状态
                                                                              // 默认该值为false
      };
    },
    components: {
      star,
      split
    },
    watch: {
      seller() {         // 监听seller，如果seller发生变化，则执行此方法
        this._initScroll();
        this._initPictureScroll();
      }
    },
    computed: {
      collectedText() {
        return this.collected ? '已收藏' : '收藏';
      }
    },
    methods: {
      toggleCollect(ev) {
        if (!ev._constructed) {
          return;
        }
        if (!this.seller.id) {
          window.alert('商家ID未知，无法收藏！请在浏览器地址栏中附加商家ID参数~');
          return;
        }
        this.collected = !this.collected;
        saveToLocalStorage(this.seller.id, 'collected', this.collected);
      },
      _initScroll() {
        if (!this.scroll) {
          this.scroll = new BetterScroll(this.$els.seller, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      },
      _initPictureScroll() {
        if (this.seller.pics) {     // 由于picture-list的宽度最多只能被li撑开到picture-wrapper的宽度
          let picLength = 120;     // 所以要想让图片有滚动效果，需要动态计算赋予picture-list指定宽度
          let margin = 6;
          let ulWidth = (picLength + margin) * this.seller.pics.length - margin;
          this.$els.pictureList.style.width = ulWidth + 'px';
          this.$nextTick(() => {
            if (!this.pictureScroll) {
              this.pictureScroll = new BetterScroll(this.$els.pictureWrapper, {
                scrollX: true,           // 横向滚动
                eventPassthrough: 'vertical'      // 也允许外部垂直滚动
              });
            } else {
              this.pictureScroll.refresh();
            }
          });
        }
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    },
    ready() {        // Dom元素加载完毕就执行，要早于watch中seller对应的方法
      this._initScroll();
      this._initPictureScroll();
    }
  };
</script>

<style lang="stylus" type="text/stylus">
  @import '../../common/stylus/mixin.styl';

  .seller
    position: absolute
    top: 174px
    bottom: 0
    width: 100%
    padding: 6px 0
    overflow: hidden   
    .overview
      position: relative
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7,17,27)
        font-size: 14px
      .desc
        padding-bottom: 18px
        line-height: 18px
        font-size: 0
        border-1px(rgba(7,17,27,0.1))
        .star
          display: inline-block
          margin-right: 8px
          vertical-aligm: top
        .text
          display: inline-block
          vertical-align: top
          font-size: 10px
          color: rgb(77,85,93)
          &:last-child
            margin-left: 20px
      .remark
        display: flex
        padding-top: 18px
        .block
          flex-grow: 1
          text-align: center
          border-right: 1px solid rgba(7,17,27,0.1)
          &:last-child
            border: none
          h2
            margin-bottom: 10px
            line-height: 10px
            font-size: 10px
            color: rgb(147,153,159)
          .content
            line-height: 24px
            font-size: 10px
            color: rgb(7,17,27)
            .stress
              font-size: 20px
      .collect
        position: absolute
        width: 50px
        right: 18px
        top: 18px
        text-align: center
        .icon-favorite
          display: block
          margin-bottom: 4px
          color: #d4d6d9
          line-height: 24px
          font-size: 24px
          &.active
            color: rgb(240,20,20)
        .text
          line-height: 10px
          font-size: 10px
          color: rgb(77,85,93)
    .bulletin
      padding: 18px 18px 0 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7,17,27)
        font-size: 14px
      .content-wrapper
        padding: 0 12px 16px 12px
        border-1px(rgba(7,17,27,0.1))
        .content
          line-height: 24px
          font-size: 12px
          color: rgb(240,20,20)
      .supports
        .support-item
          padding: 16px 12px
          font-size: 0
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border: none
          .icon
            display: inline-block
            width: 12px
            height: 12px
            margin-right: 4px
            vertical-align: middle
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease      
              bg-image("decrease_4")
            &.discount
              bg-image("discount_4")
            &.guarantee
              bg-image("guarantee_4")
            &.invoice
              bg-image("invoice_4")    
            &.special
              bg-image("special_4") 
          .text
            vertical-align: middle
            font-size: 12px   
            line-height: 16px
            color: rgb(7,17,27) 
    .pictures
      padding: 18px
      .title
        margin-bottom: 8px
        line-height: 14px
        color: rgb(7,17,27)
        font-size: 14px
      .picture-wrapper
        width: 100%
        overflow: hidden
        .picture-list
          white-space: nowrap
          font-size: 0
          .picture-item
            display: inline-block
            margin-right: 6px
            width: 120px
            height: 90px
            &:last-child
              margin: 0
    .info
      padding: 18px 18px 0 18px
      .title
        padding-bottom: 12px
        line-height: 14px
        color: rgb(7,17,27)
        font-size: 14px
        border-1px(rgba(7,17,27,0.1))
      .info-item
        padding: 16px 12px
        line-height: 16px
        border-1px(rgba(7,17,27,0.1))
        color: rgb(7,17,27)
        font-size: 12px
        &:last-child
          border: none

</style>