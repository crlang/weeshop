// forget.js
const util = require('../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    email: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.forget
    });
  },

  // 绑定输入
  bindEmailInput: function (e) {
    this.setData({
      email: e.detail.value
    });
  },

  // 注册
  // ecapi.auth.default.reset
  forget() {
    if(this.data.email.length <= 0) {
      util.showToast('请输入邮箱','error');
      return false;
    }
    util.request(util.apiUrl + 'ecapi.auth.default.reset', 'POST', {
      email: this.data.email
    }).then(res => {
      console.log(res);
      util.showToast('发送成功，请查收邮箱！','none');
      // 返回登录
      wx.navigateBack();
    }).catch(err => {
      console.log('发送失败',err);
      util.showToast(err.error_desc,'error');
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});