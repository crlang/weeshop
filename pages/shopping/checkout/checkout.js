// cart.js
import util from '../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    address: '',
    consignee: '',
    consigneeNew: null,
    defaultConsignees: '',
    shipping: '',
    shippingName: '',
    shippingFee: '',
    order_product: [],
    cart_good_id: [],
    goods_info: [],
    orderFormat: [],
    goods: [],
    orderPrice: [],
    comment: '',
    score: null,
    cashgift: null,
    preferential: null,
    goods_reduction: null,
    order_reduction: null,
    coupon_reduction: null,
    invoice_content: null,
    invoice_title: null,
    invoice_type: null,
    coupon: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.orderM.checkout
    });
    let orderFormat = JSON.parse(options.order_product);
    let goodsFormat = JSON.parse(options.goods_info);
    this.setData({
      order_product: options.order_product,
      orderFormat: orderFormat,
      cart_good_id: options.cart_good_id,
      goods_info: goodsFormat
    });
    this.setConsignee();
    this.getOrderBuylist();
  },

  // 收货默认地址
  // ecapi.consignee.list
  setConsignee() {
    let self = this;
    let newConsignee = self.data.consigneeNew;
    util.request(util.apiUrl + 'ecapi.consignee.list', 'POST').then(res => {
      let defaultConsignees = [];
      for (let i in res.consignees) {
        if (newConsignee == null) {
          if (res.consignees[i].is_default) {
            defaultConsignees = res.consignees[i];
          }
        }else{
          if (res.consignees[i].id == newConsignee) {
            defaultConsignees = res.consignees[i];
          }
        }
      }
      self.setData({
        consignee: defaultConsignees.id,
        defaultConsignees: defaultConsignees
      });
    }).catch(err => {
        util.notLogin(err);
    });
  },

  // 选择地址
  getConsignee() {
    let self = this;
    wx.getStorage({
      key: 'consignee',
      success: function(res) {
        if (res.data != 'undefined') {
          self.setData({
            consigneeNew: res.data
          });
          self.setConsignee();
        }
      }
    });
    wx.removeStorage({
      key:"consignee"
    });
  },

  // 配送方式选择
  // ecapi.shipping.vendor.list
  bindExpress() {
    let self = this;
    util.request(util.apiUrl + 'ecapi.shipping.vendor.list', 'POST',{
      shop: 1,
      products: self.data.order_product,
      address: this.data.consignee
    }).then(res => {
      let expressList = res.vendors,
          expressArrs = [],
          expressIndex = '';
      for (let i in expressList) {
        expressArrs.push(expressList[i].name + ' ￥: ' + expressList[i].fee);
      }
      wx.showActionSheet({
        itemList: expressArrs,
        success: function(res) {
          expressIndex = res.tapIndex;
          self.setData({
            shipping: expressList[expressIndex].id,
            shippingName: expressList[expressIndex].name,
            shippingFee: expressList[expressIndex].fee,
          });
          self.getOrderBuylist();
        },
        fail: function(res) {
          console.log(res);
        }
      });
    }).catch(err => {
      util.showToast(err.error_desc);
    });
  },

  // 红包筛选
  // ecapi.cashgift.available
  // total_price page per_page

  // 订单购买列表
  // ecapi.order.price
  getOrderBuylist() {
    let self = this;
    util.request(util.apiUrl + 'ecapi.order.price', 'POST',{
      consignee: self.data.consignee,
      order_product: self.data.order_product,
      shipping: self.data.shipping,
      comment: self.data.comment
    }).then(res => {
      self.setData({
        orderPrice: res.order_price
      });
    });
  },

  // 绑定输入
  bindorderComment(e){
    this.setData({
      comment: e.detail.value
    });
  },

  // 检查订单
  // ecapi.cart.checkout
  checkoutOrder() {
    let self = this;
    if (self.data.shipping == '') {
      util.showToast('配送方式不能为空！','none');
      return false;
    }
    util.request(util.apiUrl + 'ecapi.cart.checkout', 'POST',{
      cart_good_id: '[' + self.data.cart_good_id + ']',
      consignee: self.data.consignee,
      shipping: self.data.shipping,
      comment: self.data.comment,
      cashgift: self.data.cashgift,
      score: self.data.score,
      invoice_content: self.data.invoice_content,
      invoice_title: self.data.invoice_title,
      invoice_type: self.data.invoice_type,
      coupon: self.data.coupon
    }).then(res => {
      util.showToast('下单成功,跳转付款中...','none',600);
      setTimeout(function() {
        wx.navigateTo({
          url: '../payment/payment?order=' + res.order.id
        });
      },800);
    }).catch(err => {
      util.showToast(err.error_desc,'none',900);
      util.notLogin(err);
    });
    self.getOrderBuylist();
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
    this.getConsignee();
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
    // 页面关闭
  },
});