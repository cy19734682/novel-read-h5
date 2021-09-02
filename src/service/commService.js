import config from '../common/config'
import baseService from './baseService'


/********************************应用接口开始********************************/


/**
 * 获取加密key
 */
export const getRSAKey = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/getCryptKey";
    return baseService(paraMap,opt);
}
/**
 * 用户登录
 */
export const userLogin = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/userLogin";
    opt.method = "post"
    return baseService(paraMap,opt);
}
/**
 * 用户注册
 */
export const userRegister = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/userRegister";
    opt.method = "post"
    return baseService(paraMap,opt);
}
/**
 * 退出登录
 */
export const userLoginOut = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/userLoginOut";
    return baseService(paraMap,opt);
}

/**
 * 获取广告图
 */
export const queryBanner = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/banner";
    return baseService(paraMap,opt);
}
/**
 * 获取广告图
 */
export const queryRecommend = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/recommend";
    return baseService(paraMap,opt);
}
/**
 * 获取书籍列表
 */
export const queryBookList = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/books";
    return baseService(paraMap,opt);
}
/**
 * 获取书籍详情
 */
export const queryBook = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/book/"+paraMap.id;
    delete paraMap.id
    return baseService(paraMap,opt);
}
/**
 * 获取书籍评论
 */
export const queryComment = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/userComment";
    return baseService(paraMap,opt);
}
/**
 * 添加书籍评论
 */
export const addComment = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/addComment";
    opt.method = "post"
    opt.isEuc = true//内容要进行编码
    return baseService(paraMap,opt);
}
/**
 * 获取章节列表
 */
export const queryChapter = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/chapters";
    return baseService(paraMap,opt);
}
/**
 * 获取章节详情
 */
export const queryChapterDetail = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/chapter/"+paraMap.id;
    delete paraMap.id
    return baseService(paraMap,opt);
}
/**
 * 获取章节详情及前后章节
 */
export const queryChapterPreOrNext = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/chapterPreOrNext";
    return baseService(paraMap,opt);
}
/**
 * 获取书籍分类
 */
export const queryCategory = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/category";
    return baseService(paraMap,opt);
}
/**
 * 用户书架
 */
export const userBookShelf = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/userBookShelf";
    return baseService(paraMap,opt);
}
/**
 * 添加到书架
 */
export const addBookShelf = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/addBookShelf";
    opt.method = "post"
    return baseService(paraMap,opt);
}
/**
 * 移除书架
 */
export const deleteBookShelf = (params,option) => {
    let paraMap = params || {};
    let opt = option || {};
    opt.url = config.global.server + "/bus/deleteBookShelf";
    opt.method = "delete"
    return baseService(paraMap,opt);
}

