import Vue from "vue";
import VueRouter from "vue-router";
//import Login from "../views/login/index.vue";


Vue.use(VueRouter);
//引入布局组件
import Layout from "@/views/Layout/index.vue";

// router文件夹-->index.js文件
//cv以下代码解决路由地址重复的报错问题(一劳永逸)
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}

const routes = [
  {
    path: "/",
    redirect: "login",
    hidden: true,
    meta:{
      name: "主页"
    }  
  },
  {
    path: "/login",
    name: "Login",
    hidden: true,
    meta: {
      name: "登录"
    },
    component: () => import("../views/login/index.vue")
  },
  {
    path: "/console",
    name: "Console",
    redirect: "index",  //重定向 到子路由
    meta: {
      name: "控制台",
      icon: "console"
    },
    component: Layout,
    children: [
      {
        path: "/index",
        name: "Index",
        mata: {
          name: "首页"
        },
        component: () => import("../views/Console/index.vue")
      }
    ]
  },
  {
    path: "/info",
    name: "Info",
    meta: {
      name: "信息管理",
      icon: "info"
    },
    component:Layout,
    children: [
      {
        path: "/infoIndex",
        name: "InfoIndex",
        mata: {
          name: "信息列表"
        },
        component: () => import("../views/Info/index.vue")
      },
      {
        path: "/infoCategory", 
        name: "InfoCategory",
        mata: {
          name: "信息分类"
        },
        component: () => import("../views/Info/category.vue")
      },
      {
        path: "/infoDetailed", 
        name: "InfoDetailed",
        hidden: true,
        mata: {
          name: "信息详情"
        },
        component: () => import("../views/Info/detailed.vue")
      }
    ]

  },

  /**
   * 用户管理
   */
  {
    path: "/user",
    name: "User",
    meta: {
      name: "用户管理",
      icon: "user"
    },
    component: Layout,
    children: [
      {
        path: "/userIndex",
        name: "UserIndex",
        mata: {
          name: "用户列表"
        },
        component: () => import("../views/User/index.vue")
      }
    ]

  }
];



const router = new VueRouter({
  routes
});

export default router;

