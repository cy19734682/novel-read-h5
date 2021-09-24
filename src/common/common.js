/**
 * 定义全局文本过滤器对象
 */
'use strict'

import Vue from 'vue'
var Router  = require("../router.js")


/**
 * 日期格式化
 * 格式 YYYY/yyyy/YY/yy 表示年份
 * MM/M 月份
 * W/w 星期
 * dd/DD/d/D 日
 * hh/HH/h/H 小时
 *  mm/m 分钟
 *  ss/SS/s/S 秒
 * @param formatStr  格式化字符串
 * @return {*}  格式化后的日期
 * @constructor
 */
Date.prototype.Format = function (formatStr) {
    let str = formatStr;
    let Week = ['日', '一', '二', '三', '四', '五', '六'];
    str = str.replace(/yyyy|YYYY/, this.getFullYear());
    str = str.replace(/yy|YY/, (this.getFullYear() % 100) > 9 ? (this.getFullYear() % 100).toString() : '0' + (this.getFullYear() % 100));
    str = str.replace(/MM/, Number(this.getMonth() + 1) > 9 ? Number(this.getMonth() + 1).toString() : '0' + Number(this.getMonth() + 1));
    str = str.replace(/M/g, Number(this.getMonth() + 1));
    str = str.replace(/w|W/g, Week[this.getDay()]);
    str = str.replace(/dd|DD/, this.getDate() > 9 ? this.getDate().toString() : '0' + this.getDate());
    str = str.replace(/d|D/g, this.getDate());
    str = str.replace(/hh|HH/, this.getHours() > 9 ? this.getHours().toString() : '0' + this.getHours());
    str = str.replace(/h|H/g, this.getHours());
    str = str.replace(/mm/, this.getMinutes() > 9 ? this.getMinutes().toString() : '0' + this.getMinutes());
    str = str.replace(/m/g, this.getMinutes());
    str = str.replace(/ss/, this.getSeconds() > 9 ? this.getSeconds().toString() : '0' + this.getSeconds());
    str = str.replace(/s/g, this.getSeconds());
    str = str.replace(/SSS/g, this.getMilliseconds());
    return str;
};


// 输出日期时间
Vue.filter('datetime',
  v => new Date(v).Format("YYYY-MM-DD hh:mm:ss")
);

// 输出日期
Vue.filter('date',
  v => new Date(v).Format("YYYY-MM-DD")
);

// 输出数字格式化
Vue.filter('numFormat',
  v => (Number(v)/10000).toFixed(2)
);
Vue.filter('formatTime',
  (time) => {
      time = new Date(time)
      let mistiming = (Date.now()-time)/1000;
      let postfix = mistiming>0 ? '前' : '后'
      mistiming = Math.abs(mistiming)
      let arrr = ['年','个月','星期','天','小时','分钟','秒'];
      let arrn = [31536000,2592000,604800,86400,3600,60,1];
      for(let i=0; i<7; i++){
          let inm = Math.floor(mistiming/arrn[i])
          if(inm!=0){
              return inm+arrr[i] + postfix
          }
      }
  }
);

 let pageBack = (index) => {
  index = index || 1;
  let currentPath = Router.default.history.current.path;
  let firstPage = sessionStorage.getItem('firstPage');
  if (firstPage === currentPath) {
    if(currentPath !== '/' && currentPath !== '/index'){//当前页面不是首页，回到首页
      Router.default.push({path:'/'})
    }
    return false
  } else {
    Router.default.go(-index)
  }
}
Vue.prototype.pageBack = pageBack