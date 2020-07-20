<template>
    <div id="login">
        <!-- 真正的内容区 -->
      <div class="login-wrap">
           <ul class="menu-tab">
              <li v-for="item in menuTab" :key="item.id" :class="{'current': item.current}" @click="toggleMneu(item)">{{ item.txt }}</li>
           </ul>
           <!---  表单的开始-->
           <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm"  class="login-form" size="medium">

             <el-form-item  prop="username" class="item=from">
                 <lable>邮箱：</lable>
                <el-input type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
             </el-form-item>

             <el-form-item  prop="password" class="item=from">
                 <lable>密码：</lable>
                 <el-input type="text" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
             </el-form-item>

              <el-form-item  prop="passwords" class="item=from" v-show="model == 'register'">
                 <lable>重复密码：</lable>
                 <el-input type="text" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
             </el-form-item>


             <el-form-item  prop="code" class="item=from">
                 <lable>验证码：</lable>

                <el-row :gutter="10">
                    <el-col :span="15">
                        <el-input  v-model.number="ruleForm.code" minlength="6" maxlength="6"></el-input>
                    </el-col>
                    <el-col :span="9">
                      <el-button type="success" class="block" >获取验证码</el-button>  
                    </el-col>
                </el-row>
             </el-form-item>

             <el-form-item >
                <el-button type="danger" @click="submitForm('ruleForm')" class="login-btn block">提交</el-button>
             </el-form-item>
          </el-form>
      </div>
    </div>
</template>
<script>
import { stripscript,validateEmail,validatePwd,validateVCode } from '@/utils/validate'

export default {
    name: 'login',
    data(){
      
      //验证用户名邮箱
      var validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(validateEmail(value)){
            callback(new Error("用户名格式有误"))
        }else {
          callback(); 
        }
      };
      //验证密码
      var validatePassword = (rule, value, callback) => {

        this.ruleForm.password = stripscript(value)
        value = this.ruleForm.password

        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (validatePwd(value)){
            callback(new Error("密码为6-20位的数字与字母组合"))
        } else {
          callback();
        }
      };


       //验证重复密码
       var validatePasswords = (rule, value, callback) => {
        //如果页面为login的时候，直接通过
        if(this.model === 'login') {callback();}
        this.ruleForm.passwords = stripscript(value)
        value = this.ruleForm.passwords

        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !=  this.ruleForm.password){
            callback(new Error("密码输入不正确，请检查后再次输入"))
        } else {
          callback();
        }
      };


      //y验证验证码
    var checkCode = (rule, value, callback) => {
        this.ruleForm.code = stripscript(value)
        value = this.ruleForm.code 

          if (value === '') {
          callback(new Error('请输入验证码'));
        } else if (validateVCode(value)){
            callback(new Error("密码为6-20位的数字与字母组合"))
        } else {
          callback();
        }
      
      };
        return{
           menuTab:[
               {txt: '登录', current: true, type: 'login' },
               {txt: '注册', current: false, type: 'register' }
           ],
           //表单的验证
           model : 'register',
            ruleForm: {
            username: '',
            password: '',
            passwords: '',
            code: ''
            },
            rules: {
            username: [
                { validator: validateUsername, trigger: 'blur' }
            ],
            password: [
                { validator: validatePassword, trigger: 'blur' }
            ],
             passwords: [
                { validator: validatePasswords, trigger: 'blur' }
            ],
            code: [
                { validator: checkCode, trigger: 'blur' }
            ]
            }
        };
    
    },
    //钩子函数
    created(){},
    //挂载完成后自动执行的
    mounted(){},
    //写函数的地方
    methods:{
        //vue 数据驱动视频渲染
        //js 操作DOM元素
        toggleMneu(data){
            this.menuTab.forEach(element => {
                element.current = false
            });
            //高光
            data.current = true
            //修改当前模块的值
            this.model = data.type
        },
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      }
    }
}
</script>
<style lang="scss" scoped>
#login{
    height: 100vh;
    background-color: #344a5f;
}
.login-wrap{
    width: 330px;
    margin: auto;
}
.menu-tab{
    text-align: center;
    li{
        display: inline-block;
        width: 88px;
        line-height: 36px;
        font-size: 14px;
        color: #ffffff;
        border-radius: 2px;
        cursor: pointer;
    }
    .current{
        background-color: rgba( 0, 0, 0, .1);
    }
}
.login-form{
    label{
        display: block;
        font-size: 14px;
        margin-bottom: 3px;
        color: #fff;
    }
    .item-from{
        margin-bottom: 13px;
    }
    .block{
        width: 100%;
        display: block;
    }
    .login-btn{
        margin-top: 19px;
    }
}
</style>
