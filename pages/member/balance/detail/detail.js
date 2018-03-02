// page.js
const util = require('../../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    hiddenmodalput:true,
    balance: 0,
    wdBalance: '',
    wdMemo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.balance
    });
    this.getBalance();
  },

  // 绑定输入
  bindBalanceInput(e) {
    this.setData({
      username: e.detail.value
    });
  },

  // 余额
  // ecapi.balance.get
  getBalance() {
    util.request(util.apiUrl + 'ecapi.balance.get', 'POST').then(res => {
      this.setData({
        balance: res.amount
      });
    }).catch(err => {
      console.log("balance err",err)
    })
  },

  getAllWithdraw() {
    this.setData({
      wdBalance: this.data.balance
    });
  },

  getWithdraw(e) {
    let Withdraw = e.detail.value;
    this.setData({
      wdBalance: Withdraw
    });
  },

  getMemo(e) {
    let memo = e.detail.value;
    this.setData({
      wdMemo: memo
    });
  },

  //点击按钮
  modalinput() {
    this.setData({
      hiddenmodalput: !this.data.hiddenmodalput
    });
  },

  //取消按钮
  cancel() {
    this.setData({
      hiddenmodalput: true
    });
  },

  // 提交提现
  // ecapi.withdraw.submit
  confirm() {
    this.setData({
      hiddenmodalput: true
    });
    util.request(util.apiUrl + 'ecapi.withdraw.submit', 'POST',{
      cash: this.data.wdBalance,
      memo: this.data.wdMemo
    }).then(res => {
      console.log(res)
      util.showToast("提交成功","success",700);
      let wdtime = util.formatTime(res.withdraw.create_at);
      setTimeout(function(){
        wx.navigateTo({
          url: '../../withdraw/success/success?withdraw=' + res.withdraw.cash + "&member_memo=" + res.withdraw.member_memo + "&wdtime=" + wdtime
        });
      },800);

    }).catch(err => {
      console.log('err',err);
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
});