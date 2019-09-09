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
// weeshop.config.js
/* ================================ weeshop 配置 ================================ */

/**
 * 小程序名称
 * @deprecated      必填，名称必须保持和 app.json -> window -> navigationBarTitleText 的名称一致
 * @type {String}   例如：https://${shopUrl}.com
 */
const miniProName = 'weeShop';

/**
 * 商城地址
 * @deprecated      必填，商城地址，不是 API 地址
 * @type {String}   例如：https://${shopUrl}.com
 */
const shopUrl = "https://ecshop.com";


/**
 * 商城 API 地址
 * @deprecated      商城 API 地址，不是商城地址。为空则默认：https://api.${shopUrl}.com
 * @type {String}   例如：https://${shopUrl}.com
 */
let apiUrl = "";

/**
 * 开启积分商城 【4.0以上版本可开】
 * @deprecated      默认不开启。是否开启积分商城，注意 4.0 才有积分兑换功能。
 * 如果 3.6 版本想要开启积分兑换，则需要二次开发，后续请留意积分商城二次开发视频教程。
 * @type {String}   例如：https://${shopUrl}.com
 */
let pointsMall = false;// 功能为完善，请勿开启

/**
 * 站内快讯分类 ID
 * @deprecated      选填，用于首页显示商城站内快讯，默认为分类 1
 * @type {String}   后台管理中心 -> 文章管理 -> 文章分类 -> 查看文章分类 id {cat_id=xxx}
 */
const shopNoticeCatId = '1';

/**
 * 使用帮助分类 ID
 * @deprecated      选填，用于首页显示商城帮助中心，默认为分类 2
 * @type {String}   后台管理中心 -> 文章管理 -> 文章分类 -> 查看文章分类 id {cat_id=xxx}
 */
const shopHelpCatId = '2';

/**
 * 商城积分折扣比例
 * @deprecated      谨慎修改！！！用户支付时可使用积分抵扣的商品，默认：每 100 积分可抵扣 1 元，请根据实际情况修改前面的 “1” 代表 1 元
 * @type {String}   后台管理中心 -> 系统设置 -> 商店设置 -> 基本设置 {积分换算比例}
 */
const shopScoreScale = 1 / 100;

/**
 * 商城积分及会员等级
 * @description    默认最多只能拥有 7 个会员等级，与后台保持一致，由于没有 api 接口，只能在这里定义
 * @type {String}   后台管理中心 -> 会员管理 -> 会员等级 -> 添加或修改会员等级
 */
// * 会员等级需要与后台保持一致！！！
// * 会员等级需要与后台保持一致！！！
// * 会员等级需要与后台保持一致！！！
/**
 * weeshop 定义的等级比例默认值（供参考）：
 * v0注册会员 0         -1000       -100%折扣(无折扣)
 * v1青铜会员 1000      -10000      -永久99%折扣 ---消费了 10 后才有这个折扣
 * v2白银会员 10000     -100000     -永久98%折扣 ---消费了 100 后才有这个折扣
 * v3黄金会员 100000    -1000000    -永久96%折扣 ---消费了 1k 后才有这个折扣
 * v4钻石会员 1000000   -10000000   -永久92%折扣 ---消费了 1w 后才有这个折扣
 * v5紫金会员 10000000  -100000000  -永久84%折扣 ---消费了 10w 后才有这个折扣
 * v6至尊会员 100000000 -1000000000 -永久68%折扣 ---消费了 100w 后才有这个折扣
 * 上面规则按照 1:100 积分比例
 * @type {Array}
 */
const shopLevelRank = [
  { level: 0,name: '注册会员',min: 0, max: 1000, disc: '100%' },
  { level: 1,name: '青铜会员',min: 1000, max: 10000, disc: '99%' },
  { level: 2,name: '白银会员',min: 10000, max: 100000, disc: '98%' },
  { level: 3,name: '黄金会员',min: 100000, max: 1000000, disc: '96%' },
  { level: 4,name: '钻石会员',min: 1000000, max: 10000000, disc: '92%' },
  { level: 5,name: '紫金会员',min: 10000000, max: 100000000, disc: '84%' },
  { level: 6,name: '至尊会员',min: 100000000, max: 1000000000, disc: '68%' }
];

/**
 * 商城语言-未实现
 * @description 目前版本未实现多语言，敬请期待
 */
const siteLanguage = 'zh';// zh:简体 en:英文 tw:繁体

/* ================================ weeshop 配置 end ================================ */




/* ================================ 以下修改，请谨慎 ================================ */

// apiUrl 接口处理
if (apiUrl.length === 0) {
  if (shopUrl.indexOf("https://") > -1) {
    let t = shopUrl.substring(8);
    apiUrl = "https://api." + t + "/v2/";
  } else if (shopUrl.indexOf("http://") > -1) {
    let t = shopUrl.substring(7);
    apiUrl = "http://api." + t + "/v2/";
  } else {
    wx.showModal({
      title: "shopUrl 配置错误",
      content: "shopUrl 地址必须带 http/https",
      showCancel: false
    });
  }
} else {
  if (apiUrl.indexOf("https://") > -1 || apiUrl.indexOf("http://") > -1) {
    apiUrl = apiUrl + "/v2/";
  } else {
    wx.showModal({
      title: "apiUrl 配置错误",
      content: "apiUrl 地址必须带 http/https",
      showCancel: false
    });
  }
}

// 导出配置
module.exports = {
  shopUrl,
  apiUrl,
  miniProName,
  shopNoticeCatId,
  shopHelpCatId,
  shopScoreScale,
  shopLevelRank,
  pointsMall
};