// list.js
const util = require('../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    requestLoading: true,
    category: 0,
    keyword: '',
    products: [],
    paged: {
      page: 1,
      size: 10
    },
    sort_key: 0,
    sort_value: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.keyword)
    let keyword = options.keyword || '',
        category = options.category || '';
    if (keyword !== '') {
      wx.setNavigationBarTitle({
        title: util.pageTitle.search + " " + keyword
      });
    }else{
      wx.setNavigationBarTitle({
        title: util.pageTitle.goodsList
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
    let sort_key = event.currentTarget.id;
    this.setData({
      'paged.page': 1,
      'sort_key': sort_key
    });
    if(sort_key == 1) {
      this.setData({
        sort_value: this.data.sort_value == 1 ? 2 : 1
      });
    }
    this.getPorducts();
  },

  // 商品列表
  // ecapi.product.list
  getPorducts(loadMore = false) {
    wx.showLoading({
      title: '加载中...'
    });
    let TD = this.data;
    util.request(util.apiUrl + 'ecapi.product.list', 'POST', {
      category: TD.category,
      page: TD.paged.page,
      keyword: TD.keyword,
      per_page: TD.paged.size,
      sort_key: TD.sort_key,
      sort_value: TD.sort_value
    }).then(res => {
      console.log(res);
      let products = [];
      if(loadMore == true) {
        products = this.data.products;
      }else {
        products = [];
      }
      let newPorducts = products.concat(res.products);
      this.setData({
        products: newPorducts,
        paged: res.paged,
        requestLoading: false
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

    if (this.data.paged.more === 1) {
      this.setData({
        'paged.page': parseInt(this.data.paged.page) + 1
      });
      this.getPorducts(true);
    }


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})