/**
 * 公共接口调用
 */
import netWork from '../common/netWork'
const commonInvoke =(req,option) => {
    let params = req || {};
    params = dealObjectValue(params,option.isEuc);//使用加签接口不需要编码
    return netWork.invoke(params,option);
}
export default commonInvoke;

/**
 * 处理对象参数值，排除对象参数值为”“、null、undefined，并返回一个新对象
 **/
function dealObjectValue(obj,isEuc){
    let param = obj || {};
    // UTF-8编码
    for (let key in param) {
        let value = param[key] + "";
        if (value === null || value === undefined || value === "" || value.trim().toLowerCase() === "null" || value.trim().toLowerCase() === "undefined") {
            param[key] = "";
        } else {
            if(isEuc){
                value = encodeURIComponent(value);
            }
            param[key] = value;
        }
    }
    return param;
};
