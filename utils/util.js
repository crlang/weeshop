// ecshop 3.6 商城地址
let https = false, // 如果网站是 HTTPS 的则设为 true
    shopUrl = 'ecshop.com'; // 商城地址，不包含 http://

// ecshop 接口地址
// util.apiUrl + url
let apiUrl = 'http://api.'+shopUrl+'/v2/';
if(https) {apiUrl = 'https://api.'+shopUrl+'/v2/';}
  https === true ? shopUrl = "https://" + shopUrl : shopUrl = "http://" + shopUrl;

// 格式化时间
// util.formatTiem(timeStamp,'Y/M/D h:m:s')
function formatTime(date,format = null) {
  var date = new Date(date * 1000), // 毫秒级
      formatsArr = ['Y','M','D','h','i','s'],
      returnArr = [],
      year = date.getFullYear(),
      month = date.getMonth() + 1,
      day = date.getDate(),
      hour = date.getHours(),
      minute = date.getMinutes(),
      second = date.getSeconds();
  function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n;
  }
  if (format == null) {
    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':');
  }else{
    returnArr.push(year);
    returnArr.push(formatNumber(month));
    returnArr.push(formatNumber(day));
    returnArr.push(formatNumber(hour));
    returnArr.push(formatNumber(minute));
    returnArr.push(formatNumber(second));
    for (let i in returnArr)
    {
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
        if (res.data.error_code === 0) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail: function (err) {
        showToast('网络加载失败','error',600);
      }
    });
  });
}

// 消息提示
// util.showToast(title,type,duration)
function showToast(title, type, duration = null) {
  let image = '',
      icon = '';
  if(type == 'none') {
    icon = 'none';
  }else {
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
    }
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
    console.log('cartTotal err',err);
    wx.setTabBarBadge({index: 2,text: num});
  });
}
updateCartNum();

// 未登录提示
function notLogin(err) {
  if (err.error == true || err.error_code == 10001) {
    wx.showModal({
      title: '提示',
      content: '未登录，是否要登录？',
      success: function (res) {
        if(res.confirm) {
          // 跳转到登录页面
          wx.navigateTo({
            url: '/pages/auth/login/login',
          });
        }else if(res.cancel) {
          showToast('请登录后查看！','none');
          setTimeout(function(){
            wx.switchTab({
              url: '/pages/index/index',
            });
          }, 800);
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
  goodsList: "商品列表",
  goodsDetail: "宝贝详情",
  goodsCatalog: "商品分类",
  member: "个人中心",
  search: "搜索",
  order: "订单中心",
  orderDetail: "订单中心",
  favorite: "收藏中心",
  notices: "公告中心",
  noticesDetail: "公告详情",
  balance: "我的余额",
  balanceHistory: "资金明细-全部",
  balanceHistoryA: "资金明细-收入",
  balanceHistoryB: "资金明细-支出",
  login: "登录",
  forget: "找回密码",
  register: "注册",
  changePassword: "修改密码",
  checkoutOrder: "检查订单",
  orderPayment: "订单付款",
  comments: "商品评论",
  commentsAdd: "评论添加",
  addressAdd: "添加地址",
  addressEdit: "更新地址",
  address: "我的地址",
  withdraw: "提现记录",
  withdrawSuccess: "提现成功",
  coupon: "我的优惠券",
  bonus: "我的红包",
  level: "特权中心",
  score: "积分中心",
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
};

