// list.js
const util = require('../../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    requestLoading: true,
    orders: [],
    orgOrders: [],
    paged: {
      page: 1,
      size: 4
    },
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
    // this.bindSorderTap();
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
      'paged.page': 1,
      status: status
    });
    // 导航栏标题
    let orderTitle = '';
    switch(status) {
      case "0":
        orderTitle = "待付款";
        break;
      case "1":
        orderTitle = "待发货";
        break;
      case "2":
        orderTitle = "待收货";
        break;
      case "3":
        orderTitle = "待评价";
        break;
      default :
        orderTitle = "我的订单";
        break;
    }
    wx.setNavigationBarTitle({
      title: orderTitle
    });
    this.getOrderList();
  },

  // 获取订单列表
  // ecapi.order.list
  getOrderList(loadMore = false) {
    wx.showLoading({
      title: '加载中...',
    });
    util.request(util.apiUrl + 'ecapi.order.list', 'POST',{
      page: this.data.paged.page,
      per_page: this.data.paged.size,
      status: this.data.status
    }).then(res => {
      console.log(res);
      if(loadMore == true) {
        this.data.orders = this.data.orders.concat(res.orders);
      } else {
        this.data.orders = res.orders;
      }
      let newOrders = this.data.orders;
      this.setData({
        ordersList: newOrders,
        paged: res.paged,
        requestLoading: false
      });
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
      util.notLogin(err);
    });
  },

  bindComment(event) {
    console.log(event.currentTarget.dataset.indexid);
    let indexid = event.currentTarget.dataset.indexid;
    wx.navigateTo({
      url: '../../comment/add/add?order=' + indexid
    });
  },

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
    if (this.data.paged.more === 1) {
      this.setData({
        'paged.page': parseInt(this.data.paged.page) + 1
      });
      this.getOrderList(true);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})