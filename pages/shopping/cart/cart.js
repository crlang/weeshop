// cart.js
import util from '../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    requestLoading: true,
    cartGoods: [],
    cartTotal: {
      "checkedGoodsCount": 0,
      "checkedGoodsAmount": 0.00
    },
    checkedAllStatus: false,
    editCartList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.cart
    });
  },

  // 删除商品
  // ecapi.cart.delete
  onDeleteGoods(event) {
    let itemIndex = event.target.dataset.itemIndex,
        goods = this.data.cartGoods[itemIndex],
        self = this;
    wx.showModal({
      title: '提示',
      content: '是否要删除选择中商品？',
      success: function (res) {
        if (res.confirm) {
          util.request(util.apiUrl + 'ecapi.cart.delete', 'POST', {
            good: goods.id
          }).then(res => {
            util.showToast('商品已删除', 'success');
            self.getCartList();
            util.updateCartNum();
          })
        }
      }
    })
  },

  // 获取购物车列表
  // ecapi.cart.get
  getCartList: function () {
    util.request(util.apiUrl + 'ecapi.cart.get', 'POST').then(res => {
      if (res.goods_groups.length >= 1) {
        let cartGoodsInfo = res.goods_groups[0];
        let goodsList = cartGoodsInfo.goods.map(item => {
          item.checked = true;
          return item;
        });
        this.setData({
          cartGoods: goodsList,
          cartTotal: {
            checkedGoodsCount: cartGoodsInfo.total_amount,
            checkedGoodsAmount: cartGoodsInfo.total_price,
          }
        });
      }else{
        this.setData({
          cartGoods: []
        });
      }
      this.setData({
        checkedAllStatus: this.isCheckedAll(),
        requestLoading: false
      });
    }).catch(err => {
      util.notLogin(err);
    });
    util.updateCartNum();
  },

  // 选择检查
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },

  // 检查数量
  getCheckedGoodsCount: function () {
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.amount;
      }
    });
    return checkedGoodsCount;
  },

  // 检查价格
  getCheckedGoodsAmount: function () {
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.price * v.amount;
      }
    });
    return checkedGoodsCount;
  },

  // 检查当前项
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex,
        self = this,
        tmpCartData = self.data.cartGoods.map(function (element, index, array) {
      if (index == itemIndex) {
        element.checked = !element.checked;
      }
      return element;
    });

    self.setData({
      cartGoods: tmpCartData,
      checkedAllStatus: self.isCheckedAll(),
      'cartTotal.checkedGoodsCount': self.getCheckedGoodsCount(),
      'cartTotal.checkedGoodsAmount': self.getCheckedGoodsAmount()
    });
  },

  // 检查全部项
  checkedAll: function () {
    let self = this;
        isCheckedAll = self.isCheckedAll();
        tmpCartData = self.data.cartGoods.map(function (element, index, array) {
          element.checked = !isCheckedAll;
          return element;
        });

    self.setData({
      cartGoods: tmpCartData,
      checkedAllStatus: !isCheckedAll,
      'cartTotal.checkedGoodsCount': self.getCheckedGoodsCount(),
      'cartTotal.checkedGoodsAmount': self.getCheckedGoodsAmount()
    });
  },

  // 更新购物车
  // ecapi.cart.update
  updateNumber(good, amount) {
    let self = this;
    util.request(util.apiUrl + 'ecapi.cart.update', 'POST', {
      amount: amount,
      good: good
    }).then((res) => {
      if (res.error_code === 0) {
        self.getCartList();
        util.updateCartNum();
      }
    });
  },

  // 数量增减
  cutNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex,
        cartItem = this.data.cartGoods[itemIndex],
        amount = (cartItem.amount - 1 > 1) ? cartItem.amount - 1 : 1;
        cartItem.amount = amount;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateNumber(cartItem.id, amount);
  },

  // 数量增减
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let amount = cartItem.amount + 1;
    cartItem.amount = amount;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateNumber(cartItem.id, amount);
  },

  // 提交检查订单
  checkoutOrder: function () {
    //获取已选择的商品
    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
    if (checkedGoods.length <= 0) {
      return false;
    }
    let order_product = [],
        cart_good_id = [],
        goods_info = [];
    for(let i in checkedGoods) {
      // 订单信息
      order_product.push(
        '{"goods_id":' + checkedGoods[i].goods_id + ',"property":[' + checkedGoods[i].attrs + '],"num":' + checkedGoods[i].amount + '}');
      // 商品 id
      cart_good_id.push(checkedGoods[i].id);
      // 商品信息
      let property = checkedGoods[i].property.replace(/[\r\n]/g,"");
      goods_info.push(
        '{"default_photo":"' + checkedGoods[i].product.default_photo.large
        + '","good_title":"' + checkedGoods[i].product.name
        + '","good_price":"' + checkedGoods[i].product.current_price
        + '","good_num":"'+ checkedGoods[i].amount
        + '","good_property":"'+ property +'"}'
        );
    }
    wx.navigateTo({
      url: '../checkout/checkout?order_product=' + '[' + order_product + ']' + '&cart_good_id=' + cart_good_id + '&goods_info=' + '[' + goods_info + ']'
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
    this.getCartList();
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