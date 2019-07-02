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

// detail.js
import {PNT,setNavBarTitle,showToast,shopUrl} from '../../../utils/utils';
import {GetArticle} from '../../../utils/apis';
import WxParse from "../../../libs/wxParse/wxParse";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    nd: '',
    id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    setNavBarTitle(PNT.message.detail);
    this.setData({
      id: opt.id
    });
    this.getNewsDetail();
  },

  /**
   * 获取文章内容
   * 此接口需要二次开发，详情请查看 darlang 文章
   * @author darlang
   */
  getNewsDetail() {
    wx.showLoading({title: '加载中...',mask: true});
    GetArticle(this.data.id).then(res => {
      let cont = res.article_info.content;
      const IUREG = /src=("|')([^("|')]*)("|')/gi;
      if (cont) {
        cont = cont.replace(IUREG,(item,cap,cap2,cap3) => {
          if (cap.indexOf('http') === 0) {
            return item;
          }else{
            return `src=${cap}${shopUrl}/${cap2}${cap3}`;
          }
        });
        WxParse.wxParse("articleContent", "html", cont, this);
      }

      this.setData({
        articleInfo: res.article_info
      });
    }).catch(err => {
      if (err.data.error_code === 404) {
        showToast('内容不存在，或者已过期');
      }
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
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面滚动触发事件的处理函数
   */
  onPageScroll: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {}
});