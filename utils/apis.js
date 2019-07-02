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
import { request,shopUrl } from './utils';

// 初始化设备信息
const systemInfo = wx.getStorageSync('systemInfo') || '';

/**
 * !
 * 接口函数规范：
 * 统一使用“驼峰”格式，并且首字母是大写！
 * !
 */


/* ================================ weeshop 多例接口统一配置 ================================ */

/* ================================ ecshop 3.6 end ================================ */
/**
 * 获取商品分类
 * ecapi.category.list
 * @author darlang
 * @param  {Number}   page     页码
 * @param  {Number}   per_page 页码大小
 */
export function GetGoodsCategory(page,per_page) {
  return request('ecapi.category.list',"POST",{page,per_page});
}

/**
 * 获取首页商品列表(新品、热销、精品)
 * ecapi.home.product.list
 * @author darlang
 */
export function GetHomeGoodsList() {
  return request('ecapi.home.product.list');
}

/**
 * 获取商品列表
 * ecapi.product.list
 * @author darlang
 * @param  {Number}   page       页码
 * @param  {Number}   per_page   页码大小
 * @param  {Number}   category   分类id
 * @param  {String}   keyword    搜索内容
 * @param  {Number}   sort_key   排序依据 0综合;1价格;2热门;3信用;4销量;5日期;
 * @param  {Number}   sort_value 排序 1升序2降序;
 * @param  {Number}   shop       供销商，默认1为自营
 * @param  {Number}   brand      品牌
 * @param  {Number}   activity   优惠id
 * @param  {Boolean}  is_exchange 是否积分
 * @param  {Boolean}  is_hot      是否热门-仅积分
 */
export function GetGoodsList(page,per_page,category='',keyword='',sort_key=0,sort_value=2,shop=1,brand='',activity = '',is_exchange=false,is_hot=false) {
  return request('ecapi.product.list',"POST",{page,per_page,category,keyword,sort_key,sort_value,shop,brand,activity,is_exchange,is_hot});
}

/**
 * 获取商品详情
 * ecapi.product.get
 * @author darlang
 * @param  {Number}   product 商品id
 */

export function GetGoodsDetail(product) {
  return request('ecapi.product.get',"POST",{product});
}

/**
 * 获取商品相关商品
 * ecapi.product.accessory.list
 * @author darlang
 * @param  {Number}   product    商品id
 * @param  {Number}   page       页码
 * @param  {Number}   per_page   页码大小
 */

export function GetGoodsRelate(product,page,per_page) {
  return request('ecapi.product.accessory.list',"POST",{product,page,per_page});
}

/**
 * 获取热门搜索
 * ecapi.search.keyword.list
 * @author darlang
 */
export function GetGoodsKeyword() {
  return request('ecapi.search.keyword.list');
}

/**
 * 获取购物车内容
 * ecapi.cart.get
 * @author darlang
 */
export function GetCartGoods() {
  return request('ecapi.cart.get');
}

/**
 * 添加到购物车
 * ecapi.cart.add
 * @author darlang
 * @param  {Number}   product     商品id
 * @param  {Object}   property    商品属性
 * @param  {Number}   amount      商品数量
 * @param  {Object}   attachments 商品附件
 */
export function addGoodsToCart(product,property,amount,attachments={}) {
  return request('ecapi.cart.add',"POST",{product,property,amount,attachments});
}

/**
 * 获取购物车数量 3.6 -请参考下方统一接口调用
 * ecapi.cart.get
 * @author darlang
 */
function _GetCartGoodsTotalBy_3x() {
  return request('ecapi.cart.get').then(res => {
    return res;
  }).catch(err => err.data);
}

/**
 * 移除购物车商品
 * ecapi.cart.delete
 * @author darlang
 * @param  {Number}   good 商品id
 */
export function DeleteCartGoods(good) {
  return request('ecapi.cart.delete',"POST",{good});
}

/**
 * 更新购物车商品
 * ecapi.cart.update
 * @author darlang
 * @param  {Number}   good 商品id
 */
export function UpdateCartGoods(good,amount) {
  return request('ecapi.cart.update',"POST",{good,amount});
}

/**
 * 获取评论
 * ecapi.review.product.list
 * @author darlang
 * @param  {Number}   product  商品id
 * @param  {Number}   page     页码
 * @param  {Number}   per_page 页码大小
 */
