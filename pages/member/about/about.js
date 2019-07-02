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

// pages/member/about/about.js
import {PNT,setNavBarTitle,WeeShop_Version,pushPagePath} from "../../../utils/utils";
import {GetSiteInfo} from "../../../utils/apis";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    WeeShop_Version,
    siteInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    setNavBarTitle(PNT.member.about);
    this.getSiteInfo();
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const pathData = [
      {type: 'copyright',path: '/pages/message/copyright/copyright'},
    ];
    pushPagePath(e,pathData);
  },

  /**
   * 复制内容
   * @author darlang
   */
  copyLink(e) {
    const type = e.currentTarget.dataset.type;
    if (!type) {
      return false;
    }
    let copyCont = '';
    if (type === 'qq') {
      copyCont = '737840076';
    }
    if (type === 'link') {
      copyCont = 'https://www.darlang.com/?p=709';
    }
    if (type === 'github') {
      copyCont = 'https://github.com/crlang/weeshop';
    }
    wx.setClipboardData({
      data: copyCont,
      success () {
        wx.showModal({
          title: '复制成功',
          content: copyCont,
          showCancel: false,
          confirmText: '已复制',
          confirmColor: '#9c27ff'
        });
      }
    });
  },

  /**
   * 获取站点信息
   * @author darlang
   */
  getSiteInfo() {
    GetSiteInfo().catch(res =>{
      this.setData({
        siteInfo: res.data.site_info
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