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

// userinfo.js
import {PNT,setNavBarTitle,showToast} from "../../../utils/utils";
import {GetProfileInfo,SaveProfileInfo,GetProfileFields} from '../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    popupStatus: '',
    userInfo: '',
    userFields: '',
    genderData: ['保密','男','女'],
    profileParams: {
      'nickname': '',// string|max:25'
      'gender': '',// integer|in:0,1,2'
      'avatar_url': '',// string'
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    setNavBarTitle(PNT.member.userinfo);
    this.loginModal = this.selectComponent("#login-modal");
  },

  /**
   * 获取用户信息
   * @author darlang
   */
  getUserInfo() {
    wx.showLoading({title: '加载中...',mask: true});
    GetProfileInfo().then(res => {
      this.setData({
        userInfo: res.user
      });
    });
  },

  /**
   * 获取用户字段
   * @author darlang
   */
  getUserFields() {
    wx.showLoading({title: '加载中...',mask: true});
    GetProfileFields().then(res => {
      wx.hideLoading();
      this.setData({
        userFields: res.signup_field
      });
    });
  },

  /**
   * 绑定输入
   * @author darlang
   */
  bindInputChange(e) {
    let items = e.currentTarget.dataset;
    let v = e.detail.value || '';
    if (items.type === 'nicknameValue') {
      this.setData({
        "profileParams.nickname": v
      });
    }
    if (items.type === 'nickname' || items.type === 'avatar' || items.type === 'fields') {
      this.setData({
        popupStatus: items.type
      });
    }
    if (items.type === 'fields' && items.id) {
      let userFields = this.data.userFields;
      userFields[items.i].value = v;
      this.setData({
        userFields: userFields
      });
    }
    if (items.type === 'gender') {
      this.changeGender();
    }
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.getUserFields();
      this.getUserInfo();
    }
  },

  /**
   * 取消修改-弹窗
   * @author darlang
   */
  cancelChange() {
    this.setData({
      popupStatus: '',
      "profileParams.nickname": ''
    });
  },

  /**
   * 确定修改-弹窗
   * @author darlang
   */
  confirmChange(e){
    let type = this.data.popupStatus;
    if (type === 'avatar') {// 头像修改有问题
      // 拒绝授权
      if (e.detail.errMsg === "getUserInfo:fail auth deny") {
        showToast('需要授权才能同步头像');
        return false;
      }

      // 允许授权
      if (e.detail.errMsg === "getUserInfo:ok") {
        this.setData({
          "profileParams.avatar_url": e.detail.userInfo.avatarUrl
        });
        this.changeUserInfo();
        this.cancelChange();
      }

    }else if(type === 'nickname'){
      this.changeUserInfo();
      this.cancelChange();
    }else if(type === 'fields') {// 用户字段修改有问题
      let uf = this.data.userFields || '';
      uf = uf.map(k => {return {id: k.id,value: k.value};});
      this.setData({
        "profileParams.values": JSON.stringify(uf)
      });
      this.changeUserInfo();
      this.cancelChange();
    }
  },

  /**
   * 修改性别
   * @author darlang
   */
  changeGender(){
    let self = this;
    let genderData = this.data.genderData;
    wx.showActionSheet({
      itemList: genderData,  // 最多6个
      itemColor: '#9c27ff',
      success: (res) => {
        self.setData({
          "userInfo.gender": res.tapIndex,
          "profileParams.gender": res.tapIndex
        });
        self.changeUserInfo();
      }
    });
  },

  /**
   * 修改用户信息
   * @author darlang
   */
  changeUserInfo() {
    let params = this.data.profileParams;
    wx.showLoading({title: '保存中...',mask: true});
    SaveProfileInfo(params.nickname,params.gender,params.avatar_url,params.values).then(res => {
      showToast('保存成功','success');
      this.setData({
        profileParams: {
          'nickname': '',
          'gender': '',
          'avatar_url': '',
        },
        userInfo: res.user
      });
    }).catch(() => {
      showToast('保存失败','error');
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
    this.getUserFields();
    this.getUserInfo();
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
});