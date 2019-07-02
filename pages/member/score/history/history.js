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
import {PNT,setNavBarTitle,formatTime,scrollLoadList} from '../../../../utils/utils';
import {GetScoreList} from '../../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    scoreLst: '',
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
    setNavBarTitle(PNT.member.score);
    this.loginModal = this.selectComponent("#login-modal");
    this.getScoreList();
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
   * 积分明细
   * @author darlang
   */
  getScoreList() {
    if (this.data.pages.done) {
      return false;
    }
    wx.showLoading({title: '加载中...',mask: true});
    GetScoreList(this.data.pages.page,this.data.pages.size).then(res => {
      if (res.history && res.history.length > 0) {
        for (let i = 0; i < res.history.length; i++) {
          res.history[i].created_at = formatTime(res.history[i].created_at,"Y年M月D日 h:i:s");
          if (res.history[i].change > 0) {
            res.history[i].status = 1;
          }
        }
      }
      const lst = scrollLoadList(this,res,'history','scoreLst');
      this.setData({
        scoreLst: lst
      });
    });
  },

  /**
   * 重新获取列表
   * @author darlang
   */
  reList() {
    this.setData({
      scoreLst: '',
      'pages.page': 1,
      'pages.done': false
    });
    this.getScoreList();
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
    this.getScoreList();
  },
});