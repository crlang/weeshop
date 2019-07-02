/**
 * WeeShop 声明
 * ===========================================================
 * 网站： https://www.darlang.com
 * 标题： ECShop 小程序「weeshop 」- 基于 ECShop 为后台系统开发的非官方微信商城小程序
 * 链接： https://www.darlang.com/?p=709
 * 说明： 源码已开源并遵循 Apache 2.0 协议，你有权利进行任何修改，但请保留出处，请不要删除该注释。
 * ==========================================================
 * Copyright 2019 darlang
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * ===========================================================
 */

// editor.js
import {PNT,setNavBarTitle,showToast,checkMobile} from '../../../../utils/utils';
import {GetRegionList,ChangeConsigneeInfo,DeleteConsigneeInfo,SetDefaultConsignee} from '../../../../utils/apis';

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: '',// 当前地址id，编辑时
    type: "edit",
    consigneeParams: {
      'consignee': '',// 修改传
      'name': '',// 名称
      'mobile': '',// 手机
      'tel': '',// 电话
      'zip_code': '',// 邮编
      'region': '',// 地区
      'address': '',// 详细地址
      'identity': '',// ???
    },
    isDefault: false,// 是否默认地址
    regionsPickerState: false,// 区域弹出
    regionSelector: [0,0,0],
    regionItem: '',// 修改时存在
    regionsData: '',// 区域数据
    provinceData: '',// 当前省市区
    citData: '',// 当前省市区
    districtData: '',// 当前省市区
    regionMsg: '',//
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (opt) {
    this.loginModal = this.selectComponent("#login-modal");

    // 添加初始化地址，编辑初始化数据
    if (opt.type === 'add') {
      setNavBarTitle(PNT.address.add);
      this.initRegionsData();
    }else{
      setNavBarTitle(PNT.address.edit);
      this.initAddress();
    }

    this.setData({
      type: opt.type || 'edit',
      id: opt.id ? parseInt(opt.id) : ''
    });
  },

  /**
   * 登录回调
   * @author darlang
   */
  loginCallback(cb) {
    if (cb.detail.type === 'success') {
      this.initAddress();
    }
  },

  /**
   * 初始化地址-编辑时
   * @author darlang
   */
  initAddress() {
    if (!this.loginModal.check()) {
      return false;
    }
    let item = wx.getStorageSync('cache_address_edit') || '';
    if (!item) {
      this.setData({
        type: 'add'
      });
      this.initRegionsData();
      return false;
    }
    // 编辑项存在
    if (item.regions && item.regions[0] && item.regions[0].id === 1) {
      item.regions.splice(0,1);
    }
    let regionMsg = item.regions.map(k => k.name).join('-');

    this.setData({
      consigneeParams: item,
      regionItem: item.regions,
      regionMsg: regionMsg,
      isDefault: item.is_default || false
    });
    this.initRegionsData();
    wx.removeStorageSync('cache_address_edit');
  },

  /**
   * 初始化数据
   * @author darlang
   */
  initRegionsData() {
    let regionsJsonData = wx.getStorageSync('regionsJsonData') || '';
    wx.showLoading({title: '请求数据中...',mask: true});
    if (regionsJsonData && typeof regionsJsonData === 'object') {
      this.setData({
        regionsData: regionsJsonData
      });
      this.changeRegionsData();
      wx.hideLoading();
      return false;
    }
    GetRegionList().then(res => {
      if (res.regions && res.regions.length > 0) {
        wx.setStorageSync('regionsJsonData', res.regions[0]);
        this.setData({
          regionsData: res.regions[0]
        });
        this.changeRegionsData();
      }else{
        showToast('后台地址区域数据为空');
      }

    });
  },

  /**
   * 省市区数据对齐
   * @author darlang
   */
  changeRegionsData() {
    let regionsData = this.data.regionsData;
    let seleIndex = this.data.regionSelector;
    let l = seleIndex[0] || 0;
    let c = seleIndex[1] || 0;
    // let r = seleIndex[2] || 0;
    let regionItem = this.data.regionItem;
    if (regionItem) {
      this.alignRegionSelect(regionsData);
      this.data.regionItem = '';
      setTimeout(() => {
        this.changeRegionsData();
      },300);
    }
    if (!regionsData) {
      this.initRegionsData();
    }
    try {
      // 省
      let proData = regionsData.regions;
      let provinceData = proData.map(k => {return {name: k.name, id: k.id};});
      this.setData({
        provinceData: provinceData
      });
      // 市
      let citData = proData[l].regions;
      let cityData = citData.map(k => {return {name: k.name, id: k.id};});
      this.setData({
        cityData: cityData
      });
      // 区
      let disData = citData[c].regions;
      let districtData = disData.map(k => {return {name: k.name, id: k.id};});
      this.setData({
        districtData: districtData
      });
    } catch(e) {
      // console.log(e);
    }
    // 重置索引
    this.setData({
      regionSelector: seleIndex
    });
  },

  /**
   * 修改数据对齐
   * @author darlang
   * @param  {Array}   data 地区数据
   */
  alignRegionSelect(data) {
    let regionItem = this.data.regionItem;
    let i = this.data.dalang || 0;
    let id = regionItem[i].id;
    let curItem = this.alignRegionSelectX(id,data);
    let seleIndex = this.data.regionSelector || [];
    seleIndex[i] = curItem.i || 0;

    this.setData({
      regionSelector: seleIndex,
      "consigneeParams.region": curItem.id
    });

    i++;
    this.data.dalang = i;
    if (regionItem[i]) {
      this.alignRegionSelect(data);
    }
  },

  /**
   * 修改数据对齐-内
   * @author darlang
   * @param  {[type]}   id   滑动地区id
   * @param  {[type]}   data 地区数据
   */
  alignRegionSelectX(id,data) {
    if (data && data.regions) {
      // 处理子项
      for (let k = 0; k < data.regions.length; k++) {
        let item = data.regions[k];
        if (item.id === id) {// 是否存在
          return {id: item.id, i: k};
        }else{
          if (item.regions) {// 不存在则往下查找，周而复始
            let items = this.alignRegionSelectX(id,item.regions);
            if (items) {
              return items;
            }
          }
        }
      }
    }else{
      if (data) {
        // 处理父项
        for (let k = 0; k < data.length; k++) {
          let item = data[k];
          if (item.id === id) {
            return {id: item.id, i: k};
          }else{
            if (item.regions) {
              let items = this.alignRegionSelectX(id,item.regions);
              if (items) {
                return items;
              }
            }
          }
        }
      }
    }
  },

  /**
   * 拖动修改省市区数据
   * @author darlang
   */
  changeRegionsPicker(e) {
    let seleIndex = e.detail.value;
    this.setData({
      regionSelector: seleIndex
    });
    this.changeRegionsData();
  },

  /**
   * 切换省市区弹出
   * @author darlang
   */
  changePickerState() {
    if (this.data.regionsPickerState) {
      this.changeRegionsData();
    }
    this.setData({
      regionsPickerState: !this.data.regionsPickerState
    });
  },

  /**
   * 确认选择
   * @author darlang
   */
  getRegionsChange() {
    let p = this.data.provinceData;
    let c = this.data.cityData;
    let d = this.data.districtData;
    let s = this.data.regionSelector;
    let pt = '', ct = '', dt = '',ps = '', cs = '', ds = '';
    if (p[s[0]] && p[s[0]].name) {
      pt = p[s[0]].name;
      ps = p[s[0]].id;
    }
    if (c[s[1]] && c[s[1]].name) {
      ct = '-'+c[s[1]].name;
      cs = c[s[1]].id;
    }
    if (d[s[2]] && d[s[2]].name) {
      dt = '-'+d[s[2]].name;
      ds = d[s[2]].id;
    }
    if (!ds) {
      if (!cs) {
        ds = ps;
      }else{
        ds = cs;
      }
    }
    let regionMsg = pt+ct+dt;
    // console.log('选择了->',regionMsg);
    this.setData({
      'consigneeParams.region': ds,
      regionMsg: regionMsg
    });
    this.changePickerState();
  },

  /**
   * 绑定输入
   * @author darlang
   */
  bindInputChange(e) {
    let items = e.currentTarget.dataset;
    let type = items.type;
    let v = e.detail.value || '';
    if (type === 'name') {
      this.setData({
        "consigneeParams.name": v
      });
    }
    if (type === 'mobile') {
      this.setData({
        "consigneeParams.mobile": v
      });
    }
    if (type === 'tel') {
      this.setData({
        "consigneeParams.tel": v
      });
    }
    if (type === 'code') {
      this.setData({
        "consigneeParams.zip_code": v
      });
    }
    if (type === 'default') {
      this.setData({
        "isDefault": v || false
      });
    }
    if (type === 'addr') {
      this.setData({
        "consigneeParams.address": v
      });
    }
  },

  /**
   * 检查微信地址授权
   * @author darlang
   */
  checkWechatAddressAuth() {
    let self = this;
    wx.getSetting({
      success(res) {
        if (res.authSetting['scope.address'] === false) {
          wx.showModal({
            title: '授权未开启',
            content: '您尚未开启授权,请进入设置页面开启"通讯地址"授权',
            showCancel: false,
            confirmText: '了解',
            confirmColor: '#9c27ff'
          });
          self.setData({
            scopeState: true
          });
          return false;
        }
        if (!res.authSetting['scope.address']) {
          wx.authorize({
            scope: 'scope.address',
            success() {
              self.getWechatAddress();
            },
            fail() {
              showToast('导入失败,未授权导入');
            }
          });
        }else{
          self.getWechatAddress();
        }
      }
    });
  },

  /**
   * 检查授权回调
   * @author darlang
   */
  authOpenCallback(e) {
    let auth = e.detail;
    if(auth.authSetting['scope.address']) {
      this.getWechatAddress();
    }else{
      this.setData({
        scopeState: false
      });
      wx.showModal({
        title: '授权未开启',
        content: '您尚未开启授权,授权后才能使用导入功能!',
        showCancel: false,
        confirmText: '关闭',
        confirmColor: '#9c27ff'
      });
    }
  },

  /**
   * 智能导入微信地址
   * @author darlang
   */
  getWechatAddress() {
    wx.chooseAddress({
      success: (ars) => {
        if (ars.errMsg === 'chooseAddress:ok') {
          if (checkMobile(ars.telNumber)) {
            ars.mobile = ars.telNumber;
          }
          let zgData = this.data.regionsData;
          let seleIndex = this.data.regionSelector || [0,0,0];
          let p = '', c = '', d = '';
          ars.regionMsg = [];
          if (ars.provinceName) {
            // ars.provinceName = ars.provinceName.replace(/(省|市|自治区|特别行政区)/,'');
            for (let i = 0; i < zgData.regions.length; i++) {
              let item = zgData.regions[i];
              if (item.name === ars.provinceName) {
                p = item;
                ars.region = item.id;
                ars.regionMsg.push(item.name);
                seleIndex[0] = i || 0;
                break;
              }
            }
          }
          if (ars.cityName) {
            // ars.cityName = ars.cityName.replace(/(县|市|岛)/,'');
            for (let i = 0; i < p.regions.length; i++) {
              let item = p.regions[i];
              if (item.name === ars.cityName) {
                c = item;
                ars.region = item.id;
                ars.regionMsg.push(item.name);
                seleIndex[1] = i || 0;
                break;
              }
            }
          }
          if (ars.countyName) {
            // ars.countyName = ars.countyName.replace(/(区|县|市)/,'');
            for (let i = 0; i < c.regions.length; i++) {
              let item = c.regions[i];
              if (item.name === ars.countyName) {
                d = item;
                ars.region = item.id;
                ars.regionMsg.push(item.name);
                seleIndex[2] = i || 0;
                break;
              }
            }
          }

          this.setData({
            consigneeParams: {
              // 'consignee': '',// 修改传
              'name': ars.userName || '',// 名称
              'mobile': ars.mobile || '',// 手机
              'tel': ars.telNumber || '',// 电话
              'zip_code': ars.postalCode || '',// 邮编
              'region': ars.region,// 地区
              'address': ars.detailInfo || '',// 详细地址
              'identity': '',// ???
            },
            regionSelector: seleIndex,
            regionMsg: ars.regionMsg.join('-')
          });
        }
      }
    });
  },

  /**
   * 地址添加/修改
   * @author darlang
   */
  submitAddress() {
    let params = this.data.consigneeParams;
    params.consignee = this.data.id || '';

    if (!params.name) {
      showToast('姓名不能为空');
      return false;
    }
    if (!params.mobile) {
      showToast('手机不能为空');
      return false;
    }else{
      if (!checkMobile(params.mobile)) {
        showToast('请输入正确的手机号码');
        return false;
      }
    }
    if (!params.region) {
      showToast('请选择地区');
      return false;
    }
    if (!params.address) {
      showToast('详细地址不能为空');
      return false;
    }
    wx.showLoading({title: '保存中...',mask: true});
    ChangeConsigneeInfo(params.consignee,params.name,params.mobile,params.tel,params.zip_code,params.region,params.address).then((res) => {
      try {
        showToast('保存成功','success');
        let consignee = this.data.id;
        if (this.data.type === 'add') {
          consignee = res.consignee.id;
        }
        this.setDefaultAddress(consignee);
      } catch(e) {
        showToast('保存异常','warning');
      }

      setTimeout(() => {
        wx.navigateBack();
      },800);
    }).catch(err => {
      setTimeout(() => {
        if (err.data.error_code === 10000) {
          showToast('修改失败,该地址不存在,无法修改,请登录后添加','none',1300);
        }
      },800);
    });
  },


  /**
   * 地址删除
   * @author darlang
   */
  onDeleteConsignee() {
    let self = this;
    wx.showModal({
      title: '确认删除',
      content: '是否要删除？',
      success: (res) => {
        if(res.confirm) {
          DeleteConsigneeInfo(self.data.id).then(() => {
            showToast('删除成功','success');
            setTimeout(() => {
              wx.navigateBack();
            },500);
          });
        }
      }
    });
  },

  /**
   * 设定默认收货地址
   * @author darlang
   */
  setDefaultAddress(consignee) {
    let isDefault = this.data.isDefault;
    if (!isDefault) {
      return false;
    }
    SetDefaultConsignee(consignee);
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
  }
});