export function GetCommentList(product,page=1,per_page=10,grade=0) {
  return request('ecapi.review.product.list',"POST",{product,page,per_page,grade});
}

/**
 * 添加评论
 * @author darlang
 * @param  {Number}   order          订单 id
 * @param  {Object|String}   review  评论内容 { goods: '',// 商品 idgrade: '',// 3好评 2中评 1差评 content: '',// 评论内容}
 * @param  {Number}   is_anonymous   是否匿名 0匿名 1不匿名
 */
export function AddOrderComment(order,review,is_anonymous=1) {
  return request('ecapi.order.review',"POST",{order,review,is_anonymous});
}

/**
 * 获取余额
 * ecapi.balance.get
 * @author darlang
 */
export function GetBalanceTotal() {
  return request('ecapi.balance.get');
}

/**
 * 获取余额明细
 * ecapi.balance.list
 * @author darlang
 * @param  {NUmber}   page     页码
 * @param  {NUmber}   per_page 页码大小
 * @param  {Number}   status   状态 全部'' 收入1 支出2
 */
export function GetBalanceList(page,per_page,status='') {
  return request('ecapi.balance.list','POST',{status,page,per_page});
}

/**
 * 预订单检查-通过购物车购买
 * @author darlang
 * @param  {Number}   cart_good_id 购物车商品id数组[xx,xx]
 * @param  {Object}   ext_params   额外表单 {consignee,shipping,coupon,cashgift,score,shop,invoice_type,invoice_content,invoice_title,comment}
 * @description  {收货人ID/快递ID/优惠券ID/红包ID/积分/店铺ID/发票类型ID，如：公司、个人/发票内容ID，如：办公用品、礼品/发票抬头，如：xx科技有限公司/留言}
 */
export function CheckoutPreOrderByCart(cart_good_id,ext_params) {
  return request('ecapi.cart.checkout','POST',{cart_good_id,...ext_params});
}

/**
 * 预订单检查-通过抢购或者直接购买
 * ecapi.product.purchase
 * @author darlang
 * @param  {Number}          product    商品ID
 * @param  {Object|String}   property   用户选择的属性ID
 * @param  {Number}          amount     数量
 * @param  {Object}          ext_params 额外表单 {consignee,shipping,coupon,cashgift,score,shop,invoice_type,invoice_content,invoice_title,comment}
 * @description  {收货人ID/快递ID/优惠券ID/红包ID/积分/店铺ID/发票类型ID，如：公司、个人/发票内容ID，如：办公用品、礼品/发票抬头，如：xx科技有限公司/留言}
 */
export function CheckoutPreOrderByGoods(product,property,amount,ext_params) {
  return request('ecapi.product.purchase','POST',{product,property,amount,...ext_params});
}

/**
 * 检查预订单价格
 * ecapi.order.price
 * @author darlang
 * @param  {Object}   order_product 商品id数组
 * @param  {Number}   consignee     收货人ID
 * @param  {Number}   shipping      快递ID
 * @param  {Number}   coupon        优惠券ID
 * @param  {Number}   cashgift      红包ID
 * @param  {Number}   score         积分
 * @param  {Number}   shop          店铺ID
 */
export function CheckOrderPirce(order_product,consignee,shipping,coupon='',cashgift='',score='',shop=1,is_exchange='') {
  return request('ecapi.order.price','POST',{order_product,consignee,shipping,coupon,cashgift,score,shop,is_exchange});
}

/**
 * 获取订单列表
 * ecapi.order.list
 * @author darlang
 * @param  {Number}   page     页码
 * @param  {Number}   per_page 页码大小
 * @param  {Number}   status   状态 0待付款 1待发货 2发货中 3已收货 4已评价 5已取消
 */
export function GetOrderList(page,per_page,status=10) {
  return request('ecapi.order.list',"POST",{page,per_page,status});
}

/**
 * 获取订单信息
 * ecapi.order.get
 * @author darlang
 * @param  {Number}   order 订单id
 */
export function GetOrderInfo(order) {
  return request('ecapi.order.get',"POST",{order});
}

/**
 * 取消订单
 * ecapi.order.cancel
 * @author darlang
 * @param  {Number}   order  订单 id
 * @param  {Number}   reason 原因 id
 */
