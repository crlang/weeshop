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

// detail.js
import {PNT,setNavBarTitle,showToast,shopUrl,formatLeftTime,getCurrentPageUrl,pushPagePath,formatTime} from "../../../utils/utils";
import {ChangeFavoriteStatus,GetGoodsDetail,GetCartGoods,GetGoodsRelate,GetCommentList,GetConsigneeList,addGoodsToCart} from '../../../utils/apis';
import {CheckCartTotal} from "../../../utils/publics";
import WxParse from "../../../libs/wxParse/wxParse.js";


Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    goods: {},// 商品信息
    propertyPopState: false,// 规格弹窗
    curProperty: '',// 当前选中的规格
    curGoodsPrice: '',
    curGoodsStock: 0,
    curStockState: false,// 规格是否通过
    curGoodsNum: 1,// 当前商品购买数量
    cartGoodsSum: 0,// 购物车数量
    isLiked: false,// 是否收藏
    goodsAccLst: '',// 商品关联附件
    consignee: '',// 收货地址
    commentsTotal: 0,
    commentsPreview: '',//
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(opt) {
    setNavBarTitle(PNT.goods.detail);
    this.loginModal = this.selectComponent("#login-modal");
    this.setData({
      id: parseInt(opt.id)
    });
    this.getCartSum();
    this.getGoodsAccLst();
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.getCartSum();
      this.getProductInfo();
      this.getConsignees();
    }
  },

  /**
   * 获取商品
   * @author darlang
   */
  getProductInfo() {
    let self = this;
    wx.showLoading({title: '加载中...',mask: true});
    GetGoodsDetail(this.data.id).then(res => {
      let rp = res.product;
      let curStockState = true;
      if (rp.good_stock === 0) {
        showToast("商品已经售完", "error", 1800);
        curStockState = false;
      }
      if (rp.discount !== null) {
        this.data.goodsDiscountTime = '0天0时0分0秒';
        self.checkGoodsDiscountTime(rp.discount.end_at);
      }
      if (res.error_code === 0) {
        // 默认当前价格
        let curPrice = rp.price || 0;
        if (rp.discount && rp.discount.price) {
          curPrice = rp.discount.price;
        }else{
          if (rp.current_price) {
            curPrice = rp.current_price;
          }
        }

        // 多选的放到后面
        if (rp.properties && rp.properties.length > 0) {
          rp.properties.sort((a,b) => a.is_multiselect - b.is_multiselect);
        }

        // 是否已收藏
        let isLiked = false;
        if (rp.is_liked === 1) {
          isLiked = true;
        }

        self.setData({
          goods: rp,
          curGoodsPrice: curPrice,
          curGoodsStock: rp.good_stock,
          curStockState: curStockState,
          isLiked: isLiked,
        });
      }
      // 处理图片，判断图片是否带有前缀，没有加前缀，前缀为配置中的 shopUrl
      // 注意：图片地址不允许为相对地址
      let cont = res.product.goods_desc;
      const IUREG = /src=("|')([^("|')]*)("|')/gi;
      if (cont) {
        cont = cont.replace(IUREG,(item,cap,cap2,cap3) => {
          if (cap2.indexOf('http') === 0) {
            return item;
          }else{
            return `src=${cap}${shopUrl}/${cap2}${cap3}`;
          }
        });
        WxParse.wxParse("goodsDetail", "html", cont, self);
      }
    });
  },

  /**
   * 活动倒计时
   * @author darlang
   * @param  {Date}   time 时间
   */
  checkGoodsDiscountTime(time) {
    if (this.data.goodsDiscountTime) {
      setTimeout(() => {
        this.setData({
          goodsDiscountTime: formatLeftTime(time)
        });
        this.checkGoodsDiscountTime(time);
      },1e3);
    }
  },

  /**
   * 关闭/开启弹窗
   * @author darlang
   */
  switchPopstate() {
    this.setData({
      propertyPopState: !this.data.propertyPopState
    });
  },

  /**
   * 弹出选择规格
   * @author darlang
   */
  changeProSele() {
    if (!this.loginModal.check()) {
      return false;
    }
    // let g = this.data.goods;
    // let pro = g.properties;
    // let stock = g.stock;
    this.setData({
      propertyPopState: true
    });
  },

  /**
   * 选择规格属性
   * @author darlang
   */
  bindProAttrItem(e) {
    let items = e.currentTarget.dataset;
    let g = this.data.goods;
    let pro = g.properties;
    let stock = g.stock;
    // 多选 - 注意：多选没有库存说法，会直接选择规格，不做库存处理，所以多选/复选项在后台中谨慎配置添加
    let attrs = pro[items.i].attrs;

    if (items.type === 'm') {
      attrs = attrs.map(k => {
        if (k.id === Number(items.id)) {
          if (k.checked) {
            k.checked = false;
          }else{
            k.checked = true;
          }
        }
      });
    }

    // 单选
    if (items.type === 's') {
      attrs = attrs.map(k => {
        if (k.id === Number(items.id)) {
          k.checked = true;
        }else{
          k.checked = false;
        }
      });
    }

    this.setData({
      'goods.properties': pro,
    });

    let isCheckedAll = this.checkSeleItemCount(pro); // 是否检查完毕
    if(isCheckedAll) {
      this.checkSeleItemPrice(pro,stock);
    }

    this.checkSeleItemStock(pro);
  },

  /**
   * 检查规格数量
   * @author darlang
   * @param  {Array}   data 规格属性项
   * @return {Boolean}      是否已经选择完毕
   */
  checkSeleItemCount(data) {
    let len = 0;
    let attLen = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i].is_multiselect === false && data[i].attrs && data[i].attrs.length > 0) {
        len += 1;
        for (let j = 0; j < data[i].attrs.length; j++) {
          if (data[i].attrs[j].checked) {
            attLen += 1;
          }
        }
      }
    }

    return len === attLen ? true : false;
  },

  /**
   * 检查规格价格
   * @author darlang
   * @param  {Array}   proData   规格属性对照表
   * @param  {Array}   stockData 规格属性数据表
   */
  checkSeleItemPrice(proData,stockData) {
    let sele = [];
    for (let i = 0; i < proData.length; i++) {
      if (proData[i].is_multiselect === false && proData[i].attrs && proData[i].attrs.length > 0) {
        for (let j = 0; j < proData[i].attrs.length; j++) {
          if (proData[i].attrs[j].checked) {
            sele.push(proData[i].attrs[j].id);
          }
        }
      }
    }
    sele = sele.join('|');
    let si = stockData.findIndex(k => k.goods_attr === sele);
    if (si === -1) {
      // showToast('商品规格不存在');
      this.setData({
        curGoodsStock: 0,
        curStockState: false
      });
    }else{
      let curPrice = Number(stockData[si].goods_attr_price);
      for (let i = 0; i < proData.length; i++) {
        if (proData[i].is_multiselect === true && proData[i].attrs && proData[i].attrs.length > 0) {
          for (let j = 0; j < proData[i].attrs.length; j++) {
            if (proData[i].attrs[j].checked) {
              curPrice += Number(proData[i].attrs[j].attr_price);
            }
          }
        }
      }
      if (isNaN(curPrice)) {
        curPrice = Number(stockData[si].goods_attr_price);
      }

      this.setData({
        curGoodsStock: stockData[si].stock_number,
        curGoodsPrice: curPrice.toFixed(2),
        curStockState: true
      });
    }
  },

  /**
   * 获取选择的规格
   * @author darlang
   * @param  {Array}   data 规格属性项
   */
  checkSeleItemStock(data) {
    let selePro = [];
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let seleAttr = item.attrs.filter(k => k.checked).map(k => k.attr_name);
      selePro.push({
        name: item.name,
        attrs: seleAttr
      });
    }
    selePro = selePro.filter(k => k.attrs.length > 0);
    for (let i = 0; i < selePro.length; i++) {
      selePro[i].attrs = selePro[i].attrs.join('/');
    }
    this.setData({
      curProperty: selePro
    });
  },

  /**
   * 修改商品数量
   * @author darlang
   */
  changeGoodsNum(e) {
    let type = e.currentTarget.dataset.type;
    let curGoodsNum = this.data.curGoodsNum;
    let curGoodsStock = this.data.curGoodsStock;
    if (type === 'add') {
      curGoodsNum ++;
      if (curGoodsNum > 99999 && curGoodsNum <= curGoodsStock) {
        showToast('该商品限购99999件');
        curGoodsNum = 99999;
      }else{
        if (curGoodsNum >= curGoodsStock) {
          showToast('不能大于库存数量');
          curGoodsNum = curGoodsStock;
        }
      }
    }
    if (type === 'cut') {
      curGoodsNum --;
      if (curGoodsNum < 1) {
        showToast('请至少选择一件商品');
        curGoodsNum = 1;
      }
    }

    if (type === 'input') {
      curGoodsNum = e.detail.value;
      if (curGoodsNum > 99999 && curGoodsNum <= curGoodsStock) {
        showToast('该商品限购99999件');
        curGoodsNum = 99999;
      }else{
        if (curGoodsNum > curGoodsStock) {
          showToast('不能大于库存数量');
          curGoodsNum = curGoodsStock;
        }else{
          if (curGoodsNum < 1) {
            showToast('请至少选择一件商品');
            curGoodsNum = 1;
          }
        }
      }
    }

    this.setData({
      curGoodsNum: curGoodsNum
    });
  },

  /**
   * 获取购物车
   * @author darlang
   */
  getCartSum() {
    let self = this;
    GetCartGoods().then(res => {
      let cartTotal = 0;
      if (res.goods_groups.length > 0) {
        cartTotal = res.goods_groups[0].total_amount || 0;
      }
      self.setData({
        cartGoodsSum: cartTotal
      });
      CheckCartTotal(cartTotal);
    });
  },

  /**
   * 收藏/取消收藏
   * @author darlang
   */
  switchCollect() {
    if (!this.loginModal.check()) {
      return false;
    }
    let isLiked = this.data.isLiked || false;
    ChangeFavoriteStatus(this.data.id,isLiked).then(res => {
      this.setData({
        isLiked: res.is_liked
      });
    });
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const items = e.currentTarget.dataset;
    const pathData = [
      {type: 'cart',path: '/pages/shopping/cart/cart'},
      {type: 'comments',path: '/pages/member/comment/list/list?goodsId='+items.id}
    ];
    if (items.type === 'home') {
      wx.reLaunch({
        url: '/pages/index/index'
      });
      return false;
    }
    pushPagePath(e,pathData);
  },


  /**
   * 获取相关推荐商品
   * @author darlang
   */
  getGoodsAccLst() {
    GetGoodsRelate(this.data.id,1,999).then(res => {
      this.setData({
        goodsAccLst: res.products
      });
    });
  },

  /**
   * 加入购物车
   * @author darlang
   */
  buyGoods(e) {
    if (!this.loginModal.check()) {
      return false;
    }
    let type = e.currentTarget.dataset.type;
    let g = this.data.goods;
    if (g.properties && g.properties.length > 0) {
      if (!this.checkSeleItemCount(g.properties)) {
        showToast('请先选择规格');
        this.setData({
          propertyPopState: true
        });
        return false;
      }
    }

    if (!this.data.consignee) {
      showToast('请先填写收货地址');
      wx.showModal({
        title: "温馨提示",
        content: "由于您尚未添加地址，请先添加地址.",
        // showCancel: false,
        success: function(cif) {
          if (cif.confirm) {
            wx.navigateTo({
              url: "/pages/member/address/edit/edit?type=add"
            });
          }
        }
      });
      return false;
    }

    const goodsId = g.id;
    const goodsName = g.name;
    const goodsThumb = g.default_photo.large || g.photos[0].large || '/images/default_image.png';
    const goodsPrice = this.data.curGoodsPrice;
    const goodsScore = g.score || 0;
    let goodsAttrsInfo = [];
    const goodsAmount = this.data.curGoodsNum;
    let goodsAttrs = [];
    if (g.properties && g.properties.length > 0) {
      for (let i = 0; i < g.properties.length; i++) {
        goodsAttrsInfo = goodsAttrsInfo.concat(g.properties[i].attrs.filter(k => k.checked).map(k => {return {name: g.properties[i].name + ':' + k.attr_name, id: k.id, price: k.attr_price};}));
        goodsAttrs = goodsAttrs.concat(g.properties[i].attrs.filter(k => k.checked).map(k => k.id));
      }
    }

    goodsAttrs = JSON.stringify(goodsAttrs);
    let seleInfo = {
      amount: goodsAmount,// 数量
      product: goodsId,// 商品
      property: goodsAttrs,// 商品属性
    };

    if (type === 'buy') {
      // consignee: 3
      // order_product: "[{"goods_id":69,"property":[241,243],"num":1,"total_amount":1}]"
      let consignee = this.data.consignee;
      let preOrder = [
        {
          "goods_id": goodsId,
          "property": goodsAttrs,
          "num": goodsAmount,
          "total_amount": goodsAmount
        }
      ];
      let orderInfo = [
        {
          name: goodsName,
          id: goodsId,
          price: goodsPrice,
          total: goodsAmount,
          thumb: goodsThumb,
          score: goodsScore,
          attrs: goodsAttrsInfo
        }
      ];
      orderInfo = escape(JSON.stringify(orderInfo));
      preOrder = escape(JSON.stringify(preOrder));
      if (g.properties && g.properties.length > 0) {
        wx.navigateTo({
          url: '/pages/shopping/checkout/checkout?preOrder=' + preOrder + '&orderInfo=' +orderInfo + '&consignee=' + consignee
        });
      }else{
        wx.navigateTo({
          url: '/pages/shopping/checkout/checkout?preOrder=' + preOrder + '&orderInfo=' +orderInfo
        });
      }
      return false;
    }


    // amount: 1
    // product: "69"
    // property: "[239,240]"
    if (type === 'cart') {
      wx.showLoading({title: '处理中...',mask: true});
      addGoodsToCart(seleInfo.product,seleInfo.property,seleInfo.amount).then(res => {
        showToast("加入购物车成功", "success");
        this.setData({
          propertyPopState: false
        });
        this.getCartSum();
      }).catch(err => {
        // utils.showToast("加入购物车失败", "error");
      });
    }
  },

  /**
   * 获取默认收货人,无默认选择第一条
   * @author darlang
   */
  getConsignees() {
    let consignee = '';
    GetConsigneeList().then(res => {
      if (res.consignees && res.consignees.length > 0) {
        for (let i = 0; i < res.consignees.length; i++) {
          let item = res.consignees[i];
          if (item.is_default) {
            consignee = item.id;
            break;
          }else{
            if (i+1 === res.consignees.length) {
              consignee = res.consignees[0].id;
            }
          }
        }
      }
      this.setData({
        consignee: consignee
      });
    });
  },

  /**
   * 商品评论 - 只拿一条评论
   * @author darlang
   */
  getGoodsComments() {
    GetCommentList(this.data.id,1,1).then(res => {
      if (res.reviews && res.reviews.length > 0) {
        res.reviews[0].updated_at = formatTime(res.reviews[0].updated_at,"Y-M-D");
        res.reviews[0].content = res.reviews[0].content.replace(/^\s*$/g,'');
        if (res.reviews[0] && !res.reviews[0].grade) {
          res.reviews[0].grade = 0;
        }
        this.setData({
          "commentsTotal": res.paged.total,
          "commentsPreview": res.reviews[0]
        });
      }

    });
  },

  /**
   * 背景滚动事件
   * @author darlang
   */
  preventTouchMove(e) {
    console.log(e);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    // 页面渲染完成
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    // 页面显示
    this.getProductInfo();
    this.getGoodsComments();
    this.getConsignees();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    // 页面隐藏
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    // 页面关闭
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    return {
      title: this.data.goods.name || PNT.default,
      imageUrl: this.data.goods.default_photo.large || '/images/default_image.png',
      path: getCurrentPageUrl(),
      success() {},
      fail() {},
      complete() {}
    };
  }
});