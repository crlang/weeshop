// index.js
import util from '../../../utils/util.js';
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    orderTotal: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.member
    });
  },

  // 登出账号
  logout() {
    wx.removeStorageSync('token');
    wx.removeStorageSync('user');
    wx.removeStorageSync('openid');
    app.globalData.userInfo = null;
    this.data.orderTotal = null;
    util.showToast('退出登录成功', 'success');
    setTimeout(function(){
      wx.switchTab({
        url: '/pages/index/index'
      });
    }, 1500);
  },

  // 获取订单统计
  // ecapi.order.subtotal
  getOrderTotal() {
    util.request(util.apiUrl + 'ecapi.order.subtotal', 'POST').then(res => {
      this.setData({
        orderTotal: res.subtotal,
      });
    }).catch(err => {
      //...
    });
  },

  // 个人信息
  bindUserTap() {
    var self = this,
      userInfo = wx.getStorageSync('user');
    if (userInfo.avatar === null) {
      userInfo.avatar = "/images/default-avatar.png";
    }
    console.log('td',self.data);

    // 判断是否登陆
    if (!userInfo) {
      let openid = wx.getStorageSync('openid'),
        defaultUserInfo = {};
      // 初始化用户信息
      if (!userInfo && !openid) {
        defaultUserInfo.avatarUrl = "/images/default-avatar.png";
        defaultUserInfo.nickName = "你好，大朗！";
        defaultUserInfo.level = "游客";
        self.setData({
          userInfo: defaultUserInfo
        });

        wx.showModal({
          title: '登录提示',
          content: '由于你尚未授权登录，请登录。',
          // confirmText: '跳转',
          // showCancel: false,
          success: function (cif) {
            if (cif.confirm) {
              wx.navigateTo({
                url: '/pages/auth/login/login'
              });
            }else{
              wx.switchTab({
                url: '/pages/index/index'
              });
            }
          }
        });
        return false;
      }else {
        self.setData({
          userInfo: userInfo
        });
      }
    } else {
      self.setData({
        userInfo: userInfo
      });
      // 获取全局用户数据
      // app.getUserInfo(userInfo => {
      //   console.log('app user',userInfo);
      //   // self.setUserInfo();
      //   self.setData({
      //     userInfo: userInfo
      //   });
      // });
    }
  },

  // jump
  gOrderPay() {
    wx.navigateTo({
      url: '../order/list/list?status=0'
    });
  },
  // jump
  gOrderShip() {
    wx.navigateTo({
      url: '../order/list/list?status=1'
    });
  },
  // jump
  gOrderRece() {
    wx.navigateTo({
      url: '../order/list/list?status=2'
    });
  },
  // jump
  gOrderComm() {
    wx.navigateTo({
      url: '../order/list/list?status=3'
    });
  },

  // 设置会员信息
  // setUserInfo() {
  //   let user = wx.getStorageSync('user');
  //   this.setData({
  //     userInfo: user
  //   });
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.bindUserTap();
    this.getOrderTotal();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
});