export function CancelOrder(order,reason) {
  return request('ecapi.order.cancel',"POST",{order,reason});
}

/**
 * 获取取消订单原因
 * ecapi.order.reason.list
 * @author darlang
 */
export function GetCancelOrderReason() {
  return request('ecapi.order.reason.list');
}

/**
 * 确认订单(确认收货)
 * @author darlang
 * @param  {Number}   order 订单 id
 */
export function ConfirmOrder(order) {
  return request('ecapi.order.confirm',"POST",{order});
}

/**
 * 获取收货统计
 * ecapi.order.subtotal
 * @author darlang
 */
export function GetOrderTotal() {
  return request('ecapi.order.subtotal');
}

/**
 * 支付订单
 * ecapi.payment.pay
 * @author darlang
 * @param  {Number}   order   订单 id
 * @param  {String}   code    支付类型 code，可选alipay.app,wxpay.app,unionpay.app,cod.app,wxpay.web,teegon.wap,alipay.wap,wxpay.wxa,balance
 * @param  {String}   openid  openid 默认空，微信支付时必填
 * @param  {String}   channel 渠道
 * @param  {String}   referer 来源
 */
export function PayOrder(order,code,openid='',channel='',referer='') {
  return request('ecapi.payment.pay','POST',{order,code,openid,channel,referer});
}

/**
 * 获取积分
 * ecapi.score.get
 * @author darlang
 */
export function GetScoreTotal() {
  return request('ecapi.score.get');
}

/**
 * 获取积分列表
 * @author darlang
 * @param  {Number}   page     页码
 * @param  {Number}   per_page 页码大小
 */
export function GetScoreList(page,per_page) {
  return request('ecapi.score.history.list','POST',{page,per_page});
}


/**
 * 获取红包列表
 * ecapi.cashgift.list
 * @author darlang
 * @param  {Number}   page     页码
 * @param  {Number}   per_page 页码大小
 * @param  {Number}   status   状态 0未过期 1已过期 2已使用
 */

export function GetCashgiftList(page,per_page,status=0) {
  return request('ecapi.cashgift.list',"POST",{page,per_page,status});
}

/**
 * 获取可用红包
 * ecapi.cashgift.available
 * @author darlang
 * @param  {Number}   total_price 价格
 * @param  {Number}   page        页码
 * @param  {Number}   per_page    页码大小
 */
export function GetCashgiftAvailable(total_price,page,per_page) {
  return request('ecapi.cashgift.available','POST',{total_price,page,per_page});
}

/**
 * 获取商城配置
 * ecapi.config.get
 * @author darlang
 */
export function GetShopSiteConfig() {
  return request('ecapi.config.get');
}

/**
 * 获取商城信息
 * ecapi.site.get
 * @author darlang
 */
export function GetSiteInfo() {
  return request('ecapi.site.get');
}

/**
 * 获取商城版本
 * ecapi.version.check
 * @author darlang
 */
export function GetSiteVersion() {
  return request('ecapi.version.check');
}

/**
 * 获取轮播图
 * @author darlang
 */
export function GetBannerList() {
  return _GetBannerListByApi().then(res => {
    if (res.length === 0) {
      return _GetBannerListByXml().then(xml => {
        const exp = /item_url="([^"]+)"\slink="([^"]+)"\stext="([^"]*)"\ssort="([^"]*)"/ig;
        let item = '',resArray = [], i = 0;
        while( (item = exp.exec(xml)) !== null){
          resArray.push({
            id: i,
            link: item[2],
            photo: {
              width: null,
              height: null,
              thumb: shopUrl + '/' + item[1],
              large: shopUrl + '/' + item[1]
            },
            sort: item[4],
            title: item[3]
          });
          i++;
        }
        return resArray;
      });
    }else{
      return res;
    }
  });
}

/**
 * 获取轮播图-接口
 * ecapi.banner.list
 * @author darlang
 */
function _GetBannerListByApi() {
  return request('ecapi.banner.list').then(res => res.banners);
}

/**
 * 获取轮播图-文件(接口错误时调用)
 * /data/flash_data.xml
 * @author darlang
 */
function _GetBannerListByXml() {
  return request(shopUrl+'/data/flash_data.xml').catch(res => res.data);
}


/**
 * 获取用户信息
 * ecapi.user.profile.get
 * @author darlang
 */
