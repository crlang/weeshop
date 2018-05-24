/**
 * WeeShop 声明
 * ===========================================================
 * 版权 大朗 所有，并保留所有权利
 * 网站地址: http://www.darlang.com
 * 标题: ECShop 小程序「weeshop 」- 基于 ECShop 3.6 版本开发的非官方微信小程序
 * 短链接: https://www.darlang.com/?p=709
 * 说明：源码已开源并遵循 MIT 协议，你有权利进行任何修改，但请保留出处，请不要删除该注释。
 * ==========================================================
 * @Author: Darlang
 */
// payment.js
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

  // 获取订单信息
  // ecapi.order.get
  getOrderInfo(order) {
    let self = this;
    util.request(util.apiUrl + 'ecapi.order.get', 'POST',{
      order: order
    }).then(res => {
      self.setData({
        orderInfo: res.order
      });
    }).catch(err => {
      util.showToast(err.error_desc,'error');
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
    let self = this,openid = null;
    if(app.globalData.openid === null) {
      let cacheOpenid = wx.getStorageSync('openid');
      if (cacheOpenid) {
        openid = cacheOpenid;
      }else {
        wx.showModal({
          title: '登录异常',
          content: '支付错误，登录超时或者异常，请重新登录!',
          cancelText: '返回首页',
          confirmText: '重新登录',
          success: function (res) {
            if(res.confirm) {
              app.getUserInfo();
              setTimeout(function(){
                wx.navigateTo({
                  url: '/pages/shopping/payment/payment?order=' + self.data.order,
                });
              }, 1500);
            }else {
              wx.navigateTo({
                url: '/pages/index/index',
              });
            }
          }
        });
        return false;
      }
    }else {
      openid = app.globalData.openid;
    }

    wx.showModal({
      title: '确认支付',
      content: '你选择的是 ' +LANGUAGESET(self.data.code)+ ' 请确认支付.',
      success: function (res) {
        if(res.confirm) {
          util.request(util.apiUrl + 'ecapi.payment.pay', 'POST',{
            order: self.data.order,
            code:  self.data.code,
            openid: openid
          }).then(res => {
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
                  //requestPayment:ok
                  util.showToast('支付成功','success');
                },
                fail: fai =>{
                  //requestPayment:fail cancel
                  util.showToast('支付未完成','error');
                }
              });
            }
          }).catch(err => {
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