// cart.js
const util = require('../../../../utils/util.js');
let p = 0, c = 0, d = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    consignees: [],
    consignee: '',
    address: '',
    name: '',
    region: '',
    regions: '',
    tel: '',
    mobile: '',
    zip_code: '',
    provinceName:[],
    provinceID: [],
    provinceSelIndex: p,
    cityName: [],
    cityID: [],
    citySelIndex: '',
    districtName: [],
    districtID: [],
    districtSelIndex: '',
    type: "edit",
    is_default: false,
    showDistpicker: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let addType = options.type || 'edit';
    let n = '';
    addType == 'add' ? n = util.pageTitle.addressAdd : n = util.pageTitle.addressEdit
    wx.setNavigationBarTitle({
      title: n
    });

    this.setData({
      type: addType
    });
    this.setAreaData();
    let consignee = options.id || null;
    this.showAddress(consignee);
  },

  // 地址列表
  // ecapi.consignee.list
  showAddress(consignee) {
    this.setAreaData();
    let self = this;
    if (consignee !== null) {
      util.request(util.apiUrl + 'ecapi.consignee.list', 'POST').then(res => {
        let soniglst = res.consignees;
        for(let i in soniglst) {
          if(consignee == soniglst[i].id) {
            console.log(self.data.provinceName);
            self.setData({
              consignees: soniglst[i],
              consignee: consignee,
              name: this.data.name
            });
          }
        }
      });
    }
  },

  // 地址添加
  // ecapi.consignee.add
  // 地址更新
  // ecapi.consignee.update
  editAddress(e) {
    console.log(e.detail);
    if (this.data.type === "add") {
      util.request(util.apiUrl + 'ecapi.consignee.add', 'POST',{
        name: e.detail.value.name,
        region: e.detail.value.region,
        address: e.detail.value.address,
        zip_code: e.detail.value.zip_code,
        tel: e.detail.value.mobile,
        mobile: e.detail.value.mobile,
        is_default: e.detail.value.default
      }).then(res => {
        console.log(res);
      }).catch(err => {
        util.showToast(err.error_desc,'none');
      });
    }else{
      if (this.data.consignee != null) {
        util.request(util.apiUrl + 'ecapi.consignee.update', 'POST',{
          consignee: this.data.consignee,
          name: e.detail.value.name,
          region: e.detail.value.region,
          address: e.detail.value.address,
          zip_code: e.detail.value.zip_code,
          tel: e.detail.value.mobile,
          mobile: e.detail.value.mobile,
          is_default: e.detail.value.default
        }).then(res => {
          console.log(res);
        }).catch(err => {
          util.showToast(err.error_desc,'none');
        });
      }
    }
  },

  // 地址删除
  // ecapi.consignee.delete
  bindDelete() {
    console.log('this',this.data)
    let self = this;
    wx.showModal({
      title: '确认删除',
      content: '是否要删除？',
      success: function (res) {
        if(res.confirm) {
          util.request(util.apiUrl + 'ecapi.consignee.delete', 'POST',{
            consignee: self.data.consignee
          }).then(res => {
            util.showToast('删除成功','none');
            console.log(res);
          }).catch(err => {
            console.log(err);
          });
          setTimeout(function(){
            // 跳转
            wx.navigateTo({
              url: '../selector/selector',
            });
          },800);
        }
      }
    });
  },

  // 省市区地址联动
  // ecapi.region.list
  setAreaData(p, c, d) {
    wx.showLoading({
      title: '数据加载中...'
    });
    var area = {},
        self = this,
        p = p || 0,
        c = c || 0,
        d = d || 0;
    util.request(util.apiUrl + 'ecapi.region.list', 'POST').then(res => {
      area = res.regions[0];
      // 省
      let province = area.regions,
          provinceName = [],
          provinceID =[];
      for(let item in province) {
        provinceName.push(province[item].name);
        provinceID.push(province[item].id);
      }
      self.setData({
        provinceName: provinceName,
        provinceID: provinceID
      });
      // 市
      let city = province[p].regions,
          cityName = [],
          cityID = [];
      for(let item in city) {
        cityName.push(city[item].name);
        cityID.push(city[item].id);
      }
      self.setData({
        cityName: cityName,
        cityID: cityID
      });
      // 区
      let district = city[c].regions,
          districtName = [],
          districtID = [];
      for(let item in district) {
        districtName.push(district[item].name);
        districtID.push(district[item].id);
      }
      self.setData({
        districtName: districtName,
        districtID: districtID
      });
    wx.hideLoading();
    });
  },

  // 拖动区域
  changeArea(e) {
    p = e.detail.value[0];
    c = e.detail.value[1];
    d = e.detail.value[2];
    this.setAreaData(p, c, d);
    console.log(d)
  },

  // 区域调出
  showDistpicker() {
    this.setData({
      showDistpicker: true
    });
  },

  // 区域隐藏
  distpickerCancel() {
    this.setData({
      showDistpicker: false
    });
  },

  // 确认选择
  distpickerSure() {
    this.setData({
      provinceSelIndex: p,
      citySelIndex: c,
      districtSelIndex: d
    });
    console.log(p,c,d);
    this.distpickerCancel();
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