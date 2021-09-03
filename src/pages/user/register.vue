<template>
  <div class="userRegister">
    <van-nav-bar title="注册" left-arrow @click-left="back"/>
    <!-- vant表单 -->
    <div class="col-12" style="padding-top: 20px">
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
            type="password"
            name="password"
            label="密码"
            placeholder="请输入密码"
            :rules="[{ required: true, message: '密码不能为空' },{pattern: /^\w{6,}$/,message:'密码不少于6位'}]"
        />
        <van-field
            v-model="newPassword"
            type="password"
            name="password"
            label="确认密码"
            placeholder="请再次输入密码"
            :rules="[{ required: true, message: '确认密码不能为空' },{pattern: /^\w{6,}$/,message:'密码不少于6位'},
            {validator:e=>e===this.password,message:'两次输入密码不一致'}]"
        />
        <van-field
            v-model="phone"
            type="tel"
            name="phone"
            label="手机号"
            placeholder="请输入手机号"
            :rules="[{ required: true, message: '手机号不能为空' },{pattern: /^[1][0-9]{10}$/,message:'请输入正确的手机号'}]"
        />
        <van-field
            v-model="email"
            type="text"
            name="email"
            label="邮箱"
            placeholder="请输入邮箱"
            :rules="[{ required: true, message: '邮箱不能为空' },{pattern: /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/,message:'请输入正确的邮箱'}]"
        />
        <van-field
            v-model="fullname"
            type="text"
            name="fullname"
            label="姓名"
            placeholder="请输入姓名"
            :rules="[{ required: true, message: '姓名不能为空' }]"
        />
        <van-field name="sex" label="性别">
          <template #input>
            <van-radio-group v-model="sex" direction="horizontal">
              <van-radio :name="1">男</van-radio>
              <van-radio :name="2">女</van-radio>
            </van-radio-group>
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
          <van-button @click="onSubmit" :loading="loading" round block type="info" native-type="submit">
            注册
          </van-button>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
  import {getRSAKey, userRegister} from "../../service/commService"
  import JSEncrypt from 'jsencrypt'

  export default {
    data() {
      return {
        loading:false,
        imgCodeUrl: this.server + '/bus/getCaptcha',
        username: '',
        password: '',
        newPassword: '',
        phone: '',
        email: '',
        fullname: '',
        sex: 1,
        captcha: ''
      }
    },
    methods: {
      onSubmit() { //点击登录
        //如果不符合登录条件则不会继续执行
        if (this.username.trim() == '') {
          return
        }
        if (!this.password.match(/^\w{6,}$/)) {
          return
        }
        if (!this.newPassword.match(/^\w{6,}$/)) {
          return
        }
        if (this.password !== this.newPassword) {
          return
        }
        if (!this.phone.match(/^[1][0-9]{10}$/)) {
          return
        }
        if (!this.email.match(/^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/)) {
          return
        }
        if (this.fullname.trim() == '') {
          return
        }
        if (this.captcha.trim() == '') {
          return
        }
        this.loading = true
        this.aseEncrypt(this.password, e => {
          let params = {
            username: this.username,
            password: e,
            phone: this.phone,
            email: this.email,
            fullname: this.fullname,
            sex: this.sex,
            captcha: this.captcha,
          }
          userRegister(params).then(res => {
            if (res && res.code === 0) {
              this.$toast.success("注册成功！");
              this.back()
            }
            else {
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
      aseEncrypt(value, callback) {
        getRSAKey().then(res => {
          if (res && res.code === 0) {
            let aesVal = this.encrypt(value, res.data)
            callback(aesVal)
          }
        }, err => {
          console.log(err)
        })
      },
      encrypt(word, key) {
        let encryptor = new JSEncrypt()  // 创建加密对象实例
        encryptor.setPublicKey(key.publicKey)//设置公钥
        return encryptor.encrypt(word)  // 对内容进行加密
      },
      getImgUrls() {
        this.imgCodeUrl = this.server + '/bus/getCaptcha?' + Math.random();
      },
      back() {
        this.$router.go(-1)
      }
    }

  };
</script>
<style>
  .userRegister .van-field--error .van-field__control,
  .userRegister .van-field--error .van-field__control::placeholder{
    color: inherit;
  }
</style>