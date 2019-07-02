/**
 * WeeShop 声明
 * ===========================================================
 * 网站： https://www.darlang.com
 * 标题： ECShop 小程序「weeshop 」- 基于 ECShop 为后台系统开发的非官方微信商城小程序
 * 链接： https://www.darlang.com/?p=709
 * 说明： 源码已开源并遵循 Apache 2.0 协议，你有权利进行任何修改，但请保留出处，请不要删除该注释。
 * ==========================================================
 * Copyright 2019 darlang
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ===========================================================
 */
import {shopUrl, apiUrl, miniProName, shopNoticeCatId,shopHelpCatId, shopScoreScale, shopLevelRank,pointsMall} from "../weeshop.config";
import {PAGE_NAVIGATION_TITLE} from "./status";
import {WeeShop_Version} from "./version";

///////////////////////////////////////////////////////////////
//////////////// 以下区域，如果不会修改，则不要动 ////////////////
///////////////////////////////////////////////////////////////

// API 地址检测
// @author darlang
!(function apiTest() {
  const apiSiteState = wx.getStorageSync('apiSiteState');
  if (apiSiteState === true) {
    return false;
  }
  let apiSiteURL = apiUrl.slice(0, -3);
  wx.request({
    url: apiSiteURL,
    method: "GET",
    data: "",
    header: {
      "content-type": "application/json",
      "X-ECAPI-Sign": "",
      "X-ECAPI-UDID": "",
      "X-ECAPI-UserAgent": "Platform/Wechat",
      "X-ECAPI-Ver": "1.1.0"
    },
    complete: (com) => {
      if (com.data.indexOf('Hi') > -1) {
        wx.setStorageSync('apiSiteState', true);
      }else{
        wx.showModal({
          title: "API地址错误",
          content:
            "请访问\r\n" + apiSiteURL + "\r\n能否正常得到 Hi 字符.\r\n请参考文章 https://www.darlang.com/?p=709！",
          showCancel: false
        });
      }
    }
  });
})();



/**
 * 商城配置检测
 * ecapi.config.get
 * @author https://darlang.com
 * @returns
 */
!(function getShopConfig() {
  const apiInitState = wx.getStorageSync('apiInitState');
  if (apiInitState === true) {
    return false;
  }
  request("ecapi.config.get","post",{
    url: shopUrl
  }).then(res => {
    wx.setStorageSync('apiInitState', true);
  }).catch(err => {
    if (err.statusCode === 404) {
      // 页面不存在
      wx.showModal({
        title: "页面错误",
        content: "API 站点配置，页面不存在！",
        showCancel: false
      });
      return false;
    } else if (err.statusCode === 405) {
      // 页面无权限
      wx.showModal({
        title: "请求失败",
        content:
          "API 站点配置无权获取，No Access-Control-Allow-Origin。\r\n请参考文章 https://www.darlang.com/?p=709！",
        showCancel: false
      });
      return false;
    } else if (err.statusCode === 307) {
      // 页面无权限
      wx.showModal({
        title: "请求异常",
        content:
          "API 站点被重定向，请注意 apiUrl/shopUrl 地址的 http/https 是否一致！",
        showCancel: false
      });
      return false;
    }
  });
})();


/**
 * 登录异常提示
 * @author darlang
 * @param {*} err 错误信息
 */
function notLogin(err) {
  // 错误代码
  // "OK": 0, // 正常
  // "UNKNOWN_ERROR": 10000, // 内部错误
  // "TOKEN_INVALID": 10001, // Token 无效
  // "TOKEN_EXPIRED": 10002, // Token 过期
  // "SIGN_INVALID": 10003, // Sign 无效
  // "SIGN_EXPIRED": 10004, // Sign 过期
  let errorCode = [10000, 10001, 10002, 10003, 10004];
  if (err.data.error || errorCode.includes(err.data.error_code)) {
    wx.showModal({
      title: "登录异常",
      content: "由于您长时间未有操作，请重新登录",
      cancelText: "返回首页",
      confirmText: "跳转登录",
      // showCancel: true,
      success: function(cif) {
        if (cif.confirm) {
          wx.navigateTo({
            url: "/pages/auth/login/login"
          });
        } else {
          showToast("由于您尚未授权登录，后续将影响购物。");
          wx.switchTab({
            url: "/pages/index/index"
          });
        }
      }
    });
  }
}

/**
 * 未登录检测
 * @author darlang
 * @returns
 */
