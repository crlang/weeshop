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

// index.js
import {PNT,setNavBarTitle,pushPagePath} from "../../../utils/utils";
import {GetOrderTotal,GetScoreTotal,GetUserInfo} from "../../../utils/apis";
import {CheckUserLevel,CheckCartTotal} from "../../../utils/publics";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scoreInfo: '',
    userInfo: '',
    userLevel: 0,
    orderTotal: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    setNavBarTitle(PNT.member.main);
    this.loginModal = this.selectComponent("#login-modal");
  },

  /**
   * 初始化数据
   * @author darlang
   */
  initMineData() {
    this.getOrderTotal();
    this.getUserInfo();
    this.getScoreInfo();
    CheckCartTotal();
  },

  /**
   * 获取订单统计
   * @author darlang
   */
  getOrderTotal() {
    wx.showLoading({title: '统计中...',mask: true});
    GetOrderTotal().then((res) => {
      this.setData({
        orderTotal: res.subtotal
      });
    });
  },

  /**
   * 获取积分
   * @author darlang
   */
  getScoreInfo() {
    wx.showLoading({title: '获取中...',mask: true});
    GetScoreTotal().then(res => {
      this.setData({
        scoreInfo: res.score
      });
    });
  },


  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.initMineData();
    }
  },

  /**
   * 获取登录信息
   * @author darlang
   */
  getUserInfo(e) {
    let userInfo = wx.getStorageSync('userInfo') || '';
    if (!userInfo || e) {
      wx.showLoading({title: '加载中...',mask: true});
      GetUserInfo().then(res => {
        this.setData({
          userInfo: res.user,
          userLevel: CheckUserLevel(res.user.rank.score_min || 0)
        });
        wx.setStorageSync('userInfo', res.user);
      });
    }else{
      this.setData({
        userInfo: userInfo,
        userLevel: CheckUserLevel(userInfo.rank.score_min || 0)
      });
    }
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const items = e.currentTarget.dataset;
    const pathData = [
      {type: 'favorite',path: '/pages/member/favorite/favorite'},
      {type: 'userInfo',path: '/pages/member/userinfo/userinfo'},
      {type: 'address',path: '/pages/member/address/list/list'},
      {type: 'setting',path: '/pages/member/setting/setting'},
      {type: 'assets',path: '/pages/member/assets/index/index'},
      {type: 'cashgift',path: '/pages/member/cashgift/info/info'},
      {type: 'recommend',path: '/pages/member/invite/info/info'},
      {type: 'invite',path: '/pages/member/invite/index/index'},
      {type: 'help',path: '/pages/message/help/index'},
      {type: 'order',path: '/pages/member/order/list/list?status='+(items.id || '10')},
      {type: 'profile',path: '/pages/member/userinfo/userinfo'},
      {type: 'level',path: '/pages/member/level/level'},
    ];
    if (!this.loginModal.check()) {
      return false;
    }
    pushPagePath(e,pathData);
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#9c27ff",
      animation: {
        duration: 300,
        timingFunc: "linear"
      }
    });
    this.initMineData();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {
    this.initMineData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {}
});