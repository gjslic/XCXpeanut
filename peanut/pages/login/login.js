Page({

  /**
   * 页面的初始数据
   */
  data: {
    modelBox: 0 ,
    modelInfo: 0 ,
    accBox: 1,
    loginStyle:1,
    pswType: true,
    userAcc: '13395059606',
    userPsw: 'qwertyuiop',
    phone: '13395059606',
    loginstate: "0", //登录状态
    openid: "", 
    session_key: '',  
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
  // 密码显示
  changePsw(){
    if(this.data.pswType == true){
      this.setData({
        pswType: false
      })
    }else{
      this.setData({
        pswType: true
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
            let userAcc = that.data.userAcc;
            wx.setStorage({
              key: userAcc,
              data: userToken
            })
            wx.showModal({
              title: '登录提示',
              content: resData.msg,
              showCancel: true,
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
  
  // 页面初始化判断用户是否授权
  onLoad () {
    let _this = this;
    // 判断用户是否授权
    // wx.getSetting({
    //   success (res) {
    //     console.log(res)
    //     if (res.authSetting['scope.userInfo'] === true) { // 成功授权
    //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(res)
    //           _this.setUserInfoAndNext(res)
    //         },
    //         fail: res => {
    //           console.log(res)
    //         }
    //       })
    //     } else if (res.authSetting['scope.userInfo'] === false) { // 授权弹窗被拒绝
    //       wx.showModal({
    //         title: '登录提示',
    //         content: '同意获取个人信息',
    //         showCancel: false,
    //         success:function(){
    //           wx.openSetting({
    //             success: res => {
    //               console.log(res)
    //             },
    //             fail: res => {
    //               console.log(res)
    //             }
    //           })
    //           wx.reLaunch({url:'../index/index'});
    //         }
    //       })
          
    //     } else { // 没有弹出过授权弹窗
    //       wx.getUserInfo({
    //         success: res => {
    //           console.log(res)
    //           _this.setUserInfoAndNext(res)
    //         },
    //         fail: res => {
    //           console.log(res)
    //           wx.openSetting({
    //             success: res => {
    //               console.log(res)
    //             },
    //             fail: res => {
    //               console.log(res)
    //             }
    //           })
    //         }
    //       })
    //     }
    //   },
    //   fail(res){
    //     console.log(res)
    //   }
    // })
  },
   // 获取个人信息成功，然后处理剩下的业务或跳转首页
   setUserInfoAndNext(res) {
    // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    // 所以此处加入 callback 以防止这种情况
    if (this.userInfoReadyCallback) {
      this.userInfoReadyCallback(res)
    }
    wx.hideLoading()
    // 跳转首页
    setTimeout(() => {
      wx.reLaunch({
        url: '../index/index'
      })
    }, 1000)
  },
  /**
   * 
   * @param {onGotUserInfo 获取用户信息}
   */
  onGotUserInfo () {
    let that = this;
    // 微信登录
    wx.login({
      success(res){
        console.log(res.code)
        if(res.code){
        console.log(res.code)
          wx.request({
            url: 'http://127.0.0.1/th5/public/index.php/login/Login/getCode',
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            data: {'code':res.code},
            success(res) {
              let codeData = res.data.data;
              that.setData({
                openid: codeData.openid,
                session_key: codeData.session_key
              })
            },
            fail(res) {
              console.log(res);
            }
          })
          // that.getPhoneNumber()

          // 获取用户信息
          // wx.getUserInfo({
          //   success(ures){
          //     let formData = {
          //       'nickName': ures.userInfo.nickName,
          //       'sex':ures.userInfo.gender,
          //       'head_img': ures.userInfo.avatarUrl,
          //       'address': ures.userInfo.country+ures.userInfo.province+ures.userInfo.city,
          //       'code': res.code
          //     };
          //     that.bindGetUserInfo();
          //     // 发起登录请求
          //     // that.showDialogBtn();//调用一键获取手机号弹窗
          //     // that.weChatLogin(formData)
          //   },
            
          // })
        }
      }
    })
  },
  bindGetUserInfo(e){
    let that = this;
    wx.login({
      success(res){
        if(res.code){
          let userCode = res.code;
          wx.getUserInfo({
            success (data) {
              console.log(data)
              let formData = {
                'encryptedData': data.encryptedData, // 用户加密数据
                'iv': data.iv,   // 加密算法，用于解密
                'headImg': data.userInfo.avatarUrl,  // 用户头像
                'nickName': data.userInfo.nickName,  // 用户昵称
                'sex': data.userInfo.gender,         // 用户性别
                'address': data.userInfo.country+data.userInfo.province+data.userInfo.city,  // 用户所在地
                'code': userCode
              }
              wx.request({
                url: 'http://127.0.0.1/th5/public/index.php/login/Login/getCode',
                method: 'POST',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                data: formData,
                success(res) {
                  console.log(res)
                  // if(res.data.data){
                  //   let codeData = res.data.data;
                  //   if(codeData.state == 1){
                  //     that.setData({
                  //       openid: codeData.openid,
                  //       session_key: codeData.session_key,
                  //       loginstate: codeData.msg
                  //     })
                  //   }
                  // }else{
                  //   that.setData({
                  //     loginstate: '0'
                  //   })
                  //   wx.showModal({
                  //     title: '登录提示',
                  //     content: res.data.msg
                  //   })
                  // }
                },
                fail(res) {
                  console.log(res);
                }
              })
            }
          })
          // that.bindgetphonenumber();
        }
      }
    })
    
  },
  
          // that.getPhoneNumber()

          // 获取用户信息
          // wx.getUserInfo({
          //   success(ures){
          //     let formData = {
          //       'nickName': ures.userInfo.nickName,
          //       'sex':ures.userInfo.gender,
          //       'head_img': ures.userInfo.avatarUrl,
          //       'address': ures.userInfo.country+ures.userInfo.province+ures.userInfo.city,
          //       'code': res.code
          //     };
          //     that.bindGetUserInfo();
          //     // 发起登录请求
          //     // that.showDialogBtn();//调用一键获取手机号弹窗
          //     // that.weChatLogin(formData)
          //   },
            
          // })
  /**
   * [ 底部弹出框]
   */
  getPhone(){
    this.setData({
      modelBox: 'modelBox',
      modelInfo: 'modelInfo'
    })
  },

  /**
   * [bindGetPhoneNum 获取用户手机号]
   */
  getPhoneNumber(e){
    wx.login({
      success(res){
        console.log(e)
        if(res.code){
          wx.request({
            url: 'http://127.0.0.1/th5/public/index.php/login/Login/getCode',
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            data: {'code':res.code},
            success(res) {
              console.log(e)
              console.log(res)
            },
            fail(res) {
              console.log(res);
            }
          })
        }
      }
    })
  },
  // 关闭弹出框
  closeModel(){
    this.setData({
      modelBox: 'hidden',
      modelInfo: 'hidden'
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

























































































// Page({
//   /**
//    * 页面的初始数据
//    */
//   data: {
//      openid: "",
//     loginstate: "0",
//     openid: "",
//     userEntity: null,
//     terminal: "",
//     osVersion: "",
//      phoneNumber: "",
//     showModal: false,//定义登录弹窗
//   },
//   //在页面加载的时候，判断缓存中是否有内容，如果有，存入到对应的字段里
//   onLoad: function () {
//     var that = this;
//     wx.getStorage({
//       key: 'openid',
//       success: function (res) {
//         that.setData({ openid: res.data });
//       },
//       fail: function (res) {
//         that.getcode();
//       }
//     });
//     wx.getStorage({
//       key: 'userEntity',
//       success: function (res) {
//         that.setData({ userEntity: res.data });
//       },
//       fail: function (res) {
//         console.log("fail1");
//       }
//     });
//     wx.getStorage({
//       key: 'loginstate',
//       success: function (res) {
//         that.setData({ loginstate: res.data });
//       }, fail: function (res) {
//         console.log("fail2");
//       }
//     });
//   },
//   // getcode 获取code
//   getcode () {
//     wx.login({
//       success (res) {
//         console.log(res.code)
//       }
//     })
//   },
//   onGotUserInfo: function (e) {
//     var that = this;
//     if (e.detail.errMsg == "getUserInfo:ok") {
//       console.log(e)
//       wx.setStorage({
//         key: "userinfo",
//         data: e.detail.userInfo
//       })
//       this.setData({ userInfo: e.detail.userInfo });
//       that.showDialogBtn();//调用一键获取手机号弹窗（自己写的）
//     }
//   },
//   // 显示一键获取手机号弹窗
//   showDialogBtn: function () {
//     this.setData({
//       showModal: true//修改弹窗状态为true，即显示
//     })
//   },
//   // 隐藏一键获取手机号弹窗
//   hideModal: function () {
//     this.setData({
//       showModal: false//修改弹窗状态为false,即隐藏
//     });
//   },
//   onshow: function (openid, userInfo, phoneNumber) {
//     var that = this;
//     wx.getSystemInfo({
//       success: function (res) {
//         console.log(res)
//         that.setData({ terminal: res.model });
//         that.setData({ osVersion: res.system });
//       }
//     })
//     wx.request({
//       url: '登录接口',
//       method: 'POST',
//       header: {
//         'content-type': 'application/json' // 默认值
//       },
//       data: {
//         username: phoneNumber,
//         parentuser: 'xudeihai',
//         wximg: userInfo.avatarUrl,
//         nickname: userInfo.nickName,
//         identity: "",
//         terminal: that.data.terminal,
//         osVersion: that.data.system,
//         logintype: "10",//微信登录
//         openid: that.data.openid,
//       },
//       success(res) {
//         if (res.data.r == "T") {
//           that.setData({ userEntity: res.data.d });
//           wx.setStorage({
//             key: "userEntity",
//             data: res.data.d
//           })
//           that.setData({ loginstate: "1" });
//           wx.setStorage({
//             key: "loginstate",
//             data: "1"
//           })
//           wx.setStorage({
//             key: 'userinfo',
//             data: "1"
//           })
//         }
//         else {
//           return;
//         }
//       },
//       fail(res) {
//         console.log(res);
//       }
//     })
//   },
//   //绑定手机
//   getPhoneNumber: function (e) {
//     var that = this;
//     that.hideModal();
//     wx.checkSession({
//       success: function () {
//         wx.login({
//           success: res => {
//             wx.request({
//               url: '自己的登录接口', //仅为示例，并非真实的接口地址
//               data: {
//                 account: '1514382701',
//                 jscode: res.code
//               },
//               method: "POST",
//               header: {
//                 'content-type': 'application/json' // 默认值
//               },
//               success(res) {
//                 if (res.data.r == "T") {
//                   wx.setStorage({
//                     key: "openid",
//                     data: res.data.openid
//                   })
//                   wx.setStorage({
//                     key: "sessionkey",
//                     data: res.data.sessionkey
//                   })
//                   wx.setStorageSync("sessionkey", res.data.sessionkey);
//                   wx.request({
//                     url: '自己的解密接口',//自己的解密地址
//                     data: {
//                       encryptedData: e.detail.encryptedData,
//                       iv: e.detail.iv,
//                       code: wx.getStorageSync("sessionkey")
//                     },
//                     method: "post",
//                     header: {
//                       'content-type': 'application/json'
//                     },
//                     success: function (res) {
//                       if (res.data.r == "T") {
//                         that.onshow(that.data.openid, that.data.userInfo, res.data.d.phoneNumber);//调用onshow方法，并传递三个参数
//                         console.log("登录成功")
//                         console.log(res.data.d.phoneNumber)//成功后打印微信手机号
//                       }
//                       else {
//                         console.log(res);
//                       }
//                     }
//                   })
//                 }
//               }
//             })
//           }
//         })
//       },
//       fail: function () {
//         wx.login({
//           success: res => {
//             wx.request({
//               url: '自己的登录接口', //仅为示例，并非真实的接口地址
//               data: {
//                 account: '1514382701',
//                 jscode: res.code
//               },
//               method: "POST",
//               header: {
//                 'content-type': 'application/json' // 默认值
//               },
//               success(res) {
//                 if (res.data.r == "T") {
//                   wx.setStorage({
//                     key: "openid",
//                     data: res.data.openid
//                   })
//                   wx.setStorage({
//                     key: "sessionkey",
//                     data: res.data.sessionkey
//                   })
//                   wx.request({
//                     url: '自己的解密接口',//自己的解密地址
//                     data: {
//                       encryptedData: e.detail.encryptedData,
//                       iv: e.detail.iv,
//                       code: res.data.sessionkey
//                     },
//                     method: "post",
//                     header: {
//                       'content-type': 'application/json'
//                     },
//                     success: function (res) {
//                       that.onshow(that.data.openid, that.data.userInfo, res.data.d.phoneNumber);//调用onshow方法，并传递三个参数
//                     }
//                   })
//                 }
//               }
//             })
//           }
//         })
//       }
//     })
//   },
// })