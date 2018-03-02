// index.js
const util = require('../../utils/util.js');

//获取应用实例
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    siteInfo: [],
    banners: [],
    notices: [],
    goodProducts: [],
    hotProducts: [],
    recentlyProducts: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getShopSiteInfo();
    this.getBanner();
    this.getNotices();
    this.getPorducts();
  },

  // 站点信息
  // ecapi.site.get
  getShopSiteInfo() {
    wx.showLoading({
      title: '加载中...'
    });
    let self = this;
    util.request(util.apiUrl + 'ecapi.site.get', 'POST').then(function(res) {
      // ...
    }).catch(function(err){
      if(err.site_info == undefined) {
        util.showToast('数据加载出错！','error',2500);
      }else{
        console.log('sterr',err)
        self.setData({
          siteInfo: err.site_info
        });
      }
      wx.setNavigationBarTitle({
        title: self.data.siteInfo.name || util.pageTitle.home
      });
    });
    wx.hideLoading();
  },

  // 移动端 Banner
  // ecapi.banner.list
  getBanner() {
    util.request(util.apiUrl + 'ecapi.banner.list', 'POST').then(res => {
      this.setData({
        banners: res.banners
      });
    });
  },

  // 站点公告列表
  // ecapi.notice.list
  getNotices() {
    util.request(util.apiUrl + 'ecapi.notice.list', 'POST', {
      page: 1,
      per_page: 5
    }).then(res => {
      this.setData({
        notices: res.notices
      });
    });
  },

  // 公告内容
  // notice.id
  bindOnNotice(event) {
    util.request(util.apiUrl +"notice."+ event.currentTarget.dataset.id, 'GET').then(res => {
      console.log(res);
    }).catch( err => {
      let content = err.match(/<p class="lead">([\s\S]*?)<\/p>/)[1];
      wx.showModal({
        title: util.pageTitle.noticesDetail,
        content: content,
        showCancel: false
      });
    });
  },

  // 首页展示产品
  // ecapi.home.product.list
  getPorducts() {
    util.request(util.apiUrl + 'ecapi.home.product.list', 'POST').then(res => {
      this.setData({
        goodProducts: res.good_products,
        hotProducts: res.hot_products,
        recentlyProducts: res.recently_products
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 页面隐藏
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
