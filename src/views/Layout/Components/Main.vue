<template>
    <div id="main-wrap">
        <div class="main-content">
            <div class="content">
                 <!-- 显示子层的页面 -->
                 <router-view />
            </div>
        </div>
       
    </div>
</template>
<script>
import { reactive } from '@vue/composition-api'
export default {
    name: 'layoutMain',
    setup(){

    }
    
}
</script>
<style lang="scss" scoped>
@import "../../../style/config.scss";
#main-wrap{
    // position: fixed;
    // left: $navMenu;
    // top: 75px;
    // right: 0;
    // bottom: 0;
    // border: 30px solid #f7f7f7;
    // border-bottom: none;
    // // padding: 75px 0 0 250px;
     height: 100vh;
    // -webkit-box-sizing: border;
}
.main-content{
    width:100%;
    height: 100%;
    padding-top: $layoutHeader + 30;
    padding-left: $navMenu +30;
    padding-right: 30px;
    @include webkit(box-sizing,  border-box);
    @include webkit(transition, all .3s ease 0s);
}

.open{
    .main-content{ padding-left: $navMenu +30;}
}

.close{
    .main-content{ padding-left: $navMenuMin +30;}
}

.content{
    width:100%;
    height: 100%;
    padding: 30px 30px 0 30px;
    @include webkit(box-sizing,  border-box);
    background-color: #fff;

}
</style>