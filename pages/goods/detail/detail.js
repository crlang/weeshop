// detail.js
let app = getApp();
import util from '../../../utils/util.js';
import WxParse from '../../../libs/wxParse/wxParse.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    goods: {},
    gallery: [],
    specificationList: [],
    productList: [],
    relatedGoods: [],
    cartGoodsCount: 0,
    userHasCollect: false,
    checkAddress: true,
    number: 1,
    comments: {
      total: 0,
      reviews: []
    },
    paged: {
      page: 1,
      size: 10
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.goodsM.detail
    });
    this.setData({
      id: parseInt(options.id)
    });
  },

  // 产品信息
  // ecapi.product.get
  getProductInfo() {
    wx.showLoading({
      title: '加载中...',
    });
    let self = this;
    util.request(util.apiUrl + 'ecapi.product.get', 'POST', {
      product: self.data.id
    }).then(res => {
      if (res.product.good_stock === 0) {
        util.showToast('商品已经售完', 'error',1800);
      }
      if (res.product.discount !== null) {
        res.product.discount.end_at = util.formatTime(res.product.discount.end_at);
      }
      if (res.error_code === 0) {
        let CI = res.product.goods_desc;
        res.product.goods_desc = CI.replace(new RegExp('/images/','gm'),util.shopUrl + '/images/');
        let specificationList = [];
        if (res.product.properties) {
          specificationList = res.product.properties.map(v => {
            v.checked = false;
            return v;
          });
        }
        let isLiked = true;
        if (res.product.is_liked !== 1) {
          isLiked = false;
        }
        self.setData({
          goods: res.product,
          gallery: res.product.photos,
          specificationList: specificationList,
          productList: res.product.stock,
          userHasCollect: isLiked,
        });
        WxParse.wxParse('goodsDetail', 'html', res.product.goods_desc, self);
      }
      wx.hideLoading();
    });
  },

  // 商品评论
  // ecapi.review.product.list
  getGoodsComment() {
    let self = this;
    util.request(util.apiUrl + 'ecapi.review.product.list', 'POST', {
      page: self.data.paged.page,
      per_page: self.data.paged.size,
      product: self.data.id
    }).then(res => {
      for (let i in res.reviews) {
        if(res.reviews.hasOwnProperty(i)) {
          res.reviews[i].created_at = util.formatTime(res.reviews[i].created_at);
          res.reviews[i].updated_at = util.formatTime(res.reviews[i].updated_at);
        }
      }
      self.setData({
        'comments.total': res.paged.total,
        'comments.reviews': res.reviews,
      });
    });
  },

  // 相关产品
  // ecapi.product.accessory.lis
  getGoodsRelated() {
    let self = this;
    util.request(util.apiUrl + 'ecapi.product.accessory.list',"POST", {
      product: self.data.id,
      page: self.data.paged.page,
      per_page: self.data.paged.size
    }).then(res => {
      self.setData({
        relatedGoods: res.products,
      });
    });

  },

  // 规格列表
  clickSkuValue(event) {
    let self = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;
    let _sl = self.data.specificationList;
    // 绝望的嵌套循环，待优化
    for (let i in _sl) {
      if (_sl[i].id === specNameId) {
        for (let j in _sl[i].attrs) {
          if (_sl[i].attrs[j].id === specValueId) {
            if(_sl[i].attrs[j].checked) {
              _sl[i].attrs[j].checked = false;
            }else{
              _sl[i].attrs[j].checked = true;
            }
          }else{
            _sl[i].attrs[j].checked = false;
          }
        }
      }
    }
    self.setData({
      'specificationList': _sl
    });
  },

  // 获取选中的规格信息
  getCheckedSpecValue() {
    let checkedValues = [];
    let _sl = this.data.specificationList;
    for (let i = 0; i < _sl.length; i++) {
      let _checkedObj = {
        nameId: _sl[i].id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _sl[i].attrs.length; j++) {
        if (_sl[i].attrs[j].checked) {
          _checkedObj.valueId = _sl[i].attrs[j].id;
          _checkedObj.valueText = _sl[i].attrs[j].attr_name;
        }
      }
      checkedValues.push(_checkedObj);
    }
    return checkedValues;
  },

  // 判断规格是否选择完整
  isCheckedAllSpec() {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId === 0) {
        return true;
      }
    });
  },

  // 当前选择的规格
  getCheckedSpecKey() {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });
    return checkedValue.join('|');
  },

  // 规格是否存在
  getCheckedProductItem(key) {
    return this.data.productList.filter(function (v) {
      if (v.goods_attr === key) {
        return true;
      } else {
        return false;
      }
    });
  },

  // 规格名称
  getCheckedSpecName() {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueText;
    });
    return checkedValue.join(',');
  },

  // 购物车更新
  // ecapi.cart.get
  getCartCount() {
    let self = this;
    util.request(util.apiUrl + 'ecapi.cart.get', 'POST').then(res => {
      let cartTotal = 0;
      if (res.goods_groups.length !== 0) {
        cartTotal = res.goods_groups[0].total_amount;
      }
      self.setData({
        cartGoodsCount: cartTotal
      });
      util.updateCartNum();
    }).catch(err => {
      util.notLogin(err);
    });
  },

  // 收藏
  // ecapi.product.like
  // 取消收藏
  // ecapi.product.unlike
  goodsCollect() {
    let self = this;
    let collectUrl = self.data.userHasCollect === false ? 'ecapi.product.like' : 'ecapi.product.unlike';
    util.request(util.apiUrl + collectUrl, 'POST', {
      product: self.data.id
    }).then(res => {
      self.setData({
        userHasCollect: res.is_liked
      });
    });
  },

  // 加入购物车
  // ecapi.cart.add
  addToCart() {
    let self = this;
    // 验证库存
    if (self.data.goods.good_stock === 0) {
      util.showToast('商品已经售完', 'error',900);
      return false;
    }else{
      if (self.data.goods.good_stock < self.data.number) {
        util.showToast('购买数量大于库存', 'error');
        return false;
      }
    }

    if (!self.checkAddressTip()) {
      return false;
    }

    // 有规格，先选规格
    if (this.data.specificationList.length > 0 ) {
      // 规格未选择
      if (this.isCheckedAllSpec()  === false) {
        util.showToast('请选择规格', 'error');
        return false;
      }
      // 规格错误
      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (checkedProduct.length <= 0) {
        util.showToast('规格不存在', 'error');
        return false;
      }
      //添加到购物车
      let property = checkedProduct[0].goods_attr;
      property = '[' + property.replace('|', ',') + ']';
      util.request(util.apiUrl + 'ecapi.cart.add', 'POST', {
        amount: this.data.number,
        product: this.data.goods.id,
        property: property
      }).then(res => {
        util.showToast('加入购物车成功', 'success');
        self.getCartCount();
      }).catch(err => {
        util.notLogin(err);
        if (err.error_code !== 10001) {
          util.showToast(err.error_desc, 'error');
        }
      });
    // 没规格，直接选
    } else {
      //添加到购物车
      util.request(util.apiUrl + 'ecapi.cart.add', 'POST', {
        amount: this.data.number,
        product: this.data.goods.id,
        property: '[]'
      }).then(res => {
        util.showToast('加入购物车成功', 'success');
        self.getCartCount();
      }).catch(err => {
        util.notLogin(err);
        if (err.error_code !== 10001) {
          util.showToast(err.error_desc, 'error');
        }
      });
    }
  },

  // 检查地址
  // ecapi.consignee.list
  checkAddress() {
    let cA = true;
    util.request(util.apiUrl + 'ecapi.consignee.list', 'POST').then(res => {
      if (res.consignees.length === 0) {
        cA = false;
      }
      this.setData({
        checkAddress: cA
      });
    }).catch(err => {
      //...
    });
  },

  checkAddressTip() {
    this.checkAddress();
    if (this.data.checkAddress) {
      return true;
    }else{
      wx.showModal({
        title: '温馨提示',
        content: '由于您尚未添加地址，请先添加地址.',
        // showCancel: false,
        success: function (cif) {
          if(cif.confirm) {
            wx.navigateTo({
              url: '../../member/address/editor/editor?type=add'
            });
          }else if(cif.cancel) {
            util.showToast('尚未添加地址','error',600);
            return false;
          }
        }
      });
      return false;
    }
  },

  // 立即购买
  // ecapi.order.price
  buyNow() {
    let order_product = [],
      cart_good_id = [],
      goods_info = [],
      self = this;
    // 验证库存
    if (self.data.goods.good_stock === 0) {
      util.showToast('商品已经售完', 'error',900);
      return false;
    }else{
      if (self.data.goods.good_stock < self.data.number) {
        util.showToast('购买数大于库存', 'error');
        return false;
      }
    }

    if (!self.checkAddressTip()) {
      return false;
    }

    let property = null,propertyName = null;
    // 有规格，先选规格
    if (this.data.specificationList.length > 0 ) {
      // 规格未选择
      if (this.isCheckedAllSpec()  === false) {
        util.showToast('请选择规格', 'error');
        return false;
      }
      // 规格错误
      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (checkedProduct.length <= 0) {
        util.showToast('规格不存在', 'error');
        return false;
      }
      propertyName = this.getCheckedSpecName();
      property = checkedProduct[0].goods_attr;
      property = '[' + property.replace('|', ',') + ']';
    }
    // 订单
    order_product.push(
      '{"goods_id":' + this.data.id + ',"property":' + property + ',"num":' + this.data.number + '}');
    // 商品 id
    cart_good_id.push(this.data.id);
    // 商品信息
    goods_info.push(
      '{"default_photo":"' + this.data.goods.default_photo.large
      + '","good_title":"' + this.data.goods.name
      + '","good_price":"' + this.data.goods.current_price
      + '","good_num":"'+ this.data.number
      + '","good_property":"'+ propertyName +'"}'
    );
    let uri = encodeURI('../../shopping/checkout/checkout?encode=true&order_product=' + '[' + order_product + ']' + '&cart_good_id=' + cart_good_id + '&goods_info=' +'[' + goods_info + ']');
    wx.navigateTo({
      url: uri
    });
  },

  // 减少数量
  cutNumber() {
    this.setData({
      number: this.data.number-1 > 1 ? this.data.number-1 : 1
    });
  },

  // 增加数量
  addNumber() {
    this.setData({
      number: this.data.number+1
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
    this.checkAddress();
    this.getProductInfo();
    this.getCartCount();
    this.getGoodsComment();
    this.getGoodsRelated();
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.goods.name,
      path: '/pages/goods/detail/detail',
      success(e) {
        // 需要在页面onLoad()事件中实现接口
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail(e) {
      },
      complete() { }
    }
  }
});