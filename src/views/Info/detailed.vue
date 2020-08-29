<template>
    <el-form ref="form" :model="form" label-width="80px">

    <el-form-item label="信息分类">
        <el-select  v-model="form.categoryId" placeholder="请选择活动区域">
            <el-option 
            v-for="item in data.category"
            :key="item.id"
            :value="item.id"
            :label="item.category_name"></el-option>
        </el-select>
    </el-form-item>

    <el-form-item label="新闻标题">
         <el-input v-model="form.title"></el-input>
    </el-form-item>

    <el-form-item label="缩略图:">
         <UploadImg :imgUrl.sync="form.imgUrl" :config="uploadImgConfig"/>
    </el-form-item>
   
     <el-form-item label="发布日期">
        <el-date-picker
            v-model="form.createDate"
            type="date"
            placeholder="选择日期" :disabled="true">
        </el-date-picker>
    </el-form-item>

     <el-form-item label="详细内容">
         <quillEditor v-model="form.content" ref="myQuillEditor"
                        :options="data.editorOption"/>
    </el-form-item>

    <el-form-item>
    <el-button type="danger" @click="submit" :loading="data.submitLoading">保存</el-button>
    </el-form-item>
</el-form>
</template>

<script>
import {timestampToTime } from '@/utils/common'
import {QiniuToken } from "@/api/common";
import {AddInfo, GetList, EditInfo } from "@/api/news";
import { reactive, ref, watch, onMounted } from '@vue/composition-api';
import { quillEditor } from 'vue-quill-editor'; // 调用富文本编辑器
import 'quill/dist/quill.snow.css' // 富文本编辑器外部引用样式  三种样式三选一引入即可
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.bubble.css';
//组件
import UploadImg from "@c/UploadImg/index";

export default {
    name: "infoDetailed",
    components : {quillEditor, UploadImg  },
    setup(props, {root, refs }){
        //图片上传配置
        const uploadImgConfig = reactive({
            action:"http://up-z2.qiniup.com",
            ak: "HEKVQaUA4O4056EbgKbAjVBVIK4z38oEv5A3ifj3",
            sk: "UByTeQKZzHG0gziymywgBCNX7dlcjtJPY8mkvKpV",
            buckety:"yang-vue-admin"
        })
        const data = reactive({
            id: root.$route.params.id || root.$store.getters["infoDetailed/infoId"],
            category: [],
            editorOption: {},
            submitLoading: false,
            uploadKey: {
                token: "",
                key: ""
            }
        })

        const form = reactive({
            categoryId: "",
            title: "",
            createDate: "",
            content: "",
            imgUrl: ""
           
        })
        // let id = root.$route.params.id || root.$store.getters["infoDetailed/infoId"];
        // let title = root.$route.params.title || root.$store.getters["infoDetailed/infoTitle"];
        // console.log("id=="+id);
        // console.log(title);
         /**
         * 获取信息分类
         */ 
         const getInfoCategory = () => {
            root.$store.dispatch('common/getInfoCategory').then(response => {
               // console.log("index == " + response)
                data.category = response
            })
         }
         /**
          * 获取当前id信息
          */
         const getInfo = () => {
            let requestData = {
                pageNumber: 1,
                pageSize: 1,
                id: data.id
            }
            GetList(requestData).then(response => {
                let responseData = response.data.data.data[0];
                //console.log(responseData);
                form.categoryId =  responseData.categoryId;
                form.title = responseData.title;
                form.createDate =timestampToTime(responseData.createDate);
                form.content = responseData.content;
                form.imgUrl = responseData.imgUrl;
                // form =  {    //表单数据
                //        categoryId: responseData.categoryId,
                //        title: responseData.title,
                //      //  content: responseData.content
                // }
            }).catch(error => {

            })
        }

        //保存(修改数据必须注意 ，一定需要一个id)
        const submit = () => {
            let requestData = {
                id: data.id,
                categoryId: form.categoryId,
                title: form.title,
                content: form.content,
                imgUrl: form.imgUrl
            }
    
            data.submitLoading = true
            EditInfo(requestData).then(response => {
                // console.log(response.data)
                let requestData = response.data
                    root.$message({
                        message: requestData.message,
                        type: 'success'
                    })
                    data.submitLoading = false
                
            }).catch(error =>{
                    data.submitLoading = false
            })
        }



     

          /**
         * 生命周期
         */
        onMounted(() => {
           // getInfoCategory()
           //vuex 获取分类
            getInfoCategory();
            //
            getInfo();

        })

        return {
            data,form,uploadImgConfig,
            submit,
        }

    }
    
}
</script>
<style lang="scss" scoped>
       
</style>
