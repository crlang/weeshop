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
import {PNT,setNavBarTitle,showToast,scrollLoadList,formatTime,formatLeftTime,pushPagePath} from '../../../utils/utils';
import {GetActivityInfo,GetGoodsList} from '../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',
    activityInfo: '',
    moreDetail: false,
    goodsList: '',
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
    setNavBarTitle(PNT.message.detail);
    this.setData({
      id: opt.id
    });
    this.getActivityDetail();
  },

  /**
   * 获取活动详情
   * type 0送赠品或优惠购买 1现金减免 2价格打折优惠
   * status 1活动未开始 2活动进行中 3活动已结束
   * range 0全部商品 1分类 2品牌 3商品
   * @author darlang
   */
  getActivityDetail() {
    wx.showLoading({title: '加载中...',mask: true});
    GetActivityInfo(this.data.id).then(res => {
      let ra = res.activity;
      ra.banner = '/images/default_activity-'+(ra.type||0)+'.png';
      ra.start_time = formatTime(ra.start_at);
      ra.end_time = formatTime(ra.end_at);
      ra.status = 2;//
      this.data.countTime = 999;
      if (+new Date() < ra.start_at*1000) {
        ra.status = 1;
        this.countTimeDown(ra.start_at);
        showToast('活动未开始','warning');
      }else{
        if (+new Date() > ra.end_at*1000) {
          showToast('活动已结束','error');
          ra.status = 3;
        }else{
          this.countTimeDown(ra.end_at);
        }
      }
      ra.users = ra.user_rank ? ra.user_rank.map(k => k.name).join('、') : '全体会员';
      if (ra.range === 0) {
        ra.rangex = '全部商品';
      }else if(ra.range === 1) {
        ra.rangex = '部分分类';
        // 处理分类名称 待续
      }else if(ra.range === 2) {
        ra.rangex = '部分品牌';
      }else if(ra.range === 3) {
        ra.rangex = '部分商品';
      }
      this.setData({
        activityInfo: ra
      });
      let colors = ['#92E1F4','#FC6D23','#2E17F3'];
      wx.setNavigationBarColor({
        animation: { duration: 300, timingFunc: "linear" },
        frontColor: "#ffffff",
        backgroundColor: colors[ra.type] || '#f0f2f5'
      });
      this.getGoodsList();
    }).catch(err => {
      if (err.data.error_code === 404) {
        showToast('活动不存在，或者已过期');
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/message/activity/index'
          });
        },500);
      }
    });
  },

  /**
   * 获取优惠商品
   * @author darlang
   */
  getGoodsList() {
    if (this.data.pages.done) {
      return false;
    }
    wx.showLoading({title: '加载优惠...',mask: true});
    GetGoodsList(this.data.pages.page,this.data.pages.size,'','','','','','',this.data.id).then(res => {
      console.log(res);
      const lst = scrollLoadList(this,res,'products','goodsList');
      this.setData({
        goodsList: lst
      });
    });
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const items = e.currentTarget.dataset;
    const status = this.data.activityInfo.status;
    if (status === 1) {
      showToast('活动未开始','warning');
      return false;
    }else if(status === 3) {
      showToast('活动已结束','error');
      return false;
    }
    const pathData = [
      {type: 'goods',path: '/pages/goods/detail/detail?id='+items.id}
    ];
    pushPagePath(e,pathData);
  },

  /**
   * 查看更多详情
   * @author darlang
   */
  switchMoreDetail() {
    this.setData({
      moreDetail: !this.data.moreDetail
    });
  },

  /**
   * 活动倒计时
   * @author darlang
   * @param  {Date}   time 时间
   */
  countTimeDown(time) {
    // console.log(time)
    if (this.data.countTime) {
      setTimeout(() => {
        this.setData({
          countTime: formatLeftTime(time)
        });
        this.countTimeDown(time);
      },1e3);
    }else {
      let status = this.data.activityInfo.status || '';
      let countTime = 999;
      if (status === 1) {
        this.countTimeDown(this.data.activityInfo.end_at);
        status = 2;
      }else{
        status = 3;
        countTime = 0;
      }
      this.setData({
        countTime: countTime,
        'activityInfo.status': status === 1 ? 2 : 3
      });
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
  onHide: function () {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.setData({
      activityInfo: '',
      goodsList: '',
      'pages.page': 1,
      'pages.done': false
    });
    this.getActivityDetail();
  },

  /**
   * 页面滚动触发事件的处理函数
   */
  onPageScroll: function() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getGoodsList();
  }
});