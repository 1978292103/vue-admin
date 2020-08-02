<template>
  <div id="nav-wrap" >
    <h1 class="logo"><img src="../../../assets/logo.png" alt=""></h1>
    <el-menu
      default-active="1-4-1"
      class="el-menu-vertical-demo"
      :collapse="isCollapse"
      background-color="transparent"
      active-text-color="#fff"
      text-color="#fff"
      router
    >
    <template  v-for="(item, index) in routers">
      <el-submenu v-if="!item.hidden" :key="item.id" :index="index+ ''">
           <!-- 一級菜單  -->
        <template slot="title">
           <svg-icon :iconClass="item.meta.icon" :className="item.meta.icon" />
          <span slot="title">{{ item.meta.name }}</span>
        </template>
        <!-- 子級菜单 -->
          <el-menu-item v-for="subItem in item.children" :key="subItem.id" :index="subItem.path">
              {{ subItem.mata.name }}
          </el-menu-item>
      </el-submenu>
    </template>
 
 
    </el-menu>
   
  </div>
</template>
<script>
import { reactive , ref, onMounted,isRef,toRefs, computed } from "@vue/composition-api";
export default {
    name: 'navMenu',
    setup(props, { root }){
        /**
         * data 数据
         */
        //data 数组
    //    const isCollapse = ref(false);
        const routers = reactive(root.$router.options.routes);
       

        /**
         * computed 监听
         */
        const isCollapse = computed(() =>  root.$store.state.app.isCollapse)
        /**
         * 函数
         */

        return {
            isCollapse,
            routers
        }
    }
};
</script>
<style lang="scss">
@import "../../../style/config.scss";
.logo{
  text-align: center;
  img{
    @include webkit(transition, all .3s ease 0s);
    margin: 28px auto 25px;
    width: 92px;
  }

}
#nav-wrap {
  position: fixed;
  top: 0;
  left: 0;
  //width: $navMenu;
  height: 100vh;
  background-color: #344a5f;
  @include webkit(transition, all .3s ease 0s);
  svg{
    font-size: 20px;
    margin-right: 10px;
    // padding-right: 10px;
  }
}

.open{
  #nav-wrap{ width: $navMenu; }
}
.close{
  #nav-wrap{ width: $navMenuMin; }
  .logo img {width: 60%;}
   
}

</style>