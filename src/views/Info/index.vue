<template>
    <div>
            <el-row :gutter="14"  type="flex" class="row-bg" justify="space-between">
                    <el-col :span="4"> 
                        <div class="label-wrap category" >
                            <label for="">分类：</label>
                            <div class="wrap-content"  >
                                <el-select v-model="category_value" placeholder="请选择" style="width:100%;" >
                                <el-option
                                    v-for="item in options.category"
                                    :key="item.id"
                                    :label="item.category_name"
                                    :value="item.id">
                                </el-option>
                             </el-select>
                            </div>
                        </div>   
                    </el-col>
                    <el-col :span="7"> 
                        <div class="label-wrap  date" >
                            <label for="">日期：&nbsp;&nbsp; </label>
                            <div class="wrap-content" >
                                <el-date-picker
                                    style="width:100%;"
                                    v-model="date_value"
                                    type="datetimerange"
                                    format="yyyy 年 MM 月 dd 日"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    align="right"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    :default-time="['12:00:00', '12:00:00']">
                                </el-date-picker>
                            </div>
                        </div>
                    </el-col>
                    <el-col :span="4"> 
                        <div class="label-wrap  key-word" >
                            <label for="">关键字：</label>
                            <div class="wrap-content" >
                               <el-select v-model="search_key" placeholder="请选择"    style="width:100%;"  >
                                    <el-option 
                                        v-for="item in searchOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value" >
                                    </el-option>
                            </el-select>
                            </div>
                        </div>

                    </el-col>
                    <el-col :span="3">
                        <el-input v-model="search_keywork" placeholder="请输入内容" style="width:100%;"></el-input>
                    </el-col>
                    <el-col :span="2" >
                        <el-button type="danger" style="width:100%;" @click="search" >搜索</el-button>
                    </el-col>
                   <el-col :span="2" >
                     
                    </el-col>
                    <el-col :span="2"  >
                        <el-button type="danger" class="pull-right" style="width:100%;" @click="dialog_info = true">新增</el-button>
                    </el-col>
            </el-row>
        
        <!--  表单结束 -->
          <div class="black-space-30"></div>
         <!--  表格数据开始 -->
         <el-table :data="tableData.item" border v-loading="loadingData"  @selection-change="handleSelectionChange" style="width: 100%">
            <el-table-column type="selection" width="45"> </el-table-column>
            <el-table-column  prop="title"  label="标题" > </el-table-column>
            <el-table-column  prop="categoryId" label="类型"   :formatter="toCategory" width="120">  </el-table-column>
            <el-table-column  prop="createDate"   label="日期"  :formatter="toData" width="207"></el-table-column>
            <el-table-column  prop="user"  label="管理员"    width="115">  </el-table-column>
            <el-table-column label="操作" width="300" >
                   <template slot-scope="scope">
                       <el-button type="danger" size="mini" @click="deleteItem(scope.row.id)">删除</el-button>
                       <el-button type="success"  size="mini" @click="editInfo(scope.row.id)">编辑详情</el-button>
                       <el-button type="success"  size="mini" @click="editInfo(scope.row.id)">编辑</el-button>
                   </template>
            </el-table-column>
        </el-table>
        <!--  表格数据结束 --->
        <div class="black-space-30"></div>
        <!-- f分页 -->
        <el-row>
            <el-col :span="11">
                <el-button size="medium" @click="deleteAll">批量删除</el-button>
            </el-col>
            <el-col :span="13" >
               <el-pagination
                    background
                    class="pull-right"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total ,sizes, prev, pager, next,jumper"
                    :total="total">
                </el-pagination>
            </el-col>
        </el-row>

        <!---  新增弹窗--->
        <DialogInfo :flag.sync="dialog_info" :category="options.category" @close="closeDialog" @getListEmit="getList" />

         <!---  修改弹窗--->
        <DialogEditInfo :flag.sync="dialog_info_edit" :id="infoId" :category="options.category" @close="closeDialog" @getListEmit="getList" />


    </div>
