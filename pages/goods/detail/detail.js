// detail.js
var app = getApp();
var util = require('../../../utils/util.js');
var WxParse = require('../../../libs/wxParse/wxParse.js');
// 太乱了，未修
// 已知bug：配件搭配混乱
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
    number: 1,
    comments: {
      total: 0,
      reviews: []
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
    this.getProductInfo();
    this.getCartCount();
    this.getGoodsComment();
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
    }).then(function (res) {
      if (res.error_code === 0) {
        let CI = res.product.goods_desc;
        res.product.goods_desc = CI.replace(new RegExp("\/images\/","gm"),util.shopUrl + "\/images\/");
        let specificationList = [];
        if (res.product.properties) {
          specificationList = res.product.properties.map(v => {
            v.checked = false;
            return v;
          });
        }

        let isLiked = true;
        if (res.product.is_liked != 1) {
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
      page: 1,
      per_page: 3,
      product: self.data.id
    }).then(function (res) {
      console.log('c',res)
      for (let i in res.reviews) {
        res.reviews[i].created_at = util.formatTime(res.reviews[i].created_at);
        res.reviews[i].updated_at = util.formatTime(res.reviews[i].updated_at);
      }
      self.setData({
        "comments.total": res.paged.total,
        "comments.reviews": res.reviews,
      });
    });
  },

  // 000
  getGoodsRelated() {
    let that = this;
    util.request(api.GoodsRelated, { id: that.data.id }).then(function (res) {
      if (res.errno === 0) {
        that.setData({
          relatedGoods: res.data.goodsList,
        });
      }
    });

  },

  // 000
  clickSkuValue(event) {
    let that = this;
    let specNameId = event.currentTarget.dataset.nameId;
    let specValueId = event.currentTarget.dataset.valueId;

    //TODO 性能优化，可在wx:for中添加index，可以直接获取点击的属性名和属性值，不用循环
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      if (_specificationList[i].id == specNameId) {
        for (let j = 0; j < _specificationList[i].attrs.length; j++) {
          if (_specificationList[i].attrs[j].id == specValueId) {
            //如果已经选中，则反选
            if (_specificationList[i].attrs[j].checked) {
              _specificationList[i].attrs[j].checked = false;
            } else {
              _specificationList[i].attrs[j].checked = true;
            }
          } else {
            _specificationList[i].attrs[j].checked = false;
          }
        }
      }
    }
    this.setData({
      'specificationList': _specificationList
    });
  },

  // 获取选中的规格信息
  getCheckedSpecValue() {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].attrs.length; j++) {
        if (_specificationList[i].attrs[j].checked) {
          _checkedObj.valueId = _specificationList[i].attrs[j].id;
          _checkedObj.valueText = _specificationList[i].attrs[j].attr_name;
        }
      }
      checkedValues.push(_checkedObj);
    }
    console.log('cv',checkedValues);

    return checkedValues;

  },

  // 判断规格是否选择完整
  isCheckedAllSpec() {
    return !this.getCheckedSpecValue().some(function (v) {
      console.log('完整',v);
      if (v.valueId == 0) {
        return true;
      }
    });
  },

  // 000
  getCheckedSpecKey() {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });

    return checkedValue.join('|');
  },

  // 000
  getCheckedProductItem(key) {
    return this.data.productList.filter(function (v) {
      if (v.goods_attr == key) {
        return true;
      } else {
        return false;
      }
    });
  },

  // 购物车更新
  getCartCount() {
    var self = this;
    util.request(util.apiUrl + 'ecapi.cart.get', 'POST').then(res => {
      let cartTotal = 0;
      if (res.goods_groups.length !== 0) {
        cartTotal = res.goods_groups[0].total_amount;
      }
      self.setData({
        cartGoodsCount: cartTotal
      });
      util.updateCartNum();
    });
  },

  // 收藏 - ok
  // ecapi.product.like
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

  // 加入购物车 - 乱
  addToCart() {
    var self = this;

    if (this.data.specificationList.length > 0 ) {


      //提示选择完整规格
      if (this.isCheckedAllSpec()  == false) {
        util.showToast('请选择规格', 'error');
        return false;
      }

      //根据选中的规格，判断是否有对应的sku信息
      let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
      if (checkedProduct.length <= 0) {
        //找不到对应的product信息，提示没有库存
        util.showToast('规格不存在', 'error');
        return false;
      }

      //验证库存
      if (checkedProduct.stock_number < this.data.number) {
        //找不到对应的product信息，提示没有库存
        util.showToast('商品售完', 'error');
        return false;
      }
      let property = checkedProduct[0].goods_attr;
      property = '[' + property.replace("|", ",") + ']';
      //添加到购物车
      util.request(util.apiUrl + 'ecapi.cart.add', "POST", { amount: this.data.number, product: this.data.goods.id, property: property })
        .then(function (res) {
          util.showToast('加入购物车成功', 'success')
          self.getCartCount();
        })
        .catch(err => {
          util.notLogin(err);
          console.log('r',err)
           if (err.error_code !== 10001) {
             util.showToast(err.error_desc, 'error')
           }
        });
    } else {
      //验证库存

      if (this.data.goods.good_stock < this.data.number) {
        //找不到对应的product信息，提示没有库存
        util.showToast('商品售完', 'error');
        return false;
      }

      //添加到购物车
      util.request(util.apiUrl + 'ecapi.cart.add', "POST", { amount: this.data.number, product: this.data.goods.id, property: "[]" })
        .then(function (res) {
          util.showToast('加入购物车成功', 'success')
          self.getCartCount();
        }).catch(err => {
          util.notLogin(err);
          if (err.error_code !== 10001) {
            util.showToast(err.error_desc, 'error')
          }
        });
    }
  },

  // 立即购买 - 不可用
  // ecapi.order.price
  buyNow() {
    console.log('this',this.data)
    util.showToast("暂不可用","error");
    return false;
    let order_product = [],
        cart_good_id = [],
        goods_info = [];
    //根据选中的规格，判断是否有对应的sku信息
    let checkedProduct = this.getCheckedProductItem(this.getCheckedSpecKey());
    if (checkedProduct.length <= 0) {
      //找不到对应的product信息，提示没有库存
      util.showToast('规格不存在', 'error');
      return false;
    }

    //验证库存
    if (checkedProduct.stock_number < this.data.number) {
      //找不到对应的product信息，提示没有库存
      util.showToast('商品售完', 'error');
      return false;
    }
    let property = checkedProduct[0].goods_attr;
    property = '[' + property.replace("|", ",") + ']';
    // 订单
    order_product.push(
      '{"goods_id":' + this.data.id + ',"property":' + property + ',"num":' + this.data.number + '}');
    // 商品 id
    cart_good_id.push(this.data.id);
    // 商品信息
    // let property = checkedGoods[i].property.replace(/[\r\n]/g,"");
    goods_info.push(
      '{"default_photo":"' + this.data.goods.default_photo.large
      + '","good_title":"' + this.data.goods.name
      + '","good_price":"' + this.data.goods.current_price
      + '","good_num":"'+ this.data.number
      + '","good_property":"'+ property +'"}'
      );
    wx.navigateTo({
      url: '../../shopping/checkout/checkout?order_product=' + '[' + order_product + ']' + '&cart_good_id=' + cart_good_id + '&goods_info=' + '[' + goods_info + ']'
    });
  },

  // 000
  cutNumber() {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },

  // 000
  addNumber() {
    this.setData({
      number: this.data.number + 1
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