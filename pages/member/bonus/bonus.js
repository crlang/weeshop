// page.js
import util from '../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    bonusList: [],
    status: 0,
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
      title: util.pageTitle.bonus
    });
    this.getBonusList();
  },

  // 红包列表
  // ecapi.cashgift.list
  getBonusList() {
    wx.showLoading({
      title: '加载中...',
    });
    let self = this;
    util.request(util.apiUrl + 'ecapi.cashgift.list', 'POST',{
      page: self.data.paged.page,
      per_page: self.data.paged.size,
      status: self.data.status
    }).then(res => {
      for (let i in res.cashgifts) {
        res.cashgifts[i].effective = util.formatTime(res.cashgifts[i].effective);
        res.cashgifts[i].expires = util.formatTime(res.cashgifts[i].expires);
      }
      if (self.data.loadMore) {
        self.data.bonusList = self.data.bonusList.concat(res.cashgifts);
      }else{
        self.data.bonusList = res.cashgifts;
      }
      let newBonusList = self.data.bonusList;
      self.setData({
        bonusList: newBonusList,
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
    wx.hideLoading();
  },

  // 列表筛选  0未过期 1已过期 2已使用
  bindSbonustap(event) {
    let status = event.currentTarget.dataset.id || this.data.status;
    this.setData({
      bonusList: [],
      'paged.page': 1,
      status: status
    });
    // 导航栏标题
    let bonusTitle = '';
    switch(status) {
    case "0":
      bonusTitle = util.pageTitle.bonusM.s1;
      break;
    case "1":
      bonusTitle = util.pageTitle.bonusM.s2;
      break;
    case "2":
      bonusTitle = util.pageTitle.bonusM.s3;
      break;
    }
    wx.setNavigationBarTitle({
      title: bonusTitle
    });
    this.getBonusList();
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
      this.getBonusList();
    }
  },
});