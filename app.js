// app.js
import util from './utils/util.js';
var openid = '',session_key = '',loginCode = '',loginCodeNew='';

App({
  onLaunch: function() {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || [];
    logs.unshift(Date.now());
    wx.setStorageSync('logs', logs);
  },

  // 小程序注册获取用户信息
  // ecapi.auth.social
  getUserInfo: function(cb) {
    var self = this;
    if(self.globalData.userInfo) {
      typeof cb == "function" && cb(self.globalData.userInfo);
    }else{
      //调用登录接口
      wx.login({
        success: function(res){
          loginCodeNew = res.code;
        }
      });
      wx.getUserInfo({
        withCredentials: false,
        success: function(res) {
          util.request(util.apiUrl + "ecapi.auth.social","POST",{
            vendor:5,
            js_code: loginCodeNew,
            open_id: openid
          }).then(soc => {
            console.log(soc)
            wx.setStorageSync('token', soc.token);
            wx.setStorageSync('user', soc.user);
            self.globalData.userInfo = soc.user;
            typeof cb == "function" && cb(self.globalData.userInfo);
            self.getUserInfo();
            if (soc.is_new_user) {
              util.showToast('你已成功注册,欢迎您...');
            }else{
              util.showToast('你已成功登录,跳转中...');
            }
            setTimeout(function(){
              wx.switchTab({
                url: '/pages/index/index'
              });
            },600)
          }).catch(err =>{
            if (err.error_code == 400) {
              util.showToast(err.error_desc);
            }
          });
        },
        fail: function(fai) {
          wx.showModal({
            title: '授权失败',
            content: '由于你取消了用户授权，后续将影响购物，请点击确定重新开启授权。',
            // showCancel: false,
            success: function (cif) {
              if(cif.confirm) {
                wx.getSetting({
                  success(set) {
                    wx.openSetting({
                      success: (ope) => {
                        if (ope.authSetting['scope.userInfo']) {
                          util.showToast("授权开启成功","success",800);
                          wx.navigateBack();
                        }else {
                          util.showToast("授权开启失败","success",1200);
                        }
                        self.getUserInfo();
                      }
                    })
                  }
                })
              }else if(cif.cancel) {
                self.getUserInfo();
              }
            }
          });
        }
      });
    }
  },

  getSystemInfo: function(cb){
      var self = this;
    if(self.globalData.systemInfo){
      typeof cb == "function" && cb(self.globalData.systemInfo);
    }else{
      wx.getSystemInfo({
        success: function(res) {
          self.globalData.systemInfo = res;
          typeof cb == "function" && cb(self.globalData.systemInfo);
        }
      })
    }
  },

  globalData: {
    userInfo: null
  }
});
