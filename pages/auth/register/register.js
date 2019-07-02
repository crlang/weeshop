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

// register.js
import {PNT,setNavBarTitle,showToast,miniProName,checkEmail} from "../../../utils/utils";
import {SignUp,SignIn} from "../../../utils/apis";
import {GetWechatUserInfo} from "../../../utils/publics";


Page({
  /**
   * 页面的初始数据
   */
  data: {
    miniProName,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    setNavBarTitle(PNT.auth.register);
  },


  /**
   * 注册
   * @author darlang
   */
  register(e) {
    let params = e.detail.value;
    if(!params.username) {
      showToast('请输入用户名');
      return false;
    }

    if(params.email) {
      showToast('请输入邮箱');
      return false;
    }else{
      if (!checkEmail(params.email)) {
        showToast('邮箱格式有误');
        return false;
      }
    }

    if(params.password.length < 6) {
      showToast('密码不能少于6个字符');
      return false;
    }else{
      if(params.password !== params.repassword){
        showToast('两次密码不一致');
        return false;
      }
    }

    wx.showLoading({title: '注册中...',mask: true});
    SignUp(params.username,params.email,params.password).then(() => {
      wx.showModal({
        title: '注册成功',
        content: '注册成功，是否立刻登录？',
        cancelText: '首页',
        cancelColor: '#999999',
        confirmText: '登录',
        confirmColor: '#9c27ff',
        success: (res) => {
          if(res.confirm) {
            SignIn(params.username,params.password);
          }else {
            showToast('未登录将影响后续购物','warning');
            setTimeout(() => {
              wx.reLaunch({
                url: '/pages/index/index',
              });
            }, 900);
          }
        }
      });
    });
  },

  /**
   * 微信快捷登录
   * @author darlang
   */
  getUserInfo(e) {
    GetWechatUserInfo(e);
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

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  }
});