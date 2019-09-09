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

import {miniProName} from "../weeshop.config";

/* ECM 订单状态 */
const STATUS_CREATED     = 0; // 待付款
const STATUS_PAID        = 1; // 已付款
const STATUS_DELIVERING  = 2; // 发货中
const STATUS_DELIVERIED  = 3; // 已收货，待评价
const STATUS_FINISHED    = 4; // 已完成
const STATUS_CANCELLED   = 5; // 已取消


/* 订单状态 */
const OS_UNCONFIRMED     = 0; // 未确认
const OS_CONFIRMED       = 1; // 已确认
const OS_CANCELED        = 2; // 已取消
const OS_INVALID         = 3; // 无效
const OS_RETURNED        = 4; // 退货
const OS_SPLITED         = 5; // 已分单
const OS_SPLITING_PART   = 6; // 部分分单


/* 支付状态 */
const PS_UNPAYED         = 0; // 未付款
const PS_PAYING          = 1; // 付款中
const PS_PAYED           = 2; // 已付款


/* 配送状态 */
const SS_UNSHIPPED       = 0; // 未发货
const SS_SHIPPED         = 1; // 已发货
const SS_RECEIVED        = 2; // 已收货
const SS_PREPARING       = 3; // 备货中
const SS_SHIPPED_PART    = 4; // 已发货(部分商品)
const SS_SHIPPED_ING     = 5; // 发货中(处理分单)
const OS_SHIPPED_PART    = 6; // 已发货(部分商品)

/* 取消原因 */
export const reason    = ['改选其他商品', '改选其他配送方式', '不想买了', '其他原因'];

/* 商品状态 */
const NOSORT     = 0; // 默认
const PRICE      = 1; // 价格
const POPULAR    = 2; // 热门
const CREDIT     = 3; // 信用
const SALE       = 4; // 销量
const DATE       = 5; // 日期

const ASC        = 1; // 升序
const DESC       = 2; // 降序

/* 金额状态 */
const IN = 1;         // 收入
const OUT = 2;        // 支出


/* 优惠类型 */
const FAT_GOODS                 = 0; // 送赠品或优惠购买
const FAT_PRICE                 = 1; // 现金减免
const FAT_DISCOUNT              = 2; // 价格打折优惠

/* 优惠活动的优惠范围 */
const FAR_ALL                   = 0; // 全部商品
const FAR_CATEGORY              = 1; // 按分类选择
const FAR_BRAND                 = 2; // 按品牌选择
const FAR_GOODS                 = 3; // 按商品选择


/* 分成类型 */
const SIGNUP = 0;   //  注册分成
const ORDER  = 1;   //  订单分成

/* 分成状态 */
const WAIT    = 0;  //  等待处理
const FINISH  = 1;  //  已分成
const CANCEL  = 2;  //  已取消
const REVOKE  = 3;   //  已撤销


/* 余额操作状态 */
const process_type = 1;  // 0：充值 1:提现



/* 购物车商品类型 */
const CART_GENERAL_GOODS        = 0; // 普通商品
const CART_GROUP_BUY_GOODS      = 1; // 团购商品
const CART_AUCTION_GOODS        = 2; // 拍卖商品
const CART_SNATCH_GOODS         = 3; // 夺宝奇兵
const CART_EXCHANGE_GOODS       = 4; // 积分商城

/* 减库存时机 */
const SDT_SHIP                  = 0; // 发货时
const SDT_PLACE                 = 1; // 下订单时

/* 评论类型 */
const GOODS = 0;
const ARTICLE = 1;

/* 评论状态 */
const BAD     = 1;            // 差评
const MEDIUM  = 2;            // 中评
const GOOD    = 3;            // 好评

/* 账号类型 */
const VENDOR_WEIXIN = 1;
const VENDOR_WEIBO  = 2;
const VENDOR_QQ     = 3;
const VENDOR_TAOBAO = 4;
const VENDOR_WXA    = 5;    //微信小程序

