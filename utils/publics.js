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

/**
 * WeeShop 使用说明
 * ===========================================================
 * 先看根目录的 README.md 文件说明
 * 后修改根目录的 weeshop.config.js
 * ==========================================================
 * 先看根目录的 README.md 文件说明
 * 后修改根目录的 weeshop.config.js
 * ==========================================================
* 先看根目录的 README.md 文件说明
* 后修改根目录的 weeshop.config.js
* ==========================================================
 */

import { checkRoutePage,showToast,shopLevelRank } from './utils';
import { SocialSignIn,GetCartGoodsTotal,GetInvoiceType,GetInvoiceList } from './apis';

/**
 * 获取微信用户信息
 * @author darlang
 */
export function GetWechatUserInfo(e) {
  // 拒绝授权
  if (e.detail.errMsg === "getUserInfo:fail auth deny") {
    showToast('登录取消','warning');
    return false;
  }

  // 允许授权
  if (e.detail.errMsg === "getUserInfo:ok") {
    let openid = wx.getStorageSync("openid") || '';
    let userInfo = e.detail.userInfo;
    wx.setStorageSync('wxUserInfo', userInfo);// 保存微信授权登录信息到本地
    wx.login({
      success: (res) => {
        wx.showLoading({title: '登录中...',mask: true});
        SocialSignIn(res.code,openid).then((wxa) => {
          wx.setStorageSync("token", wxa.token);
          wx.setStorageSync("userInfo", wxa.user);
          wx.setStorageSync("openid", wxa.openid);
          wx.setStorageSync('loginStatus', true);
          if (wxa.is_new_user) {
            showToast("已成功注册,欢迎"+(userInfo.nickName || '您')+"加入...",'none',1800);
          } else {
            showToast("登录成功,欢迎"+(userInfo.nickName || '您')+"回来...",'none',1800);
          }
          setTimeout(() => {
            checkRoutePage();
          }, 1800);
        });
      }
    });
  }
}

/**
 * 检查VIP信息
 * @author darlang
 * @param  {Number}   minLevelScore 当前用户等级最低积分
 */
export function CheckUserLevel(minLevelScore) {
  console.log("当前拥有积分：",minLevelScore);
  let userLevel = 0;
  // shopLevelRank 目前先从配置定义(weeshop.config.js)中获取，为了保证数据的灵活及可靠、建议二次开发，通过接口获取后台的。
  if (shopLevelRank && shopLevelRank.length > 0) {
    userLevel = shopLevelRank.find(k => Number(k.min) === Number(minLevelScore)).level;
  }

  console.log(userLevel);
  return (parseInt(userLevel) || 0);
}

/**
 * 检查发票信息
 * @author darlang
 * @param  {Number} id   发票类型/内容 id
 * @param  {String} type 类型/内容
 */
export function CheckInvoiceInfo(id,type) {
  if (type === 'type') {
    return GetInvoiceType().then(res => {
      return res.types.find(k => parseInt(k.id) === parseInt(id)).name;
    });
  }
  if (type === 'content') {
    return GetInvoiceList().then(res => {
      return res.contents.find(k => parseInt(k.id) === parseInt(id)).name;
    });
  }
}

/**
 * 检查购物车数量
 * @author darlang
 * @param  {[type]}   cartTotal 购物车数量
 */
export function CheckCartTotal(cartTotal) {
  if (cartTotal >= 0) {
    wx.setTabBarBadge({index: 2, text: cartTotal.toString()});
  }else{
    GetCartGoodsTotal().then(res => {
      if (res >= 0) {
        wx.setTabBarBadge({index: 2, text: res.toString()});
      }
    });
  }
}