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

// list.js
import {PNT,setNavBarTitle,showToast} from '../../../../utils/utils';
import {GetConsigneeList,SetDefaultConsignee} from '../../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressLst: '',
    isSelect: false,// 下单过来的
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    setNavBarTitle(PNT.address.main);
    this.loginModal = this.selectComponent("#login-modal");

    if (opt.isSelect) {
      this.setData({
        isSelect: Boolean(opt.isSelect) || false
      });
    }

  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.getAddressList();
    }
  },

  /**
   * 收货地址
   * @author darlang
   */
  getAddressList() {
    wx.showLoading({title: '加载中...',mask: true});
    GetConsigneeList().then(res => {
      this.setData({
        addressLst: res.consignees
      });
    });
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
    if (type === 'edit') {
      if (items.select === 'true') {
        wx.setStorageSync('cache_consignee', items.id);
        wx.navigateBack();
        return false;
      }
      wx.setStorageSync('cache_address_edit', this.data.addressLst[items.i]);
      wx.navigateTo({
        url: '/pages/member/address/edit/edit?id='+items.id
      });
    }
    if (type === 'add') {
      wx.navigateTo({
        url: '/pages/member/address/edit/edit?type=add'
      });
    }
  },


  /**
   * 设定默认收货地址
   * @author darlang
   */
  setDefaultAddress(e) {
    let i = e.currentTarget.dataset.i;
    let lst = this.data.addressLst;
    if (!lst[i] || !lst[i].id) {
      showToast('更改异常','error',300);
      return false;
    }
    SetDefaultConsignee(lst[i].id).then(() => {
      for (let k = 0; k < lst.length; k++) {
        lst[k].is_default = false;
      }
      lst[i].is_default = true;
      this.setData({
        addressLst: lst
      });
      showToast('默认已更改','success',300);
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
    this.getAddressList();
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
      addressLst: ''
    });
    this.getAddressList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getAddressList();
  }
});