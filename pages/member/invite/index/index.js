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

// index.js
import {PNT,setNavBarTitle,request,showToast,pushPagePath,formatTime,scrollLoadList} from "../../../../utils/utils";
import {GetRecommendList,GetRecommendInfo,GetSiteInfo,GetWxaCode} from '../../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    recommendLst: '',
    recommendInfo: '',
    wxaCodeStatus: true,
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
    setNavBarTitle(PNT.member.invite);
    this.loginModal = this.selectComponent("#login-modal");
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.getRecommendList();
    this.getRecommendInfo();
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.getRecommendList();
      this.getRecommendInfo();
    }
  },


  /**
   * 获取推荐记录
   * status 0等待处理 1已分成 2已取消 3已撤销
   * type 0注册分成 1订单分成
   * @author darlang
   */
  getRecommendList() {
    if (this.data.pages.done) {
      return false;
    }
    wx.showLoading({title: '加载中...',mask: true});
    GetRecommendList(this.data.pages.page,this.data.pages.size).then(res => {
      for (let i = 0; i < res.bonues.length; i++) {
        res.bonues[i].time = formatTime(res.bonues[i].time,'Y-M-D h:i:s');
      }
      const lst = scrollLoadList(this,res,'bonues','recommendLst');
      this.setData({
        recommendLst: lst
      });
    });
  },

  /**
   * 获取推荐信息
   * @author darlang
   */
  getRecommendInfo() {
    wx.showLoading({title: '加载中...',mask: true});
    GetRecommendInfo().then(res => {
      this.setData({
        recommendInfo: res.bonus_info
      });
    });
    GetSiteInfo().catch(res =>{
      this.setData({
        siteInfo: res.data.site_info
      });
      setNavBarTitle(res.data.site_info.name || PNT.default);
    });
  },

  /**
   * 复制链接
   * @author darlang
   */
  copyLink() {
    let slink = this.data.recommendInfo.shared_link || '';
    if (!slink) {
      showToast('复制链接失败','error');
    }
    wx.setClipboardData({
      data: slink,
      success () {
        showToast('复制链接成功','success');
        wx.showModal({
          title: '复制成功',
          content: '链接复制成功，快去粘贴分享给好友吧！',
          showCancel: false,
          confirmText: '已复制',
          confirmColor: '#9c27ff'
        });
      }
    });
  },

  /**
   * 生成小程序码分享-后台有问题
   * @author darlang
   */
  getWxQrcode() {
    GetWxaCode().then(res => {
    }).catch(res => {
      if (res.statusCode === 500 || res.statusCode === 404) {
        showToast('小程序码生成失败');
      }
    });
  },

  /**
   * 切换弹窗
   * @author darlang
   */
  switchRulesPop() {
    this.setData({
      rulesPopup: !this.data.rulesPopup
    });
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#F6344D",
      animation: {
        duration: 300,
        timingFunc: "linear"
      }
    });
    // this.getWxQrcode();
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
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    const u = wx.getStorageSync('userInfo') || '';
    if (!u) {
      showToast('登录异常,分享失败');
      return false;
    }
    var shareName = this.data.siteInfo.name || '' ;
    var imgUrl = '/images/default_activity-'+parseInt(Math.random()*2)+'.png';
    var shareLink = '/pages/index/index?inviteCode='+(u.id || '');
    return {
      title: shareName || PNT.default,
      imageUrl: imgUrl || '/images/default_image.png',
      path: shareLink,
      success() {},
      fail() {},
      complete() {}
    };
  }
});