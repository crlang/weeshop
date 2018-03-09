// catalog.js
import util from '../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.catalog
    });
    this.getCategories();
  },

  goSearch() {
    wx.navigateTo({
      url: "../search/search"
    });
  },

  // 商品目录
  // ecapi.category.list
  getCategories() {
    wx.showLoading({
      title: '加载中...'
    });
    util.request(util.apiUrl + 'ecapi.category.list', 'POST', {
      page: 1,
      per_page: 999
    }).then(res => {
      this.setData({
        categories: res.categories
      });
      wx.hideLoading();
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