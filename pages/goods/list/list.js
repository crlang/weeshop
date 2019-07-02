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
import {PNT,setNavBarTitle,shopScoreScale,scrollLoadList,pushPagePath} from "../../../utils/utils";
import {GetGoodsList} from "../../../utils/apis";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    downState: false,// 下拉列表
    goodsLst: '',
    lstParams: {
      page: '',// required|integer|min:1
      per_page: '',// required|integer|min:1
      brand: '',// integer|min:1
      category: '',// integer|min:1
      shop: '',// integer|min:1
      keyword: '',// string|min:1
      sort_key: 0,// string|min:1 0综合;1价格;2热门;3信用;4销量;5日期;
      sort_value: 2,// required_with:sort_key|string|min:1 1升序2降序;
    },
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
    if (opt.keyword) {
      setNavBarTitle(PNT.goods.search + ":" + opt.keyword);
    }else{
      setNavBarTitle(PNT.goods.list);
    }
    this.setData({
      "lstParams.category" : opt.catId || '',
      "lstParams.keyword" : opt.keyword || '',
      'lstParams.sort_key': opt.sortKey || '0',
      'lstParams.sort_value': opt.sortValue || '2'
    });
    this.getGoodsList();
  },


  /**
   * 商品排序
   * @author darlang
   */
  bindSorderTap(e) {
    let sortKey = Number(e.currentTarget.dataset.sk || 1);
    let sortValue = this.data.lstParams.sort_value;
    if(sortKey === 1) {
      sortValue = sortValue === 1 ? 2 : 1;
    }else{
      sortValue = 2;
    }
    this.setData({
      'goodsLst': [],
      'downState': false,
      'pages.page': 1,
      'pages.done': false,
      'lstParams.sort_key': sortKey,
      'lstParams.sort_value': sortValue
    });
    this.getGoodsList();
  },

  /**
   * 下拉切换
   * @author darlang
   */
  bindDorderTap() {
    this.setData({
      downState: !this.data.downState
    });
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const items = e.currentTarget.dataset;
    const pathData = [
      {type: 'goods',path: '/pages/goods/detail/detail?id='+items.id}
    ];
    pushPagePath(e,pathData);
  },

  /**
   * 获取商品列表
   * @author darlang
   */
  getGoodsList() {
    if (this.data.pages.done) {
      return false;
    }
    let params = this.data.lstParams;
    params.page = this.data.pages.page;
    params.per_page = this.data.pages.size;

    wx.showLoading({title: '加载中...',mask: true});
    GetGoodsList(params.page,params.per_page,params.category,params.keyword,params.sort_key,params.sort_value).then(res => {
      if (res.products) {
        for (let i = 0; i < res.products.length; i++) {
          // 处理折扣比例
          if (res.products[i].score > 0 && shopScoreScale && res.products[i].current_price) {
            res.products[i].score_rate = (res.products[i].score * shopScoreScale / res.products[i].current_price).toFixed(2) * 100;
            res.products[i].score_rate = res.products[i].score_rate > 100 ? '100%' : res.products[i].score_rate+'%';
          }
        }
      }

      const lst = scrollLoadList(this,res,'products','goodsLst');
      this.setData({
        goodsLst: lst
      });
    });

  },

  /**
   * 重新获取商品列表
   * @author darlang
   */
  repullGoodsList() {
    this.setData({
      goodsLst: '',
      'pages.page': 1,
      'pages.done': false
    });
    this.getGoodsList();
  },

  /**
   * 背景滚动事件
   * @author darlang
   */
  preventTouchMove(e) {
    // console.log(e)
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
    this.repullGoodsList();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getGoodsList();
  }
});