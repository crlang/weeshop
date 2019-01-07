/**
 * WeeShop 声明
 * ===========================================================
 * 版权 大朗 所有，并保留所有权利
 * 网站地址: http://www.darlang.com
 * 标题: ECShop 小程序「weeshop 」- 基于 ECShop 3.6 版本开发的非官方微信小程序
 * 短链接: https://www.darlang.com/?p=709
 * 说明：源码已开源并遵循 MIT 协议，你有权利进行任何修改，但请保留出处，请不要删除该注释。
 * ==========================================================
 * @Author: Darlang
 */
// app.js
import util from './utils/util.js';
App({
  onLaunch: function() {
    util.updateCartNum();
  },

  globalData: {
    userInfo: null,
    openid: null
  }
});
