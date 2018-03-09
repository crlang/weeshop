// catalog.js
import util from '../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyword: null,
    hotKeywords: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.search
    });
    this.getHotSearchList();
  },

  // 绑定输入
  bindSearchInput(event){
    this.setData({
      keyword: event.detail.value
    });
  },

  // 回车
  bindSearchConfirm(event){
    this.bindSearchTap(event.detail.value);
  },

  // 商品搜索
  bindSearchTap(keyword){
    if (this.data.keyword !== null) {
      let k = this.data.keyword || keyword
      wx.navigateTo({
        url: '../goods/list/list?keyword=' + k
      });
    }
  },

  // 热搜商品
  // ecapi.search.keyword.list
  getHotSearchList() {
    util.request(util.apiUrl + 'ecapi.search.keyword.list', 'POST').then(res => {
      this.setData({
        hotKeywords: res.keywords
      });
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