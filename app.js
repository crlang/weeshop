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

// app.js
App({
  onLaunch(opt) {
    wx.getSystemInfo({
      success (res) {
        console.log('系统信息：',res);
        wx.setStorageSync('systemInfo',res);
      }
    });
    // 如果是被推荐/分享进来的话,一般带有推荐码 (inviteCode)
    if (opt.inviteCode) {
      wx.setStorageSync('inviteCode',opt.inviteCode);
    }
  },

  /**
   * 版本更新检查
   * @author darlang
   */
  initVerCheck() {
    const updateManager = wx.getUpdateManager();
    updateManager.onCheckForUpdate();
    updateManager.onUpdateReady((res) => {
      console.log('检出新版本：',res);
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，请重启更新！',
        showCancel: false,
        confirmText: '重启更新',
        confirmColor: '#9c27ff',
        success() {
          // 无论点击取消或者确定，都强制更新
          // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
          try {
            const token = wx.getStorageSync('token');
            wx.clearStorageSync();
            wx.setStorageSync('token', token);
          } catch(e) {
            console.log('清理缓存失败：',e);
          }
          updateManager.applyUpdate();
        }
      });
    });
  },

  onShow() {
    this.initVerCheck();
  },

  onPageNotFound() {
    wx.switchTab({
      url: '/pages/index/index'
    });
  }
});
