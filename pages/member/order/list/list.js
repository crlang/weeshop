// list.js
import util from '../../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    ordersList: [],
    paged: {
      page: 1,
      size: 10
    },
    loadMore: true,
    status: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.order
    });
    let status = options.status || 999;
    this.setData({
      status: status
    });
    this.getOrderList();
  },

  // 取消订单
  // ecapi.order.cancel
  onCancelOrder(e) {
    let itemIndex = e.target.dataset.indexid;
    let self = this;
    wx.showModal({
      title: '提示',
      content: '是否要取消选择中订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(util.apiUrl + 'ecapi.order.cancel', 'POST', {
            order: itemIndex,
            reason: 1
          }).then(res => {
            util.showToast('订单已取消', 'success');
            setTimeout(function () {
              self.getOrderList();
            }, 1000);
          });
        }
      }
    });
  },

  // 确认订单
  // ecapi.order.confirm
  confirmOrder(e) {
    let itemIndex = e.target.dataset.indexid;
    let self = this;
    wx.showModal({
      title: '提示',
      content: '是否确认收货？',
      success: function (res) {
        if (res.confirm) {
          util.request(util.apiUrl + 'ecapi.order.confirm', 'POST', {
            order: itemIndex
          }).then(res => {
            util.showToast('提交收货成功', 'success',800);
            setTimeout(function () {
              self.getOrderList();
            }, 1000);
          }).catch(err => {
            util.showToast(err.error_desc,'none');
          });
        }
      }
    });
  },

  // 查询物流编号
  // ecapi.shipping.status.get
  bindExpress(event) {
    util.request(util.apiUrl + 'ecapi.shipping.status.get', 'POST',{
      order_id: event.currentTarget.dataset.indexid
    }).then(res => {
      let codeSN = res.code;
      wx.showModal({
        title: '物流提示',
        content: '当前物流：' + res.vendor_name + '\r\n物流编号：' + res.code + '\r\n暂不支持查询物流，点击复制物流编号',
        showCancel: false,
        confirmText: "复制",
        success: function (res) {
          if (res.confirm) {
            wx.setClipboardData({
              data: codeSN,
              success: function(res) {
                util.showToast("复制成功","success",800);
              }
            });
          }
        }
      });
    });
  },

  // 订单筛选 0待付款 1待发货 2发货中 3已收货 4已评价 5已取消
  bindSorderTap(event) {
    let status = event.currentTarget.id || this.data.status;
    this.setData({
      ordersList: [],
      'paged.page': 1,
      status: status
    });
    // 导航栏标题
    let orderTitle = '';
    switch(status) {
    case "0":
      orderTitle = util.pageTitle.orderM.s1;
      break;
    case "1":
      orderTitle = util.pageTitle.orderM.s2;
      break;
    case "2":
      orderTitle = util.pageTitle.orderM.s3;
      break;
    case "3":
      orderTitle = util.pageTitle.orderM.s4;
      break;
    }
    wx.setNavigationBarTitle({
      title: orderTitle
    });
    this.getOrderList();
  },

  // 获取订单列表
  // ecapi.order.list
  getOrderList() {
    wx.showLoading({
      title: '加载中...',
    });
    let self = this;
    util.request(util.apiUrl + 'ecapi.order.list', 'POST',{
      page: self.data.paged.page,
      per_page: self.data.paged.size,
      status: self.data.status
    }).then(res => {
      if (self.data.loadMore) {
        self.data.ordersList = self.data.ordersList.concat(res.orders);
      }else{
        self.data.ordersList = res.orders;
      }
      let newOrders = self.data.ordersList;
      self.setData({
        ordersList: newOrders,
        paged: res.paged
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

  // 跳转评论
  bindComment(event) {
    let indexid = event.currentTarget.dataset.indexid;
    wx.navigateTo({
      url: '../../comment/add/add?order=' + indexid
    });
  },

  // 跳转付款
  bindPay(event) {
    let indexid = event.currentTarget.dataset.indexid;
    wx.navigateTo({
      url: '../../../shopping/payment/payment?order=' + indexid
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
    if (this.data.loadMore) {
      this.setData({
        'paged.page': parseInt(this.data.paged.page) + 1
      });
      this.getOrderList();
    }
  }
});