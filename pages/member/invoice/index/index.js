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

// invoice.js
import {PNT,setNavBarTitle,showToast} from "../../../../utils/utils";
import {GetInvoiceType,GetInvoiceList,GetInvoiceStatus} from '../../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    invoiceParams: {
      invoice_type: '',
      invoice_content: '',
      invoice_title: '',
    },
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    setNavBarTitle(PNT.member.invoice);
    this.loginModal = this.selectComponent("#login-modal");
    this.initInvoice();
  },

  /**
   * 初始化发票数据
   * @author darlang
   */
  initInvoice() {
    GetInvoiceType().then(res => {
      this.setData({
        types: res.types
      });
    });
    GetInvoiceList().then(res => {
      this.setData({
        contents: res.contents
      });
    });
    // GetInvoiceStatus().then(res => {
    // });
  },

  bindChangeData(e) {
    const items = e.currentTarget.dataset;
    if (items.type === 'title') {
      let v = e.detail.value;
      this.setData({
        'invoiceParams.invoice_title': v
      });
    }
    if (items.type === 'xtitle') {
      let v = e.detail.value;
      this.setData({
        'tmpTitle': v
      });
    }
    if (items.type === 'type') {
      let its = this.data.types;
      for (let i = 0; i < its.length; i++) {
        its[i].checked = false;
      }
      if (its[items.i]) {
        its[items.i].checked = true;
        this.setData({
          types: its,
          'invoiceParams.invoice_type': its[items.i].id,
          'invoiceParams.invoice_type_name': its[items.i].name
        });
      }
    }
    if (items.type === 'content') {
      let cnt = this.data.contents;
      for (let i = 0; i < cnt.length; i++) {
        cnt[i].checked = false;
      }
      if (cnt[items.i]) {
        cnt[items.i].checked = true;
        this.setData({
          contents: cnt,
          'invoiceParams.invoice_content': cnt[items.i].id,
          'invoiceParams.invoice_content_name': cnt[items.i].name
        });
      }
    }
  },

  /**
   * 检查发票
   * @author darlang
   */
  checkInvoice(e) {
    let type = e.currentTarget.dataset.type;
    if (type === 'none') {
      wx.setStorageSync('cache_invoice', {invoice_type:'',invoice_type_name:'',invoice_content:'',invoice_content_name:'',invoice_title:''});
    }
    if (type === 'need') {
      let params = this.data.invoiceParams;
      if (!params.invoice_type) {
        showToast('请选择抬头类型');
        return false;
      }
      if (!params.invoice_title) {
        showToast('请填写发票抬头');
        return false;
      }
      if (!this.data.tmpTitle) {
        showToast('请填写发票税号');
        return false;
      }
      if (!this.data.invoice_content) {
        showToast('请选择发票内容');
        return false;
      }
      params.invoice_title = params.invoice_title + ' ' + this.data.tmpTitle;
      wx.setStorageSync('cache_invoice', params);
    }
    wx.navigateBack();
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.initInvoice();
    }
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