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
import {PNT,setNavBarTitle,showToast,pushPagePath,pointsMall,getUrlParamValue,shopNoticeCatId} from "../../utils/utils";
import {GetSiteInfo,GetBannerList,GetArticleList,GetHomeGoodsList} from '../../utils/apis';
import {CheckCartTotal} from "../../utils/publics";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    siteInfo: '',
    bannerLst: '',
    mainMenu: [
      {
        type: 'list',
        title: '购物',
        img: '/images/icon_index-1.png'
      },
      {
        type: 'score',
        title: '积分',
        img: '/images/icon_index-2.png'
      },
      {
        type: 'cashgift',
        title: '卡券',
        img: '/images/icon_index-3.png'
      },
      {
        type: 'activities',
        title: '优惠',
        img: '/images/icon_index-4.png'
      },
      {
        type: 'level',
        title: '会员',
        img: '/images/icon_index-5.png'
      }
    ],
    noticeLst: [],
    goodProducts: [],
    hotProducts: [],
    recentlyProducts: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    setNavBarTitle(PNT.default);
    this.loginModal = this.selectComponent("#login-modal");

    this.getShopSiteInfo();
    this.getBanner();
    this.getNotices();
    this.getPorducts();

  },

  /**
   * 获取站点信息
   * @author darlang
   */
  getShopSiteInfo() {
    GetSiteInfo().catch(res =>{
      this.setData({
        siteInfo: res.data.site_info
      });
      setNavBarTitle(res.data.site_info.name || PNT.default);
    });
  },

  /**
   * 获取移动端 Banner 广告
   * @description 智能识别是否为优惠地址或商品地址，点击跳转相应小程序页面
   * @author darlang
   */
  getBanner() {
    GetBannerList().then(res => {
      if (res.length !== 0) {
        const linkArr = ['activity','product'];
        for (let i = 0; i < res.length; i++) {

          let activity = getUrlParamValue('activity',res[i].link);
          let product = getUrlParamValue('product',res[i].link);
          if (activity) {
            res[i].type = 'activity';
            res[i].tid = getUrlParamValue('activity',res[i].link);
          }else if(product) {
            res[i].type = 'product';
            res[i].tid = getUrlParamValue('activity',res[i].link);
          }
        }
        this.setData({
          bannerLst: res
        });
      }
    });
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const items = e.currentTarget.dataset;
    if (items.type === 'score' && !pointsMall) {
      showToast('积分商城未开启');
      return false;
    }
    if (items.type === 'level' || items.type === 'cashgift' || items.type === 'score') {
      if (!this.loginModal.check()) {
        return false;
      }
    }
    const pathData = [
      {type: 'list',path: '/pages/goods/list/list'},
      // {type: 'score',path: '/pages/points/index/index'},
      {type: 'cashgift',path: '/pages/member/cashgift/info/info'},
      {type: 'activities',path: '/pages/message/activity/index'},
      {type: 'level',path: '/pages/member/level/level'},
      {type: 'notices',path: '/pages/message/notices/index'},
      {type: 'goods',path: '/pages/goods/detail/detail?id='+items.id},
      {type: 'activity',path: '/pages/message/activity/detail?id='+items.tid},
      {type: 'product',path: '/pages/goods/detail/detail?id='+items.tid},
    ];
    pushPagePath(e,pathData);
  },

  /**
   * 站内快讯
   * @author darlang
   */
  getNotices() {
    if (!shopNoticeCatId) {
      return false;
    }
    GetArticleList(1,6,shopNoticeCatId).then(res => {
      this.setData({
        noticeLst: res.articles
      });
    });
  },


  /**
   * 首页展示产品
   * @author darlang
   */
  getPorducts() {
    GetHomeGoodsList().then(res => {
      this.setData({
        goodProducts: res.good_products || '',
        hotProducts: res.hot_products || '',
        recentlyProducts: res.recently_products || ''
      });
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
    CheckCartTotal();
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
    try {
      var shareName = this.data.siteInfo.name;
      var imgUrl = this.data.bannerLst[0].photo.large;
    } catch(e) {
      // console.log(e)
    }
    return {
      title: shareName || PNT.default,
      imageUrl: imgUrl || '/images/default_image.png',
      path: '/pages/index/index',
      success() {},
      fail() {},
      complete() {}
    };
  }
});
