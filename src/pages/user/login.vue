<template>
  <div class="userLogin">
    <van-nav-bar title="登录" left-arrow @click-left="back"/>
    <!-- vant表单 -->
    <div class="col-12" style="padding-top: 100px">
      <van-form>
        <van-field
            v-model="username"
            name="username"
            label="账号"
            placeholder="请输入用户名"
            :rules="[{ required: true, message: '用户名不能为空' }]"
        />
        <van-field
            v-model="password"
            :type="isPassword"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '密码不能为空' },{pattern: /^\w{6,}$/,message:'密码不少于6位'}]"
        >
          <template #right-icon>
            <van-icon :name="isPassword==='text'?'eye-o':'closed-eye'" @click="onPassword"/>
          </template>
        </van-field>
        <van-field
            v-model="captcha"
            name="captcha"
            label="验证码"
            placeholder="请输入验证码"
            :rules="[{ required: true, message: '验证码不能为空' }]"
        >
          <template #right-icon>
            <van-image
                style="position: absolute;right: 0;top: -12px"
                width="100"
                height="44"
                :src="imgCodeUrl"
                @click="getImgUrls"
            />
          </template>
        </van-field>
        <div style="margin: 16px;">
          <van-button @click="onSubmit" round block :loading="loading" type="info" native-type="submit">
            登录
          </van-button>
        </div>
      </van-form>
      <div style="float: right;font-size: 14px;padding-right: 20px">
        <router-link to="/register">没有账号？点击注册</router-link>
      </div>
    </div>
  </div>
</template>

<script>
  import {getRSAKey, userLogin} from "../../service/commService"
  import JSEncrypt from 'jsencrypt'
  export default {
    data() {
      return {
        loading:false,
        imgCodeUrl:this.server+'/bus/getCaptcha',
        username: '',
        password: '',
        captcha: '',
        isPassword:'password' //密码的type类型
      }
    },
    methods: {
      onSubmit(){ //点击登录
        //如果不符合登录条件则不会继续执行
        if(this.username.trim() == ''){
          return
        }
        if(!this.password.match(/^\w{6,}$/)){
          return
        }
        if(this.captcha.trim() == ''){
          return
        }
        this.loading = true
        this.aseEncrypt(this.password,e=>{
          let params ={
            username:this.username,
            password:e,
            captcha:this.captcha
          }
          userLogin(params,{isEuc:true}).then(res => {
            if (res && res.code === 0) {
              let userInfo = res.data[0]
              sessionStorage.setItem("userInfo", JSON.stringify(userInfo));
              this.back()
            }else{
              this.captcha = ""
              this.getImgUrls()
              this.$toast.fail(res.msg);
            }
            this.loading = false
          }, err => {
            console.log(err)
            this.loading = false
            this.captcha = ""
            this.getImgUrls()
          })
        })
      },
      aseEncrypt(value,callback) {
        getRSAKey().then(res => {
          if (res && res.code === 0) {
            let aesVal = this.encrypt(value,res.data)
            callback(aesVal)
          }
        }, err => {
          console.log(err)
        })
      },
      encrypt(word,key){
        let encryptor = new JSEncrypt()  // 创建加密对象实例
        encryptor.setPublicKey(key.publicKey)//设置公钥
        return encryptor.encrypt(word)  // 对内容进行加密
      },
      getImgUrls(){
        this.imgCodeUrl =this.server+'/bus/getCaptcha?'+Math.random();
      },
      onPassword(){ //点击切换密码的type类型
        this.isPassword =  this.isPassword==='password'?'text':'password'
      },
      back(){
        this.pageBack()
      }
    }

  };
</script>

<style>
  .userLogin .van-field--error .van-field__control,
  .userLogin .van-field--error .van-field__control::placeholder{
    color: inherit;
  }
</style>
