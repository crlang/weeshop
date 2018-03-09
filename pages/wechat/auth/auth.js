// auth.js
import util from '../../../utils/util.js';
var openid = '',session_key = '',loginCode = '';
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: util.pageTitle.wechatLogin
    });
    let self = this;
    wx.login({
      success: function(res){
        util.getShopConfig().then(con => {
          if (con.feature['signin.wxa']) {
            let appID = con.config['wechat.wxa'].app_id,
                appSecret = con.config['wechat.wxa'].app_secret
            wx.request({
              url: 'https://api.weixin.qq.com/sns/jscode2session',
              data:{
                appid: appID,
                secret: appSecret,
                js_code: loginCode,
                grant_type:'authorization_code'
              },
              header: {
                "Content-Type": "application/x-www-form-urlencoded"
              },
              method: 'GET',
              success: function(key){
                if (parseInt(key.data.errcode) == 40163) {
                  self.errLogin();
                }
                openid = key.data.openid;
                session_key = key.data.session_key;
              }
            });
          }
        })
      }
    });
    self.getUserInfo();
  },

  // 小程序注册获取用户信息
  // ecapi.auth.social
  getUserInfo: function(cb) {
    var self = this;
    if(app.globalData.userInfo) {
      typeof cb == "function" && cb(app.globalData.userInfo);
    }else{
      //调用登录接口
      wx.login({
        success: function(res){
          loginCode = res.code;
        }
      });
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          app.globalData.userInfo = res.userInfo;
          typeof cb == "function" && cb(app.globalData.userInfo);
          util.request(util.apiUrl + "ecapi.auth.social","POST",{
            vendor:5,
            js_code: loginCode,
            open_id: openid
          }).then(res => {
            wx.setStorageSync('token', res.token);
            wx.setStorageSync('user', res.user);
            self.getUserInfo();
            // ...
          }).catch(err =>{
            if (err.error_code == 400) {
              util.showToast(err.error_desc);
              self.errLogin();
            }
          });
        },
        fail: function(fai) {
          wx.showModal({
            title: '授权失败',
            content: '由于你取消了用户授权，后续将影响购物，请点击确定重新授权。',
            success: function (cif) {
              if (cif.confirm) {
                wx.getSetting({
                  success(set) {
                    wx.openSetting({
                      success: (ope) => {
                        util.showToast("授权开启成功","success",800)
                        wx.navigateBack();
                        self.getUserInfo();
                      }
                    })
                  }
                })
              }
            }
          });
        }
      });
    }
  },

  errLogin() {
    util.showToast('你已成功注册,跳转中...');
    setTimeout(function(){
      wx.switchTab({
        url: '../../member/index/index'
      });
    },600)
    return false;
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