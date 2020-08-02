import router from "./index";
import store from "../store/index";
import { getToken } from "@/utils/app";
import { removeToken, removeUserName } from "../utils/app";

const whiteRouter = ['/login'];  //indexOf方法，判断是否存在
//路由守卫
router.beforeEach((to, from, next) => {
    console.log(to) 
    if(getToken()){
        if(to.path === '/login'){
            removeToken();
            removeUserName();
            store.commit("app/SET_TOKEN",'');
            store.commit("app/SET_USERNAME",'');
            next()
        }else{
            //获得用户的角色
            //动态分配路由权限
            next();
        }
        
        /***
         * 1 to = /console
         * 2 to = /index
         */
        //路由动态添加，分配菜单，每个角色分配不同的菜单
        console.log("存在");
    }else{
        console.log("不存在");
        if(whiteRouter.indexOf(to.path) !== -1){
            next();  //指向to
        }else{
            next('/login'); //路由指向
        }
        
    }
    /***  to.path
     * 1 直接进入index的时候，参数的to被改变成 /index。触发路由指向，就会走beforeEach
     * 2 再次next指向login，再次发生路由的执行，在走beforeEach，这是参数为 /login
     * 3 白名单判断存在，则直接执行next，因为没有参数，所有不在执行beforeEach
     */
    // console.log(to)  //需要进入的页面（下一个页面）
    // console.log(from) //离开之前的页面（上一个页面）
    // console.log(next)
    // next()
    // token 令牌
  })