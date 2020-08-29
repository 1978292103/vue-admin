import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

import app from "./modules/app";
import common from "./modules/common";
import login from "./modules/login";
import infoDetailed from "./modules/infoDetailed";

export default new Vuex.Store({
  

  modules: {
    app,
    login,
    common,
    infoDetailed
  }

});
