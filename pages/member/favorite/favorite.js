// cart.js
import util from '../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    favoriteList: [],
    paged: {
      page: 1,
      size: 10
    },
    loadMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.favorite
    });
    // 页面初始化 options为页面跳转所带来的参数
    this.getFavoriteList();
  },

  // 删除收藏
  // ecapi.product.unlike
  onCancelFavorite(event) {
    let itemIndex = event.currentTarget.dataset.indexid;
    let self = this;
    wx.showModal({
      title: '提示',
      content: '是否要移除当前收藏？',
      success: function (res) {
        if (res.confirm) {
          util.request(util.apiUrl + 'ecapi.product.unlike', 'POST', {
            product: itemIndex
          }).then(res => {
            util.showToast('移除收藏成功!','success');
            self.setData({
              'paged.page': 1
            });
            setTimeout(function () {
              self.getFavoriteList();
            }, 1000);
          });
        }
      }
    });
  },

  // 收藏列表
  // ecapi.product.liked.list
  getFavoriteList() {
    wx.showLoading({
      title: '加载中...',
    });
    let self = this;
    util.request(util.apiUrl + 'ecapi.product.liked.list', 'POST',{
      page: self.data.paged.page,
      per_page: self.data.paged.size
    }).then(res => {
      if (self.data.loadMore) {
        self.data.favoriteList = self.data.favoriteList.concat(res.products);
      }else{
        self.data.favoriteList = res.products;
      }
      let newFavoriteList = self.data.favoriteList;
      self.setData({
        favoriteList: newFavoriteList,
        paged: res.paged,
        loadMore:true,
      });
      if (res.paged.more > 0) {
        self.setData({ loadMore:true });
      }else{
        self.setData({ loadMore:false });
      }
    }).catch(err => {
        util.notLogin(err);
    });
    wx.hideLoading();
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
    if (this.data.loadMore) {
      this.setData({
        'paged.page': parseInt(this.data.paged.page) + 1
      });
      this.getFavoriteList();
    }
  },
});