// checkout.js
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
    buyNow: false,
    score: null,
    scoreInfo: '',
    maxScore: 0,
    cashgift: {id:null,value:0},
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
    if (options.encode) {
      options.order_product = decodeURI(options.order_product);
      options.goods_info = decodeURI(options.goods_info);
      this.setData({
        buyNow: true
      });
    }
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
        if (newConsignee === null) {
          if (res.consignees[i].is_default) {
            defaultConsignees = res.consignees[i];
          }
        }else{
          if (res.consignees[i].id === newConsignee) {
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
        if (res.data !== 'undefined') {
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
        fail: function(fai) {
          util.showToast('取消选择','error');
        }
      });
    }).catch(err => {
      util.showToast(err.data.error_desc);
    });
  },

  // 选择红包
  // ecapi.cashgift.available
  bindCashgift() {
    let self = this, flPrice = parseFloat(self.data.orderPrice.total_price);
    util.request(util.apiUrl + "ecapi.cashgift.available","POST",{
      total_price: flPrice,
      page: 1,
      per_page: 15
    }).then(res => {
      let tpArrs = [],
        tpi = '';
      for (let i in res.cashgifts) {
        tpArrs.push(res.cashgifts[i].name + '( 满 ' + res.cashgifts[i].condition +' 立减 ￥: ' + res.cashgifts[i].value + ')');
      }

      wx.showActionSheet({
        itemList: tpArrs,
        success: function(sASres) {
          tpi = sASres.tapIndex;
          self.setData({
            cashgift: {
              id: res.cashgifts[tpi].id,
              value: res.cashgifts[tpi].value
            }
          });
          self.getOrderBuylist();
        },
        fail: function(fai) {
          util.showToast('取消选择','error');
        }
      });
    }).catch(err => {
    });
  },

  // 获取用户可用积分
  // ecapi.score.get
  getScoreInfo() {
    util.request(util.apiUrl + 'ecapi.score.get', 'POST').then(res => {
      this.setData({
        scoreInfo: res
      });
    });
  },

  // 获取订单最大积分
  // ecapi.product.get
  getMaxScore(){
    let self = this;
    let newOP = JSON.parse(this.data.order_product);
    for (let i = 0; i < newOP.length; i++) {
      util.request(util.apiUrl + 'ecapi.product.get', 'POST',{
        product: newOP[i].goods_id
      }).then(res => {
        let od = parseInt(res.product.score);
        let oldod = parseInt(this.data.maxScore);
        self.setData({
          maxScore: oldod + od
        });
      });
    }
  },

  // 输入积分
  getInputScore(e) {
    let gis = e.detail.value;
    let gisREG = /^[0-9]*$/;
    let cc = gisREG.test(gis);
    let maxScore = this.data.maxScore;
    let userScore = this.data.scoreInfo.score;
    if (!cc) {
      return gis = '';
    }else {
      if (userScore > maxScore) {
        if(gis > maxScore) {
          return gis = maxScore;
        }
      }else {
        if(gis > userScore) {
          return gis = userScore;
        }
      }
    }
  },

  // 提交积分
  getInputScoreNum(e) {
    this.setData({
      score: e.detail.value
    });
    this.getOrderBuylist();
  },

  // 订单购买列表
  // ecapi.order.price
  getOrderBuylist() {
    let self = this;
    util.request(util.apiUrl + 'ecapi.order.price', 'POST',{
      consignee: self.data.consignee,
      order_product: self.data.order_product,
      shipping: self.data.shipping,
      cashgift: self.data.cashgift.id,
      score: self.data.score,
      comment: self.data.comment
    }).then(res => {
      self.setData({
        orderPrice: res.order_price
      });
    }).catch(err => {
      util.showToast(err.data.error_desc);
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
    let self = this,paymentUrl=null,propertyC = null,propertyN = null;
    if (self.data.shipping === '') {
      util.showToast('配送方式不能为空！','none');
      return false;
    }
    let checkedValue = '';
    if (this.data.orderFormat[0].property !== null) {
      checkedValue = this.data.orderFormat[0].property.toString();
    }

    if (self.data.buyNow) {
    // product: 74, property: "[245]", amount: 1, consignee: 11, shipping:
      util.request(util.apiUrl + 'ecapi.product.purchase', 'POST',{
        property: '[' + checkedValue + ']',
        consignee: self.data.consignee,
        shipping: self.data.shipping,
        comment: self.data.comment,
        cashgift: self.data.cashgift.id,
        score: self.data.score,
        product: self.data.orderFormat[0].goods_id,
        amount: self.data.orderFormat[0].num,
        invoice_content: self.data.invoice_content,
        invoice_title: self.data.invoice_title,
        invoice_type: self.data.invoice_type,
      }).then(res => {
        util.showToast('下单成功,跳转付款中...','none',600);
        setTimeout(function() {
          wx.navigateTo({
            url: '../payment/payment?order=' + res.order.id
          });
        },800);
      }).catch(err => {
        util.showToast(err.data.error_desc,'none',900);
        util.notLogin(err);
      });
    }else{
      util.request(util.apiUrl + 'ecapi.cart.checkout', 'POST',{
        cart_good_id: '[' + self.data.cart_good_id + ']',
        consignee: self.data.consignee,
        shipping: self.data.shipping,
        comment: self.data.comment,
        cashgift: self.data.cashgift.id,
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
        util.showToast(err.data.error_desc,'none',900);
        util.notLogin(err);
      });
    }

    // self.getOrderBuylist();
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
    this.getScoreInfo();
    this.getMaxScore();
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