function checkLogin(redirect = false) {
  let user = wx.getStorageSync("user");
  let token = wx.getStorageSync("token");
  if (!user || !token) {
    if (redirect) {
      wx.showModal({
        title: "登录提示",
        content: "由于您尚未登录，请先登录。",
        cancelText: "稍后登录",
        confirmText: "跳转登录",
        // showCancel: true,
        success: function(cif) {
          if (cif.confirm) {
            wx.navigateTo({
              url: "/pages/auth/login/login"
            });
          } else {
            wx.switchTab({
              url: "/pages/index/index"
            });
          }
        }
      });
    }

    return false;
  }
  return true;
}


/**
 * 验证手机号
 * @author darlang
 * @param {String} mobile
 * @returns 返回布尔
 */
function checkMobile(mobile) {
  const mobileREG = new RegExp(/^[1][3,4,5,6,7,8,9][0-9]{9}$/);
  return mobileREG.test(mobile);
}

/**
 * 验证邮箱
 * @author darlang
 * @param {String} email
 * @returns 返回布尔
 */
function checkEmail(email) {
  const emailREG = new RegExp(/^\w{1,9}(-){0,1}\w{1,9}@\w{2,8}(\.\w{2,6}){1,3}$/);
  return emailREG.test(email);
}

/**
 * 格式化时间戳
 * @author darlang
 * @param {Date} val 时间戳
 * @param {String|Null} [format=null] 自定义格式(如只写日期: Y-M-D,或只写时间: h:i:s)
 * @returns 默认返回格式化时间 yyyy/mm/dd h:i:s
 */
function formatTime(date,format = null) {
  if (!date || typeof date == 'undefined') {
    console.log('时间错误: =>>',date);
    return '';
  }

  let daDate = new Date(date.toString().length < 11 ? date*1000 : date);
  if (daDate == 'Invalid Date') {
    console.log('时间无效: =>>',date);
    return '';
  }
  let fromatsRule = ['y','m','d','h','i','s'];
  let cr = [];
  let year = daDate.getFullYear(),
    month = daDate.getMonth() + 1,
    day = daDate.getDate(),
    hour = daDate.getHours(),
    minute = daDate.getMinutes(),
    second = daDate.getSeconds();
  if (year === 'NaN' || month === 'NaN' || day === 'NaN' || hour === 'NaN' || minute === 'NaN' || second === 'NaN') {
    console.log('时间异常: =>>',date);
    return '';
  }
  if (format === null) {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  }else{
    cr.push(year,month,day,hour,minute,second);
    cr = cr.map(formatNumber);
    format = format.toLowerCase();
    for(let i in cr){
      if (cr.hasOwnProperty(i)) {
        format = format.replace(fromatsRule[i], cr[i]);
      }
    }
    return format;
  }
}

/**
 * 获取倒计时
 * @author darlang
 * @description 传入时间超出现在时间，则顺计时，反之逆计时，目前逆计时未实现，直接返回 null
 * @param  {Date}   date 传入时间戳
 * @param  {Boolean}   countDown 如果为true直接传入与当前时间的时间差值
 * @return {String}        返回x日x时x分x秒
 */
function formatLeftTime(date,countDown = false) {
  if(!date) {
    console.error('无效时间');
    return false;
  }
  const iDate = new Date();
  const mDate = date.toString().length < 11 ? date*1000 : date;// 是否毫秒级，不是需要x1000
  const daDate = new Date(mDate);
  const langDate = +iDate;// 当前时间戳
  const leftTime = countDown ? date : (mDate - langDate)/1000;// 剩余时间或距今时间
  let format = null;

  if (leftTime > 0) {
    let d = parseInt(leftTime / 60 / 60 / 24);// 获得天数
    let h = formatNumber(parseInt(leftTime / 60 / 60 % 24));
    let i = formatNumber(parseInt(leftTime / 60 % 60));
    let s = formatNumber(parseInt(leftTime % 60));
    format = (d>0 ? d+'日' : '')+h+'时'+i+'分'+s+'秒';
  }
  return format;
}

/**
 * 个位数补 0
 * @author darlang
 * @param  {String|Number}   n 数字
 * @return {String}            补零的值
 */
function formatNumber(n) {
  n = n.toString();
  return n[1] ? n : '0' + n;
}

/**
 * 格式化时间
 * @author darlang
 * @param  {Date} date 时间戳
 * @return {String}     返回人性化的时间格式
 */
function formatRightTime(date) {
  const ct = parseInt((+new Date() - date) / 1000);
  switch (ct) {
  case ct < 60:
    return '刚刚';
  case ct < 60*60:
    return Math.floor( ct / 60 ) + "分钟前";
  case ct < 60*60*24:
    return formatTime(date,"h:i");
  default:
    return formatTime(date,"Y/M/D");
  }
}