</template>
<script>
import {GetCategory, GetList, DeleteInfo } from "@/api/news";
import DialogInfo from "./dialog/info";
import DialogEditInfo from "./dialog/edit";
// import { common } from "@/api/common";
import { global } from "@/utils/globalVue3.0";
import { reactive, ref, watch, onMounted } from '@vue/composition-api';
import {timestampToTime } from '@/utils/common'
export default {
    name: 'infoIndex',
    components: { DialogInfo, DialogEditInfo },
    setup(props,{ root }){
        const {str: aaa, confirm } = global();

      // const { getInfoCategory, categoryItem }  = common();
        /**
        数据的内容
         */
        const dialog_info = ref(false);
        const dialog_info_edit = ref(false);
        const search_key = ref('ID');
        const category_value = ref('');
        const date_value = ref('');
        const search_keywork = ref('');
        const total = ref(0);
        const deleteInfoId = ref('');
        const infoId = ref('');
        //loading
        const loadingData = ref(false);

        const options = reactive({
            category: []
        });
        //搜索关键字
        const searchOptions = reactive([
            { value: "id", label: "ID"},
            { value: "title", label: "标题"},
        ]);
        //y页码
        const page = reactive({
            pageNumber: 1,
            pageSize: 10
        })
        
        const tableData = reactive({
            item: []
        })

        
        //vue2.0 方法
        const handleSizeChange = (val) => {
            page.pageSize = val;
        }

        const handleCurrentChange = (val) => {
            page.pageNumber = val;
            getList();
        }
        const closeDialog = () =>{
           dialog_info.value = false;
        }

        //搜索
        const search = () => {
            // console.log(category_value.value);
            // console.log(date_value.value);
            // console.log(search_key.value);
            // console.log(search_keywork.value);
            let requestData = formData();
         //   console.log(requestData)
            getList();
        }
        //搜索处理数据条件
        const formData = () => {
            let requestData = {
                pageNumber: page.pageNumber,
                pageSize: page.pageSize,
            };
            //分类
            if(category_value.value){
                requestData.categoryId = category_value.value
            }
            //日期
            if(date_value.value.length > 0){
                requestData.startTiem = date_value.value[0];
                requestData.endTime = date_value.value[1];
            }
            //关键字
            if(search_key.value){
                requestData[search_key.value] = search_keywork.value
            }
            
            return requestData;
        }

        const getList = () => {
            //单独处理数据
           let requestData = formData();
            //加载状态
            loadingData.value = true;
            GetList(requestData).then(response => {
                let data = response.data.data
                //更新数据
                tableData.item = data.data
                //页面统计数量
                total.value = data.total
                //加载状态
                loadingData.value = false;
                  
            }).catch(error => {
                //加载状态
                loadingData.value = false;
            })
        }
        /**
         * 删除的单个与多个功能
         */
        const deleteItem = (id) =>{
            deleteInfoId.value = [id];
            confirm({
                content: "确认删除当前信息么，删除后将无法恢复！",
                tip: "警告",
                fn: confirmDelete
            });
        }

        const deleteAll = () =>{ 
            if(!deleteInfoId.value || deleteInfoId.value.length ==0 ){
                root.$message({
                    message: "请选择要删除的信息！！",
                    type: 'error'
                })
                return false;
            }
            confirm({
                content: "确认删除选中的信息么?",
                type: "success",
                fn: confirmDelete
            });
        }

        const confirmDelete = (value) => {
            DeleteInfo({id: deleteInfoId.value}).then(response => {
                deleteInfoId.value = '';
                getList();
            })
        }


        const editInfo = (id) => {
            //console.log(id)
            infoId.value  = id;
            dialog_info_edit.value = true;
        }
        /**
         * 获取分类
         */
        
         const getInfoCategory = () => {
            root.$store.dispatch('common/getInfoCategory').then(response => {
              //  console.log("index == " + response)
                options.category = response
            })
        }

        const toData = (row, column, cellValue, index) => {
            return timestampToTime(row.createDate);
        }

        const toCategory = (row) => {
            //调用一个函数，返回一个新的值，替换原来的值
            let categoryId = row.categoryId;
            let categoryData = options.category.filter(item => item.id == row.categoryId)[0]
            return categoryData.category_name;
        }

        const handleSelectionChange = (val) => {
            let id = val.map(item => item.id);
            deleteInfoId.value = id;
            //console.log(id);
        }



        /**
         * 生命周期
         */
        onMounted(() => {
           // getInfoCategory()
           //vuex 获取分类
            getInfoCategory()

            //获取列表
            getList()
        })

        /**
         * watch
         */
        // watch(() => categoryItem.item, (value) => {
        //    // console.log(value)
        //     options.category = value
        // })

        return {

            // ref
            date_value,
            search_key,
            search_keywork,
            dialog_info,
            category_value,
            total,
            loadingData,
            dialog_info_edit,
            infoId,
            //reactive
            options,
            searchOptions,
            tableData,
            toData,
            toCategory,
            handleSelectionChange,
            search,
            getList,
            // vue2.0 methods
            handleSizeChange,
            handleCurrentChange,
            closeDialog,
            deleteItem,
            editInfo,
            deleteAll
            
             

        }

    }
}
</script>
<style lang="scss" scoped>
@import "../../style/config.scss";

.label-wrap{
    &.category{ @include labelDom(left, 60, 40); }
    &.date{ @include labelDom(right, 83, 40); }
    &.key-word{ @include labelDom(right, 79, 40); }
   
}

</style>
