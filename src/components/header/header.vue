<template>
  <div class="header">
  	<div class="content-wrapper">
  	  <div class="avatar">
  	  	<img width="64" height="64" :src="seller.avatar" alt="">
  	  </div>
  	  <div class="content">
  	  	<div class="title">
  	  	  <span class="brand"></span>
  	  	  <span class="name">{{ seller.name }}</span>
  	  	</div>
  	  	<div class="description">
  	  	  {{ seller.description }}/{{ seller.deliveryTime }}分钟送达
  	  	</div>
  	  	<div v-if="seller.supports" class="support">
  	  	  <span class="icon" :class="classMap[seller.supports[0].type]"></span>
  	  	  <span class="text">{{ seller.supports[0].description }}</span>
  	  	</div>
  	  </div>
  	  <div v-if="seller.supports" class="support-count" @click="showDetail">
  	  	<span class="count">{{ seller.supports.length }}种</span>
  	  	<i class="icon-keyboard_arrow_right"></i>
  	  </div>
  	</div>
  	<div class="bulletin-wrapper" @click="showDetail">
  	  <span class="bulletin-title"></span><span class="bulletin-text">{{ seller.bulletin }}</span>
  	  <i class="icon-keyboard_arrow_right"></i>
  	</div>

  	<!-- 模糊背景 -->
  	<div class="blur-background">
  	  <img :src="seller.avatar" width="100%" height="100%" alt="">
  	</div>

  	<!-- 商家详情页 -->
  	<div v-show="detailShow" class="detail" transition="fade">     <!-- 给显示过程添加渐变效果 -->
  	  <div class="detail-wrapper clearfix">
  	  	<div class="detail-main">
          <h1 class="name">{{ seller.name }}</h1>
          <div class="star-wrapper">
            <star :score="seller.score" :size="24"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="support in seller.supports">
              <span class="icon" :class="classMap[support.type]"></span>
              <span class="text">{{ support.description }}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="content">{{ seller.bulletin }}</p>
          </div>
  	  	</div>
  	  </div>	
  	  <div class="detail-close" @click="hideDetail">
  	  	<i class="icon-close"></i>
  	  </div>
  	</div>
  </div>
</template>

<script type="text/ecmascript-6">
  import star from '../star/star.vue';

  export default {
    components: {
      star
    },
    props: {
      seller: {
        type: Object              // 类型检查，传递进来的seller必须是一个Object对象
      }
    },
    data() {
      return {
        detailShow: false
      };
    },
    methods: {
      showDetail() {
        this.detailShow = true;           // 弹出详情页
      },
      hideDetail() {
        this.detailShow = false;          // 关闭详情页
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
    }
  };
</script>

<style lang="stylus" type="text/stylus">
  @import '../../common/stylus/mixin.styl';
  .header
    position: relative
    color: #fff
    background: rgba(7,17,27,0.5)
    .content-wrapper
      position: relative
      padding: 24px 12px 18px 24px
      font-size: 0        /* 消除aratar和content之间的由于空白字符引起的间距 */
      .avatar
        display: inline-block
        vertical-align: top
        img
          border-radius: 2px
      .content
        display: inline-block
        margin-left: 16px
        .title
          margin: 2px 0 8px 0
          .brand
            display: inline-block
            width: 30px
            height: 18px
            bg-image("brand")
            background-size: 30px 18px
            background-repeat: no-repeat
            vertical-align: top
          .name
            margin-left: 6px
            font-size: 16px
            line-height: 18px
            font-weight: bold
        .description
          margin-bottom: 10px
          lign-height: 12px
          font-size: 12px
        .support
          .icon
            display: inline-block
            width: 12px
            height: 12px
            margin-right: 4px
            background-size: 12px 12px
            background-repeat: no-repeat
            vertical-align: top
            &.decrease       /* 同时具有icon类和decrease类 */
              bg-image("decrease_1")
            &.discount
              bg-image("discount_1")
            &.guarantee
              bg-image("guarantee_1")
            &.invoice
              bg-image("invoice_1")    
            &.special
              bg-image("special_1")                        
        .text
          line-height: 12px
          font-size: 10px
      .support-count
        position: absolute
        width: 40px
        height: 24px
        right: 12px
        bottom: 18px
        padding: 0 8px
        line-height: 24px
        border-radius: 14px
        background: rgba(0,0,0,0.2)
        text-align: center
        .count
          font-size: 10px
          vertical-align: middle
        .icon-keyboard_arrow_right
          font-size: 10px
          vertical-align: middle
          margin-left: 2px
    .bulletin-wrapper
      position: relative
      height: 28px
      padding: 0 22px 0 12px
      line-height: 28px
      background: rgba(7,17,27,0.2)
      overflow: hidden
      text-overflow: ellipsis
      white-space: nowrap
      .bulletin-title
        display: inline-block
        width: 22px
        height: 12px
        bg-image("bulletin")
        background-size: 22px 12px
        background-repeat: no-repeat
        vertical-align: middle
      .bulletin-text
        font-size: 10px
        margin: 0 4px
        vertical-align: middle
      .icon-keyboard_arrow_right
        position: absolute
        font-size: 10px
        top: 10px
        right: 10px
    .blur-background
      position: absolute
      top: 0
      left: 0
      width: 100%
      height: 100%
      z-index: -1
      filter: blur(10px)
    .detail           
      position: fixed
      top: 0
      left: 0
      z-index: 200
      width: 100%
      height: 100%  
      overflow: auto
      backdrop-filter: blur(10px)       /* 只有在IOS上才会显示这个背景模糊效果 */
      transition: all 0.5s        /* 把时间调长查看样式的添加和删除过程 */
      &.fade-transition           /* 渐变效果,会始终保留该样式 */
        opacity: 1
        background: rgba(7,17,27,0.8)
      &.fade-enter,&.fade-leave
        opacity: 0
        background: rgba(7,17,27,0)
      .detail-wrapper             /* sticky footer 布局 */
        min-height: 100%
        .detail-main
          padding-top: 64px          /* 讲道理这里是可以将padding-top换成margin-top的，但是却有bug */
          padding-bottom: 64px 
          .name
            font-size: 16px
            line-height: 16px
            text-align: center
            font-weight: 700
          .star-wrapper
            margin-top: 18px
            padding: 2px 0
            text-align: center
      .title
        display: flex
        flex-direction: row
        width: 80%
        margin: 28px auto 24px auto
        .line
          flex-grow: 1
          position: relative
          top: -6px
          border-bottom: 1px solid rgba(255,255,255,0.2)
        .text
          padding: 0 12px
          font-size: 14px
          font-weight: 700
      .supports
        width: 80%
        margin: 0 auto
        .support-item
          padding:0 12px
          margin-bottom: 12px
          font-size: 0
          &:last-child
            margin-bottom: 0
         .icon
           display: inline-block
           width: 16px
           height: 16px
           vertical-align: top
           margin-right: 6px
           background-size: 16px 16px
           background-repeat: no-repeat
           &.decrease       
             bg-image("decrease_2")
           &.discount
             bg-image("discount_2")
           &.guarantee
             bg-image("guarantee_2")
           &.invoice
             bg-image("invoice_2")    
           &.special
             bg-image("special_2")      
          .text
            line-height: 16px
            font-size: 12px   
      .bulletin
        width: 80%
        margin: 0 auto
        .content
          padding: 0 12px
          line-height: 24px
          font-size: 12px
      .detail-close
        width: 32px
        height: 32px
        margin: -48px auto 0 auto
        font-size: 32px

</style>