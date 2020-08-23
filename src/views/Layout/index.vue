<template>
    <div id="layout" :class="[menuStatus? 'close':'open']">
        
        <LayoutHeader />
        <LayoutMain />  
        <LayoutNav />
      
    </div>
</template>

<script>

import LayoutHeader from './Components/Header'
import LayoutMain from './Components/Main'
import LayoutNav from './Components/Nav'
import { computed } from '@vue/composition-api'

export default {
    name: 'layout',
    components: {LayoutHeader,LayoutMain,LayoutNav},
    setup(props, { root }){
      //  console.log(root.$store.state.isCollapse);
        const menuStatus = computed(() => root.$store.state.app.isCollapse);
       // console.log(JSON.stringify(menuStatus)+'--------------');   
        return {
            menuStatus
        }
    }
 


}
</script>
<style lang="scss" scoped></style>