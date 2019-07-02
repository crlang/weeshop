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

// checkout.js
import {PNT,setNavBarTitle,showToast,pushPagePath} from "../../../utils/utils";
import {GetConsigneeList,GetShippingVendorList,CheckOrderPirce,GetScoreTotal,CheckoutPreOrderByGoods} from '../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    preOrder: '',// 订单信息
    orderInfo: '',// 订单商品信息
    orderPriceInfo: '',// 订单金额信息
    consigneeInfo: '',// 收货人信息
    scoreInfo: '',// 积分
    checkoutParams: {
      "shop": 1,// 店铺ID
      "consignee": '',// 收货人ID
      "shipping": '',// 快递ID
      "coupon": '',// 优惠券ID
      "cashgift": '',// 红包ID
      "score": '', // 积分
      "order_product": '',// 商品id数组 [{"goods_id":xx,"property":[xx,xx],"num":x,"total_amount":x}]
      "property": '',// 用户选择的属性ID
      "product": '',// 商品ID
      "amount": '',// 数量
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    setNavBarTitle(PNT.order.checkout);
    this.loginModal = this.selectComponent("#login-modal");

    if (!opt.orderInfo || !opt.preOrder) {
      showToast('订单错误','error');
      return false;
    }

    this.setData({
      preOrder: JSON.parse(unescape(opt.preOrder)),
      orderInfo: JSON.parse(unescape(opt.orderInfo)),
      "checkoutParams.consignee": opt.consignee || '',
      'checkoutParams.order_product': unescape(opt.preOrder)
    });
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const consignee = this.data.checkoutParams.consignee || '';
    const pathData = [
      {type: 'consignee',path: '/pages/member/address/list/list?isSelect=true&consignee='+consignee}
    ];
    pushPagePath(e,pathData);
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.getConsignee();
      this.checkPushData();
      this.checkScoreInfo();
    }
  },

  /**
   * 检查数据
   * @author darlang
   */
  checkPushData() {
    let cs = wx.getStorageSync('cache_consignee') || '';
    if (cs) {
      this.setData({
        'checkoutParams.consignee': cs >= 0 ? cs : ''
      });
      wx.removeStorageSync('cache_consignee');
      this.getConsignee();
    }
    this.checkOrderPrice();
  },


  /**
   * 处理收货地址
   * @author darlang
   */
  getConsignee() {
    let consignee = this.data.checkoutParams.consignee || '';
    wx.showLoading({title: '检查收货地址...',mask: true});
    GetConsigneeList().then(res => {
      let consignees = res.consignees;
      if (consignees && consignees.length > 0) {
        if (consignee) {
          consignees = consignees.filter(k => k.id === Number(consignee));
          if (consignees.length === 0) {
            consignees = res.consignees;
          }
        }else{
          let c = consignees.filter(k => k.is_default);
          if (c && c.length > 0) {
            consignees = c;
            consignee = c[0].id;
          }
        }
        if (consignees && consignees.length > 0) {
          consignees = consignees[0];
          consignees.region = consignees.regions.map(k => k.name).join('');
        }
        consignee = consignees.id || '';
      }else{
        consignees = '';
        consignee = '';
      }
      this.setData({
        consigneeInfo: consignees || '',
        "checkoutParams.consignee": consignee
      });
      this.getExpress(true);
    });
  },

  /**
   * 智能匹配配送方式或选择
   * @author darlang
   * @param  {Boolean}  init 是否初始化
   */
  getExpress(init = false) {
    let preOrder = JSON.stringify(this.data.preOrder);
    if (!this.data.checkoutParams.consignee) {
      showToast('请填写收货地址');
      return false;
    }
    wx.showLoading({title: '检查配送方式...',mask: true});
    GetShippingVendorList(this.data.checkoutParams.consignee,preOrder).then(res => {
      if (!res.vendors) {
        showToast('该商品无配送方式');
        return false;
      }
      if (res.vendors.length === 1 || init === true) {
        res.vendors.sort((a,b) => a.fee - b.fee);
        this.setData({
          expressData: res.vendors[0],
          "checkoutParams.shipping": res.vendors[0].id
        });
        this.checkOrderPrice();
        return false;
      }
      this.setExpress(res.vendors);
    }).catch((err) => {
      console.log("配送方式获取 err：",err);
    });
  },

  /**
   * 设置配送方式
   * @author darlang
   */
  setExpress(data) {
    let exArr = data.map(k => k.name+'+￥'+k.fee);
    let self = this;
    wx.showActionSheet({
      itemList: exArr,
      success(res) {
        let i = res.tapIndex;
        self.setData({
          expressData: data[i],
          "checkoutParams.shipping": data[i].id
        });
        self.checkOrderPrice();
      },
      fail() {
        self.setData({
          expressData: '',
          "checkoutParams.shipping": ''
        });
        showToast('未选配送方式','warning');
      }
    });
  },

  /**
   * 订单金额检查
   * @author darlang
   */
  checkOrderPrice() {
    let params = this.data.checkoutParams;
    let totalGoods = 0;
    params.order_product = this.data.preOrder;

    for (let i = 0; i < params.order_product.length; i++) {
      let item = params.order_product[i];
      if(item.property && typeof item.property === 'string') {
        item.property = JSON.parse(item.property);
      }
      totalGoods += item.total_amount;
    }
    this.setData({
      totalGoods: totalGoods
    });
    params.order_product = JSON.stringify(params.order_product);
    params.is_exchange = 1;
    CheckOrderPirce(params.order_product,params.consignee,params.shipping,params.coupon,params.cashgift,params.score,params.shop,params.is_exchange).then(res => {
      this.setData({
        orderPriceInfo: res.order_price
      });
    }).catch(err => {
      if (err.data.error_code === 400) {
        this.setData({
          isExchangeFail: true
        });
      }
    });
  },

  /**
   * 获取用户可用积分
   * @author darlang
   */
  checkScoreInfo() {
    let oi = this.data.orderInfo;
    GetScoreTotal().then(res => {
      res.usable = 0;
      for (let i = 0; i < oi.length; i++) {
        res.usable += (oi[i].price*oi[i].total);
      }
      this.setData({
        scoreInfo: res
      });
    });
  },

  /**
   * 提交订单
   * @author darlang
   */
  submitCheckoutOrder() {
    let params = this.data.checkoutParams;
    const preOrder = this.data.preOrder;
    const scoreInfo = this.data.scoreInfo;
    if(scoreInfo.usable > scoreInfo.score) {
      showToast('积分不足','warning');
      this.setData({
        isExchangeFail: true
      });
      return false;
    }
    let checkoutFunc = '';
    params.exchange_score = 1;
    params.property = JSON.stringify(preOrder[0].property) || '[]';
    params.product = preOrder[0].goods_id;
    params.amount = preOrder[0].num;
    checkoutFunc = CheckoutPreOrderByGoods(params.product,params.property,params.amount,params);

    if (!params.consignee) {
      showToast('请选择收货地址');
      return false;
    }
    if (!params.shipping) {
      showToast('请选择配送方式');
      return false;
    }

    wx.showLoading({title: '正在提交...',mask: true});
    checkoutFunc.then(res => {
      // showToast('提交成功','success');
      setTimeout(() => {
        if (this.data.orderPriceInfo.total_price > 0) {
          wx.redirectTo({
            url: '/pages/shopping/payment/payment?orderId=' + res.order.id
          });
        }else{
          wx.redirectTo({
            url: '/pages/points/complete/complete?id=' + res.order.id
          });
        }
      },800);
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
    this.getConsignee();
    this.checkPushData();
    this.checkScoreInfo();
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
  }
});