// page.js
import util from '../../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    withdrawsList: [],
    paged: {
      page: 1,
      size: 10
    },
    loadMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.withdraw
    });
    this.getWithdrawList();
  },

  // 取消提现
  // ecapi.withdraw.cancel
  onCancelWithdraw(e) {
    let itemIndex = e.currentTarget.dataset.indexid;
    let self = this;
    wx.showModal({
      title: '提示',
      content: '是否取消该提现？',
      success: function (res) {
        if (res.confirm) {
          util.request(util.apiUrl + 'ecapi.withdraw.cancel', 'POST', {
            id: itemIndex,
          }).then(res => {
            util.showToast('已取消提现', 'success');
            setTimeout(function () {
              self.getWithdrawList();
            }, 1000);
          });
        }
      }
    });
  },

  // 提现记录
  // ecapi.withdraw.list
  getWithdrawList() {
    let self = this;
    util.request(util.apiUrl + 'ecapi.withdraw.list', 'POST', {
      page: self.data.paged.page,
      per_page: self.data.paged.size
    }).then(res => {
      for (let i in res.withdraws) {
        res.withdraws[i].create_at = util.formatTime(res.withdraws[i].create_at);
      }
      if (self.data.loadMore) {
        self.data.withdrawsList = self.data.withdrawsList.concat(res.withdraws);
      }else{
        self.data.withdrawsList = res.withdraws;
      }
      let newWithdraw = self.data.withdrawsList;
      self.setData({
        withdrawsList: newWithdraw,
        paged: res.paged
      });
      if (res.paged.more > 0) {
        self.setData({ loadMore:true });
      }else{
        self.setData({ loadMore:false });
      }
    }).catch(err => {
      util.notLogin(err);
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
    if (this.data.loadMore) {
      this.setData({
        "paged.page": parseInt(this.data.paged.page) + 1
      });
      this.getWithdrawList();
    }
  },
});