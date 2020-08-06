var SysConfig = require('../../utils/util.js');
Page({
  data: {
    onlynum: "", //
    creator: "", //姓名
    creatorId: "", //userid
    depart: "", //部门
    sDate: "", //申请时间
    leaveReason: "",
    tg_fx_show: false, //图书弹框
    tg_fx_arr: [], //图书弹框数据
    ts_lyarr: [], //图书领用数量
    rowiddata: {
      rowid: ""
    },
    project_search: "", //项目名称搜索
  },

  onLoad: function (options) {
    if (!options.id) {
      this.setData({
        judge_id: ""
      })
    } else {
      this.setData({
        judge_id: options.id
      })
    }

    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH201908231020302030114331"
      },
      method: "GET" //请求方式  目前接口先暂时全部使用get方式
    }).then((res) => {

      let allbook = []
      if (res.rows && res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {

          allbook.push({
            book_id: res.rows[i].id,
            book_name: res.rows[i].name,
            book_publisher: res.rows[i].publisher,
            book_price: res.rows[i].price,
            book_storeNum: parseInt(res.rows[i].sum) - parseInt(res.rows[i].virtualNum==""? 0 :res.rows[i].virtualNum) > 0 ? parseInt(res.rows[i].sum) - parseInt(res.rows[i].virtualNum) : 0,
            book_bh: res.rows[i].onlynum,
            book_num: 1,
            book_onlynum: this.data.onlynum, //主表唯一编号 
          })
        }
      }
      this.setData({
        tg_fx_arr: allbook
      })
    })
    if (options.id) {
      // 单体数据
      SysConfig.SubSystemData.request({
        istoken: true, //是否使用token
        XKLX: "SYBGGL", //接口XKLX参数
        XAction: "GetDataInterface", //接口XAction参数
        data: { //接口body体内参数
          "XDLMCID": "1001",
          "XDLMSID": "DYBH20190823102030203025622",
          "XDLMA": options.id
        },
        method: "GET"
      }).then((res) => {
        this.setData({
          rowiddata: {
            rowid: options.id
          },
          creator: res.rows[0].creator,
          sDate: res.rows[0].sqTime,
          leaveReason: res.rows[0].yongtu,
          creatorId: res.rows[0].creator_id,
          onlynum: res.rows[0].onlynum,
        })

        return SysConfig.SubSystemData.request({
          istoken: true, //是否使用token
          XKLX: "SYBGGL", //接口XKLX参数
          XAction: "GetDataInterface", //接口XAction参数
          data: { //接口body体内参数
            "XDLMCID": "1001",
            "XDLMSID": "DYBH202002191621372137105371",
            "XDLMA": res.rows[0].onlynum
          },
          method: "GET"
        })
      }).then((returnBook) => {
        if (returnBook.rows && returnBook.rows.length > 0) {
          let bookArray = []
          for (let j in returnBook.rows) {
            SysConfig.SubSystemData.request({
              istoken: true, //是否使用token
              XKLX: "SYBGGL", //接口XKLX参数
              XAction: "GetDataInterface", //接口XAction参数
              data: { //接口body体内参数
                "XDLMCID": "1001",
                "XDLMSID": "DYBH201908231020302030118332",
                "XDLMB": returnBook.rows[j].图书编号
              },
              method: "GET"
            }).then((bookinfo) => {
              bookArray.push({
                book_name: returnBook.rows[j].图书,
                book_num: returnBook.rows[j].数量,
                book_bh: returnBook.rows[j].图书编号,
                book_onlynum: returnBook.rows[j].关联编号,
                book_publisher: bookinfo.rows[0].publisher,
                book_price: bookinfo.rows[0].price,
                book_storeNum: bookinfo.rows[0].storeNum,
              });
              if (j == returnBook.rows.length - 1) {
                this.setData({
                  ts_lyarr: bookArray
                })
              }
            })
          }
        }
      })
    } else {
      this.setData({
        onlynum: 'LS' + SysConfig.ToolBox.getTimeAndRandom(),
        sDate: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(), //申请时间
      })
      // 获取人名
      SysConfig.UserInfo.GetUserName().then((res) => {
        this.setData({
          creator: res.data
        })
      })
      // 获取人员id
      SysConfig.UserInfo.GetUserID().then((res) => {
        this.setData({
          creatorId: res.data
        })
      })
      // 获取部门
      SysConfig.UserInfo.GetUserDepart().then((res) => {
        this.setData({
          depart: res.data
        })
      })
    }
  },
  onChangeReason(event) {
    this.setData({
      leaveReason: event.detail
    })
  },
  tiaoUrl() {
    wx.navigateTo({
      url: '/pages/ls_sqjl/ls_sqjl'
    })
  },
  addbook() { //添加图书
    this.setData({
      tg_fx_show: true
    })
  },
  tg_fx_cancel() {
    this.setData({
      tg_fx_show: false
    })
  },
  tg_fx_confirm(e) {
    this.setData({
      tg_fx_name: e.detail
    });
  },
  toggle(event) {
    const {
      index
    } = event.currentTarget.dataset;
    const checkbox = this.selectComponent(`.checkboxes-${index}`);
    console.log(this.data.tg_fx_arr[index])
    checkbox.toggle();
  },
  add_num(event) {
    let ind = event.currentTarget.dataset.id
    let {
      tg_fx_arr
    } = this.data
    if (tg_fx_arr[ind].book_num +1 <= tg_fx_arr[ind].book_storeNum) {
      tg_fx_arr[ind].book_num = tg_fx_arr[ind].book_num + 1
      this.setData({
        tg_fx_arr: tg_fx_arr
      })
    } else {
      wx.showToast({
        title: "领书数量不能大于库存数量！",
        icon: 'none',
        duration: 1000
      })
    }
  },
  reduce_num(event) {
    let ind = event.currentTarget.dataset.id 
    let {
      tg_fx_arr
    } = this.data
    if (tg_fx_arr[ind].book_num - 1 < 1) {
      wx.showToast({
        title: "领书数量不能小于1！",
        icon: 'none',
        duration: 1000
      })
    } else {
      tg_fx_arr[ind].book_num = tg_fx_arr[ind].book_num - 1
      this.setData({
        tg_fx_arr: tg_fx_arr
      })
    }
  },
  confirm_book(event) {
    let ind = event.currentTarget.dataset.id
    let {
      tg_fx_arr
    } = this.data
    if (tg_fx_arr[ind].book_num > tg_fx_arr[ind].book_storeNum) {
      wx.showToast({
        title: "领书数量不能大于库存数量！",
        icon: 'none',
        duration: 2000
      })
    } else {
      let {
        ts_lyarr
      } = this.data
      let ts_lyarr_index_data = JSON.stringify(tg_fx_arr[ind])
      let newArr = JSON.parse(ts_lyarr_index_data)
      if (!ts_lyarr.length) {
        ts_lyarr.push(newArr)
      } else {
        if (JSON.stringify(ts_lyarr).indexOf(JSON.stringify(newArr.book_id)) == -1) {
          ts_lyarr.push(newArr)
        } else {
          ts_lyarr = ts_lyarr.filter(item => {
            if (item.book_id == newArr.book_id ) {
              if(item.book_num<item.book_storeNum){
                item.book_num += newArr.book_num
                wx.showToast({
                  title: "图书添加成功！",
                  icon: 'success',
                  duration: 1000
                })
              }else{
                wx.showToast({
                  title: "领书数量不能大于库存数量！",
                  icon: 'none',
                  duration: 2000
                })
              }
            }
            return item
          })
        }
      }
      this.setData({
        ts_lyarr: ts_lyarr
      })
     
    }
  },
  del_book(e) {
    // if (this.data.rowiddata.rowid && e.currentTarget.dataset.rowid) {
    //   SysConfig.SubSystemData.request({
    //     istoken: true, //是否使用token
    //     XKLX: "SYBGGL", //接口XKLX参数
    //     XAction: "GetDataInterface", //接口XAction参数
    //     data: { //接口body体内参数
    //       "XDLMCID": "4000",
    //       "XDLMSID": "DYBH202002181047204720115334",
    //       "XDLMROWID": e.currentTarget.dataset.rowid
    //     },
    //     method: "GET"
    //   })
    // }
    let {
      ts_lyarr
    } = this.data
    ts_lyarr.splice(e.currentTarget.dataset.index, 1);
    this.setData({
      ts_lyarr
    });
  },
  project_search_Change(e) {
    SysConfig.SubSystemData.request({
      istoken: true,
      XKLX: "SYBGGL",
      XAction: "GetDataInterface",
      data: {
        "XDLMCID": "1001",
        "XDLMSID": "DYBH201908231020302030114331",
        "QueryKey": e.detail,
        "QueryType": "模糊查询"
      },
      method: "GET"
    }).then((res) => {
      let allbook = []
      if (res.rows && res.rows.length > 0) {
        for (let i = 0; i < res.rows.length; i++) {
          allbook.push({
            book_name: res.rows[i].name,
            book_publisher: res.rows[i].publisher,
            book_price: res.rows[i].price,
            book_storeNum: parseInt(res.rows[i].sum) - parseInt(res.rows[i].virtualNum) > 0 ? parseInt(res.rows[i].sum) - parseInt(res.rows[i].virtualNum) : 0,
            book_bh: res.rows[i].onlynum,
            book_num: 1,
            book_onlynum: this.data.onlynum, //主表唯一编号 
          })
        }
        this.setData({
          project_search: e.detail,
          tg_fx_arr: allbook
        })
      } else {
        this.setData({
          tg_fx_arr: []
        })
      }
    })
  },
  // 提交表单
  submitTijiao() {
    var that = this
    let {
      ts_lyarr
    } = that.data
    let bookObject = []
    let dataparams = {}
    for (let i = 0; i < ts_lyarr.length; i++) {
      bookObject.push({
        "图书": ts_lyarr[i].book_name,
        "数量": ts_lyarr[i].book_num,
        "图书编号": ts_lyarr[i].book_bh,
        "库内编号": SysConfig.ToolBox.getTimeAndRandom(),
        "关联编号": ts_lyarr[i].book_onlynum
      })
    }
    if (ts_lyarr.length < 1) {
      wx.showToast({
        title: "请添加图书！",
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (that.data.rowiddata.rowid) {
      dataparams = {
        "XDLMCID": "6000",
        "XDLMSID": "DYBH2019082310203020301825",
        "XDLMID": that.data.rowiddata.rowid,
        "XDLMyongtu": that.data.leaveReason
      }
    } else {
      dataparams = {
        "XDLMCID": "5000",
        "XDLMSID": "DYBH20190823102030203012523",
        "XDLMonlynum": that.data.onlynum,
        "XDLMdepart": that.data.depart,
        "XDLMshzt": "待提交",
        "XDLMtitle": that.data.creator + "的领书申请 ",
        "XDLMcreator_id": that.data.creatorId,
        "XDLMcreator": that.data.creator,
        "XDLMsqTime": that.data.sDate,
        "XDLMyongtu": that.data.leaveReason
      }
    }
    SysConfig.SubSystemData.request({
      istoken: true, //是否使用token
      XKLX: "SYBGGL", //接口XKLX参数
      XAction: "GetDataInterface", //接口XAction参数
      data: dataparams,
      method: "GET" //请求方式  目前接口先暂时全部使用get方式
    }).then((data) => {

      if (that.data.rowiddata.rowid) {
        return SysConfig.SubSystemData.request({
          istoken: true, //是否使用token
          XKLX: "SYBGGL", //接口XKLX参数
          XAction: "GetDataInterface", //接口XAction参数
          data: {
            "XDLMCID": "4001",
            "XDLMSID": "DYBH20200402172205028236",
            "XDLMA": that.data.onlynum
          },
          method: "GET" //请求方式  目前接口先暂时全部使用get方式
        }).then(() => {
          SysConfig.SubSystemData.request({
            istoken: true, //是否使用token
            XKLX: "SYBGGL", //接口XKLX参数
            XAction: "GetDataInterface", //接口XAction参数
            data: {
              "XDLMCID": '5001',
              "XDLMSID": 'DYBH2020040209415104731637',
              "datalist": JSON.stringify({
                "key": bookObject
              }),
            },
            method: "GET" //请求方式  目前接口先暂时全部使用get方式
          })
        })
      } else {
        return SysConfig.SubSystemData.request({
          istoken: true, //是否使用token
          XKLX: "SYBGGL", //接口XKLX参数
          XAction: "GetDataInterface", //接口XAction参数
          data: {
            "XDLMCID": '5001',
            "XDLMSID": 'DYBH2020040209415104731637',
            "datalist": JSON.stringify({
              "key": bookObject
            }),
          },
          method: "GET" //请求方式  目前接口先暂时全部使用get方式
        }).then(() => {
          SysConfig.SubSystemData.request({
            istoken: true, //是否使用token
            XKLX: "SYBGGL", //接口XKLX参数
            XAction: "GetDataInterface", //接口XAction参数
            data: {
              "XDLMCID": "9000",
              "XDLMTID": "9203",
              "XDLMSID": "9203004",
              "关联编号": that.data.onlynum
            },
            method: "GET" //请求方式  目前接口先暂时全部使用get方式
          })
        })
      }
    }).then((res) => {
      return SysConfig.WorkflowManage.create(that.data.onlynum, '领书申请')
    }).then((shlc) => {
      let icon;
      if (shlc.success) {
        icon = 'success';
      } else {
        icon = 'none';
      }
      wx.showToast({
        title: shlc.message,
        icon: 'success',
        duration: 2000,
        success: () => {
          if (this.data.judge_id!="") {
          wx.navigateBack({
          delta: 1
          })
          }else{
          wx.redirectTo({
            url: '/pages/ls_sqjl/ls_sqjl'
          })
          }
        }
      })
    })
  }
})