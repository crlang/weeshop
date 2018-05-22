// catalog.js
import util from '../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: [],
    childCategories: [],
    curId: 0,
    srollHeight: 300 //需要动态获取屏幕高度，给scorllview高度赋值，随便用一个值初始化数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
      console.log(res.categories);

      this.setData({
        categories: res.categories,
        childCategories: res.categories[0].categories,
        curId: res.categories[0].id
      });
      wx.hideLoading();
    });
  },

  //事件处理函数
  switchRightTab(e) {
    // 获取item项的id，和数组的下标值
    let id = e.target.dataset.id,
      index = parseInt(e.target.dataset.index);
    console.log(index,id);

    // 把点击到的某一项，设为当前index
    this.setData({
      curId: id,
      childCategories: this.data.categories[index].categories
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var self = this;
    wx.getSystemInfo({
      success: function(res) {
        var height = res.windowHeight - 50; //footerpannelheight为底部组件的高度
        self.setData({
          srollHeight: height
        });
      }
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
});