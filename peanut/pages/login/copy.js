Page({

  /**
   * 页面的初始数据
   */
  data: {
    accBox: 0,
    loginStyle:1,
    userAcc: '13395059606',
    userPsw: 'qwertyuiop',
    phone: '13395059606',
    checked: false,
    btnDisabled: true,
    loginstate: "0", //登录状态
    openid: "",   
    userEntity: null,
    terminal: "",
    osVersion: "",
    phoneNumber:"", //手机号
    showModal: false,//定义登录弹窗
  },
  //显示账号密码登录
  accLogin(){
    this.setData({
      accBox:1,
      loginStyle:0
    })
  },
  // 微信一键授权登录
  goWechat(){
    this.setData({
      accBox:0,
      loginStyle:1
    })
  },
  //账号双向绑定
  getUserAcc(e){
    this.setData({
      userAcc:e.detail.value
    })
  },
  //密码双向绑定
  getUserPsw(e){
    this.setData({
      userPsw:e.detail.value
    })
  },
  //手机号双向绑定
  getPhone(e){
    this.setData({
      phone:e.detail.value
    })
  },
  /**
   * @param {checkBlur} 复选框点击事件
   */
  checkBlur(e){
    if(this.data.checked == false){
      this.setData({
        checked: true,
        btnDisabled:false
      })
    }else{
      this.setData({
        checked: false,
        btnDisabled:true
      })
    }
  },
  /**
   * [loading 登录等待加载]
   */
  loading(){
    let that = this;
    wx.showLoading({
      title: '登陆中',
      mask: true
    })
    that.setData({
      btnDisabled:true
    })
    setTimeout(function () {
      that.setData({
        btnDisabled:false
      })
      wx.hideLoading()
    }, 1000)
  },
  
  /**
   * [login 账号密码登录]
   */
  login(){
    this.loading();
    let that = this;
    if(that.data.userAcc != '' && that.data.phone != '' && that.data.userPsw != ''){
      wx.request({
        url: 'http://127.0.0.1/th5/public/index.php/login/Login/login',
        data: {
          'acc': that.data.userAcc,
          'phone': that.data.phone,
          'password': that.data.userPsw
        },
        method: 'POST',
        timeout: 5000,
        dataType: 'JSON',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function(res) {
          let resData;
          if (typeof (res.data) == 'string') {
            resData = JSON.parse(res.data);
          }else{
            resData = res.data
          }
          if(resData.code == 1){
            let userToken = resData.data.token;
            let userInfo = that.data.userAcc;
            wx.setStorage({
              key: userInfo,
              data: userToken
            })
            wx.showModal({
              title: '登录提示',
              content: resData.msg,
              showCancel: false,
              success:function(){
                wx.reLaunch({url:'../index/index'});
              }
            })
          }else{
            wx.showModal({
              title: '登录提示',
              content: resData.msg
            })
          }
        },
        fail: function() {
          console.log('连接异常')
        }
      })
    }else{
      wx.showModal({
        title: '登录提示',
        content: '请输入账号密码手机号进行验证'
      })
    }
  },
  
  onLoad () {
    let _this = this;
    // 判断用户是否授权
    wx.getSetting({
      success (res) {
        console.log(res)
        if(res.authSetting['scope.userInfo']){
          // 获取用户信息
          wx.getUserInfo({
            success: function(res) {
              console.log(res.userInfo)
              // _this.onGotUserInfo();
            }
          })
        }
      },
      fail(res){
        console.log(res)
      }
    })
  },
  /**
   * 
   * @param {onGotUserInfo 获取用户信息，存储在本地} e 
   */
  onGotUserInfo () {
    let that = this;
    // 微信登录
    wx.login({
      success(res){
        if(res.code){
          // 获取用户信息
          wx.getUserInfo({
            success(ures){
              let formData = {
                'nickName': ures.userInfo.nickName,
                'sex':ures.userInfo.gender,
                'head_img': ures.userInfo.avatarUrl,
                'address': ures.userInfo.country+ures.userInfo.province+ures.userInfo.city,
                'code': res.code
              };
              // 发起登录请求
              that.showDialogBtn();//调用一键获取手机号弹窗
              that.weChatLogin(formData)
            },
            
          })
        }
      }
    })
  },
 
  /**
   * [weChatLogin 微信登录接口请求]
   */ 
  weChatLogin (userInfo) {
    wx.request({
      url: 'http://127.0.0.1/th5/public/index.php/login/Login/weChatLogin',
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        head_img: userInfo.head_img,
        nickName: userInfo.nickName,
        address: userInfo.head_img,
        sex: userInfo.sex,
        // openid: that.data.openid,
      },
      success(res) {
        console.log(res)
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  // 显示一键获取手机号弹窗
  showDialogBtn: function () {
    this.setData({
      showModal: true,//修改弹窗状态为true，即显示
      loginStyle: 0
    })
  },
  // 隐藏一键获取手机号弹窗
  hideModal: function () {
    this.setData({
      showModal: false,//修改弹窗状态为false,即隐藏
      loginStyle:1
    });
  },
  // onshow: function (openid, userInfo, phoneNumber) {
  //   var that = this;
  //   wx.getSystemInfo({
  //     success: function (res) {
  //       console.log(res)
  //       that.setData({ terminal: res.model });
  //       that.setData({ osVersion: res.system });
  //     }
  //   })
  //   wx.request({
  //     url: 'http://127.0.0.1/th5/public/index.php/login/Login/login',
  //     method: 'POST',
  //     header: {
  //       'content-type': 'application/json' // 默认值
  //     },
  //     data: {
  //       username: phoneNumber,
  //       parentuser: 'xudeihai',
  //       wximg: userInfo.avatarUrl,
  //       nickname: userInfo.nickName,
  //       identity: "",
  //       terminal: that.data.terminal,
  //       osVersion: that.data.system,
  //       logintype: "10",//微信登录
  //       openid: that.data.openid,
  //     },
  //     success(res) {
  //       if (res.data.r == "T") {
  //         that.setData({ userEntity: res.data.d });
  //         wx.setStorage({
  //           key: "userEntity",
  //           data: res.data.d
  //         })
  //         that.setData({ loginstate: "1" });
  //         wx.setStorage({
  //           key: "loginstate",
  //           data: "1"
  //         })
  //         wx.setStorage({
  //           key: 'userinfo',
  //           data: "1"
  //         })         
  //       }
  //       else {
  //         return;
  //       }
  //     },
  //     fail(res) {
  //       console.log(res);
  //     }
  //   })
  // },
  //绑定手机
  getPhoneNumber: function (e) {
    var that = this;
    that.hideModal();
    wx.checkSession({
      success () {
        wx.request({
          url: 'http://127.0.0.1/th5/public/index.php/login/Login/weChatLogin',
          data: {},
          
        })
      }
      // success: function () {
      //   wx.login({
      //     success: res => {
      //       wx.request({
      //         url: 'http://127.0.0.1/th5/public/index.php/login/Login/login', //仅为示例，并非真实的接口地址
      //         data: {
      //           account: '1514382701',
      //           jscode: res.code
      //         },
      //         method: "POST",
      //         header: {
      //           'content-type': 'application/json' // 默认值
      //         },
      //         success(res) {
      //           if (res.data.r == "T") {
      //             wx.setStorage({
      //               key: "openid",
      //               data: res.data.openid
      //             })
      //             wx.setStorage({
      //               key: "sessionkey",
      //               data: res.data.sessionkey
      //             })
      //             wx.setStorageSync("sessionkey", res.data.sessionkey);
      //             wx.request({
      //               url: 'http://127.0.0.1/th5/public/index.php/login/Login/login',//自己的解密地址
      //               data: {
      //                 encryptedData: e.detail.encryptedData,
      //                 iv: e.detail.iv,
      //                 code: wx.getStorageSync("sessionkey")
      //               },
      //               method: "post",
      //               header: {
      //                 'content-type': 'application/json'
      //               },
      //               success: function (res) {
      //                 if (res.data.r == "T") {
      //                   that.onshow(that.data.openid, that.data.userInfo, res.data.d.phoneNumber);//调用onshow方法，并传递三个参数
      //                   console.log("登录成功")
      //                   console.log(res.data.d.phoneNumber)//成功后打印微信手机号
      //                 }
      //                 else {
      //                   console.log(res);
      //                 }
      //               }
      //             })
      //           }
      //         }
      //       })
      //     }
      //   })
      // },
      // fail: function () {
      //   wx.login({
      //     success: res => {
      //       wx.request({
      //         url: 'http://127.0.0.1/th5/public/index.php/login/Login/login', //仅为示例，并非真实的接口地址
      //         data: {
      //           account: '1514382701',
      //           jscode: res.code
      //         },
      //         method: "POST",
      //         header: {
      //           'content-type': 'application/json' // 默认值
      //         },
      //         success(res) {
      //           if (res.data.r == "T") {
      //             wx.setStorage({
      //               key: "openid",
      //               data: res.data.openid
      //             })
      //             wx.setStorage({
      //               key: "sessionkey",
      //               data: res.data.sessionkey
      //             })
      //             wx.request({
      //               url: 'http://127.0.0.1/th5/public/index.php/login/Login/login',//自己的解密地址
      //               data: {
      //                 encryptedData: e.detail.encryptedData,
      //                 iv: e.detail.iv,
      //                 code: res.data.sessionkey
      //               },
      //               method: "post",
      //               header: {
      //                 'content-type': 'application/json'
      //               },
      //               success: function (res) {
      //                 that.onshow(that.data.openid, that.data.userInfo, res.data.d.phoneNumber);//调用onshow方法，并传递三个参数
      //               }
      //             })
      //           }
      //         }
      //       })
      //     }
      //   })
      // }
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})