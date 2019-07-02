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
import {GetConsigneeList,GetShippingVendorList,CheckOrderPirce,GetScoreTotal,CheckoutPreOrderByCart,CheckoutPreOrderByGoods} from '../../../utils/apis';
import {PROMOS_TYPE} from '../../../utils/status';

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
    },
    orderCheckoutParams: {
      "invoice_type": '',// 发票类型ID，如：公司、个人
      "invoice_content": '',// 发票内容ID，如：办公用品、礼品
      "invoice_title": '',// 发票抬头，如：xx科技有限公司
      "comment": '',// 留言
    },
    orderPriceParams: {// +checkoutParams
      "order_product": '',// 商品id数组 [{"goods_id":xx,"property":[xx,xx],"num":x,"total_amount":x}]
    },
    buyCheckoutParams: {// +checkoutParams+orderCheckoutParams
      "property": '',// 用户选择的属性ID
      "product": '',// 商品ID
      "amount": '',// 数量
    },
    cartCheckoutParams: {// +checkoutParams+orderCheckoutParams
      "cart_good_id": '',// 购物车商品id数组 [xx,xx]
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
      checkoutType: opt.type || '',
      preOrder: JSON.parse(unescape(opt.preOrder)),
      orderInfo: JSON.parse(unescape(opt.orderInfo)),
      "checkoutParams.consignee": opt.consignee || '',
      'orderPriceParams.order_product': unescape(opt.preOrder)
    });
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const totalPrice = this.data.orderPriceInfo.total_price || '';
    const cashgift = this.data.checkoutParams.cashgift || '';
    const consignee = this.data.checkoutParams.consignee || '';
    const pathData = [
      {type: 'cashgift',path: '/pages/member/cashgift/select/select?total='+ totalPrice + '&id='+cashgift},
      {type: 'consignee',path: '/pages/member/address/list/list?isSelect=true&consignee='+consignee},
      {type: 'invoice',path: '/pages/member/invoice/index/index'}
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
    let cg = wx.getStorageSync('cache_cashgift') || '';
    if (cg) {
      this.setData({
        'checkoutParams.cashgift': cg > 0 ? cg : ''
      });
      wx.removeStorageSync('cache_cashgift');
    }
    let ci = wx.getStorageSync('cache_invoice') || '';
    if (ci) {
      this.setData({
        'orderCheckoutParams.invoice_type': ci.invoice_type,
        'orderCheckoutParams.invoice_type_name': ci.invoice_type_name,
        'orderCheckoutParams.invoice_content': ci.invoice_content,
        'orderCheckoutParams.invoice_content_name': ci.invoice_content_name,
        'orderCheckoutParams.invoice_title': ci.invoice_title
      });
      wx.removeStorageSync('cache_invoice');
    }
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
    let params = {...this.data.checkoutParams,...this.data.orderPriceParams};
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
    CheckOrderPirce(params.order_product,params.consignee,params.shipping,params.coupon,params.cashgift,params.score,params.shop).then(res => {
      let promoPirce = 0;
      if (res.order_price && res.order_price.promos && res.order_price.promos.length > 0) {
        for (let i = 0; i < res.order_price.promos.length; i++) {
          let item = res.order_price.promos[i];
          item.label = PROMOS_TYPE.find(k => k.code === item.promo).label || '其他优惠';
          if(item.promo === 'cashgift') {
            this.setData({
              cashgiftData: item
            });
          }
          promoPirce += parseFloat(item.price);
        }
      }
      res.order_price.discount_price = (parseFloat(res.order_price.discount_price) + promoPirce).toFixed(2);
      this.setData({
        orderPriceInfo: res.order_price
      });
    });
  },

  /**
   * 获取用户可用积分
   * @author darlang
   */
  checkScoreInfo() {
    GetScoreTotal().then(res => {
      res.usable = 0;
      for (let i = 0; i < this.data.orderInfo.length; i++) {
        res.usable += this.data.orderInfo[i].score;
      }
      this.setData({
        scoreInfo: res
      });
    });
  },

  /**
   * 绑定输入
   * @author darlang
   */
  bindInput(e) {
    const type = e.currentTarget.dataset.type;
    const v = e.detail.value;
    if (!type) {
      return false;
    }
    if (type === 'score') {
      this.setData({
        "checkoutParams.score": v
      });
    }

    if (type === 'comment') {
      this.setData({
        "orderCheckoutParams.comment": v
      });
    }
  },

  /**
   * 检查积分
   * @author darlang
   */
  checkScoreValue() {
    let orderInfo = this.data.orderInfo;
    let scoreInfo = this.data.scoreInfo;
    let v = this.data.checkoutParams.score;
    let vREG = new RegExp(/^\d+$/);
    let maxUseScore = 0;
    if (!vREG.test(v)) {
      this.setData({
        "checkoutParams.score": ''
      });
      showToast('不使用积分','warning');
      return false;
    }
    for (let i = 0; i < orderInfo.length; i++) {
      maxUseScore += parseInt(orderInfo[i].score);
    }
    if (v >= scoreInfo.score) {
      if (scoreInfo.score >= maxUseScore) {
        v = maxUseScore;
      }else{
        v = scoreInfo.score;
      }
    }else{
      if (v > maxUseScore) {
        v = maxUseScore;
      }else if (v <= 0) {
        v = '';
      }
    }
    this.setData({
      "checkoutParams.score": v
    });
    this.checkOrderPrice();
  },

  /**
   * 提交订单
   * @author darlang
   */
  submitCheckoutOrder() {
    let params = {...this.data.checkoutParams,...this.data.orderCheckoutParams};
    const preOrder = this.data.preOrder;
    let checkoutFunc = '';
    if (this.data.checkoutType === 'cart') {
      let cartCP = this.data.cartCheckoutParams;
      cartCP.cart_good_id = JSON.stringify(preOrder.map(k => k.id));
      checkoutFunc = CheckoutPreOrderByCart(cartCP.cart_good_id,params);
    }else{
      let buyCP = this.data.buyCheckoutParams;
      buyCP.property = JSON.stringify(preOrder[0].property) || '[]';
      buyCP.product = preOrder[0].goods_id;
      buyCP.amount = preOrder[0].num;
      checkoutFunc = CheckoutPreOrderByGoods(buyCP.product,buyCP.property,buyCP.amount,params);
    }

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
      showToast('提交成功','success');
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/shopping/payment/payment?orderId=' + res.order.id
        });
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