// page.js
const util = require('../../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    grade: 0,
    product: null,
    comments: [],
    paged: {
      page: 1,
      size: 4
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.comments
    });
    this.setData({
      product: options.id,
    })
    this.getGoodsComment();
  },

  // 评论列表
  // ecapi.review.product.list
  getGoodsComment() {
    let self = this;
    util.request(util.apiUrl + 'ecapi.review.product.list', 'POST', {
      grade: self.data.grade,
      page: self.data.paged.page,
      per_page: self.data.paged.size,
      product: self.data.product
    }).then(function (res) {
      console.log('c',res)
      for (let i in res.reviews) {
        res.reviews[i].created_at = util.formatTime(res.reviews[i].created_at);
        res.reviews[i].updated_at = util.formatTime(res.reviews[i].updated_at);
      }
      if (self.data.loadMore) {
        self.data.comments = self.data.comments.concat(res.reviews);
      }else{
        self.data.comments = res.reviews;
      }
      let newComments = self.data.comments;
      self.setData({
        "comments": newComments,
        paged: res.paged,
      });
      if (res.paged.more > 0) {
        self.setData({ loadMore:true });
      }else{
        self.setData({ loadMore:false });
      }
    })
  },

  // 订单筛选 0待付款 1待发货 2发货中 3已收货 4已评价 5已取消
  bindScommentsTap(event) {
    let grade = event.currentTarget.dataset.id || this.data.grade;
    this.setData({
      'paged.page': 1,
      grade: grade
    });
    // 导航栏标题
    let title = '';
    switch(grade) {
      case "0":
        title = "全部";
        break;
      case "1":
        title = "好评";
        break;
      case "2":
        title = "中评";
        break;
      case "3":
        title = "差评";
        break;
    }
    wx.setNavigationBarTitle({
      title: title
    });
    this.getGoodsComment();
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
      this.getGoodsComment();
    }
  },
});