export function GetUserInfo() {
  return request('ecapi.user.profile.get');
}

/**
 * 账号密码登录
 * ecapi.auth.signin
 * @author darlang
 * @param  {String}   username 用户名
 * @param  {String}   password 密码 6-20
 */
export function SignIn(username,password) {
  return request('ecapi.auth.signin', 'POST', { username, password });
}

/**
 * 第三方登录(含注册)
 * ecapi.auth.social
 * @author darlang
 * @param  {String}   js_code      js_code
 * @param  {String}   open_id      openid
 * @param  {String}   invite_code  推荐人id
 * @param  {Number}   vendor       1微信、2微博、3qq、4淘宝、5小程序
 * @param  {String}   device_id    设备id - 默认空
 * @param  {String}   access_token 访问token - 默认空
 */
export function SocialSignIn(js_code,open_id,invite_code = '',vendor = 5) {
  invite_code = invite_code || wx.getStorageSync('inviteCode') || '';
  return request('ecapi.auth.social', 'POST', { js_code, open_id, invite_code, vendor, device_id: systemInfo ? JSON.stringify(systemInfo) : '', access_token: '' });
}

/**
 * 账号密码注册
 * ecapi.auth.signin
 * @author darlang
 * @param  {String}   username    用户名
 * @param  {String}   email       邮箱
 * @param  {String}   password    密码
 * @param  {String}   invite_code 推荐人id，如果有
 */
export function SignUp(username,email,password,invite_code = '') {
  invite_code = invite_code || wx.getStorageSync('inviteCode') || '';
  return request('ecapi.auth.default.signup', 'POST', { device_id: systemInfo ? JSON.stringify(systemInfo) : '', username, email, password,invite_code });
}


/**
 * 邮箱找回密码
 * ecapi.auth.default.reset
 * @author darlang
 * @param  {String}   email 用户邮箱
 */
export function ForgetPwdByEmail(email) {
  return request('ecapi.auth.default.reset', 'POST', { email });
}

/**
 * 修改密码
 * ecapi.user.password.update
 * @author darlang
 * @param  {String}   old_password 旧密码
 * @param  {String}   passowrd 新密码
 */
export function ChangePassword(old_password,password) {
  return request('ecapi.user.password.update', 'POST', { old_password,password });
}

/**
 * 获取用户信息
 * ecapi.user.profile.get
 * @author darlang
 */
export function GetProfileInfo() {
  return request('ecapi.user.profile.get');
}

/**
 * 获取用户字段
 * ecapi.user.profile.fields
 * @author darlang
 */
export function GetProfileFields() {
  return request('ecapi.user.profile.fields');
}

/**
 * 修改用户信息
 * ecapi.user.profile.update
 * @author darlang
 * @param  {String}   nickname   昵称
 * @param  {Number}   gender     性别
 * @param  {String}   avatar_url 头像
 * @param  {Object}   values     附加字段
 */

export function SaveProfileInfo(nickname,gender,avatar_url,values) {
  return request('ecapi.user.profile.update', 'POST', { nickname,gender,avatar_url,values });
}


/**
 * 获取收藏列表
 * ecapi.product.liked.list
 * @author darlang
 * @param  {Number}   page     页码
 * @param  {Number}   per_page 页码大小
 */
export function GetFavoriteList(page,per_page) {
  return request('ecapi.product.liked.list',"POST",{page,per_page});
}

/**
 * 收藏/取消收藏
 * ecapi.product.like/ecapi.product.unlike
 * @author darlang
 * @param  {Number}   product 商品id
 * @param  {Boolean}  isLiked 是否已经收藏
 */
export function ChangeFavoriteStatus(product,isLiked=true) {
  if (isLiked) {
    return request('ecapi.product.unlike',"POST",{product});
  }else{
    return request('ecapi.product.like',"POST",{product});
  }
}

/**
 * 获取提现明细
 * ecapi.withdraw.list
 * @author darlang
 * @param  {Number}   page     页码
 * @param  {Number}   per_page 页码大小
 */
export function GetWithdrawList(page,per_page) {
  return request('ecapi.withdraw.list',"POST",{page,per_page});
}

/**
 * 提现
 * ecapi.withdraw.submit
 * @author darlang
 * @param  {Number}   cash 提现金额
 * @param  {String}   memo 备注
 */
