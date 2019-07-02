/**
 * WeeShop 声明
 * ===========================================================
 * 版权 大朗 所有，并保留所有权利
 * 网站地址: http://www.darlang.com
 * 标题: ECShop 小程序「weeshop 」- 基于 ECShop 为后台系统开发的非官方微信商城小程序
 * 短链接: https://www.darlang.com/?p=709
 * 说明：源码已开源并遵循 MIT 协议，你有权利进行任何修改，但请保留出处，请不要删除该注释。
 * ==========================================================
 * @Author: Darlang
 */

import {request,showToast,miniProName} from "../../utils/utils";

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    notLogin:{// 默认不弹出登录弹窗
      type: Boolean,
      value: false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    miniProName: miniProName
  },

  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  pageLifetimes: {
    show: function() {
      // 页面被展示
      this.check();
    },
    hide: function() {
      // 页面被隐藏
    },
    resize: function(size) {
      // 页面尺寸变化
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 登录检查
     * 已登录返回true，未登录返回false
     * @author darlang
     */
    check() {
      let loginStatus = wx.getStorageSync("loginStatus") || false;// loginStatus 为 true 时表示已经登录
      if (loginStatus) {
        this.setData({
          notLogin: false
        });
        return true;// 返回登录 true 状态表示已经登录
      }else{
        this.setData({
          notLogin: true
        });
        return false;// 返回登录 false 状态表示尚未登录
      }
    },

    /**
     * 授权弹窗回调
     * 将会回调 loginCallback 事件，请通过 bindloginCallback="func()" 获取回调内容
     * 登录成功：返回 type 为 success ，并且返回登录 userInfo 信息
     * 登录失败：返回 type 为 fail ，并且返回失败 failInfo 信息
     * @param {*} e
     */
    getUserInfo(e) {
      let self = this;
      let inviteCode = wx.getStorageSync('inviteCode') || '';
      // 拒绝授权
      if (e.detail.errMsg === "getUserInfo:fail auth deny") {
        return false;
      }
      // 允许授权
      if (e.detail.errMsg === "getUserInfo:ok") {
        let userInfo = e.detail.userInfo;
        let openid = wx.getStorageSync("openid") || '';
        wx.setStorageSync('wxUserInfo', userInfo);// 保存微信授权登录信息到本地
        wx.login({
          success: (res) => {
            wx.showLoading({title: '登录中...',mask: true});
            request("ecapi.auth.social", "POST", {
              vendor: 5,// 1微信、2微博、3qq、4淘宝、5小程序
              js_code: res.code,
              open_id: openid,
              // device_id: '',
              // access_token: '',
              invite_code: inviteCode, // 推广码，如果分享出去的将会携带分享者的推广码
            })
              .then((soc) => {
                wx.hideLoading();
                wx.setStorageSync("token", soc.token);
                wx.setStorageSync("userInfo", soc.user);
                wx.setStorageSync("openid", soc.openid);
                wx.setStorageSync('loginStatus', true);
                self.triggerEvent("loginCallback",{type: 'success',userInfo: soc.userInfo || ''});
                self.check();
                if (soc.is_new_user) {
                  showToast("已成功注册,欢迎"+(userInfo.nickName || '您')+"...",'none',1800);
                } else {
                  showToast("登录成功,欢迎"+(userInfo.nickName || '您')+"回来...",'none',1800);
                }
              })
              .catch((err) => {
                wx.hideLoading();
                console.log(err);
                self.triggerEvent("loginCallback",{type: 'fail',failInfo: err.data || ''});
                try {
                  showToast(err.data.error_desc);
                } catch(e) {
                  console.log(e);
                }
              });
          }
        });
      }
    },

    /**
     * 页面跳转
     * @author darlang
     */
    pushPath(e) {
      let type = e.currentTarget.dataset.type;
      // this.setData({
      //   notLogin: false
      // });
      if (type === 'account') {
        wx.navigateTo({
          url: '/pages/auth/login/login'
        });
      }
      if (type === 'mask') {
        this.setData({
          notLogin: false
        });
      }
    },

    /**
     * 背景滚动事件
     */
    preventTouchMove(e) {
      // console.log(e)
    }
  }
});
