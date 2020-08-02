<template>
   
    <svg :class="svgClass" aria-hidden="true">
        <use :xlink:href="iconName"></use>
    </svg>
    
</template>
<script>
import { reactive , ref, onMounted, isRef, toRefs, computed} from "@vue/composition-api";
export default {
    name: "svgIcon",
    //props: ['iconClass','className'],
    props: {
        iconClass: {
            type: String ,//定义接收的值类型
            default: '',
            required: true
        },
        className: {
            type: String,
            default: ''
        }
    },
    setup(props){
        console.log(props.iconClass);
        const msg = ref("1234567");
        const count = ref(10);
       /**
        * computed 监听属性变化，并计算属性
        */
    //    const plusOne = computed(() => {
    //        return count.value + 1
    //    })
        //計算属性，得出最终结果，并返回
        const iconName = computed(() =>  `#icon-${props.iconClass}`)
        const svgClass = computed(() => {
            if(props.className){
                return `svg-icon ${props.className}`
            }else{
                return `svg-icon`
            }
        })


        return {
            msg,
            iconName,
            svgClass
        }
    }
}
</script>
<style lang="scss" scoped>
.svg-icon{
    width: 1em;
    height: 1em;
    fill: currentColor;
    
}
</style>