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

// search.js
import {PNT,setNavBarTitle,showToast,uniqueArray} from "../../../utils/utils";
import {GetGoodsKeyword} from "../../../utils/apis";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hotData: '',// 热门
    historyData: '',// 历史
    keyword: '',// 搜索词
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    setNavBarTitle(PNT.goods.search);
    this.getHotKey();
  },

  /**
   * 获取热门关键词
   * @author darlang
   */
  getHotKey() {
    GetGoodsKeyword().then(res => {
      if (res.keywords.length > 0) {
        this.setData({
          hotData: res.keywords
        });
      }
    });
  },

  /**
   * 绑定输入
   * @author darlang
   */
  bindSearch(e) {
    let v = e.detail.value;
    this.setData({
      keyword: v
    });
  },

  /**
   * 搜索跳转
   * @author darlang
   */
  searchKey(e) {
    let skw = e.currentTarget.dataset.name;
    let kw = this.data.keyword;
    let nkw = kw.replace(/(^\s*)|(\s*$)/g, "");
    let sk = wx.getStorageSync('searchHistoryKey') || [];
    // 是否输入的内容
    if (!skw) {
      // 是否为空,空返回上一页
      if (kw.length === 0) {
        wx.navigateBack();
      }
      // 去除空格后是否为空, 不为空保存到历史记录
      if (nkw.length > 0) {
        sk.push(nkw);
        sk = uniqueArray(sk);
        this.setData({
          historyData: sk
        });
        wx.setStorageSync('searchHistoryKey', sk);
      }
    }else{
      kw = skw;
    }

    wx.navigateTo({
      url: '/pages/goods/list/list?keyword=' + kw
    });
  },

  /**
   * 获取历史数据
   * @author darlang
   */
  getHistoryData() {
    let sk = wx.getStorageSync('searchHistoryKey');
    this.setData({
      historyData: sk
    });
  },

  /**
   * 清除历史记录
   * @author darlang
   */
  clearHistoryData() {
    try {
      wx.removeStorageSync('searchHistoryKey');
      this.setData({
        historyData: ''
      });
    } catch(e) {
      showToast("清理失败");
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
    this.getHistoryData();
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