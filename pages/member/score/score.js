// score.js
import util from '../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    score: 0,
    scoreList: [],
    status: 0,
    paged: {
      page: 1,
      size: 10
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.score
    });
    this.getScore();
    this.getScoreList();
  },

  // 获取积分
  // ecapi.score.get
  getScore() {
    util.request(util.apiUrl + 'ecapi.score.get', 'POST').then(res => {
      this.setData({
        score: res.score
      });
    }).catch(err => {
      util.notLogin(err);
    });
  },

  // 积分列表
  // ecapi.score.history.list
  getScoreList() {
    wx.showLoading({
      title: '加载中...',
    });
    let self = this;
    util.request(util.apiUrl + 'ecapi.score.history.list', 'POST',{
      page: self.data.paged.page,
      per_page: self.data.paged.size,
      status: self.data.status
    }).then(res => {
      for (let i in res.history) {
        res.history[i].created_at = util.formatTime(res.history[i].created_at);
      }
      if (self.data.loadMore) {
        self.data.scoreList = self.data.scoreList.concat(res.history);
      }else{
        self.data.scoreList = res.history;
      }
      let newScoreList = self.data.scoreList;
      self.setData({
        scoreList: newScoreList,
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

  // 列表筛选  0全部 1收入 2支出
  bindSscoretap(event) {
    let status = event.currentTarget.dataset.id || this.data.status;
    this.setData({
      scoreList: [],
      'paged.page': 1,
      status: status
    });
    // 导航栏标题
    let scoreTitle = '';
    switch(status) {
    case "0":
      scoreTitle = util.pageTitle.scoreM.s1;
      break;
    case "1":
      scoreTitle = util.pageTitle.scoreM.s2;
      break;
    case "2":
      scoreTitle = util.pageTitle.scoreM.s3;
      break;
    }
    wx.setNavigationBarTitle({
      title: scoreTitle
    });
    this.getScoreList();
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
        'paged.page': parseInt(this.data.paged.page) + 1
      });
      this.getScoreList();
    }
  },
});