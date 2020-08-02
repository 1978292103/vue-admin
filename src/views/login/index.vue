<template>
    <div id="login">
        <!-- 真正的内容区 -->
      <div class="login-wrap">
           <ul class="menu-tab">
              <li v-for="item in menuTab" :key="item.id" :class="{'current': item.current}" @click="toggleMenu(item)">{{ item.txt }}</li>
           </ul>
           <!---  表单的开始-->
           <el-form :model="ruleForm" status-icon :rules="rules" ref="loginForm"  class="login-form" size="medium">

             <el-form-item  prop="username" class="item=from">
                 <lable for="username">邮箱：</lable>
                <el-input id="username" type="text" v-model="ruleForm.username" autocomplete="off"></el-input>
             </el-form-item>

             <el-form-item  prop="password" class="item=from">
                 <lable for="password">密码：</lable>
                 <el-input id="passoword" type="text" v-model="ruleForm.password" autocomplete="off" minlength="6" maxlength="20"></el-input>
             </el-form-item>

              <el-form-item  prop="passwords" class="item=from" v-show="model == 'register'">
                 <lable for="repassword">重复密码：</lable>
                 <el-input id="repassword" type="text" v-model="ruleForm.passwords" autocomplete="off" minlength="6" maxlength="20"></el-input>
             </el-form-item>


             <el-form-item  prop="code" class="item=from">
                 <lable for="code">验证码：</lable>

                <el-row :gutter="10">
                    <el-col :span="15">
                        <el-input id="code"  v-model="ruleForm.code" minlength="6" maxlength="6"></el-input>
                    </el-col>
                    <el-col :span="9">
                      <el-button type="success" class="block" @click="getSms()" :disabled="codeButtonStatus.status" >{{codeButtonStatus.text}}</el-button>  
                    </el-col>
                </el-row>
             </el-form-item>

             <el-form-item >
                <el-button type="danger" @click="submitForm('loginForm')" class="login-btn block"  :disabled="loginButtonStatus">{{model === "login" ? "登录" :"注册"}}</el-button>
             </el-form-item>
          </el-form>
      </div>
    </div>
</template>
<script>
import sha1 from "js-sha1";
import { GetSms, Register, Login } from "@/api/login";
import { reactive , ref, onMounted } from "@vue/composition-api";
import { stripscript,validateEmail,validatePwd,validateVCode } from "@/utils/validate";

