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
import {PNT,setNavBarTitle,showToast,checkMobile} from "../../../../utils/utils";
import {GetBalanceTotal,SubmitWithdraw} from '../../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    balanceInfo: '0.00',
    withdrawLst: '',
    withdrawParams: {
      cash: '',// 金额
      memo: '',// 备注
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    setNavBarTitle(PNT.withdraw.main);
  },

  /**
   * 绑定输入
   * @author darlang
   */
  bindInput(e) {
    let type = e.currentTarget.dataset.type;
    let v = e.detail.value || '';
    if (!type) {
      return false;
    }
    if (type === 'username') {
      this.setData({
        username: v
      });
    }
    if (type === 'mobile') {
      this.setData({
        mobile: v
      });
    }
    if (type === 'bank') {
      this.setData({
        bank: v
      });
    }
    if (type === 'remark') {
      this.setData({
        remark: v
      });
    }
    if (type === 'amount') {
      if (parseFloat(v) > parseFloat(this.data.balanceInfo)) {
        v = parseFloat(this.data.balanceInfo);
      }
      this.setData({
        "withdrawParams.cash": v
      });
    }
    if (type === 'all') {
      this.setData({
        "withdrawParams.cash": this.data.balanceInfo
      });
    }
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.initData();
    }
  },

  /**
   * 初始化金额
   * @author cdarlang
   */
  initData() {
    GetBalanceTotal().then(res => {
      this.setData({
        balanceInfo: res.amount || '0.00'
      });
    });
  },

  /**
   * 提交提现
   * @author darlang
   */
  submitWithdraw() {
    let params = this.data.withdrawParams;
    if (!this.data.username) {
      showToast('请输入联系人名称');
      return false;
    }
    if (!this.data.mobile) {
      showToast('请输入联系人手机');
      return false;
    }else{
      if (!checkMobile(this.data.mobile)) {
        showToast('联系人手机格式有误');
        return false;
      }
    }
    if (!this.data.bank) {
      showToast('请输入银行卡号码');
      return false;
    }
    if (!params.cash) {
      showToast('请输入金额');
      return false;
    }
    params.memo = `联系人：${this.data.username}\n电话：${this.data.mobile}\n银行卡：${this.data.bank}\n其他备注：${this.data.remark || ''}`;
    wx.showModal({
      title: '提现提示',
      content: '请确认是否继续提现？',
      showCancel: true,
      cancelText: '确认提现',
      cancelColor: '#999999',
      confirmText: '暂不提现',
      confirmColor: '#9c27ff',
      success: (res) => {
        if(res.confirm) {
          wx.navigateBack();
        }else{
          wx.showLoading({title: '处理中...',mask: true});
          SubmitWithdraw(params.cash,params.memo).then(res => {
            wx.redirectTo({
              url: '/pages/member/withdraw/complete/complete?type=wait&id='+res.withdraw.id+"&price="+params.cash
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
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.initData();
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
  }
});