/**
 * 数组去重
 * @author darlang
 * @param {Array} arr 数组
 * @returns {Array}
 */
function uniqueArray(arr) {
  try {
    return [...new Set(arr)];
  } catch(e) {
    // 遍历arr，把元素分别放入tmp数组(不存在才放)
    var tmp = new Array();
    for (var i in arr) {
      //该元素在tmp内部不存在才允许追加
      if (tmp.indexOf(arr[i]) == -1) {
        tmp.push(arr[i]);
      }
    }
    return tmp;
  }
}

/**
 * 获取 url 参数值
 * @author darlang
 * @param  {String} name 参数名称
 * @param  {String} url url地址
 * @return {String}      返回参数内容
 */
function getUrlParamValue(name,url) {
  const reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  url = url ? url : window.location.href;
  try {
    if (url.indexOf("?") > -1) {
      const s = url.split("?")[1];
      const r = s.match(reg) || null;
      if (r != null) {
        return unescape(r[2]);
      }
    }else{
      return null;
    }
  } catch (error) {
    console.error('非法url');
    return null;
  }
  return null;
}

/**
 * 获取当前小程序 url 带参数
 * @author darlang
 * 注意：不能在 onlaunch 中使用
 * @return {String} 返回完整的当前页面url
 */
function getCurrentPageUrl(){
  let pages = getCurrentPages();    //获取加载的页面
  let currentPage = pages[pages.length-1];    //获取当前页面的对象
  let url = currentPage.route;    //当前页面url
  let options = currentPage.options;    //获取url中所带的参数
  let fullUrl = url + '?';
  for(let key in options){
    let value = options[key];
    fullUrl += key + '=' + value + '&';
  }
  fullUrl = fullUrl.substring(0, fullUrl.length-1);
  return fullUrl;
}

/**
 * 检查路径是否合法
 * @author darlang
 * @param  {Array}    data 路径数据 [{type: '',path: ''}]
 * @param  {String}   key  路径类型
 * @return {String}        路径
 */
function checkPagePath(data,key) {
  for (let i = 0; i < data.length; i++) {
    if(data[i].type === key) {
      return data[i].path;
    }
  }
  return null;
}

/**
 * 检查路由页面
 * @author darlang
 * @description 检查存在是否存在上一页，有则返回上一页，无则跳转到首页
 */
function checkRoutePage() {
  let pages = getCurrentPages();
  let prevpage = pages[pages.length - 2];
  if (prevpage) {
    wx.navigateBack();
  }else{
    wx.switchTab({
      url: '/pages/index/index',
    });
  }
}

/**
 * 跳转路由，点击事件处理
 * @author darlang
 * @param  {Object}   e        type/对应路径，path/对应跳转路由类型{默认空/普通跳转,tab/调到 tabBar 页面,redirect/关闭当前页面跳转,back/返回上一页}
 * @param  {Array}    pathData 路由数据
 */
function pushPagePath(e,pathData = '') {
  if (!pathData) {
    showToast("错误路径跳转,不存在路径数据");
    return false;
  }
  try {
    const items = e.currentTarget.dataset;
    const type = items.type;
    const pagePath = checkPagePath(pathData,type);
    if (!type || !pagePath) {
      showToast("功能内测中");
      return false;
    }
    if (items.path === 'tab') {
      wx.switchTab({
        url: pagePath
      });
    }else if(items.path === 'redirect') {
      wx.redirectTo({
        url: pagePath
      });
    }else{
      wx.navigateTo({
        url: pagePath
      });
    }
  } catch(e) {
    console.error('错误路径跳转',e);
  }
}

/**
 * 统一化处理滚动加载列表数据
 * @author darlang
 * @param {Object} self 当前请求对象页面的 this
 * @param {Object} result 当前请求的数据
 * @param {String} remotName 当前请求的远程数据列表名称
 * @param {String} localName 当前请求的本地数据列表名称
 * @returns {Array} 返回组合后的新数据
 */
function scrollLoadList(self,result,remotName = '',localName = '') {
  let origData = self.data[localName] || [];// 获取原有数据
  let newData = result[remotName] || [];// 获取新增数据
  let pages = result['paged'] || '';

  if (newData && pages && pages.total > 0) {
    // 首次加载或原数据为空直接返回请求数据
    if (newData.length === 0) {
      if (pages.page > 1) {
        showToast("数据加载完毕");
      }
      self.setData({"pages.done": true});
      return origData;
    }

    // 已经到最后一页
    if (pages.page >= Math.ceil(pages.total/pages.size)) {
      if (pages.page > 1) {
        showToast("数据加载完毕");
      }
      self.setData({"pages.done": true});
      if (!origData || origData.length === 0) {
        origData = newData;
      }else {
        origData = origData.concat(newData);
      }
      return origData;
    }

    // 未到最后一页
    if (0 < pages.page && pages.page < Math.ceil(pages.total/pages.size)) {
      self.setData({"pages.page": parseInt(self.data.pages.page)+1,"pages.done": false});
      if (!origData || origData.length === 0) {
        origData = newData;
      }else {
        origData = origData.concat(newData);
      }
    }
  }
  return origData;
}

