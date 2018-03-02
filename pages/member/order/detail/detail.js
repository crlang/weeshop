// detail.js
const util = require('../../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderID: 0,
    order: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.orderDetail
    });
    this.setData({
      orderID: parseInt(options.id)
    });
    this.getOrderInfo();
  },

  // 取消订单
  // ecapi.order.cancel
  onCancelOrder() {
    let self = this;
    wx.showModal({
      title: '提示',
      content: '是否要取消选择中订单？',
      success: function (res) {
        if (res.confirm) {
          util.request(util.apiUrl + 'ecapi.order.cancel', 'POST', {
            order: self.data.orderID,
            reason: 1
          }).then(res => {
            util.showToast('订单已取消', 'success');
            setTimeout(function () {
              self.getOrderInfo();
            }, 1000);
          });
        }
      }
    });
  },

  // 确认订单
  // ecapi.order.confirm
  confirmOrder() {
    let self = this;
    wx.showModal({
      title: '提示',
      content: '是否确认收货？',
      success: function (res) {
        if (res.confirm) {
          util.request(util.apiUrl + 'ecapi.order.confirm', 'POST', {
            order: self.data.orderID
          }).then(res => {
            util.showToast('提交收货成功', 'success',800);
            setTimeout(function () {
              self.getOrderInfo();
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
  bindExpress() {
    util.request(util.apiUrl + 'ecapi.shipping.status.get', 'POST',{
      order_id: this.data.orderID
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

  bindComment() {
    wx.navigateTo({
      url: '../../comment/add/add?order=' + this.data.orderID
    });
  },

  bindPay() {
    wx.navigateTo({
      url: '../../../shopping/payment/payment?order=' + this.data.orderID
    });
  },

  getOrderInfo() {
    wx.showLoading({
      title: '加载中...',
    });
    util.request(util.apiUrl + 'ecapi.order.get', 'POST',{
      order: this.data.orderID
    }).then((res) => {
      console.log(res);
      // canceled_at 取消时间、created_at 创建时间、finish_at 完成时间、paied_at 支付时间、shipping_at 发货时间、updated_at 更新时间
      let canceled_at = null,
          created_at = null,
          finish_at = null,
          paied_at = null,
          shipping_at = null,
          updated_at = null;
      if (res.order.canceled_at !== null) {
        canceled_at = util.formatTime(res.order.canceled_at);
      }else if (res.order.created_at !== null) {
        created_at = util.formatTime(res.order.created_at);
      }else if (res.order.finish_at !== null) {
        finish_at = util.formatTime(res.order.finish_at);
      }else if (res.order.paied_at !== null) {
        paied_at = util.formatTime(res.order.paied_at);
      }else if (res.order.shipping_at !== null) {
        shipping_at = util.formatTime(res.order.shipping_at);
      }else if (res.order.updated_at !== null) {
        updated_at = util.formatTime(res.order.updated_at);
      }
      this.setData({
        order: res.order,
        "order.canceled_at": canceled_at,
        "order.created_at": created_at,
        "order.finish_at": finish_at,
        "order.paied_at": paied_at,
        "order.shipping_at": shipping_at,
        "order.updated_at": updated_at
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
})