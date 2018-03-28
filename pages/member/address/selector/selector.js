// selector.js
import util from '../../../../utils/util.js';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    addressList: [],
    defaultAddress: '',
    order_product: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    wx.setNavigationBarTitle({
      title: util.pageTitle.address
    });
    let order_product = options.order_product || null;
    this.setData({
      order_product: order_product
    });
  },

  // 地址列表
  // ecapi.consignee.list
  getAddressList() {
    wx.showLoading({
      title: '加载中...',
    });
    util.request(util.apiUrl + 'ecapi.consignee.list', 'POST').then(res => {
      this.setData({
        addressList: res.consignees
      });
    }).catch(err => {
      util.notLogin(err);
    });
    wx.hideLoading();
  },

  // 选择地址
  bindSelect(event) {
    let self = this;
    if (self.data.order_product !== null) {
      wx.setStorage({
        key: "consignee",
        data: event.currentTarget.dataset.consignee
      });
      wx.navigateBack();
    }
  },

  // 设定默认收货地址
  // ecapi.consignee.setDefault
  setDefaultAddress(e) {
    let selfID = e.currentTarget.dataset.id;
    util.request(util.apiUrl + 'ecapi.consignee.setDefault', 'POST',{
      consignee: selfID
    }).then(res => {
      this.setData({
        defaultAddress: selfID
      });
      util.showToast('设定成功！','success',300)
    });
    this.getAddressList();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 页面显示
    this.getAddressList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    // 页面隐藏

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // 页面关闭
  },
});