/**
 * 数据请求封装
 * @author darlang
 * @param {String} url 地址
 * @param {String} [method="POST"] 类型 默认 POST
 * @param {Object} [data={}] 内容
 * @returns {Object}
 */
function request(url, method = "POST", data = {}) {
  let header = {
    "content-type": "application/json",
    "X-ECAPI-Sign": "",
    "X-ECAPI-UDID": "",
    "X-ECAPI-UserAgent": "Platform/WechatMiniProgram",
    "X-ECAPI-Ver": "1.1.0"
  };

  let token = wx.getStorageSync("token") || "";
  if (token) {
    header["X-ECAPI-Authorization"] = token;
  }

  if (url) {
    url = url.indexOf('http') === 0 ? url : apiUrl + url;
  }else {
    console.error("该地址 "+url+" 不存在，请求终止！");
    return false;
  }

  // 删除空数据 - 默认
  if (!data.saveNull) {
    if (data && JSON.stringify(data) !== '{}') {
      for (const k in data) {
        if (data[k] === null || data[k] === '' || data[k] === undefined) {
          delete data[k];
        }
      }
    }
  }

  method = method.toLocaleUpperCase();
  if (method !== "GET") {
    if (method !== "POST") {
      console.error("该地址 "+url+" 请求的 method 不为 post 或 get ，请求终止！");
      return false;
    }
  }

  return new Promise((resolve, reject) => {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: (res) => {
        let errorCode = [10000, 10001, 10002, 10003, 10004];
        if (res.statusCode === 200 && res.data.error_code === 0 ) {
          resolve(res.data);
        }

        if (res.data && res.data.error_code ) {
          if (errorCode.includes(res.data.error_code)) {
            try {
              wx.clearStorageSync();
              showToast('登录超时，请重新登录');
              let pages = getCurrentPages();
              let currentPage = pages[pages.length-1];
              if (currentPage
                && currentPage.loginModal
                && currentPage.loginModal !== null) {
                currentPage.loginModal.check();
              }
              reject(res);
            } catch (e) {
              console.log(e);
            }
          }else{
            try {
              showToast(res.data.error_desc);
            } catch(e) {
              showToast('数据加载失败');
            }
          }
          reject(res);
        }
      },
      fail: (res) => {
        showToast("网络加载失败", "error", 800);
        reject(res);
      },
      complete: (res) => {
        reject(res);
        wx.stopPullDownRefresh();
        wx.hideLoading();
      }
    });
  });
}




/**
 * 消息提示
 * @author darlang
 * @param {String} 内容
 * @param {String} [type="none"] 类型
 * @param {Number} [duration=900] 持续时间
 */
function showToast(title, type = "none", duration = 900) {
  let image = "",
    icon = "";
  switch (type) {
  case "error":
    image = "/images/icon_toast-error.png";
    break;
  case "success":
    image = "/images/icon_toast-success.png";
    break;
  case "warning":
    image = "/images/icon_toast-warning.png";
    break;
  case "none":
    icon = "none";
    break;
  }
  wx.showToast({
    title: title,
    icon: icon,
    image: image,
    duration: duration,
    mask: true,
    success: () => {},
    fail: () => {},
    complete: () => {}
  });
}

/**
 * 设置导航标题名称
 * @author darlang
 * @param  {String}   name 标题名称
 */
function setNavBarTitle(name) {
  if (!name || typeof name !== 'string') {
    return false;
  }
  wx.setNavigationBarTitle({
    title: name
  });
}

// 模块出口
module.exports = {
  PNT: PAGE_NAVIGATION_TITLE,
  miniProName,
  WeeShop_Version,
  pointsMall,
  formatTime,
  formatLeftTime,
  formatNumber,
  formatRightTime,
  uniqueArray,
  getUrlParamValue,
  checkMobile,
  checkEmail,
  getCurrentPageUrl,
  checkPagePath,
  checkRoutePage,
  pushPagePath,
  scrollLoadList,
  request,
  showToast,
  setNavBarTitle,
  apiUrl,
  shopUrl,
  shopNoticeCatId,
  shopHelpCatId,
  notLogin,
  checkLogin,
  shopScoreScale,
  shopLevelRank
};
