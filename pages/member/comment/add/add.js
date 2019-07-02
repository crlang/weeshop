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

// add.js
import {PNT,setNavBarTitle,showToast} from '../../../../utils/utils';
import {GetOrderInfo,AddOrderComment} from '../../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderId: '',
    reviewsParams: [{
      goods: '',// 商品id
      grade: '',// 3好评 2中评 1差评
      content: '',// 评论内容
    }],
    isAnonymous: 1,// 是否匿名 1不匿名 0匿名
    orderInfo: '',
    goodsLst: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    setNavBarTitle(PNT.comments.add);
    this.loginModal = this.selectComponent("#login-modal");

    if (!opt.orderId) {
      showToast('评论异常','error');
      return false;
    }
    this.setData({
      orderId: opt.orderId
    });
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.getOrderInfo();
    }
  },

  /**
   * 输入
   * @author darlang
   */
  bindInputChange(e) {
    let items = e.currentTarget.dataset;
    let type = items.type;
    let v = e.detail.value || '';
    // let rp = this.data.reviewsParams;
    let g = this.data.goodsLst;

    if (type === 'star') {
      let grade = 0;
      if (items.star < 3) {
        grade = 1;
      }else if (items.star == 3) {
        grade = 2;
      }else {
        grade = 3;
      }
      g[items.i].grade = grade;
      g[items.i].star = items.star;
      g[items.i].goods = items.id;
      this.setData({
        goodsLst: g
      });
    }

    if (type ==='comment') {
      g[items.i].content = v;
      this.setData({
        goodsLst: g
      });
    }

    if (type === 'anonymous') {
      v = v ? 0 : 1;
      this.setData({
        isAnonymous: v
      });
    }
  },

  /**
   * 获取订单信息
   * @author darlang
   */
  getOrderInfo() {
    GetOrderInfo(this.data.orderId).then(res => {
      if (res.order && res.order.goods && res.order.goods.length > 0) {
        for (let i = 0; i < res.order.goods.length; i++) {
          res.order.goods[i].star = 5;
          res.order.goods[i].grade = 3;
        }
      }
      this.setData({
        orderInfo: res.order,
        goodsLst: res.order.goods
      });
    });
  },

  /**
   * 提交评论
   * @author darlang
   */
  submitReview() {
    let params = this.data.reviewsParams;
    let g = this.data.goodsLst;
    params = g.map(k => { return {goods: k.id, grade: k.grade, content: k.content};});
    params = JSON.stringify(params);
    wx.showLoading({title: '正在提交...',mask: true});
    AddOrderComment(this.data.orderId,params,this.data.isAnonymous).then(() => {
      showToast('评论成功','success',700);
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/member/order/detail/detail?id=' + this.data.orderId
        });
      }, 800);
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getOrderInfo();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
});