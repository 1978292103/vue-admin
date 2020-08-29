import { GetCategory } from '@/api/news';
const state = {
    qiniuUrl: "http://qft32sj3b.hn-bkt.clouddn.com/"
}

const getters = {
    qiniuUrl: state => state.qiniuUrl
    
  }
const actions = {  // 可以回调处理事情

    getInfoCategory(content, repuestData) {
        return new Promise((resolve, reject) => {
            GetCategory({}).then((response) => {
                //console.log( "response===  "+ response)
                resolve(response.data.data.data)
            }).catch(error => {
                reject(error)
            })
        })
    }
}


export default {
    namespaced: true,
    actions,
    state
}