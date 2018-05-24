/**
 * WeeShop 声明
 * ===========================================================
 * 版权 大朗 所有，并保留所有权利
 * 网站地址: http://www.darlang.com
 * 标题: ECShop 小程序「weeshop 」- 基于 ECShop 3.6 版本开发的非官方微信小程序
 * 短链接: https://www.darlang.com/?p=709
 * 说明：源码已开源并遵循 MIT 协议，你有权利进行任何修改，但请保留出处，请不要删除该注释。
 * ==========================================================
 * @Author: Darlang
 */
import XXTEA from '../libs/security/xxtea.js';

//////////////////////////////////////////////////////////////
// 如果不是 https 的网站，则 https 等于 false ，否则请改为 true /
/////// 商城 URL 请添加你的 ECShop 商城地址，不是 API 地址 //////
//////////////////////////////////////////////////////////////

// 商城地址
let https     = true,
  // 如果网站是 HTTPS 的则设为 true
  shopUrl     = 'ecshop.crlang.com';
// 商城地址，不是 API 地址。不包含 "http://"

///////////////////////////////////////////////////////////////
//////////////// 以下区域，如果不会修改，则不要动 ////////////////
///////////////////////////////////////////////////////////////

// ecshop 接口地址
// util.apiUrl + url
let apiUrl = 'http://api.' + shopUrl + '/v2/';
if(https) {apiUrl = 'https://api.' + shopUrl + '/v2/';}
https === true ? shopUrl = 'https://' + shopUrl : shopUrl = 'http://' + shopUrl;

// API 地址检测
!(function apiTest(){
  let apiSiteURL = apiUrl.substring(0, apiUrl.length - 3);
  wx.request({
    url: apiSiteURL,
    method: 'GET',
    data: '',
    header: {
      'content-type': 'application/json',
      'X-ECAPI-Sign': '',
      'X-ECAPI-UDID': '',
      'X-ECAPI-UserAgent': 'Platform/Wechat',
      'X-ECAPI-Ver': '1.1.0'
    },
    complete: function(com) {
      if (com.data !== 'Hi') {
        wx.showModal({
          title: 'API地址错误',
          content: '请访问\r\n' + apiSiteURL + '\r\n能否正常得到 Hi 字符.\r\n请参考文章 https://www.darlang.com/?p=709！',
          showCancel: false
        });
      }
    }
  });
})();

// 格式化时间
// util.formatTiem(timeStamp,'Y/M/D h:m:s') 或 util.formatTiem(timeStamp)
function formatTime(date,format = null) {
  var daDate = new Date(date * 1000), // 毫秒级
    formatsArr = ['Y','M','D','h','i','s'],
    returnArr = [],
    year = daDate.getFullYear(),
    month = daDate.getMonth() + 1,
    day = daDate.getDate(),
    hour = daDate.getHours(),
    minute = daDate.getMinutes(),
    second = daDate.getSeconds();
  function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }
  if (format === null) {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  }else{
    returnArr.push(year);
    returnArr.push(formatNumber(month));
    returnArr.push(formatNumber(day));
    returnArr.push(formatNumber(hour));
    returnArr.push(formatNumber(minute));
    returnArr.push(formatNumber(second));
    for(let i in returnArr){
      format = format.replace(formatsArr[i], returnArr[i]);
    }
    return format;
  }
}

// AJAX 请求
// util.request(url,type,date)
function request(url, method = 'GET', data = {}) {
  let header = {
    'content-type': 'application/json',
    'X-ECAPI-Sign': '',
    'X-ECAPI-UDID': '',
    'X-ECAPI-UserAgent': 'Platform/Wechat',
    'X-ECAPI-Ver': '1.1.0'
  };

  let token = wx.getStorageSync('token') || '';
  if (token) {
    header['X-ECAPI-Authorization'] = token;
  }

  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: method,
      data: data,
      header: header,
      success: function (res) {
        if (res.data.error_code === 0 && res.statusCode === 200) {
          resolve(res.data);
        } else {
          reject(res);
        }
      },
      fail: function (err) {
        showToast('网络加载失败','error',600);
      }
    });
  });
}

// 商城配置
// ecapi.config.get
function getShopConfig(){
  return request(apiUrl + 'ecapi.config.get', 'POST').then(res => {
    if(res.error_code === 0) {
      let key = "getprogname()",
        data = res.data;
      return JSON.parse(XXTEA.decryptFromBase64(data, key));
    }
    return null;
  }).catch(err => {
    if (err.statusCode === 404) {
      // 页面不存在
      wx.showModal({
        title: '错误',
        content: 'API 站点配置，页面不存在！',
        showCancel: false
      });
    } else if(err.statusCode === 405) {
      // 页面无权限
      wx.showModal({
        title: '失败',
        content: 'API 站点配置无权获取，No Access-Control-Allow-Origin。\r\n请参考文章 https://www.darlang.com/?p=709！',
        showCancel: false
      });
    }
  });
}
getShopConfig().then(res => {
  if (res) {
    if (typeof res.config['wechat.wxa'] === "undefined") {
      // 未开启小程序提示
      wx.showModal({
        title: '提示',
        content: '商城后台配置未开启小程序功能！',
        showCancel: false
      });
      return false;
    }else {
      // 未授权提示
      if (res.config.authorize !== true) {
        let authorizeTip = XXTEA.utf8Decode("æªææï¼å°ç¨åºåè½åéå¶ã\r\nè¯·æ³¨æï¼å¦éææï¼è¯·åå¾ ecshop å®æ¹ç½ç«è´­ä¹°ï¼ï¼ï¼");
        wx.showModal({
          title: '',
          content: authorizeTip,
          showCancel: false
        });
        return false;
      }
    }
  }
});

