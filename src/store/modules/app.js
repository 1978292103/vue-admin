import { Login } from "@/api/login";
import {setToken, setUserName, getUserName } from "@/utils/app";
import { removeToken, removeUserName } from "../../utils/app";

const state = {
  isCollapse:  false || JSON.parse(sessionStorage.getItem('isCollapse')),
  to_ken: '',
  username: getUserName() || ''
}

const getters = {
  isCollapse: state => state.isCollapse
  
}

const mutations = {
  SET_COLLAPSE(state){
   // console.log(state +'============');
    state.isCollapse = !state.isCollapse;
    
    //html5本地存储
    //Cookie.set('isCollapse',JSON.stringify(state.isCollapse));
    sessionStorage.setItem('isCollapse',JSON.stringify(state.isCollapse));
   // console.log(state.isCollapse);
  },
  SET_TOKEN(state,value){
    state.to_ken = value
  },
  SET_USERNAME(state, value){
    state.username = value
  }


}

const actions = {
  login({commit}, requestData){
    return new Promise((resolve, reject) => {
      //接口
      Login(requestData).then((response)=> {
        console.log(response);
        let data = response.data.data;
        //普通的 方式1
        // content.commit('SET_TOKEN',data.toKen);
        // content.commit('SET_USERNAME',data.username);
        //解构的 方式2
        commit('SET_TOKEN',data.token);
        commit('SET_USERNAME',data.username);
        setToken(data.token);
        setUserName(data.username);
        //token 
          resolve(response);
      }).catch(eror => {
        reject(eror);
      })
    })
  },

  exit({commit} ){
    return new Promise((resolve, reject) => {
      removeToken();
      removeUserName();
      commit('SET_TOKEN','');
      commit('SET_USERNAME','');
      resolve();

    })
    
  }
}


export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};