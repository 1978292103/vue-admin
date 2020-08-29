<template>
    
        <el-dialog title="修改" :visible.sync="data.dialog_info_flag" @close="close" width="580px" @open="openDialog">
           <el-form :model="data.form" ref="addInfoForm">
               <el-form-item label="类型" :label-width="data.formLabelWidth" prop="category">
                    <el-select v-model="data.form.category" placeholder="请选择类型">
                        <el-option 
                        v-for="item in data.categoryOption" 
                        :key="item.id" 
                        :label="item.category_name" 
                        :value="item.id">
                        </el-option>
                        
                    </el-select>
                </el-form-item>
                <el-form-item label="标题" :label-width="data.formLabelWidth" prop="title" >
                     <el-input v-model="data.form.title"  placeholder="请输入标题" ></el-input>
                </el-form-item>
                <el-form-item label="概况" :label-width="data.formLabelWidth"  prop="content">
                    <el-input type="textarea" v-model="data.form.content"  placeholder="请输入内容"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="danger" :loading="data.submitLoading" @click="submit">确 定</el-button>
            </div>
        </el-dialog>
    
</template>
<script>
import {AddInfo, GetList, EditInfo } from "@/api/news";
import { ref, reactive, watch } from '@vue/composition-api';
export default {
    name: 'dialogInfo',
    //单向数据流 父=>子  不可以反向修改
    props: {
        flag: {
            type: Boolean,
            default: false
        },
       category: {
           type: Array,
           default: ()=>  []
       },
       id: {
           type: String,
           default: ""
       }
    },
    setup(props, { emit,root,refs }){
        /**
         * 
         */
        const data = reactive({
            dialog_info_flag: false, //弹窗标记
            formLabelWidth: '70px',  //左边的宽度
            form: {    //表单数据
                category: '',
                title: '',
                content: ''
            },
            categoryOption: [], //分类下拉选项
            submitLoading: false  //按钮加载
        })
      
      

        //const submitLoading = ref(false)


        //监听flag的值
         watch(() => data.dialog_info_flag = props.flag );

       //  console.log(".////=="+props.category)
             


        //vue2.0  的函数
        const close = () => {
            data.dialog_info_flag = false;
            resetForm()
            emit("update:flag",false);
           // emit('close',false)
            //回调的时候需要做逻辑处理，就不能使用修饰器
        }

        const resetForm = () => {
            refs.addInfoForm.resetFields();
                // data.form.category = '',
                // data.form.title = '',
                // data.form.content = ''
        }

        const openDialog = () => {
            data.categoryOption = props.category
            getInfo();
            //console.log(props.id)
        }
        const getInfo = () => {
            let requestData = {
                pageNumber: 1,
                pageSize: 1,
                id: props.id
            }
            GetList(requestData).then(response => {
                let responseData = response.data.data.data[0];
               // console.log(response);
                data.form =  {    //表单数据
                       category: responseData.categoryId,
                       title: responseData.title,
                       content: responseData.content
                }

            }).catch(error => {

            })
        }

        const submit = () => {
            let requestData = {
                id: props.id,
                categoryId: data.form.category,
                title: data.form.title,
                content: data.form.content,
            }
          //  console.log(requestData)
            if(!data.form.category){
                 root.$message({
                        message: '分类不可为空！！',
                        type: 'error'
                    })
                return false;
            }
             if(!data.form.title){
                 root.$message({
                        message: '标题不可为空！！',
                        type: 'error'
                    })
                return false;
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
                    /**
                     * 两个刷新数据方式
                     * 1 直接刷新接口
                     * 2 返回列表，进行指定数据的替换
                     */
                    emit("getListEmit")
                    //重置表单
                    //resetForm()
                    close();
                     //root.$refs['addInfoForm1].resetFields();
            }).catch(error =>{
                    data.submitLoading = false
            })
        }

        return {     
            //对象数据
            data,
            close,
            openDialog,
            submit
        }
    }  
    
}
</script>
<style scoped>

</style>