const GENDER_SECRET = 0;
const GENDER_MALE   = 1;
const GENDER_FEMALE = 2;


/* 帐号变动类型 */
const ACT_SAVING               =  0;     // 帐户冲值
const ACT_DRAWING              =  1;     // 帐户提款
const ACT_ADJUSTING            =  2;     // 调节帐户
const ACT_OTHER                = 99;     // 其他类型

/* 红包发放的方式 */

const SEND_BY_USER               = 0; // 按用户发放
const SEND_BY_GOODS              = 1; // 按商品发放
const SEND_BY_ORDER              = 2; // 按订单发放
const SEND_BY_PRINT              = 3; // 线下发放


/* 响应状态 */
const SUCCESS         = 0;      // 成功
const UNKNOWN_ERROR   = 10000;  // 未知错误
const INVALID_SESSION = 10001;  // 无效 session
const EXPIRED_SESSION = 10002;  // 过期 session


/* 请求状态 */
const BAD_REQUEST     = 400;  // 错误请求
const UNAUTHORIZED    = 401;  // 未授权
const NOT_FOUND       = 404;  // 不存在


/* 平台类型 */
const B2C             = 0;    // 单店

/* 平台厂商 */
const ECSHOP          = 1;    // 多店

export const PAY_CODE = [
  {"code": "balance",     "label": "余额支付"},
  {"code": "cod.app",     "label": "货到付款"},
  {"code": "teegon.wap",  "label": "天工收银"},
  {"code": "alipay.wap",  "label": "支付宝支付"},
  {"code": "alipay.app",  "label": "支付宝支付"},
  {"code": "wxpay.app",   "label": "微信支付"},
  {"code": "wxpay.web",   "label": "微信支付"},
  {"code": "wxpay.wxa",   "label": "微信支付"},
  {"code": "unionpay.app","label": "银联支付"}
];

export const PROMOS_TYPE = [
  {"code": "score",     "label": "积分抵扣"},
  {"code": "cashgift",     "label": "红包抵扣"},
  {"code": "preferential",     "label": "优惠金额"},
  {"code": "goods_reduction",     "label": "商品减免"},
  {"code": "order_reduction",     "label": "订单减免"},
  {"code": "coupon_reduction",     "label": "优惠券减免"},
];
/* 页面标题 */
export const PAGE_NAVIGATION_TITLE = {
  address: {
    add: "添加地址",
    edit: "更新地址",
    main: "我的地址"
  },
  assets: {
    balance: "我的余额",
    bonus: "我的红包",
    coupon: "我的优惠券",
    history: "资金明细",
    main: "钱包中心",
    wechat: "微信支付"
  },
  auth: {
    changepassword: "修改密码",
    forget: "找回密码",
    login: "登录",
    main: "安全中心",
    register: "注册",
    wechat: "微信登录"
  },
  comments: {
    add: "添加评论",
    edit: "编辑评论",
    main: "商品评论"
  },
  default: miniProName,
  goods: {
    cart: "购物车",
    catalog: "商品分类",
    detail: "商品详情",
    list: "商品列表",
    main: "商品中心",
    search: "搜索"
  },
  points: {
    detail: "商品详情",
    main: "积分兑换",
    success: "兑换成功"
  },
  home: "首页",
  member: {
    about: "关于",
    favorite: "收藏中心",
    help: "用户帮助",
    level: "特权中心",
    main: "个人中心",
    score: "积分中心",
    invite: "我的推广",
    setting: "设置中心",
    invoice: "发票",
    userinfo: "用户信息"
  },
  message: {
    main: "消息中心",
    notices: "公告中心",
    detail: "详情",
    activitys: "优惠中心",
    activity: "优惠详情",
    order: "订单消息"
  },
  order: {
    checkout: "检查订单",
    detail: "订单详情",
    main: "订单中心",
    payment: "订单付款"
  },
  withdraw: {
    fail: "提现失败",
    info: "提现详情",
    main: "提现",
    history: "提现记录",
    success: "提现成功"
  }
};
