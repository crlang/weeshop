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
import {PNT,setNavBarTitle,showToast,pushPagePath,scrollLoadList} from "../../../../utils/utils";
import {GetShippingStatus,GetOrderList,GetCancelOrderReason,ConfirmOrder,CancelOrder} from "../../../../utils/apis";
// import {CheckUserLevel} from "../../../utils/publics";

Page({
  /**
   * 页面的初始数据
   */
  data: {
    status: '10',
    tabStatus: [{id:10,label:'全部'},{id: 0,label:'待付款'},{id:1,label:'待发货'},{id:2,label:'待收货'},{id:3,label:'待评价'}],
    orderStatus: ['待付款','待发货','待收货','已收货','已完成','已取消'],
    orderLst: '',
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
    setNavBarTitle(PNT.order.main);
    this.loginModal = this.selectComponent("#login-modal");

    this.setData({
      status: opt.status || '10'
    });
    this.getOrderList();
    this.getCancelReason();
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const items = e.currentTarget.dataset;
    const pathData = [
      {type: 'order',path: '/pages/member/order/detail/detail?id=' + items.id},
      // {type: 'goods',path: '/pages/goods/detail/detail?id=' + items.id},
      {type: 'comment',path: '/pages/member/comment/add/add?orderId=' + items.id},
      {type: 'payment',path: '/pages/shopping/payment/payment?orderId=' + items.id},
      // {type: 'shipping',path: '/pages/member/order/shipping/index?id'},
    ];
    pushPagePath(e,pathData);
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.bindSorderTap();
    }
  },

  /**
   * 订单筛选
   *  0待付款 1待发货 2发货中 3已收货 4已评价 5已取消
   * @author darlang
   */
  bindSorderTap(e) {
    let id = e ? e.currentTarget.dataset.id : '10';
    let oid = this.data.status;
    if (e && id === oid) {
      return false;
    }
    this.setData({
      orderLst: '',
      'pages.page': 1,
      'pages.done': false,
      status: id
    });
    this.getOrderList();
  },

  /**
   * 获取订单列表
   * @author darlang
   */
  getOrderList() {
    if (this.data.pages.done) {
      return false;
    }

    wx.showLoading({title: '加载中...',mask: true});
    GetOrderList(this.data.pages.page,this.data.pages.size,this.data.status).then(res => {
      for (let i = 0; i < res.orders.length; i++) {
        res.orders[i].totalNum = 0;
        let item = res.orders[i];
        if (item.goods && item.goods.length > 0) {
          item.goods.forEach(k => {
            item.totalNum += k.total_amount;
          });
        }
      }

      const lst = scrollLoadList(this,res,'orders','orderLst');
      this.setData({
        orderLst: lst
      });
    });
  },

  /**
   * 获取取消原因
   * @author darlang
   */
  getCancelReason() {
    GetCancelOrderReason().then(res => {
      console.log(res);
      this.setData({
        cancelReasonList: res.reasons
      });
    });
  },

  /**
   * 选择原因
   * @author darlang
   */
  bindCancelReason(e) {
    let self = this;
    let items = e.currentTarget.dataset;
    let cancelReasonList = this.data.cancelReasonList;
    let crlArr = cancelReasonList.map(k => k.name);
    wx.showActionSheet({
      itemList: crlArr,
      success(res) {
        let i = res.tapIndex;
        self.onCancelOrder(items.id,cancelReasonList[i].id);
      },
      fail() {
        // showToast('未选择原因','warning');
      }
    });
  },

  /**
   * 取消订单
   * @author darlang
   * @param  {Number}   id 订单 id
   * @param  {Number}   reason 原因 id
   */
  onCancelOrder(id,reason) {
    wx.showModal({
      title: '温馨提示',
      content: '是否要取消当前订单？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({title: '正在查询...',mask: true});
          CancelOrder(id,reason).then(() => {
            showToast('订单已取消', 'success');
            this.findOrderIndex(id,'cancel');
          }).catch(err => {
            if (err.error_code === 404) {
              showToast('重复取消','warning');
              this.findOrderIndex(id,'cancel');
            }
          });
        }
      }
    });
  },

  /**
   * 确认订单
   * @author darlang
   */
  onConfirmOrder(e) {
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '温馨提示',
      content: '是否确认收货？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({title: '查询中...',mask: true});
          ConfirmOrder(id).then(() => {
            showToast('收货成功', 'success',800);
            this.findOrderIndex(id,'confirm');
          }).catch(err => {
            if (err.error_code === 404) {
              showToast('已确认收货','warning');
              this.findOrderIndex(id,'confirm');
            }
          });
        }
      }
    });
  },

  /**
   * 查找订单位置
   * @author darlang
   * @param  {Number}   id   订单id
   * @param  {String}   type 类型
   */
  findOrderIndex(id,type) {
    let olst = this.data.orderLst;
    let idx = olst.findIndex(k => {
      return k.id == id;
    });
    if (type === 'cancel') {
      type = 5;
    }
    if (type === 'confirm') {
      type === 3;
    }

    olst[idx].status = type;
    this.setData({
      orderLst: olst
    });

  },

  /**
   * 查询物流编号
   * @author darlang
   */
  bindExpress(e) {
    let id =  e.currentTarget.dataset.id;
    GetShippingStatus(id).then(res => {
      let sn = res.code;
      wx.showModal({
        title: '物流提示',
        content: '当前物流：' + res.vendor_name + '\r\n物流编号：' + res.code + '\r\n暂不支持查询物流，点击复制物流编号',
        showCancel: false,
        confirmText: "已复制",
        success: (res) => {
          if (res.confirm) {
            wx.setClipboardData({
              data: sn,
              success: () => {
                showToast("复制成功","success",800);
              }
            });
          }
        }
      });
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
    this.bindSorderTap();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getOrderList();
  }
});