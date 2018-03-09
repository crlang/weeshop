// cart.js
import util from '../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    order: '',// 订单
    code: '',// 支付方式
    orderInfo: [],
    balance: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.orderM.payment
    });
    let order = options.order;
    this.setData({
      order: order
    });
    this.purchaseInfo();
    this.getBalanceInfo();
  },

  // 支付列表
  // ecapi.payment.types.list
  // ecapi.product.purchase
  // product: 74 产品
  // property: "[245,243]" 规格
  // amount: 1 数量
  // comment: "留言，我要红色的"
  // consignee: 3, 收货id
  // shipping: 8 快递id

  // 支付方式
  // ecapi.payment.types.list
  // shop: 1

  // 选择支付方式
  setPayType(event) {
    this.setData({
      code: event.detail.value
    });
  },

  // 支付
  // ecapi.payment.pay
  toPay() {
    let self = this;
    wx.showModal({
      title: '确认支付',
      content: '你选择的是 ' +LANGUAGESET(self.data.code)+ ' 请确认支付.',
      success: function (res) {
        if(res.confirm) {
          util.request(util.apiUrl + 'ecapi.payment.pay', 'POST',{
            order: self.data.order,
            code:  self.data.code
          }).then(res => {
            util.showToast('支付成功','success');
            setTimeout(function(){
              wx.navigateTo({
                url: '../../member/order/list/list',
              });
            },800);
          }).catch(err => {
            util.showToast('支付方式有误','error',800);
          });
        }
      }
    });
    function LANGUAGESET(name) {
      switch (name) {
        case "balance":
          return '余额支付';
        break;
        case "cod.app":
          return '货到付款';
        break;
        case "alipay.wap":
          return '支付宝wap支付';
        break;
        case "teegon.wap":
          return '天工收银';
        break;
        case "alipay.app":
          return '支付宝支付';
        break;
        case "wxpay.app":
          return '微信支付';
        break;
        case "wxpay.web":
          return '微信web支付';
        break;
        case "wxpay.wxa":
          return '银联支付';
        break;
        case "unionpay.app":
          return '银联支付';
        break;
        default:
          return '错误支付方式';
        break;
      }
    }
  },

  // 账户余额
  // ecapi.balance.get
  getBalanceInfo() {
    util.request(util.apiUrl + 'ecapi.balance.get', 'POST').then(res =>{
      this.setData({
        balance: res.amount
      })
    });
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
    // 页面关闭
  },

});