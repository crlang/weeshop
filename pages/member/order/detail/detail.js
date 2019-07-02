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
import {PNT,setNavBarTitle,showToast,pushPagePath,formatTime} from "../../../../utils/utils";
import {GetShippingStatus,GetOrderInfo,GetCancelOrderReason,ConfirmOrder,CancelOrder} from "../../../../utils/apis";
import {CheckInvoiceInfo} from '../../../../utils/publics';
import {PROMOS_TYPE} from '../../../../utils/status';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    orderDetail: '',
    orderStatus: ['等待买家付款','等待卖家发货','等待买家收货','交易成功','交易成功','交易取消'],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    setNavBarTitle(PNT.order.detail);
    this.loginModal = this.selectComponent("#login-modal");
    if (!opt.id) {
      showToast('订单id异常','warning');
      return false;
    }
    this.setData({
      id: parseInt(opt.id)
    });
  },

  /**
   * 页面跳转
   * @author darlang
   */
  pushPath(e) {
    const items = e.currentTarget.dataset;
    const pathData = [
      {type: 'goods',path: '/pages/goods/detail/detail?id=' + items.id},
      {type: 'comment',path: '/pages/member/comment/add/add?orderId=' + items.id},
      {type: 'payment',path: '/pages/shopping/payment/payment?orderId=' + items.id},
      // {type: 'shipping',path: '/pages/member/order/shipping/index?id'},
    ];
    pushPagePath(e,pathData);
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
    let self = this;
    wx.showModal({
      title: '温馨提示',
      content: '是否要取消当前订单？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({title: '正在查询...',mask: true});
          CancelOrder(id,reason).then(() => {
            showToast('订单已取消', 'success');
            self.setData({
              'orderDetail.status': 5
            });
          }).catch(err => {
            if (err.error_code === 404) {
              showToast('重复取消','warning');
              self.setData({
                'orderDetail.status': 5
              });
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
    let self = this;
    let id = e.currentTarget.dataset.id;
    wx.showModal({
      title: '温馨提示',
      content: '是否确认收货？',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({title: '查询中...',mask: true});
          ConfirmOrder(id).then(() => {
            showToast('收货成功', 'success',800);
            self.setData({
              'orderDetail.status': 3
            });
          }).catch(err => {
            if (err.error_code === 404) {
              showToast('已确认收货','warning');
              self.setData({
                'orderDetail.status': 3
              });
            }
          });
        }
      }
    });
  },


  /**
   * 查询物流编号及跳转查询
   * @author darlang
   */
  bindExpress() {
    GetShippingStatus(this.data.id).then(res => {
      let sn = res.code;
      wx.showModal({
        title: '物流提示',
        content: '当前物流：' + res.vendor_name + '\r\n物流编号：' + res.code + '\r\n暂不支持查询物流，点击复制物流编号',
        showCancel: false,
        confirmText: "已复制",
        success(res) {
          if (res.confirm) {
            wx.setClipboardData({
              data: sn,
              success() {
                showToast("复制成功","success",800);
              }
            });
          }
        }
      });
    });
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.reInitData();
    }
  },

  /**
   * 获取订单信息
   * @author darlang
   */
  getOrderInfo() {
    wx.showLoading({title: '加载中...',mask: true});
    GetOrderInfo(this.data.id).then((res) => {
      let o = res.order;
      if (o.promos && o.promos.length) {
        for (let i = 0; i < o.promos.length; i++) {
          o.promos[i].label = PROMOS_TYPE.find(k => k.code === o.promos[i].promo).label || '其他优惠';
        }
      }
      if (o.invoice && o.invoice.type) {
        CheckInvoiceInfo(o.invoice.type,'type').then(xres => {
          this.setData({
            'orderInfo.invoice.type': xres
          });
        });
        CheckInvoiceInfo(o.invoice.content,'content').then(xres => {
          this.setData({
            'orderInfo.invoice.content': xres
          });
        });
      }
      o.canceled_at = o.canceled_at ? formatTime(o.canceled_at,'Y年M月D日 h:i:s') : '';// 取消时间
      o.created_at = o.created_at ? formatTime(o.created_at,'Y年M月D日 h:i:s') : '';// 下单时间
      o.finish_at = o.finish_at ? formatTime(o.finish_at,'Y年M月D日 h:i:s') : '';// 完成时间
      o.paied_at = o.paied_at ? formatTime(o.paied_at,'Y年M月D日 h:i:s') : '';// 支付时间
      o.shipping_at = o.shipping_at ? formatTime(o.shipping_at,'Y年M月D日 h:i:s') : '';// 发货时间
      o.updated_at = o.updated_at ? formatTime(o.updated_at,'Y年M月D日 h:i:s') : '';// 更新时间
      this.setData({
        orderDetail: o
      });
    });
  },

  /**
   * 重新获取
   * @author darlang
   */
  reInitData() {
    this.setData({
      orderDetail: ''
    });
    this.getOrderInfo();
    this.getCancelReason();
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
    wx.setNavigationBarColor({
      frontColor: "#ffffff",
      backgroundColor: "#9c27ff",
      animation: {
        duration: 300,
        timingFunc: "linear"
      }
    });
    this.reInitData();
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
    this.reInitData();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
});