export function SubmitWithdraw(cash,memo) {
  return request('ecapi.withdraw.submit','POST',{cash,memo});
}

/**
 * 获取提现信息
 * ecapi.withdraw.info
 * @author darlang
 * @param  {Number}   id 提现id
 */
export function GetWithdrawInfo(id) {
  return request('ecapi.withdraw.info','POST',{id});
}

/**
 * 取消提现
 * ecapi.withdraw.cancel
 * @author darlang
 * @param  {Number}   id 提现 id
 */
export function CancelWithdraw(id) {
  return request('ecapi.withdraw.cancel','POST',{id});
}

/**
 * 获取区域信息
 * ecapi.region.list
 * @author darlang
 */
export function GetRegionList() {
  return request('ecapi.region.list');
}

/**
 * 获取收货地址
 * ecapi.consignee.list
 * @author darlang
 */
export function GetConsigneeList() {
  return request('ecapi.consignee.list');
}

/**
 * 更新购物地址
 * ecapi.consignee.update/ecapi.consignee.add
 * @author darlang
 * @param  {Number}   consignee 不存在则变为新增地址
 * @param  {String}   name      名称
 * @param  {Number}   mobile    手机
 * @param  {String}   tel       电话
 * @param  {Number}   zip_code  邮编
 * @param  {Number}   region    地区
 * @param  {String}   address   详细地址
 * @param  {String}   identity  ???
 */
export function ChangeConsigneeInfo(consignee,name,mobile,tel,zip_code,region,address,identity='') {
  return request(consignee ? 'ecapi.consignee.update' : 'ecapi.consignee.add',"POST",{consignee,name,mobile,tel,zip_code,region,address,identity});
}

/**
 * 删除收货地址
 * ecapi.consignee.delete
 * @author darlang
 * @param  {Number}   consignee 收货id
 */
export function DeleteConsigneeInfo(consignee) {
  return request('ecapi.consignee.delete','POST',{consignee});
}

/**
 * 设置默认地址
 * ecapi.consignee.setDefault
 * @author darlang
 * @param  {Number}   consignee 收货id
 */
export function SetDefaultConsignee(consignee) {
  return request('ecapi.consignee.setDefault','POST',{consignee});
}

/**
 * 获取配送方式
 * ecapi.shipping.vendor.list
 * @author darlang
 * @param  {Number}   shop            供应商，默认1自营
 * @param  {Number}   address         地址 id
 * @param  {Object|String}   products 产品 id 及规格的格式化 json
 */
export function GetShippingVendorList(address,products,shop=1) {
  return request('ecapi.shipping.vendor.list','POST',{shop,address,products});
}

/**
 * 获取物流状态
 * ecapi.shipping.status.get
 * @author darlang
 * @param  {Number}   order_id   订单 id
 */
export function GetShippingStatus(order_id) {
  return request('ecapi.shipping.status.get','POST',{order_id});
}

/**
 * 获取发票类型
 * ecapi.invoice.type.list
 * @author darlang
 */
export function GetInvoiceType() {
  return request('ecapi.invoice.type.list');
}

/**
 * 获取发票列表
 * ecapi.invoice.content.list
 * @author darlang
 */
export function GetInvoiceList() {
  return request('ecapi.invoice.content.list');
}

/**
 * 获取开票状态
 * ecapi.invoice.status.get
 * @author darlang
 */
export function GetInvoiceStatus() {
  return request('ecapi.invoice.status.get');
}

/**
 * 获取系统消息
 * ecapi.message.system.list
 * @author darlang
 * @param  {Number}   page       页码
 * @param  {Number}   per_page   页码大小
 */
export function GetMessageBySystem(page,per_page) {
  return request('ecapi.consignee.list',"POST",{page,per_page});
}

/**
 * 获取订单消息
 * ecapi.message.order.list
 * @author darlang
 * @param  {Number}   page       页码
 * @param  {Number}   per_page   页码大小
 */
export function GetMessageByOrder(page,per_page) {
  return request('ecapi.message.order.list',"POST",{page,per_page});
}

/**
 * 获取未读信息
 * ecapi.message.count
 * @author darlang
 * @param  {String}   after 时间格式
 * @param  {Number}   type  未读类型 1系统消息、2订单消息
 */
