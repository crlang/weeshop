// cart.js
import util from '../../../utils/util.js';

let app = getApp();

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
    this.getOrderInfo(order);
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

  getOrderInfo(order) {
    let self = this,
      orderInfo = [];
    util.request(util.apiUrl + 'ecapi.order.get', 'POST',{
      order: order
    }).then(res => {
      console.log('inf',res);
      self.setData({
        orderInfo: res.order
      });
    }).catch(err => {
      console.log(err);
    });
  },

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
            code:  self.data.code,
            openid: app.globalData.openid
          }).then(res => {
            console.log("pay",res);
            if (self.data.code === "balance" && res.error_code === 0) {
              util.showToast('支付成功','success');
              setTimeout(function(){
                wx.navigateTo({
                  url: '../../member/order/list/list',
                });
              },800);
            }else if(self.data.code === "wxpay.wxa" && res.error_code === 0){
              if (res.wxpay.prepay_id === null) {
                util.showToast('支付失败','error');
                return false;
              }
              wx.requestPayment({
                'timeStamp': res.wxpay.timestamp,
                'nonceStr': res.wxpay.nonce_str,
                'package': res.wxpay.packages,
                'signType': 'MD5',
                'paySign': res.wxpay.sign,
                success: res => {
                  util.showToast('支付成功','success');
                  console.log('res',res);
                },
                fail: fai =>{
                  util.showToast('支付错误','error');
                  console.log('fai',fai);
                }
              });
            }
          }).catch(err => {
            console.log('e',err);
            util.showToast(err.error_desc,'error',800);
          });
        }
      }
    });
    function LANGUAGESET(name) {
      switch (name) {
      case "balance":
        return '余额支付';
      case "cod.app":
        return '货到付款';
      case "alipay.wap":
        return '支付宝wap支付';
      case "teegon.wap":
        return '天工收银';
      case "alipay.app":
        return '支付宝支付';
      case "wxpay.app":
        return '微信支付';
      case "wxpay.web":
        return '微信支付';
      case "wxpay.wxa":
        return '小程序支付';
      case "unionpay.app":
        return '银联支付';
      default:
        return '错误支付方式';
      }
    }
  },

  // 账户余额
  // ecapi.balance.get
  getBalanceInfo() {
    util.request(util.apiUrl + 'ecapi.balance.get', 'POST').then(res =>{
      this.setData({
        balance: res.amount
      });
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