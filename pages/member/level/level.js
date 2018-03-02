// page.js
const util = require('../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: [],
    score: 0,
    nextLevel: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.level
    });
    this.getLevelInfo();
  },

  // 用户信息
  getLevelInfo() {
    var userInfo = wx.getStorageSync('user');
    console.log('cuserxxinfo',userInfo);
    var userInfo = wx.getStorageSync('user');
    this.getScore();
    let nextLevel = userInfo.rank.score_max;
    userInfo.joined_at = util.formatTime(userInfo.joined_at);
    this.setData({
      userInfo: userInfo,
      nextLevel: nextLevel
    });
  },

  // 获取积分
  // ecapi.score.get
  getScore() {
    util.request(util.apiUrl + 'ecapi.score.get', 'POST').then(res => {
      this.setData({
        score: res.score
      })
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
});