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
import {PNT,setNavBarTitle,formatTime,scrollLoadList} from '../../../../utils/utils';
import {GetCommentList} from '../../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    commentState: 0,
    goodsId: null,
    commentLst: '',
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
    setNavBarTitle(PNT.comments.list);

    this.setData({
      goodsId: opt.goodsId,
    });
    this.getCommentLst();
  },

  /**
   * 评论列表
   * @author darlang
   */
  getCommentLst() {
    if (this.data.pages.done) {
      return false;
    }
    wx.showLoading({title: '加载中...',mask: true});
    GetCommentList(this.data.goodsId,this.data.pages.page,this.data.pages.size,this.data.commentState).then(res => {
      if (res.reviews && res.reviews.length > 0) {
        for (let i = 0; i < res.reviews.length; i++) {
          res.reviews[i].updated_at = formatTime(res.reviews[i].updated_at);
          res.reviews[i].content = res.reviews[i].content.replace(/^\s*$/g,'');
        }
      }
      const lst = scrollLoadList(this,res,'reviews','commentLst');
      this.setData({
        "commentLst": lst
      });
    });
  },

  /**
   * 切换评论
   * @author darlang
   */
  changeCommentState(e) {
    let commentState = e ? e.currentTarget.dataset.id : this.data.commentState;
    this.setData({
      'pages.page': 1,
      'pages.done': false,
      'commentLst': '',
      commentState: commentState
    });
    this.getCommentLst();
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
    this.changeCommentState();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getCommentLst();
  },
});