<template>
  <div class="ratingselect">
    <div class="rating-type border-1px">
      <span class="common positive" :class="{'active':selectType===2}" @click="select(2,$event)">{{ desc.all }}<span class="count">{{ ratings.length }}</span></span>
      <span class="common positive" :class="{'active':selectType===0}" @click="select(0,$event)">{{ desc.positive }}<span class="count">{{ positives.length }}</span></span>
      <span class="common negative" :class="{'active':selectType===1}" @click="select(1,$event)">{{ desc.negative }}<span class="count">{{ negatives.length }}</span></span>
    </div>
    <div class="switch" :class="{'on':onlyContent}" @click="toggleContent">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  const POSITIVE = 0;
  const NEGATIVE = 1;
  const ALL = 2;

  export default {
    props: {
      ratings: {
        type: Array,
        default() {
          return [];
        }
      },
      selectType: {
        type: Number,
        default() {
          return ALL;
        }
      },
      onlyContent: {
        type: Boolean,
        default() {
          return false;
        }
      },
      desc: {
        type: Object,
        default() {
          return {
            all: '全部',
            positive: '满意',
            negative: '不满意'
          };
        }
      }
    },
    methods: {
      select(type, ev) {
        if (!ev._constructed) {
          return;
        }
        this.selectType = type;
        this.$dispatch('ratingtype.select', type);       // 通过派发事件把type传给父组件
      },
      toggleContent(ev) {
        if (!ev._constructed) {
          return;
        }
        this.onlyContent = !this.onlyContent;
        this.$dispatch('content.toggle', this.onlyContent);
      }
    },
    computed: {
      positives() {            // 积极评价
        return this.ratings.filter((rating) => {
          return rating.rateType === POSITIVE;
        });
      },
      negatives() {           // 消极评价
        return this.ratings.filter((rating) => {
          return rating.rateType === NEGATIVE;
        });
      }
    }
  };
</script>

<style lang="stylus" type="text/stylus">
  @import '../../common/stylus/mixin.styl';

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7,17,27,0.2))
      font-size: 0
      .common
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        border-radius: 1px
        font-size: 12px
        &.active
          color: #fff
        .count
          font-size: 8px
          margin-left: 2px
        &.positive
          background: rgba(0,160,220,0.2)
          &.active
            background: rgb(0,160,220)
        &.negative
          background: rgba(77,85,93,0.2)
          &.active
            background: rgb(77,85,93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7,17,27,0.1)
      color: rgb(147,153,159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        font-size: 24px
        margin-right: 4px
        display: inline-block
        vertical-align: middle
      .text
        font-size: 12px
        vertical-align: middle

</style>