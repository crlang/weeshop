// cart.js
import util from '../../../../utils/util.js';
let p = 0, c = 0, d = 0;

Page({
  /**
   * 页面的初始数据
   */
  data: {
    consignees: [],
    consignee: null,
    address: '',
    name: '',
    region: '',
    regions: '',
    tel: '',
    mobile: '',
    zip_code: '',
    provinceName:[],
    provinceID: [],
    provinceSelIndex: '-1',
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
    let addType = options.type || 'edit',
        consignee = options.id || null,
        n = '';
    addType == 'add' ? n = util.pageTitle.addressM.add : n = util.pageTitle.addressM.edit
    wx.setNavigationBarTitle({
      title: n
    });
    this.setData({
      type: addType
    });
    this.setAreaData();
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
            self.setData({
              consignees: soniglst[i],
              consignee: consignee,
              name: this.data.name
            });
          }
        }
      }).catch(err => {
        util.notLogin(err);
      });
    }
  },

  // 地址添加
  // ecapi.consignee.add
  // 地址更新
  // ecapi.consignee.update
  editAddress(event) {
    let self = this.data,
        eventDA = event.detail.value;
    if (eventDA.name.length <= 0) {
      util.showToast('姓名不能为空');
      return false;
    }
    if (eventDA.mobile.length <= 0) {
      util.showToast('手机不能为空');
      return false;
    }
    if (eventDA.region.length <= 0) {
      util.showToast('地区不能为空');
      return false;
    }
    if (eventDA.address.length <= 0) {
      util.showToast('详细地址不能为空');
      return false;
    }
    if (self.type === "add") {
      util.request(util.apiUrl + 'ecapi.consignee.add', 'POST',{
        name: eventDA.name,
        region: eventDA.region,
        address: eventDA.address,
        zip_code: eventDA.zip_code,
        tel: eventDA.mobile,
        mobile: eventDA.mobile,
        is_default: eventDA.default
      }).then(res => {
        util.showToast('成功新增地址！','success');
        setTimeout(function(){
          // 跳转
          wx.navigateTo({
            url: '../selector/selector',
          });
        },800);
      }).catch(err => {
        util.showToast(err.error_desc);
      });
    }else{
      if (self.consignee !== null) {
        util.request(util.apiUrl + 'ecapi.consignee.update', 'POST',{
          consignee: self.consignee,
          name: eventDA.name,
          region: eventDA.region,
          address: eventDA.address,
          zip_code: eventDA.zip_code,
          tel: eventDA.mobile,
          mobile: eventDA.mobile,
          is_default: eventDA.default
        }).then(res => {
          util.showToast('地址已更新！','success');
          setTimeout(function(){
            // 跳转
            wx.navigateTo({
              url: '../selector/selector',
            });
          },800);
        }).catch(err => {
          util.showToast(err.error_desc);
        });
      }
    }
  },

  // 地址删除
  // ecapi.consignee.delete
  bindDelete() {
    let self = this;
    wx.showModal({
      title: '确认删除',
      content: '是否要删除？',
      success: function (res) {
        if(res.confirm) {
          util.request(util.apiUrl + 'ecapi.consignee.delete', 'POST',{
            consignee: self.data.consignee
          }).then(res => {
            util.showToast('删除成功');
            setTimeout(function(){
              // 跳转
              wx.navigateTo({
                url: '../selector/selector',
              });
            },800);
          });
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