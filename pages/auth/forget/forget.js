// forget.js
import util from '../../../utils/util.js';

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

  // 重置密码
  // ecapi.auth.default.reset
  forget(event) {
    util.request(util.apiUrl + 'ecapi.auth.default.reset', 'POST', {
      email: event.detail.value.email
    }).then(res => {
      util.showToast('发送成功，请查收邮箱！','none');
      // 返回登录
      wx.navigateBack();
    }).catch(err => {
      util.showToast(err.error_desc,'none');
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

  }
});