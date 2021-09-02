import axios from 'axios'
const CancelToken = axios.CancelToken;
let cancel;
let cancelAjaxText = '中断成功';
let httpRequestList = [];
//将axios的post方法注册到vue的原型中。调用方式为this.$post;url,data,custom,loading
axios.$serviceAjax = function (params) {
  let option = {
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret += it + '=' + data[it] + '&'
        }
        ret = ret.substring(0, ret.length - 1)
        return ret
      }
    ],
    transformResponse: [
      function (data) {
        // 对 data 进行任意转换处理
        return data;
      }
    ],
    maxContentLength: 2000,
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
    cancelToken: new CancelToken(c => { //强行中断请求要用到的,中断以错误形式报出，不影响使用
      cancel = c
      httpRequestList.push(cancel);
    })
  }
  let reqParamVo = Object.assign(params, option);
  return new Promise((resolve, reject) => {
    axios(reqParamVo).then(res => {
      /**
       * 针对安卓低版本会把axios中的的data转成字符串，需要在这里作判断，如果是字符串，我们需要转成对象
       * @type {any}
       */
      let datachild = res.data;
      if (typeof datachild == 'string') {
        datachild = JSON.parse(datachild);
      }
      resolve(datachild);
    }).catch(err => {
      reject(err);
    })
  })
}
axios.cancelAjax = function () { //切换页面强行中断请求 router.beforeEach中用到
  if (httpRequestList.length > 0) {        //强行中断时才向下执行
    httpRequestList.forEach(item => {
      item(cancelAjaxText);//给个标志，中断请求
    })
  }
  httpRequestList = [];
}
export default axios

