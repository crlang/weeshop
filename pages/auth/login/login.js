// login.js
import util from '../../../utils/util.js';
var app = getApp();
var openid = '',session_key = '',loginCode = '',loginCodeNew='';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    logoURL: '',
    username: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.login
    });
    util.request(util.apiUrl + 'ecapi.site.get', 'POST').then(res => {
      // ...
    }).catch(err =>{
      if (err.data.site_info.logo) {
        let siteLogo = err.data.site_info.logo.large || '';
        this.setData({
          logoURL: siteLogo
        });
      }
    });
  },

  // 登录
  // ecapi.auth.signin
  login(event) {
    let self = this;
    if(event.detail.value.username.length <=0) {
      util.showToast('用户名不能为空','none');
      return false;
    }
    if(event.detail.value.password.length < 6) {
      util.showToast('密码不能少于 6 个字符','none');
      return false;
    }
    util.request(util.apiUrl + 'ecapi.auth.signin', 'POST', {
      username: event.detail.value.username,
      password: event.detail.value.password
    }).then(res => {
      self.setData({
        token: res.token,
        user: res.user
      });
      wx.setStorageSync('token', res.token);
      wx.setStorageSync('user', res.user);
      // 从哪来回哪去
      wx.navigateBack();
    }).catch(err => {
      util.showToast(err.data.error_desc,'none');
    });
  },

  // 小程序注册获取用户信息
  // ecapi.auth.social
  getUserInfo: function(cb) {
    app.getUserInfo();
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