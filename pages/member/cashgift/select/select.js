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

// select.js
import {PNT,setNavBarTitle,formatTime,formatLeftTime,scrollLoadList} from '../../../../utils/utils';
import {GetCashgiftAvailable} from '../../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    selectId: '',
    totalPrice: 0,
    cashgiftLst: '',
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
    setNavBarTitle(PNT.assets.bonus);

    this.setData({
      totalPrice: opt.total || 0,
      selectId: opt.id || ''
    });
    this.getCashGiftList();
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    let items = e.currentTarget.dataset;
    let type = items.type;
    if (!type) {
      return false;
    }
    if (type === 'cashgift') {
      wx.setStorageSync('cache_cashgift', items.id || '');
      wx.navigateBack();
    }
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.changeCashGiftType();
    }
  },

  /**
   * 可用红包列表
   * @author darlang
   */
  getCashGiftList() {
    if (this.data.pages.done) {
      return false;
    }
    wx.showLoading({title: '加载中...',mask: true});
    GetCashgiftAvailable(this.data.totalPrice,this.data.pages.page,this.data.pages.size).then(res => {
      for (let i = 0; i < res.cashgifts.length; i++) {
        let item = res.cashgifts[i];
        if (item.status == '0') {
          if (+new Date() < item.effective*1000) {
            item.starttime = formatLeftTime(item.effective);
          }
          if (+new Date() < item.expires*1000) {
            item.overtime = formatLeftTime(item.expires);
          }
        }
        if (this.data.selectId && this.data.selectId == item.id) {
          item.checked = true;
        }else{
          item.checked = false;
        }

        item.effective = formatTime(item.effective,"Y/M/D h:i");
        item.expires = formatTime(item.expires,"Y/M/D h:i");
      }
      const lst = scrollLoadList(this,res,'cashgifts','cashgiftLst');
      this.setData({
        cashgiftLst: lst
      });
    });
  },

  /**
   * 刷新红包
   * @author darlang
   */
  changeCashGiftType() {
    this.setData({
      "cashgiftLst": '',
      'pages.page': 1,
      'pages.done': false
    });
    this.getCashGiftList();
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
    this.changeCashGiftType();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCashGiftList();
  },
});