// 消息提示
// util.showToast(title,type,duration)
function showToast(title, type = 'none', duration = null) {
  let image = '',
    icon = '';
  switch (type) {
  case 'error':
    image = '/images/icon_error.png';
    break;
  case 'success':
    image = '/images/icon_success.png';
    break;
  case 'warning':
    image = '/images/icon_warning.png';
    break;
  case 'none':
    icon = 'none';
    break;
  }
  duration === null ? duration = 500 : duration;
  wx.showToast({
    title: title,
    icon: icon,
    image: image,
    duration: duration,
    mask: true,
    success: function (res) { },
    fail: function (res) { },
    complete: function (res) { }
  });
}

// 初始化购物车数量
function updateCartNum() {
  let num = '0';
  request(apiUrl + 'ecapi.cart.get', 'POST').then(res => {
    if (res.goods_groups.length >= 1) {
      num = res.goods_groups[0].total_amount.toString();
    }
    wx.setTabBarBadge({index: 2,text: num});
  }).catch(err => {
    wx.setTabBarBadge({index: 2,text: num});
  });
}

// 未登录提示
function notLogin(err) {
  // 错误代码
  // "OK": 0, // 正常
  // "UNKNOWN_ERROR": 10000, // 内部错误
  // "TOKEN_INVALID": 10001, // Token 无效
  // "TOKEN_EXPIRED": 10002, // Token 过期
  // "SIGN_INVALID": 10003, // Sign 无效
  // "SIGN_EXPIRED": 10004, // Sign 过期
  if (err.data.error || err.data.error_code === 10001) {
    wx.showModal({
      title: '授权错误',
      content: '由于你尚未授权登录，后续将影响购物，请授权。',
      confirmText: '跳转',
      // showCancel: false,
      success: function (cif) {
        if (cif.confirm) {
          wx.navigateTo({
            url: '/pages/auth/login/login'
          });
        }else{
          wx.showModal({
            title: '授权取消',
            content: '由于你取消了用户授权，是否使用账号登录？',
            success: function (eci) {
              if (eci.confirm) {
                wx.redirectTo({
                  url: '/pages/auth/login/login'
                });
              }else {
                wx.switchTab({
                  url: '/pages/index/index'
                });
              }
            }
          });
        }
      }
    });
  }
}

// 页面标题
const pageTitle = {
  home: "首页",
  cart: "购物车",
  catalog: "分类目录",
  goods: "商品中心",
  goodsM: {
    list: '商品列表',
    detail: '宝贝详情',
    catalog: '商品分类'
  },
  member: "个人中心",
  search: "搜索",
  order: "订单中心",
  orderM: {
    detail: '订单详情',
    checkout: '检查订单',
    payment: '订单付款',
    s1: '待付款',
    s2: '待发货',
    s3: '待收货',
    s4: '待评价'
  },
  favorite: "收藏中心",
  notices: "公告中心",
  balance: "我的余额",
  balanceM: {
    history: "资金明细",
    s1: '全部',
    s2: '收入',
    s3: '支出'
  },
  login: "登录",
  forget: "找回密码",
  register: "注册",
  changePassword: "修改密码",
  comments: "商品评论",
  commentsM: {
    add: '评论添加',
    s1: '好评',
    s2: '中评',
    s3: '差评'
  },
  address: "我的地址",
  addressM: {
    add: '添加地址',
    edit: '更新地址'
  },
  withdraw: "提现记录",
  withdrawM: {
    success: '提现成功',
    fail: '提现失败'
  },
  coupon: "我的优惠券",
  bonus: "我的红包",
  bonusM: {
    s1: '未过期',
    s2: '已过期',
    s3: '已使用'
  },
  level: "特权中心",
  score: "积分中心",
  scoreM: {
    s1: '未过期',
    s2: '已过期',
    s3: '已使用'
  },
  userinfo: "用户信息",
  wechatLogin: "微信登录",
  wechatPay: "微信支付",
};

// 模块出口
module.exports = {
  formatTime: formatTime,
  request: request,
  showToast: showToast,
  apiUrl: apiUrl,
  shopUrl: shopUrl,
  updateCartNum: updateCartNum,
  notLogin: notLogin,
  pageTitle: pageTitle,
  getShopConfig: getShopConfig
};