export function GetUnreadMessage(after,type) {
  return request('ecapi.message.count',"POST",{after,type});
}

/**
 * 更新信息状态
 * ecapi.push.update
 * @author darlang
 */
export function UpdateMessage() {
  return request('ecapi.push.update',"POST",{device_id: systemInfo ? JSON.stringify(systemInfo) : ''});
}


/**
 * 获取优惠列表
 * ecapi.activity.list
 * @author darlang
 */
export function GetActivityList() {
  return request('ecapi.activity.list');
}

/**
 * 获取优惠信息
 * ecapi.activity.get
 * @author darlang
 * @param  {Number}   activity 优惠id
 */
export function GetActivityInfo(activity) {
  return request('ecapi.activity.get','POST',{activity});
}

/**
 * 获取推荐列表
 * ecapi.recommend.bonus.list
 * @author darlang
 * @param  {Number}   page     页码
 * @param  {Number}   per_page 页码大小
 */
export function GetRecommendList(page,per_page) {
  return request('ecapi.recommend.bonus.list','POST',{page,per_page});
}

/**
 * 获取推荐信息
 * ecapi.recommend.bonus.info
 * @author darlang
 */
export function GetRecommendInfo() {
  return request('ecapi.recommend.bonus.info');
}




/**
 * 获取文章信息
 * ecapi.article.list
 * @author darlang
 * @param  {Number}   page     页码
 * @param  {Number}   per_page 页码大小
 * @param  {Number}   id       文章 id
 */
export function GetArticleList(page,per_page,id='') {
  return request('ecapi.article.list',"POST",{page,per_page,id});
}

/**
 * 获取文章内容【此接口需要二次开发，详情请看 darlang 文章】
 * article.[id]
 * @author darlang
 * @param  {Number}   文章 id
 */
export function GetArticle(id) {
  return request('article.'+id,"get");
}

/* ================================ ecshop 3.6 end ================================ */

/* ================================ ecshop 4.0 start ================================ */

/**
 * 获取小程序码
 * ecapi.wxa.qrcode
 * @author darlang
 */
export function GetWxaCode() {
  return request('ecapi.wxa.qrcode',"get");
}

/**
 * 获取站点配置项
 * ecapi.wxa.qrcode
 * @author darlang
 * @param  {Array}   key 项key ["can_invoice","use_integral"]
 */
export function GetSiteConfig(key=["can_invoice","use_integral"]) {
  return request('ecapi.site.configs','POST',{key});
}

/**
 * 获取购物车数量 4.0 - 请参考下方统一接口调用
 * ecapi.cart.quantity
 * @author darlang
 */
function _GetCartGoodsTotalBy_4x() {
  return request('ecapi.cart.quantity').then(res => {
    return res;
  }).catch(err => err.statusCode);
}



/* ================================ ecshop 4.0 end ================================ */

/**
 * 获取购物车数量
 * 优先调用 4.0 否则使用 3.6 版本的 api
 * @author darlang
 */
export function GetCartGoodsTotal() {
  return _GetCartGoodsTotalBy_4x().then(res => {
    if (res === 404) {
      return _GetCartGoodsTotalBy_3x().then(sres => {
        try {
          return sres.goods_groups[0].total_amount || 0;
        } catch(e) {
          return 0;
        }
      });
    }else{
      try {
        return res.quantity || 0;
      } catch(e) {
        return 0;
      }
    }
  }).catch(() => {
    return 0;
  });
}


/* ================================ weeshop 接口配置 end ================================ */


/* ============= weeshop 二次开发接口调度(接口需要二次开发，才有效果) ============= */
/* ============= weeshop 二次开发接口调度(接口需要二次开发，才有效果) ============= */
/* ============= weeshop 二次开发接口调度(接口需要二次开发，才有效果) ============= */

/**
 * 示例：获取商城会员等级
 * ecapi.score.level
 * @author darlang
 */
export function GetShopLevelInfo() {
  return request('ecapi.score.level');
}

/* =========== weeshop 二次开发接口调度 End (接口需要二次开发，才有效果) =========== */
/* =========== weeshop 二次开发接口调度 End (接口需要二次开发，才有效果) =========== */
/* =========== weeshop 二次开发接口调度 End (接口需要二次开发，才有效果) =========== */
