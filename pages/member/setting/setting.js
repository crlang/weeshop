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
// setting.js
import {PNT,setNavBarTitle,showToast,pushPagePath} from "../../../utils/utils";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hasLogged: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    setNavBarTitle(PNT.member.setting);
    this.loginModal = this.selectComponent("#login-modal");
  },

  /**
   * 退出登录
   * @author darlang
   */
  logout() {
    if (!this.data.hasLogged) {
      return false;
    }
    wx.showModal({
      title: "登出提示",
      content: "是否退出登录？",
      showCancel: true,
      cancelText: "退出登录",
      cancelColor: "#999999",
      confirmText: "点错了",
      confirmColor: "#9c27ff",
      success: (res) => {
        if (res.cancel) {
          wx.clearStorageSync();
          showToast("退出成功", "success",1500);
          setTimeout(() => {
            wx.reLaunch({
              url: "/pages/index/index"
            });
          }, 1500);
        }
      }
    });
  },

  /**
   * 清理缓存
   * @author darlang
   */
  clearLocalCache() {
    showToast('清理成功','success');
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const pathData = [
      {type: 'changePassword',path: '/pages/auth/changepassword/changepassword'},
      {type: 'userInfo',path: '/pages/member/userinfo/userinfo'},
      {type: 'about',path: '/pages/member/about/about'},
    ];
    if (!this.data.hasLogged) {
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
    this.setData({
      hasLogged: this.loginModal.check() || false
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