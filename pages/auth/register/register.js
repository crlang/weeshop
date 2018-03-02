// register.js
const util = require('../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    username: '',
    password: '',
    repassword: '',
    email: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.register
    });
  },

  // 绑定输入
  bindUsernameInput: function (e) {
    this.setData({
      username: e.detail.value
    });
  },bindEmailInput: function (e) {
    this.setData({
      email: e.detail.value
    });
  },bindPasswordInput: function (e) {
    this.setData({
      password: e.detail.value
    });
  },bindRepasswordInput: function (e) {
    this.setData({
      repassword: e.detail.value
    });
  },

  // 注册
  // ecapi.auth.default.signup
  register() {
    let self = this;
    if(this.data.username.length <=0) {
      util.showToast('请输入用户名','none');
      return false;
    }
    if(this.data.email.length <= 0) {
      util.showToast('请输入邮箱','none');
      return false;
    }
    if(this.data.password.length <= 0 || this.data.repassword.length <= 0) {
      util.showToast('请输入密码','none');
      return false;
    }else if(this.data.password != this.data.repassword){
      util.showToast('密码不一致','none');
      return false;
    }
    util.request(util.apiUrl + 'ecapi.auth.default.signup', 'POST',{
      username: this.data.username,
      password: this.data.password,
      email: this.data.email
    }).then(res => {
      wx.showModal({
        title: '注册成功',
        content: '注册成功，是否要登录？',
        success: function (res) {
          if(res.confirm) {
            // 登录
            // ecapi.auth.signin
            util.request(util.apiUrl + 'ecapi.auth.signin', 'POST', {
              username: self.data.username,
              password: self.data.password
            }).then(res => {
              self.setData({
                token: res.token,
                user: res.user
              });
              wx.setStorageSync('token', res.token);
              wx.setStorageSync('user', res.user);
              util.showToast('登录成功','success',800)
              setTimeout(function(){
                wx.switchTab({
                  url: '/pages/member/index/index',
                });
              }, 900);
            });
          }else if(res.cancel) {
            util.showToast('请登录后查看！','none');
            setTimeout(function(){
              wx.switchTab({
                url: '/pages/index/index',
              });
            }, 800);
          }
        }
      });
    }).catch(err => {
      util.showToast(err.error_desc,'none',600);
    });
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
});