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

// catalog.js
import {PNT,setNavBarTitle,pushPagePath} from "../../utils/utils";
import {GetGoodsCategory} from "../../utils/apis";
import {CheckCartTotal} from "../../utils/publics";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    categories: '',
    childCategories: '',
    curCategories: '',
    scrollHeight: 0 //动态获取屏幕高度
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    setNavBarTitle(PNT.goods.catalog);
    this.getCategories();
  },


  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const items = e.currentTarget.dataset;
    const pathData = [
      {type: 'search',path: '/pages/goods/search/search'},
      {type: 'list',path: '/pages/goods/list/list?catId='+items.id},
    ];
    pushPagePath(e,pathData);
  },

  /**
   * 获取商品分类
   * @author darlang
   */
  getCategories() {
    wx.showLoading({title: '加载中...',mask: true});
    GetGoodsCategory(1,999).then(res => {

      if (res.categories && res.categories.length > 0) {
        this.setData({
          categories: res.categories,
          childCategories: res.categories[0].categories,
          curCategories: res.categories[0],
        });
      }
    });
  },


  /**
   * 切换分类
   * @author darlang
   */
  switchRightTab(e) {
    let items = e.currentTarget.dataset;
    let i = parseInt(items.i) || 0;
    let cateData = this.data.categories;
    this.setData({
      curCategories: cateData[i],
      childCategories: cateData[i].categories
    });
  },


  /**
   * 初始化滚动高度
   * @author darlang
   */
  getScrollViewInfo() {
    let self = this;
    wx.createSelectorQuery()
      .select(".catalog")
      .boundingClientRect(rect => {
        self.setData({
          scrollHeight: rect.height
        });
      })
      .exec();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getScrollViewInfo();
    CheckCartTotal();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  }
});