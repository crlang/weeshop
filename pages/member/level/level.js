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

// level.js
import {PNT,setNavBarTitle,shopLevelRank} from "../../../utils/utils";
import {GetScoreTotal,GetUserInfo} from "../../../utils/apis";
import {CheckUserLevel} from "../../../utils/publics";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo: '',
    userLevel: 0,
    shopLevelRank: shopLevelRank || '',
    scoreInfo: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    setNavBarTitle(PNT.member.level);
    this.loginModal = this.selectComponent("#login-modal");
  },


  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.getUserInfo();
    }
  },

  /**
   * 获取用户信息
   * @author darlang
   */
  getUserInfo(e) {
    let userInfo = wx.getStorageSync('userInfo') || '';
    if (!userInfo || e) {
      GetUserInfo().then(res => {
        this.setData({
          userInfo: res.user,
          userLevel: CheckUserLevel(res.user.rank.score_min || 0),
          maxVip: shopLevelRank.length
        });
        wx.setStorageSync('userInfo', res.user);
        this.getScoreInfo();
      });
    }else{
      this.setData({
        userInfo: userInfo,
        userLevel: CheckUserLevel(userInfo.rank.score_min || 0),
        maxVip: shopLevelRank.length
      });
      this.getScoreInfo();
    }
  },

  /**
   * 获取积分
   * @author darlang
   */
  getScoreInfo() {
    GetScoreTotal().then(res => {
      // 这个判断需要二次开发，获取用户等级积分
      if (res.rank) {
        let v = this.data.userLevel;
        let SLR = shopLevelRank.find(k => k.level == v).max;
        res.next = (SLR - res.rank) || 0;
      }
      this.setData({
        scoreInfo: res
      });
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
    this.getUserInfo();
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
    this.setData({
      userInfo: '',
      userLevel: '',
      scoreInfo: ''
    });
    this.getUserInfo(true);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  }
});