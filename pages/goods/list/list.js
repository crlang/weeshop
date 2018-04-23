// list.js
import util from '../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    category: 0,
    keyword: '',
    products: [],
    paged: {
      page: 1,
      size: 10
    },
    sort_key: 0,
    sort_value: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let keyword = options.keyword || '',
      category = options.category || '';
    if (keyword !== '') {
      wx.setNavigationBarTitle({
        title: util.pageTitle.search + " " + keyword
      });
    }else{
      wx.setNavigationBarTitle({
        title: util.pageTitle.goodsM.list
      });
    }
    this.setData({
      category: category,
      keyword: keyword
    });
    this.getPorducts();
  },

  // 商品排序
  bindSorderTap(event) {
    let sort_key = event.currentTarget.dataset.id;
    this.setData({
      products: [],
      'paged.page': 1,
      'sort_key': sort_key
    });
    if(sort_key === 1) {
      this.setData({
        sort_value: this.data.sort_value === 1 ? 2 : 1
      });
    }
    this.getPorducts();
  },

  // 商品列表
  // ecapi.product.list
  getPorducts() {
    wx.showLoading({
      title: '加载中...'
    });
    let self = this.data;
    util.request(util.apiUrl + 'ecapi.product.list', 'POST', {
      page: self.paged.page,
      per_page: self.paged.size,
      category: self.category,
      keyword: self.keyword,
      sort_key: self.sort_key,
      sort_value: self.sort_value
    }).then(res => {
      if (self.loadMore) {
        self.products = self.products.concat(res.products);
      }else{
        self.products = res.products;
      }
      let newProducts = self.products;
      this.setData({
        products: newProducts,
        paged: res.paged
      });
      if (res.paged.more > 0) {
        this.setData({ loadMore:true });
      }else{
        this.setData({ loadMore:false });
      }
    });
    wx.hideLoading();
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
    if (this.data.loadMore) {
      this.setData({
        "paged.page": parseInt(this.data.paged.page) + 1
      });
      this.getPorducts();
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});