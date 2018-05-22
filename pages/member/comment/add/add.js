// add.js
import util from '../../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: '',
    is_anonymous: 0, // 0 不匿名 1 匿名
    goods: '',
    grade: '', // 3好评 2中评 1差评
    cg: '',
    content: '',
    review: [],
    goodsInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.commentsM.add
    });
    let order = options.order;
    this.setData({
      order: order
    });
    this.goodsInfo();
  },

  // 绑定输入
  bindGrade(e) {
    this.setData({
      grade: e.currentTarget.dataset.id
    });
    this.checkedGrade();
  },
  bindIsAnonymous(e) {
    let id = 0;
    e.detail.value === true ? id = 1 : id = 0;
    this.setData({
      is_anonymous: id
    });
  },

  // 评级
  checkedGrade() {
    let cg = this.data.grade;
    switch (cg) {
    case 1:
      this.setData({
        cg: 1
      });
      break;
    case 2:
      this.setData({
        cg: 2
      });
      break;
    case 3:
      this.setData({
        cg: 3
      });
      break;
    }
  },

  // 获取订单信息
  // ecapi.order.get
  goodsInfo() {
    util.request(util.apiUrl + 'ecapi.order.get', 'POST',{
      order: this.data.order
    }).then(res => {
      this.setData({
        goodsInfo: res.order.goods[0],
        goods: res.order.goods[0].id
      });
    }).catch(err => {
      util.showToast(err.error_desc);
      util.notLogin(err);
    });
  },

  // 提交评论
  // ecapi.order.review
  submitReview(e) {
    let self = this;
    let review = '[{"goods":'+self.data.goods+',"grade":'+self.data.grade+',"content":"'+e.detail.value.content+'"}]';
    util.request(util.apiUrl + 'ecapi.order.review', 'POST',{
      order: self.data.order,
      review: review,
      is_anonymous: self.data.is_anonymous
    }).then(res => {
      util.showToast('评论成功','success',700);
      setTimeout(function(){
        wx.navigateTo({
          url: '../../order/detail/detail?id=' + self.data.order
        });
      }, 800);
    }).catch(err => {
      util.showToast(err.error_desc,'none',800);
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