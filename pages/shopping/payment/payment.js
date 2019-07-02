/**
 * WeeShop 声明
 * ===========================================================
 * 网站： https://www.darlang.com
 * 标题： ECShop 小程序「weeshop 」- 基于 ECShop 为后台系统开发的非官方微信商城小程序
 * 链接： https://www.darlang.com/?p=709
 * 说明： 源码已开源并遵循 Apache 2.0 协议，你有权利进行任何修改，但请保留出处，请不要删除该注释。
 * ==========================================================
 * Copyright 2019 darlang
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ===========================================================
 */

// payment.js
import {PNT,setNavBarTitle,showToast,pushPagePath,formatTime} from "../../../utils/utils";
import {GetOrderInfo,PayOrder,GetBalanceTotal} from '../../../utils/apis';
import {CheckInvoiceInfo} from '../../../utils/publics';
import {PAY_CODE,PROMOS_TYPE} from '../../../utils/status';


Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderInfo: '',
    orderInfoPop: false,
    balanceInfo: '',
    payParams: {
      'order': '',// 订单id
      'code': 'wxpay.wxa',// 支付类型 alipay.app,wxpay.app,unionpay.app,cod.app,wxpay.web,teegon.wap,alipay.wap,wxpay.wxa,balance
      'openid': '',// openid 默认空，微信支付时必填
      'channel': '',// 渠道
      'referer': '',// 来源
    },
    payWay: [{
      label: '微信支付',
      code: 'wxpay.wxa',
      checked: true,
      icon: '/images/icon_wxpay.png',
      desc: '微信小程序支付(推荐)'
    },{
      label: '余额支付',
      code: 'balance',
      checked: false,
      icon: '/images/icon_balance.png',
      desc: '账户余额支付'
    }],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    setNavBarTitle(PNT.order.payment);
    this.loginModal = this.selectComponent("#login-modal");

    if (!opt.orderId) {
      showToast('订单错误','error');
      return false;
    }

    this.setData({
      "payParams.order": opt.orderId || ''
    });
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.getOrderInfo();
      this.getBalanceInfo();
    }
  },


  /**
   * 获取订单信息
   * @author darlang
   */
  getOrderInfo() {
    wx.showLoading({title: '正在检查订单...',mask: true});
    GetOrderInfo(this.data.payParams.order).then(res => {
      if (res.order) {
        let o = res.order;
        o.created_at = formatTime(o.created_at,'Y/M/D h:i:s');
        o.promos = o.promos.filter(k => k.price > 0);
        if (o.promos && o.promos.length > 0) {
          for (let i = 0; i < o.promos.length; i++) {
            let item = o.promos[i];
            item.label = PROMOS_TYPE.find(k => k.code === item.promo).label || '其他优惠';
          }
        }
        if (o.invoice && o.invoice.type) {
          CheckInvoiceInfo(o.invoice.type,'type').then(xres => {
            this.setData({
              'orderInfo.invoice.type': xres
            });
          });
          CheckInvoiceInfo(o.invoice.content,'content').then(xres => {
            this.setData({
              'orderInfo.invoice.content': xres
            });
          });
        }
        this.setData({
          orderInfo: res.order
        });
      }
    });
  },

  /**
   * 订单详情弹窗
   * @author darlang
   */
  setOrderInfoPop() {
    if (!this.data.orderInfoPop && !this.loginModal.check()) {
      return false;
    }
    this.setData({
      orderInfoPop: !this.data.orderInfoPop
    });
  },

  /**
   * 修改支付方式
   * @author darlang
   */
  setPayType(e) {
    let items = e.currentTarget.dataset;
    let pw = this.data.payWay;
    for (let i = 0; i < pw.length; i++) {
      if (pw[i].checked) {
        pw[i].checked = false;
      }
    }
    pw[items.i].checked = true;
    this.setData({
      "payParams.code": items.code,
      "payWay": pw
    });
  },

  /**
   * 支付检查
   * @author darlang
   */
  toPay() {
    let self = this;
    let openid = wx.getStorageSync("openid") || '';
    let payCode = this.data.payParams.code || '';
    let payName = PAY_CODE.find( k => k.code === payCode).label;
    if (!payName) {
      showToast('请选择支付方式');
      return false;
    }

    if (!this.loginModal.check()) {
      showToast('请选择先登录');
      return false;
    }

    if (!openid && payCode === 'wxpay.wxa') {
      showToast('微信授权登录才能使用微信支付');
      return false;
    }

    wx.showLoading({title: '支付中...',mask: true});
    PayOrder(self.data.payParams.order,payCode,openid,'weeshop','wxa').then(res => {
      if (res.error_code === 0) {
        if (payCode === 'balance') {
          showToast('支付成功','success');
          self.paySuccess();
        }else if(payCode === 'wxpay.wxa') {
          if (!res.wxpay.prepay_id) {
            showToast('支付失败','error');
            return false;
          }
          wx.requestPayment({
            'timeStamp': res.wxpay.timestamp,
            'nonceStr': res.wxpay.nonce_str,
            'package': res.wxpay.packages,
            'signType': 'MD5',
            'paySign': res.wxpay.sign,
            success: () => {
              showToast('支付成功','success');
              self.paySuccess();
            },
            fail: () =>{
              showToast('支付取消','warning');
            }
          });
        }
      }else{
        showToast('支付错误','success');
      }
    }).catch(err => {
      if (parseInt(err.data.error_code) === 400 &&payCode === 'balance') {
        wx.showModal({
          title: '余额不足',
          content: '你的账户余额为 '+self.data.balanceInfo+ ' 元,余额不足,建议您使用微信支付.',
          showCancel: false,
          confirmText: '确定',
          confirmColor: '#9c27ff'
        });
      }else{
        showToast(err.data.error_desc,'error',800);
      }
    });
  },

  /**
   * 支付成功跳转
   * @author darlang
   */
  paySuccess() {
    setTimeout(() => {
      wx.redirectTo({
        url: this.data.payParams.order ? '/pages/member/order/detail/detail?id='+this.data.payParams.order : '/pages/member/order/list/list'
      });
    },900);
  },

  /**
   * 账户余额
   * @author darlang
   */
  getBalanceInfo() {
    wx.showLoading({title: '检查余额...',mask: true});
    GetBalanceTotal().then(res =>{
      this.setData({
        balanceInfo: res.amount
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
    this.getOrderInfo();
    this.getBalanceInfo();
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