export default {
    name: 'login',
    // setup(props,context){
    //   console.log(context)
    //   attrs: (...)     this.$attrs
    //   emit: (...)      this.$emit
    //   isServer: (...)  this.$isServer
    //   listeners: (...) this.$listeners
    //   parent: (...)    this.$parent
    //   refs: (...)      this.$refs
    //   root: (...)  ===  this.
     setup(props,{ refs,root }){

         //验证用户名邮箱
      let validateUsername = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入用户名'));
        } else if(validateEmail(value)){
            callback(new Error("用户名格式有误"))
        }else {
          callback(); 
        }
      };
      //验证密码
      let validatePassword = (rule, value, callback) => {

        ruleForm.password = stripscript(value)
        value = ruleForm.password

        if (value === '') {
          callback(new Error('请输入密码'));
        } else if (validatePwd(value)){
            callback(new Error("密码为6-20位的数字与字母组合"))
        } else {
          callback();
        }
      };


      //验证重复密码
      let validatePasswords = (rule, value, callback) => {
        //如果页面为login的时候，直接通过
        if(model.value === 'login') {callback();}
        ruleForm.passwords = stripscript(value)
        value = ruleForm.passwords

        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !=  ruleForm.password){
            callback(new Error("密码输入不正确，请检查后再次输入"))
        } else {
          callback();
        }
      };


      //y验证验证码
      let checkCode = (rule, value, callback) => {
         ruleForm.code = stripscript(value)
         value = ruleForm.code 

          if (value === '') {
            callback(new Error('请输入验证码'));
          }else if (validateVCode(value)){
            callback(new Error("密码为6-20位的数字与字母组合"))
          }else {
            callback();
        }
      };


        /** 
         * 声明数据
        */

        // 这里面放置data数据，生命周期，自定义函数
        const menuTab = reactive([
            {txt: '登录', current: true, type: 'login' },
            {txt: '注册', current: false, type: 'register' }
           ]);
        //模块值
        const model = ref('login');
        //表单提交按钮状态 
        const loginButtonStatus = ref(true);
        //验证码按钮状态
        // const codeButtonStatus = ref(false)
        // const codeButtonText = ref('获取验证码')

        //相同的东西用对象
        const codeButtonStatus = reactive({
          status: false,
          text: '获取验证码'
        });

        //倒计时
        const timer = ref(null);
        //表单绑定数据
        const ruleForm = reactive({
            username: '',
            password: '',
            passwords: '',
            code: ''
        });
        //表单的验证
        const rules = reactive ({
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
        })

        /**
         * 声明函数
         */
         const toggleMenu = (data => {
             menuTab.forEach(element => {
                element.current = false
            });
            //高光
            data.current = true
            //修改当前模块的值
            model.value = data.type
            //切换页面的时候 重置表单
            //2.0的写法 this.$refs[formName].resetFields();
            refs.loginForm.resetFields();
            clearCountDown();

         })


        /**
         * 获取验证码
         */
        const getSms = (() =>{
          //请求的接口
          //验证邮箱 进行响应
          if(ruleForm.username == ""){
            root.$message.error('邮箱不可为空！');
            return false
          }
          // if(validateEmail(ruleForm.username)){
          //   root.$message.error('邮箱格式有误，请重新输入！');
          //   return false
          // }
          //获取验证码
          let requestData ={
              username: ruleForm.username,
              module : model.value
          }
          // const updateButtonStatus = ((params) => {
          // //更新验证码状态
          //    codeButtonStatus.status = params.status,
          //    codeButtonStatus.text = params.text
          //  })
          //修改获取验证码状态
          // updateButtonStatus({
          //   status: true,
          //   text: '发送中'
          // })
           codeButtonStatus.status = true,
           codeButtonStatus.text = '发送中'
        
          //延时多长时间
          GetSms(requestData).then(response =>{
              let data = response.data
              root.$message({
                message: data.message,
                type: 'success'
              })
              //启动登录或者注册按钮
              loginButtonStatus.value = false
              //调用定时器的方法,直接倒计时
              countDown(3)
            }).catch(error =>{
              console.log(error)
           })
        })
        /**
         * 表单提交验证
         */
        const submitForm = (formName => {

            refs[formName].validate((valid) => {
              //表单验证通过
            if (valid) {
              //三元运算
              model.value === 'login' ? login() : register();
              
            } else {
              console.log('error submit!!');
              return false;
            }
          })
        })

      //
        /**
         * 登录
         */
        const login = (() => {
           let requestData = {
                username: ruleForm.username,
                password:sha1(ruleForm.password),
                code: ruleForm.code,
               // module: 'register'
            }
            root.$store.dispatch('app/login', requestData).then(response =>{
                console.log("登录成功");
                console.log(response);
                /**登录跳转页面 */
                root.$router.push({
                  name: 'Console'
                  })
                }).catch(error => { });
            })
            // Login(requestData).then(response => {
            //   console.log("登录成功");
            //    console.log(response);
            //     /**登录跳转页面 */
            //    root.$router.push({
            //      name: 'Console'
            //    })
            // }).catch(error => {

            // })
        

        /**
         * 注册
         */
        const register = (() => {
            let requestData = {
                  username: ruleForm.username,
                  password: sha1(ruleForm.password),
                  code: ruleForm.code,
                  module: 'register'
              }
              //注册接口
              Register(requestData).then(response => {
                let data = response.data
                root.$message({
                  message: data.message,
                  type: 'success'
                })
              //模拟注册成功
               toggleMenu(menuTab[0])
               clearCountDown()
              }).catch(error => {
                  //失败执行的代码
              })
        })


        /**
         * 倒计时方法
         */
        const countDown =((number) => {
          //判断定时器是否存在，若存在则清除
          if(timer.value){
            clearInterval(timer.value)
          }
            //setTimeout   clearTimeout()执行一次
            //setInterval   clearInterval(变量)不断的执行，需要条件才会停止
            let time = number
            console.log(time)
          timer.value = setInterval(() => {
              time --;
              console.log(time)
              if(time === 0){
                  clearInterval(timer.value);

                  // updateButtonStatus({
                  //   status:false,
                  //   text: '重新发送'
                  // })

                  codeButtonStatus.status = false
                  codeButtonStatus.text = '重新发送'
              }else{
                  codeButtonStatus.text = `倒计时${time}秒`  //ES6的写法
              }                
          },1000)
        })

      /**
       * 清除倒计时
       */
      const clearCountDown = (() => {
        //还原验证码按钮默认状态
        // updateButtonStatus({
        //             status : false,
        //             text : '获取验证码'
        //  })
        codeButtonStatus.status = false;
        codeButtonStatus.text = '获取验证码';
        //清除倒计时
        clearInterval(timer.value);
      })

        /**
         * 生命周期
         */
        //挂载完成后
        onMounted( () => {
           // GetSms()
        })

        return{
            menuTab,
            model,
            toggleMenu,
            submitForm,
            ruleForm,
            rules,
            getSms,
            loginButtonStatus,
            codeButtonStatus,
            timer,
            countDown
        }
    },
    
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
