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
// index.js
import util from '../../utils/util.js';

//获取应用实例
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    siteInfo: [],
    banners: [],
    bannersX: [],
    notices: [],
    goodProducts: [],
    hotProducts: [],
    recentlyProducts: [],
    userInfo: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    wx.showLoading({
      title: '加载中...'
    });
    this.getUserInfo();
    this.getShopSiteInfo();
    this.getBanner();
    this.getNotices();
    this.getPorducts();
    wx.hideLoading();
  },

  // 个人信息
  getUserInfo() {
    var self = this;
    var userInfo = wx.getStorageSync('user');
    // 判断是否登陆
    if (userInfo.is_completed) {
      // 获取用户信息
      if (userInfo.avatar === null) {
        userInfo.avatar = "/images/default-avatar.png";
      }
      var photo = userInfo.avatar,
        name = userInfo.username,
        level = userInfo.rank,
        user = {};
      user.avatarUrl = photo;
      user.nickName = name;
      user.level = level;
      self.setData({
        userInfo: user
      });
    }
  },

  // 站点信息
  // ecapi.site.get
  getShopSiteInfo() {
    let self = this;
    util.request(util.apiUrl + 'ecapi.site.get', 'POST').then(res => {
      // ...
    }).catch(err =>{
      if(err.data.site_info === undefined) {
        util.showToast('数据加载出错！','error',2500);
      }else{
        self.setData({
          siteInfo: err.data.site_info
        });
      }

      wx.setNavigationBarTitle({
        title: self.data.siteInfo.name || util.pageTitle.home
      });
    });
  },

  // 移动端 Banner
  // ecapi.banner.list
  getBanner() {
    util.request(util.apiUrl + 'ecapi.banner.list', 'POST').then(res => {
      if (res.banners.length === 0) {
        util.request(util.shopUrl + '/data/flash_data.xml', 'GET').then(xml => {
          // ...
        }).catch(xml => {
          const exp = /item_url="([^"]+)"\slink="([^"]+)"\stext="([^"]*)"/ig;
          let result,j=[] ;
          while( (result = exp.exec(xml.data)) !== null){
            j.push(result);
          }
          for (let i in j) {
            if (j.hasOwnProperty(i)) {
              j[i][1] = util.shopUrl + '/' + j[i][1];
            }
          }
          this.setData({
            bannersX: j
          });
        });
      }else{
        this.setData({
          banners: res.banners
        });
      }
    });
  },

  // 站点公告列表
  // ecapi.notice.list
  getNotices() {
    util.request(util.apiUrl + 'ecapi.notice.list', 'POST', {
      page: 1,
      per_page: 10
    }).then(res => {
      this.setData({
        notices: res.notices
      });
    });
  },

  // 公告内容
  // notice.id
  bindOnNotice(event) {
    util.request(util.apiUrl +"notice."+ event.currentTarget.dataset.id).then(res => {
      // ...
    }).catch( err => {
      let content = err.data.match(/<p class="lead">([\s\S]*?)<\/p>/)[1];
      wx.showModal({
        title: "公告详情",
        content: content,
        showCancel: false
      });
    });
  },

  // 首页展示产品
  // ecapi.home.product.list
  getPorducts() {
    util.request(util.apiUrl + 'ecapi.home.product.list', 'POST').then(res => {
      this.setData({
        goodProducts: res.good_products,
        hotProducts: res.hot_products,
        recentlyProducts: res.recently_products
      });
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示
    util.updateCartNum();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 页面隐藏
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
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    return {
      title: this.data.siteInfo.name,
      path: '/pages/index/index',
      success(e) {
        // 需要在页面onLoad()事件中实现接口
        wx.showShareMenu({
          // 要求小程序返回分享目标信息
          withShareTicket: true
        });
      },
      fail(e) {
      },
      complete() { }
    }
  }
});
