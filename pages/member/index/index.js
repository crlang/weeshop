// index.js
const util = require('../../../utils/util.js');
var app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    user: {
      id: 0,
      username: 'Hi 你好',
      avatar: ''
    },
    orderTotal: {
      "created": 0,
      "paid": 0,
      "delivering": 0,
      "deliveried": 0,
      "finished": 0,
      "cancelled": 0
    }
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
      console.log('ortest',res);
      this.setData({
        orderTotal: res.subtotal,
      });
    }).catch(err => {
      util.notLogin(err);
    });
  },

  // 个人信息
  bindUserTap() {
    var that = this;
    console.log("this info",this);
    var userInfo = wx.getStorageSync('user');
    console.log('cuserinfo',userInfo);
    // 判断是否登陆
    if (userInfo.is_completed) {
      // 获取用户信息
      console.log('token',userInfo);
      if (userInfo.avatar == null) {
        userInfo.avatar = "/images/default-avatar.png";
      }
      var photo = userInfo.avatar,
          name = userInfo.username,
          level = userInfo.rank,
          user = {};
          user.avatarUrl = photo;
          user.nickName = name;
          user.level = level;
      that.setData({
        userInfo: user
      });
    } else {
      // 获取全局用户数据
      app.getUserInfo(userInfo => {
        that.setData({
          userInfo: userInfo
        });
      });
    }
  },

  gOrderPay() {
    wx.navigateTo({
      url: '../order/list/list?status=0'
    });
  },

  gOrderShip() {
    wx.navigateTo({
      url: '../order/list/list?status=1'
    });
  },

  gOrderRece() {
    wx.navigateTo({
      url: '../order/list/list?status=2'
    });
  },

  gOrderComm() {
    wx.navigateTo({
      url: '../order/list/list?status=3'
    });
  },

  // 设置会员信息
  setUserInfo() {
    let user = wx.getStorageSync('user');
    this.setData({
      user: user
    });
  },

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
    this.setUserInfo();
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});