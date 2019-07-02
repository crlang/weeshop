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

// info.js
import {PNT,setNavBarTitle,showToast,formatTime} from "../../../../utils/utils";
import {CancelWithdraw,GetWithdrawInfo} from "../../../../utils/apis";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    withdrawInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    setNavBarTitle(PNT.withdraw.info);
    if (!opt.id) {
      showToast('非法id,请退出页面重试');
    }
    this.setData({
      id: opt.id
    });
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.getWithdrawInfo();
    }
  },

  /**
   * 取消提现
   * @author darlang
   */
  onCancelWithdraw() {
    if (!this.data.id) {
      showToast('错误操作', 'error');
      return false;
    }
    wx.showLoading({title: '正在取消...',mask: true});
    CancelWithdraw(this.data.id).then(() => {
      showToast('取消成功', 'success');
      setTimeout(() => {
        wx.navigateBack();
      }, 800);
    });
  },

  /**
   * 提现记录
   * @author darlang
   */
  getWithdrawInfo() {
    wx.showLoading({title: '加载中...',mask: true});
    GetWithdrawInfo(this.data.id).then(res => {
      res.withdraw.create_at = formatTime(res.withdraw.create_at,"Y年M月D日 h:i:s");
      res.withdraw.update_at = formatTime(res.withdraw.update_at,"Y年M月D日 h:i:s");

      this.setData({
        withdrawInfo: res.withdraw
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
    this.getWithdrawInfo();
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
      withdrawInfo: ''
    });
    this.getWithdrawInfo();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  }
});