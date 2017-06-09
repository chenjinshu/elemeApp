<template>
  <div>
    <v-header :seller="seller"></v-header>    <!-- 将seller传递给header组件 -->
    <div class="tab border-1px">
      <div class="tab-item">
        <a v-link="{path: '/goods'}">商品</a>          <!-- 使用指令v-link进行导航 -->
      </div>
      <div class="tab-item">
        <a v-link="{path: '/ratings'}">评论</a>
      </div>
      <div class="tab-item">
        <a v-link="{path: '/seller'}">商家</a>
      </div>
    </div>
    <router-view :seller="seller" keep-alive></router-view>  <!-- keep-alive的作用是当tab页被切换到另一个页面后又再次
                                                                  切换回来时，该tab页面不会被重新渲染，而是保持之前的
                                                                  状态，在这里就表现为购物车不会因为切换到其他tab页而
                                                                  清空 -->
  </div>
</template>

<script type="text/ecmascript-6">
  import header from './components/header/header.vue';
  import {urlParse} from './common/js/util.js';           // 引入浏览器地址解析模块
  
  const ERR_OK = 0;

  export default {
    data() {
      return {
        seller: {    // 由于下面的ajax请求是异步请求，所以需要在Vue实例上先绑定一个空的seller对象作为数据传递
                     // 否则会报错。
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
    },
    created() {
      // 发起ajax请求，前提是main.js中必须注册了VueResource。这里的this是这个模板实例
      this.$http.get('/api/seller?id=' + this.seller.id).then((response) => {
        response = response.body;
        // console.log(response);
        if (response.errno === ERR_OK) {
          this.seller = Object.assign({}, this.seller, response.data);
        }
      });
    },
    components: {
      'v-header': header
    }
  };
</script>

<style lang="stylus" type="text/stylus">
  @import './common/stylus/mixin.styl';       
  
  .tab
    display: flex
    flex-direction: row
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7, 17, 27, 0.1))       /* 设置边框为1px，然而由于手机dpr的不同，有些是无法实现1px的，需要
                                              利用媒体查询进行缩放来真正实现1px */      
    .tab-item
      flex-grow: 1
      text-align: center
      & > a 
        display: block
        font-size: 14px
        color: rgb(77, 85, 93)
        &.active
          color: rgb(240, 20, 20)       
</style>
