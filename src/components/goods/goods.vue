<template>
  <div class="goods">
    <div class="menu-wrapper" v-el:menu-wrapper> <!--v-el属性将menu-wrapper存入vue实例中，用于vue获取对应的dom元素-->
      <ul>
        <!-- 如果需要高亮显示的菜单就是这个list，则给这个list添加current类 -->
        <li v-for="good in goods" class="menu-item" :class="{'current':currentIndex===$index}" @click="selectMenu($index,$event)">
          <span class="info border-1px">
            <span v-show="good.type>0" class="icon" :class="classMap[good.type]"></span>
            <span class="text">{{ good.name }}</span>
          </span>
        </li>
      </ul>
    </div>
    <div class="foods-wrapper" v-el:foods-wrapper>
      <ul>
        <li v-for="good in goods" class="food-list food-list-hook">
          <h1 class="title">{{ good.name }}</h1>
          <ul>
            <li v-for="food in good.foods" class="food-item border-1px" @click="foodClicked(food,$event)">
              <div class="icon">
                <img width="57" height="57" :src="food.icon" alt="">
              </div>
              <div class="content">
                <h2 class="name">{{ food.name }}</h2>
                <p class="desc">{{ food.description }}</p>
                <div class="extra">
                  <span class="count">月售{{ food.sellCount }}份</span><span>好评率{{ food.rating }}%</span>
                </div>
                <div class="price">
                  <span class="nowPrice">￥{{ food.price }}</span><span class="oldPrice" v-show="food.oldPrice">￥{{ food.oldPrice }}</span>
                </div>
                <div class="cartctrl-wrapper" @click.stop.prevent> <!-- 单纯阻止事件冒泡，避免点击增添商品时弹出
                                                                        商品详情页 -->
                  <cartctrl :food="food"></cartctrl>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
  <shopcar v-ref:shopcar
           :delivery-price="seller.deliveryPrice" 
           :min-price="seller.minPrice" 
           :selected-foods="selectedFoods">
  </shopcar>
           <!-- v-ref的作用是把shopcar子组件绑定的Vue实例传递到此组件的Vue实例上
                通过此组件的Vue实例的$refs.shopcar便可以得到shopcar子组件的Vue实例
                从而实现了在父组件中访问子组件 -->
  <food-detail :clicked-food="clickedFood" v-ref:food-detail></food-detail>
</template>

<script type="text/ecmascript-6">
  import BetterScroll from 'better-scroll';           // 引入better-scroll插件用于食品列表的滚动
  import shopcar from '../shopcar/shopcar.vue';      // 引入购物车组件
  import cartctrl from '../cartctrl/cartctrl.vue';   // 引入商品的添加和删除组件
  import foodDetail from '../foodDetail/foodDetail.vue';                // 引入商品详情组件

  const ERR_OK = 0;
  
  export default {
    components: {
      shopcar,            // 注册购物车组件
      cartctrl,           // 注册引入商品的添加和删除组件
      'food-detail': foodDetail    // 注册商品详情组件
    },
    props: {
      seller: {
        type: Object
      }
    },
    data() {
      return {
        goods: [],           // 所有商品
        listHeight: [],     // 用于存储每个foodList距离容器顶部的高度
        scrollY: 0,          // 实时存储滚动时的Y坐标
        clickedFood: {}      // 被用户点击的商品
      };
    },
    events: {               // 自定义事件
      'cart.add'(target) {
        // console.log(target);
        this._drop(target);
      }
    },
    methods: {
      selectMenu(index, ev) {
        if (!ev._constructed) {            // 只有派发的事件才具有这个属性，原生的事件不具有此属性
          return;                          // 过滤掉原生的事件，使得手机端和pc端均只响应一次
        }
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');  // 获取原生dom元素
        let currentList = foodList[index];
        this.foodsScroll.scrollToElement(currentList, 300);       // 滚动到当前index所对应的食物列表,滚动3毫秒
      },
      _initScroll() {
        // 创建menuScroll实例，this.$els对象中存放的就是通过v-el绑定的dom元素,使其具有滚动效果
        // 其实滚动的是其子元素，其充当的只是一个滚动时的容器，本身不滚动
        this.menuScroll = new BetterScroll(this.$els.menuWrapper, {
          click: true   // 默认情况下，在手机端BetterScroll将阻止事件冒泡到这个容器元素，使得无法监听这个容器
                        // 元素的click等事件，在pc端则能正常监听。设置click为true，实际上BetterScroll会派发一个
                        // 点击事件，使得在手机端也能监测到click事件。这时在pc端就会有两次click事件，比如上面的
                        // selectMenu方法，如果不设置click为true，在手机端点击菜单时这个方法不会被执行。在pc端会
                        // 被执行一次。如果设置click为true，在手机端点击菜单时这个方法会被执行一次，在pc端会被执
                        // 行两次。
        });
        this.foodsScroll = new BetterScroll(this.$els.foodsWrapper, {
          probeType: 3,           // 能对滚动进行监测
          click: true
        });
        this.foodsScroll.on('scroll', (position) => {               // 对滚动进行监测
          if (position.y <= 0) {       // 表明列表的位置相对于初始位置是往上滚动了的
            this.scrollY = Math.abs(Math.round(position.y));    // 取正数
            // console.log(this.scrollY);
          }
        });
      },
      _calculate() {
        let foodList = this.$els.foodsWrapper.getElementsByClassName('food-list-hook');
        let height = 0;
        this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
          let item = foodList[i];
          height += item.clientHeight;
          this.listHeight.push(height);
        }
        // console.log(this.listHeight);
      },
      _drop(target) {                   // 处理购物车小球坠落函数，target为所点击的添加按钮
        // console.log(target);
        // 异步执行小球动画，优化体验
        this.$nextTick(() => {
          this.$refs.shopcar._drop(target);    // 在shopcar子组件中的_drop函数中处理小球
        });
      },
      foodClicked(food, ev) {
        if (!ev._constructed) {            // 只有派发的事件才具有这个属性，原生的事件不具有此属性
          return;                          // 过滤掉原生的事件，使得手机端和pc端均只响应一次
        }
        // console.log(food);
        this.clickedFood = food;           // 把被点击的商品传递给food子组件
        this.$refs.foodDetail.show();      // 在父组件中调用food子组件的show方法
                                           // PS: 父组件中可以调用子组件的方法，反之不行
      }
    },
    computed: {
      currentIndex() {      // 计算食品列表滚动时其应该所在的索引，用于在菜单上高亮显示
        for (let i = 0; i < this.listHeight.length - 1; i++) {
          // 判断当前的scrollY是否介于listHeight数组中的任意两个连续值之间
          if (this.scrollY >= this.listHeight[i] && this.scrollY < this.listHeight[i + 1]) {
            return i;          // i就是菜单的高亮显示的索引值
          }
        }
      },
      selectedFoods() {       // 通过传递给cartctrl组件的food对象的count属性的变化来计算用户选择的商品
        var foods = [];         // 这时因为当传递给子组件的是一个引用类型变量时，传递的只是这个对象的引用
        this.goods.forEach((goodType) => {         // 在子组件中改变这个对象的属性值也会反应到父组件上
          goodType.foods.forEach((food) => {       // 如果传递的不是引用类型，则在子组件中改变传递的变量
            if (food.count > 0) {                  // 不会影响到父组件,但在父组件中改变这个变量却会影响
              // console.log(food.count);          // 到子组件。
              foods.push(food);
            }
          });
        });
        // console.log(obj);
        return foods;
      }
    },
    created() {
      this.classMap = ['decrease', 'discount', 'guarantee', 'invoice', 'special'];
      this.$http.get('/api/goods').then(response => {
        // console.log(response.body);
        response = response.body;
        if (response.errno === ERR_OK) {
          this.goods = response.data;
          // console.log(this.goods);
          this.$nextTick(() => {
            this._initScroll();       // 一定要在nextTick函数里中执行这两个函数，这两个函数涉及dom操作
                                      // 必须确保在函数执行时dom已经更新完毕，否则可能不会有滚动效果
            this._calculate();
          });
          // console.log(this.goods);
        }
      });
    }
  };
