import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import  "./router/premit";
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import VueCompositionApi from "@vue/composition-api";
//自定义全局方法
//import global from "@/utils/global.js";

//自定义全局组件
import "./icons";

Vue.use(ElementUI);
//Vue.use(global);
Vue.use(VueCompositionApi);

Vue.config.productionTip = false;



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
