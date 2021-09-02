import axios from './http'
//配置引入赋值
var configuration = {};
//是否字符串
const isString = o => Object.prototype.toString.call(o).slice(8, -1) === 'String'
//是否数字
const isNumber = o => Object.prototype.toString.call(o).slice(8, -1) === 'Number'
//是否对象
const isObj = o => Object.prototype.toString.call(o).slice(8, -1) === 'Object'
//是否boolean
const isBoolean = o => Object.prototype.toString.call(o).slice(8, -1) === 'Boolean'
//是否为undefined
const isUndefined = o => Object.prototype.toString.call(o).slice(8, -1) === 'Undefined'

const isExistence = o => {
  if (isBoolean(o)) {
    return false
  }
  else {
    if (!o || o === 'null' || o === 'undefined' || o === 'false' || o === 'NaN') {
      return true
    }
    else {
      return false
    }
  }
}
const isExit = o => !isExistence(o);
/**
 * 功能:获取拦截信息
 * 入参: option:配置对象
 */
const getConfig = (config) => {
  configuration = config;
  if (isExit(configuration.protocal)) {
    axios.interceptors.request.use(config => {
      configuration.requestFilter.requestBefore(config);
      return config
    }, error => {
      return Promise.reject(error)
    })
    axios.interceptors.response.use(data => {
      configuration.requestFilter.requestAfter(data, data.config);
      return data
    }, error => {
      return Promise.reject(error)
    })
  }
}
//公共http信息
const GetParam = (configuration) => {
  this.params = {};
  this.optParams = {};
  this.configuration = configuration;
}
GetParam.prototype.setParams = (key, value) => {
  this.params[key] = value;
}
GetParam.prototype.setOptParams = (key, value) => {
  this.optParams[key] = value;
}
GetParam.prototype.getParams = () => {
  return this.params;
}
GetParam.prototype.getOptParams = () => {
  return this.optParams;
}
GetParam.prototype.getConfig = () => {
  return this.configuration;
}
//检测url是否存在
GetParam.prototype.checkUrl = (option) => {
  const url = option.url || GetParam.prototype.getConfig().LOCAL_ROOT;
  if (isExit(url) && isString(url)) {
    GetParam.prototype.setParams('url', url)
  }
  else {
    console.log('配置错误 ~~~ 地址配置错误')
  }
}
GetParam.prototype.checkTimeout = (option) => {
  const timeout = option.timeout || GetParam.prototype.getConfig().timeout;
  if (isExit(timeout) && isNumber(timeout)) {
    GetParam.prototype.setParams('timeout', timeout)
  }
  else {
    GetParam.prototype.setParams('timeout', 3000)
  }
}
GetParam.prototype.checkMethod = (option) => {
  const method = option.method || GetParam.prototype.getConfig().method;
  if (isExit(method) && isString(method)) {
    GetParam.prototype.setParams('method', method)
  }
  else {
    GetParam.prototype.setParams('method', 'get')
  }
}
GetParam.prototype.checkProtcal = (option) => {
  const protocal = option.protocal || GetParam.prototype.getConfig().protocal;
  //协议类型
  if (isExit(protocal) && isString(protocal) && protocal == ('webSocket' || 'http')) {
    GetParam.prototype.setOptParams('protocal', protocal);
  }
  else {
    GetParam.prototype.setOptParams('protocal', 'http');
  }
}
GetParam.prototype.checkHead = (option) => {
  const header = option.headers || GetParam.prototype.getConfig().headers;
  if (isExit(header) && isObj(header)) {
    GetParam.prototype.setParams('headers', header)
  }
  else {
    GetParam.prototype.setParams('headers', {'Content-Type': 'application/x-www-form-urlencoded'})
  }
}
GetParam.prototype.checkWithCredentials = (option) => {
  let withCredentials = option.withCredentials;
  if (isUndefined(withCredentials)) {
    withCredentials = GetParam.prototype.getConfig().withCredentials;
  }
  if (isBoolean(withCredentials)) {
    GetParam.prototype.setParams('withCredentials', withCredentials)
  }
  else {
    GetParam.prototype.setParams('withCredentials', true)
  }
}
GetParam.prototype.checkResponseType = (option) => {
  const responseType = option.responseType || GetParam.prototype.getConfig().responseType;
  if (isExit(responseType) && isString(responseType)) {
    GetParam.prototype.setParams('responseType', responseType)
  }
  else {
    GetParam.prototype.setParams('responseType', 'json')
  }
}
GetParam.prototype.checkOptions = (option) => {
  GetParam.prototype.checkProtcal(option);
}
//http配置项处理
GetParam.prototype.checkHttp = (reqParamVo, option) => {
  GetParam.prototype.checkUrl(option)
  GetParam.prototype.checkTimeout(option)
  GetParam.prototype.checkMethod(option)
  GetParam.prototype.checkHead(option)
  GetParam.prototype.checkWithCredentials(option)
  GetParam.prototype.checkResponseType(option)
}
/**
 * 功能:请求服务
 * 入参: reqParamVo:请求对象
 */
const invoke = (reqParamVo, option) => {
  const getParam = new GetParam(configuration);
  getParam.checkOptions(option)
  getParam.checkHttp(reqParamVo, option)
  if(getParam.getParams().method === 'get'){
    getParam.getParams().params = reqParamVo || {};
  }else{
    getParam.getParams().data = reqParamVo || {};
  }
  let params = getParam.getParams();
  return axios.$serviceAjax(params, configuration).then(res => {
    return Promise.resolve(res)
  });
}

export default {
  invoke,
  getConfig
}
