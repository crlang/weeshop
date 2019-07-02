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
// cart.js
import utils from '../../../utils/utils.js';
import {PNT,setNavBarTitle,showToast,pushPagePath,formatTime} from "../../../utils/utils";
import {DeleteCartGoods,GetCartGoods,UpdateCartGoods} from "../../../utils/apis";
import {CheckCartTotal} from "../../../utils/publics";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartGoodsLst: '',
    cartTotal: {
      "count": 0,
      "amount": 0.00
    },
    cartSeleStatus: '',
    cartEditStatus: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    setNavBarTitle(PNT.goods.cart);
    this.loginModal = this.selectComponent("#login-modal");
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const items = e.currentTarget.dataset;
    const pathData = [
      {type: 'goods',path: '/pages/goods/detail/detail?id='+items.id}
    ];
    pushPagePath(e,pathData);
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.getCartList();
      CheckCartTotal();
    }
  },

  /**
   * 移出购物车
   * @author darlang
   */
  delCartGoods(e) {
    let self = this;
    let i = e.target.dataset.i;
    let cartGoodsLst = this.data.cartGoodsLst;

    wx.showModal({
      title: '温馨提示',
      content: '是否将选中商品移出购物车？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({title: '移除中...',mask: true});
          DeleteCartGoods(cartGoodsLst[i].id).then(() => {
            utils.showToast('成功', 'success');
            cartGoodsLst.splice(i,1);
            self.setData({
              cartGoodsLst: cartGoodsLst
            });
            CheckCartTotal();
          });
        }
      }
    });
  },

  /**
   * 获取购物车商品列表
   * @author darlang
   */
  getCartList() {
    wx.showLoading({title: '加载中...',mask: true});
    GetCartGoods().then(res => {
      if (res.goods_groups && res.goods_groups.length > 0) {
        let cartGoodsList = res.goods_groups[0].goods;
        this.setData({
          cartGoodsLst: cartGoodsList
        });
        this.checkCartSeleState(cartGoodsList);
      }
      this.checkedSeleGoods();
    });
    CheckCartTotal();
  },

  /**
   * 选择检查
   * @author darlang
   * @param  {Array}   data  购物车商品
   * @return {String}        ''、some、all
   */
  checkCartSeleState(data) {
    let seleState = '';
    let cartGoodsLst = data;
    seleState = cartGoodsLst.every(k => k.checked);
    if (!seleState) {
      seleState = cartGoodsLst.some(k => k.checked);
      if (seleState) {
        seleState = 'some';
      }else{
        seleState = '';
      }
    }else{
      seleState = 'all';
    }
    this.setData({
      cartSeleStatus: seleState
    });
    return seleState;
  },

  /**
   * 统计已选价格、数量
   * @author darlang
   * @return {Object}   返回选择数量及总额
   */
  checkedSeleGoods() {
    let cartGoodsAmount = 0;
    let cartGoodsCount = 0;
    let cartGoodsLst = this.data.cartGoodsLst;
    if (cartGoodsLst && cartGoodsLst.length > 0) {
      for (let i = 0; i < cartGoodsLst.length; i++) {
        if (cartGoodsLst[i].checked) {
          cartGoodsAmount = Number(cartGoodsAmount + (cartGoodsLst[i].price * cartGoodsLst[i].amount));
          cartGoodsCount += parseInt(cartGoodsLst[i].amount);
        }
      }
    }
    if (isNaN(cartGoodsAmount)) {
      cartGoodsAmount = 0;
    }
    if (isNaN(cartGoodsCount)) {
      cartGoodsCount = 0;
    }
    this.setData({
      'cartTotal.count': cartGoodsCount,
      'cartTotal.amount': cartGoodsAmount.toFixed(2)
    });
    return {amount: cartGoodsAmount,count: cartGoodsCount};
  },

  /**
   * 选择当前项
   * @author darlang
   */
  seleGoods(e) {
    let i = e.currentTarget.dataset.i;
    let g = this.data.cartGoodsLst;
    if (g[i]) {
      if (g[i].checked) {
        g[i].checked = false;
      }else{
        g[i].checked = true;
      }
    }
    this.setData({
      cartGoodsLst: g
    });
    this.checkCartSeleState(g);
    this.checkedSeleGoods();
  },

  /**
   * 全选/取消全选
   * @author darlang
   */
  seleAllGoods() {
    let cartGoodsLst = this.data.cartGoodsLst;
    if (cartGoodsLst && cartGoodsLst.length) {
      if (cartGoodsLst.every(k => k.checked)) {
        cartGoodsLst = cartGoodsLst.map((k) => {
          k.checked = false;
          return k;
        });
      }else{
        cartGoodsLst = cartGoodsLst.map((k) => {
          k.checked = true;
          return k;
        });
      }

    }
    this.setData({
      cartGoodsLst: cartGoodsLst
    });
    this.checkCartSeleState(cartGoodsLst);
    this.checkedSeleGoods();
  },

  /**
   * 修改购物车商品数量
   * @author darlang
   */
  changeCartGoodsAmount(e) {
    const g = this.data.cartGoodsLst;
    const items = e.currentTarget.dataset;
    const type = items.type;
    const i = items.i;
    const stock = g[i].attr_stock;
    let num = parseInt(items.num) || '1';

    if (type === 'add') {
      num++;
    }
    if (type === 'cut') {
      num--;
    }
    if (type === 'input') {
      num = e.detail.value;
    }
    if (num >= stock && stock >= 1) {
      num = stock;
    }else if(num <= 1) {
      num = 1;
    }
    num = stock === 0 ? 0 : num;
    g[i].amount = num;

    this.updateCartGoods(g[i].id,num,g);
  },

  /**
   * 更新购物车商品
   * @author darlang
   * @param  {Number}   goodsId   商品id
   * @param  {Number}   amount 数量
   */
  updateCartGoods(goodsId, amount,g) {
    UpdateCartGoods(goodsId,amount).then((res) => {
      CheckCartTotal();
      this.setData({
        cartGoodsLst: g
      });
    });
  },

  /**
   * 提交前检查数量，防止超出库存
   * @author darlang
   * @param  {Array}   g 商品列表
   */
  checkSeleItemStock(g) {
    if (g && g.length > 0) {
      for (let i = 0; i < g.length; i++) {
        if (g[i].checked) {
          g[i].amount = g[i].amount >= g[i].attr_stock ? g[i].attr_stock : g[i].amount;
        }
      }
    }

    return g;
  },


  /**
   * 提交检查订单
   * @author darlang
   */
  checkoutGoods() {
    let self = this;
    const g = this.checkSeleItemStock(this.data.cartGoodsLst);
    const checkedGoods = g.filter(k => k.checked);
    if (!checkedGoods || checkedGoods.length === 0) {
      utils.showToast('未选择商品','warning');
      return false;
    }
    let preOrder = [];
    let orderInfo = [];
    checkedGoods.map(k => {
      let attrs = k.attrs.split(',');
      let props = k.product.properties;
      let attrsInfo = [];

      preOrder.push({
        id: k.id,
        "goods_id": k.goods_id,
        "property": k.attrs.split(),
        "num": k.amount,
        "total_amount": k.amount
      });

      attrsInfo = self.checkGoodsAttrs(attrs,props);

      orderInfo.push({
        "name": k.product.name,
        "id": k.goods_id,
        "price": k.price,
        "total": k.amount,
        "thumb": k.product.default_photo.large || '/images/default_image.png',
        "score": k.product.score || 0,
        "attrs": attrsInfo
      });
    });
    orderInfo = escape(JSON.stringify(orderInfo));
    preOrder = escape(JSON.stringify(preOrder));
    wx.navigateTo({
      url: '/pages/shopping/checkout/checkout?type=cart&preOrder=' + preOrder + '&orderInfo=' +orderInfo
    });
  },

  /**
   * 对齐选择商品规格
   * @author darlang
   * @param  {Array}   attrs 属性
   * @param  {Array}   props 规格
   * @return {Array}         返回选择的规格属性
   */
  checkGoodsAttrs(attrs,props) {
    // console.time();
    let attrsInfo = [];
    if (attrs && attrs.length > 0) {
      for (let i = 0; i < props.length; i++) {
        if (props[i].attrs && props[i].attrs.length > 0) {
          for (let j = 0; j < props[i].attrs.length; j++) {
            if (attrs.includes((props[i].attrs[j].id.toString()))) {
              props[i].attrs[j].attr_name = props[i].name+':'+props[i].attrs[j].attr_name;
              attrsInfo.push(props[i].attrs[j]);
            }
          }
        }
      }
      attrsInfo = attrsInfo.map(k => {
        return {
          name: k.attr_name,
          price: k.attr_price,
          id: k.id
        };
      });
      attrsInfo.sort((a,b) => a.id - b.id);
    }
    // console.timeEnd();
    return attrsInfo;
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