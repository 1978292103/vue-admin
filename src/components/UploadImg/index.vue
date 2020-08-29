<template>
    
    <el-upload
            class="avatar-uploader"
            :action="config.action"
            :data="data.uploadKey"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="data.image" :src="data.image" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>

</template>
<script>
import { reactive, ref, watch, onMounted } from '@vue/composition-api';
import {QiniuToken } from "@/api/common";
export default {
    /**
     * 1 组件的过程要做些什么事
     *      （  获取token
     *          显示默认图片 
     *          选择图片后渲染自身图片
     * 2  最终的结果是什么
     *          返回选择后的图片信息
     */
    name: "uploadImg",
    props: {
        imgUrl: {
            type: String,
            default: ""
        },
        config: {
            type: Object,
            default: () => { }
        }
    },
    setup(props, {root, emit }){
       // console.log(props.config)
        const data = reactive({
            image: "",
            uploadKey: {
                token: "",
                key: ""
            }
        })
        
        const handleAvatarSuccess = (res, file) => {
             //console.log(res + "//////")
             let img = `${root.$store.getters['common/qiniuUrl']}${res.key}`;
             form.imgUrl = img;
             emit("update:imgUrl",img);
        }


        const beforeAvatarUpload = (file) => {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isJPG) {
            root.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
            root.$message.error('上传头像图片大小不能超过 2MB!');
            }
            //文件名转码
            let suffix = file.name;
            let key = encodeURI(`${suffix}`);
            data.uploadKey.key = key;
            //console.log()
            return isJPG && isLt2M;
        }

        /**
         * 获取七牛云token
         */
        const getQiniuToken = () =>{
            let requestData = {
                "ak": props.config.ak,
                "sk": props.config.sk,
                "buckety":props.config.buckety
            }
            QiniuToken(requestData).then(response => {
                data.uploadKey.token  = response.data.data.token;
               //console.log(data.uploadKey)
            }).catch(error => {

            })
        }

        /**
         * 监听
         */
        watch(() => props.imgUrl ,(value) => {
            //console.log(value)
            data.image = value;
        })

         /**
         * 生命周期
         */
        onMounted(() => {
           
            getQiniuToken();
        })

        return {
            data,
            handleAvatarSuccess,beforeAvatarUpload
        }

    }
}
</script>
<style lang="scss" scoped>
         .avatar-uploader .el-upload {
            border: 1px dashed #d9d9d9;
            border-radius: 6px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
        }
        .avatar-uploader .el-upload:hover {
          border-color: #409EFF;
        }
        .avatar-uploader-icon {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            line-height: 178px;
            text-align: center;
        }
        .avatar {
            width: 178px;
            height: 178px;
            display: block;
        }
</style>