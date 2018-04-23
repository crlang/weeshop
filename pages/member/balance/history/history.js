// page.js
import util from '../../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    balance: [],
    paged: {
      page: 1,
      size: 10
    },
    status: '',
    loadMore: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.balanceM.history
    });
    this.getBalanceList();
  },

  // 资金往来
  // ecapi.balance.list
  getBalanceList() {
    let self = this;
    util.request(util.apiUrl + 'ecapi.balance.list', 'POST', {
      page: self.data.paged.page,
      per_page: self.data.paged.size,
      status: self.data.status
    }).then(res => {
      for (let i in res.balances) {
        res.balances[i].create_at = util.formatTime(res.balances[i].create_at);
      }
      if (self.data.loadMore) {
        self.data.balance = self.data.balance.concat(res.balances);
      }else{
        self.data.balance = res.balances;
      }
      let newBalance = self.data.balance;
      self.setData({
        balance: newBalance,
        paged: res.paged,
        loadMore:true,
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

  // 资金筛选 1收入 2支出
  bindSbalanceTap(event) {
    let status = event.currentTarget.dataset.id;
    this.setData({
      balance: [],
      'paged.page': 1,
      status: status
    });
    // 导航栏标题
    let title = '';
    switch(status) {
    case "1":
      title = util.pageTitle.balanceM.s2;
      break;
    case "2":
      title = util.pageTitle.balanceM.s3;
      break;
    case "":
      title = util.pageTitle.balanceM.s1;
      break;
    }
    wx.setNavigationBarTitle({
      title: title
    });
    this.getBalanceList();
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
      this.getBalanceList();
    }
  },
});