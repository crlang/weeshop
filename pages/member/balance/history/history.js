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
import {GetBalanceList} from '../../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    balanceStatus: '',
    balanceLst: '',
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
  onLoad: function (opt) {
    setNavBarTitle(PNT.assets.balance);
    this.loginModal = this.selectComponent("#login-modal");
    if (opt.status) {
      this.setData({
        balanceStatus: opt.status
      });
    }
  },

  /**
   * 获取资金明细
   * @author darlang
   */
  getBalanceList() {
    if (this.data.pages.done) {
      return false;
    }
    wx.showLoading({title: '加载中...',mask: true});
    GetBalanceList(this.data.pages.page,this.data.pages.size,this.data.balanceStatus).then(res => {
      if (res.balances && res.balances.length > 0) {
        for (let i = 0; i < res.balances.length; i++) {
          res.balances[i].create_at = formatTime(res.balances[i].create_at,"Y年M月D日 h:i:s");
        }
      }
      const lst = scrollLoadList(this,res,'balances','balanceLst');
      this.setData({
        balanceLst: lst
      });
    });
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.bindBalanceState();
    }
  },

  /**
   * 资金过滤
   * 1收入 2支出
   * @author darlang
   */
  bindBalanceState(e) {
    const type = e ? e.currentTarget.dataset.type : '';
    this.setData({
      balanceLst: '',
      'pages.page': 1,
      'pages.done': false,
      balanceStatus: type
    });
    this.getBalanceList();
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
    this.getBalanceList();
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
    this.bindBalanceState();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getBalanceList();
  },
});