</script>

<style lang="stylus" type="text/stylus">
  @import '../../common/stylus/mixin.styl';

  .goods
    display: flex
    position: absolute
    top: 174px
    bottom: 46px
    width: 100%
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        width: 56px
        height: 54px
        padding: 0 12px
        &.current
          position: relative
          margin-top: -1px
          z-index: 10
          background: #fff
          font-weight: 700
          .info
            border-none()
        .info
          display: table-cell            /* 利用table布局结合vertical-align:middle使元素垂直居中; */
          width: 56px
          vertical-align: middle
          border-1px(rgba(7,17,27,0.1))
          font-size: 0
          .icon
            display: inline-block
            width: 12px
            height: 12px
            margin-right: 2px
            vertical-align: top
            background-size: 12px 12px
            background-repeat: no-repeat
            &.decrease
              bg-image("decrease_3")
            &.discount
              bg-image("discount_3")
            &.guarantee
              bg-image("guarantee_3")
            &.invoice
              bg-image("invoice_3")
            &.special
              bg-image("special_3")
          .text
            font-size: 12px
    .foods-wrapper
      flex-grow: 1
      .food-list
        .title
          padding-left: 14px
          height: 26px
          line-height: 26px
          border-left: 2px solid #d9dde1
          font-size: 12px
          color: rgb(147,153,159)
          background: #f3f5f7
        .food-item
          display: flex
          flex-direction: row
          margin: 18px
          padding-bottom: 18px
          border-1px(rgba(7,17,27,0.1))
          &:last-child
            border-none()             /* 消除伪类生成的1px边框 */
            margin-bottom: 0
          .icon
            flex: 0 0 57px
            margin-right: 10px
          .content
            flex-grow: 1
            .name
              margin: 2px 0 8px 0
              height: 14px
              font-size: 14px
              line-height: 14px
              color: rgb(7,17,27)
            .desc
              margin-bottom: 8px
            .desc,.extra
              line-height: 12px
              font-size: 10px
              color: rgb(147,153,159)
            .extra
              .count
                margin-right: 12px
            .price
              font-weight: 700
              line-height: 24px
              .nowPrice
                margin-right: 18px
                font-size: 10px
                color: rgb(240,20,20)
              .oldPrice
                text-decoration: line-through
                color: rgb(147,153,159)
                font-size: 10px
            .cartctrl-wrapper
              position: absolute
              right: 0
              bottom: 8px
</style>
