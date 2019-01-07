// index.js
import util from "../../../utils/util.js";
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
  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.member
    });
  },

  // 登出账号
  logout() {
    wx.showModal({
      title: "退出提示",
      content: "",
      showCancel: true,
      cancelText: "点错了",
      cancelColor: "#999999",
      confirmText: "退出登录",
      confirmColor: "#3CC51F",
      success: res => {
        if (res.confirm) {
          wx.clearStorageSync();
          util.showToast("退出成功", "success");
          setTimeout(function() {
            wx.reLaunch({
              url: "/pages/index/index"
            });
          }, 1500);
        }
      }
    });
  },

  // 获取订单统计
  // ecapi.order.subtotal
  getOrderTotal() {
    if (!util.checkLogin()) {
      return false;
    }
    util
      .request(util.apiUrl + "ecapi.order.subtotal")
      .then(res => {
        this.setData({
          orderTotal: res.subtotal
        });
      })
      .catch(err => {
        //...
      });
  },

  // 个人信息
  bindUserTap() {
    var self = this,
      userInfo = wx.getStorageSync("user");
    if (userInfo.avatar === null) {
      userInfo.avatar = "/images/default-avatar.png";
    }
    // 判断是否登陆
    if (userInfo) {
      self.setData({
        userInfo: userInfo
      });
    }
  },

  pushPagePath(e) {
    let type = e.currentTarget.dataset.type || "";
    console.log(type);
    if (type === "pay") {
      wx.navigateTo({
        url: "../order/list/list?status=0"
      });
    } else if (type === "ship") {
      wx.navigateTo({
        url: "../order/list/list?status=1"
      });
    } else if (type === "rece") {
      wx.navigateTo({
        url: "../order/list/list?status=2"
      });
    } else if (type === "comm") {
      wx.navigateTo({
        url: "../order/list/list?status=3"
      });
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#333333",
      animation: {
        duration: 300,
        timingFunc: "linear"
      }
    });
    util.checkLogin(true);
    this.bindUserTap();
    this.getOrderTotal();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {}
});