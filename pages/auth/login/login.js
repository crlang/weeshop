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

// login.js
import {PNT,setNavBarTitle,showToast,miniProName,checkRoutePage,pushPagePath} from "../../../utils/utils";
import {SignIn} from "../../../utils/apis";
import {GetWechatUserInfo} from "../../../utils/publics";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    miniProName,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    setNavBarTitle(PNT.auth.login);
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const pathData = [
      {type: 'register',path: '/pages/auth/register/register'},
      {type: 'forget',path: '/pages/auth/forget/forget'},
    ];
    pushPagePath(e,pathData);
  },

  /**
   * 登录
   * @author darlang
   */
  login(e) {
    let params = e.detail.value;
    if (!params.username) {
      showToast("用户名不能为空");
      return false;
    }
    if (params.password.length < 6) {
      showToast("密码不能少于6个字符");
      return false;
    }

    SignIn(params.username,params.password).then(res => {
      showToast('登录成功','success',800);
      wx.setStorageSync("token", res.token);
      wx.setStorageSync("userInfo", res.user);
      wx.setStorageSync("openid", res.openid);
      wx.setStorageSync('loginStatus', true);
      wx.showModal({
        title: '登录成功',
        content: '注意，如您使用账号登录，将无法使用微信支付，但您可以通过余额支付。',
        showCancel: false,
        confirmText: '了解',
        confirmColor: '#9c27ff',
        complete: () => {
          checkRoutePage();
        }
      });
    });
  },

  /**
   * 微信快捷登录
   * @author darlang
   */
  getUserInfo(e) {
    GetWechatUserInfo(e);
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
      frontColor: "#000000",
      backgroundColor: "#ffffff",
      animation: {
        duration: 300,
        timingFunc: "linear"
      }
    });
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
  onPullDownRefresh: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {}
});
