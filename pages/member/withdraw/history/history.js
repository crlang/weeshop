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

// history.js
import {PNT,setNavBarTitle,pushPagePath,scrollLoadList,formatTime} from "../../../../utils/utils";
import {GetWithdrawList} from "../../../../utils/apis";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    withdrawLst: '',
    pages: {
      page: 1,
      size: 10,
      total: 10,
      done: false,
      loading: false
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    setNavBarTitle(PNT.withdraw.history);
    this.loginModal = this.selectComponent("#login-modal");
    this.getWithdrawList();
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const items = e.currentTarget.dataset;
    const pathData = [
      {type: 'info',path: '/pages/member/withdraw/info/info?id='+items.id},
    ];
    pushPagePath(e,pathData);
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.reList();
    }
  },

  /**
   * 提现记录
   * @author darlang
   */
  getWithdrawList() {
    if (this.data.pages.done) {
      return false;
    }
    wx.showLoading({title: '加载中...',mask: true});
    GetWithdrawList(this.data.pages.page,this.data.pages.size).then(res => {
      if (res.withdraws && res.withdraws.length > 0) {
        for (let i = 0; i < res.withdraws.length; i++) {
          res.withdraws[i].create_at = formatTime(res.withdraws[i].create_at,"Y年M月D日 h:i:s");
        }
      }

      const lst = scrollLoadList(this,res,'withdraws','withdrawLst');
      this.setData({
        withdrawLst: lst
      });
    });
  },

  /**
   * 重新获取列表
   * @author darlang
   */
  reList() {
    this.setData({
      withdrawLst: '',
      'pages.page': 1,
      'pages.done': false
    });
    this.getWithdrawList();
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
    this.reList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getWithdrawList();
  },
});