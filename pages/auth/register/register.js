// register.js
import util from '../../../utils/util.js';

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

  // 注册
  // ecapi.auth.default.signup
  register(event) {
    let self = this,
      eValue = event.detail.value;
    if(eValue.username.length <=0) {
      util.showToast('请输入用户名');
      return false;
    }
    if(eValue.email.length <= 0) {
      util.showToast('请输入邮箱');
      return false;
    }
    if(eValue.password.length < 6) {
      util.showToast('密码不能少于 6 个字符');
      return false;
    }else{
      if(eValue.password !== eValue.repassword){
        util.showToast('两次密码不一致');
        return false;
      }
    }
    util.request(util.apiUrl + 'ecapi.auth.default.signup', 'POST',{
      username: eValue.username,
      password: eValue.password,
      email: eValue.email
    }).then(res => {
      wx.showModal({
        title: '注册成功',
        content: '注册成功，是否要登录？',
        success: function (res) {
          if(res.confirm) {
            // 登录
            // ecapi.auth.signin
            util.request(util.apiUrl + 'ecapi.auth.signin', 'POST', {
              username: eValue.username,
              password: eValue.password
            }).then(res => {
              self.setData({
                token: res.token,
                user: res.user
              });
              wx.setStorageSync('token', res.token);
              wx.setStorageSync('user', res.user);
              util.showToast('登录成功','success',800);
              setTimeout(function(){
                wx.switchTab({
                  url: '/pages/member/index/index',
                });
              }, 900);
            });
          }else if(res.cancel) {
            util.showToast('请登录后查看！');
            setTimeout(function(){
              wx.switchTab({
                url: '/pages/index/index',
              });
            }, 800);
          }
        }
      });
    }).catch(err => {
      util.showToast(err.error_desc);
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