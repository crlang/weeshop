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

// favorite.js
import {PNT,setNavBarTitle,showToast,scrollLoadList} from '../../../utils/utils';
import {GetFavoriteList,ChangeFavoriteStatus} from '../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    favoriteList: [],
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
    setNavBarTitle(PNT.member.favorite);
    this.loginModal = this.selectComponent("#login-modal");
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
    if (type === 'goods') {
      wx.navigateTo({
        url: '/pages/goods/detail/detail?id='+items.id
      });
    }
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.getFavoriteList();
    }
  },

  /**
   * 收藏列表
   * @author darlang
   */
  getFavoriteList() {
    if (this.data.pages.done) {
      return false;
    }
    wx.showLoading({title: '加载中...',mask: true});
    GetFavoriteList(this.data.pages.page,this.data.pages.size).then(res => {
      const lst = scrollLoadList(this,res,'products','favoriteLst');
      this.setData({
        favoriteLst: lst,
      });
    });
  },

  /**
   * 移除收藏
   * @author darlang
   */
  onCancelFavorite(e) {
    let self = this;
    let items = e.currentTarget.dataset;
    let lst = this.data.favoriteLst;
    wx.showModal({
      title: '提示',
      content: '是否要移除当前收藏？',
      success: function (res) {
        if (res.confirm) {
          wx.showLoading({title: '移除中...',mask: true});
          ChangeFavoriteStatus(items.id).then(() => {
            showToast('移除成功!','success');
            lst.splice(items.i,1);
            self.setData({
              favoriteLst: lst
            });
          });
        }
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示
    this.getFavoriteList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 页面隐藏
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
      'pages.page': 1,
      'pages.done': false,
      favoriteLst: '',
    });
    this.getFavoriteList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getFavoriteList();
  },
});