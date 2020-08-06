var SysConfig = require("../../utils/util.js")
Page({
    /**
     * 页面的初始数据
     */
    data: {
        lzyj_data: [], //流转意见
        useData: { //用户数据
            mUserID: null
        },
        pageParams: {}, //页面参数
        rowidData: {}, //单行数据
        backNode: [], //退回节点数据渲染
        ht_jd: null, //回退节点
        current: 1,
        xianyin: true,
        items: [{
                name: 'ok',
                value: '同意完成',
                checked: 'true'
            },
            {
                name: 'no',
                value: '不同意'
            }
        ],
        steps: [], //所有步骤
        active: 0, //	当前步骤
        linkid: ""
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            pageParams: {
                rowid: options.id,
                m_LConlynum: options.xmlcid,
                m_Onlynum: options.onlynum,
                module: options.module,
                urlid: options.urlid,
            }
        })
        SysConfig.UserInfo.GetUserID().then((res) => {
            this.setData({
                useData: {
                    mUserID: res.data
                }
            })
            return SysConfig.SubSystemData.request({ // 获取主表单行数据
                istoken: true,
                XKLX: "SYXMGL",
                XAction: "GetDataInterface",
                data: {
                    "XDLMCID": "1001",
                    "XDLMSID": "DYBH201908231026422642114212",
                    "XDLMA": this.data.pageParams.urlid,
                },
                method: "GET"
            })
        }).then((res) => {
            if (res.rows) {
                SysConfig.WorkflowManage.getXMInfo(res) //流程函数初始化
                console.log(res)
                this.setData({ //主表数据相关
                    xm: {
                        xmmc: res.rows[0].xmmc,
                        xmlx: res.rows[0].xmlx,
                        xmbh: res.rows[0].xmbh,
                        year: res.rows[0].year,
                        lxsj: res.rows[0].lxsj,
                        xmgroup: res.rows[0].xmgroup,
                        dig_license: res.rows[0].dig_license,
                        survey_length: res.rows[0].survey_length,
                        excavate_site_area: res.rows[0].excavate_site_area,
                        other: res.rows[0].other,
                        WorkPlace: res.rows[0].WorkPlace,
                        adddetails: res.rows[0].adddetails,
                        logitude: res.rows[0].logitude,
                        latitude: res.rows[0].latitude,
                        StartTime: res.rows[0].StartTime,
                        EndTime: res.rows[0].EndTime,
                        xmzq: res.rows[0].xmzq,
                        remark: res.rows[0].remark,
                        module: res.rows[0].module,
                        linkid: res.rows[0].onlynum,
                        title: res.rows[0].title
                    },
                    active: res.rows[0].currentLCxh - 1
                })


                SysConfig.SubSystemData.request({ // 获取人员相关
                    istoken: true,
                    XKLX: "SYXMGL",
                    XAction: "GetDataInterface",
                    data: {
                        "XDLMCID": "1001",
                        "XDLMSID": "DYBH20200213151746174616111",
                        "XDLME": res.rows[0].onlynum,
                    },
                    method: "GET"
                }).then((res) => {
                    console.log(res)
                    this.setData({
                        tzggData: res.rows
                    })
                })
                SysConfig.SubSystemData.request({ // 获取合作单位相关
                    istoken: true,
                    XKLX: "SYXMGL",
                    XAction: "GetDataInterface",
                    data: {
                        "XDLMCID": "1001",
                        "XDLMSID": "DYBH20200310101352135225691",
                        "XDLMA": res.rows[0].onlynum,
                    },
                    method: "GET"
                }).then((res) => {
                    this.setData({
                        hzdwData: res.rows
                    })
                })
                return SysConfig.WorkflowManage.getWorkflowInfoAndList() // 获取流转意见
            }
        }).then((res) => {
            console.log(res)
            this.setData({
                lzyj_data: res
            })
            return SysConfig.WorkflowManage.getWorkflowNodesState()
        }).then((res) => {
            this.setData({
                steps: res
            })
        })
    },
    radioJiedian: function(e) {
        this.setData({
            ht_jd: e.detail.value
        })
    },
    radioChange: function(e) {
        if (e.detail.value == 'no') {
            this.setData({
                xianyin: false
            })
            SysConfig.WorkflowManage.getRollbackNodeList().then((res) => {
                console.log(res)
                this.setData({
                    backNode: res,
                    ht_jd: res[0].Lc_xh
                })
            })

        } else {
            this.setData({
                xianyin: true
            })
        }
    },
    // 审核通过接口：
    bindFormsubmit: function(e) {
        let that = this
        if (that.data.xianyin) {
            // 发送通过请求
            SysConfig.WorkflowManage.complete(e.detail.value.wQPYJ).then((res) => {
                let that = this
                console.log(res)
                if (res.message.indexOf("流程已完成") != -1) {
                    var createinfo_XM_data = SysConfig.WorkflowManage.createXMBH(that.data.pageParams.urlid);
                    var createinfo_CW_data;
                    createinfo_XM_data.then((createinfo_XM) => {
                        if (createinfo_XM.success) {
                            wx.showToast({
                                title: createinfo_XM.message,
                                icon: 'success',
                                duration: 1500,
                                success: () => {
                                    setTimeout(function() {
                                        var hascw_data = SysConfig.WorkflowManage.usingCWXM();
                                        hascw_data.then((hascw) => {
                                            if (hascw) {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '是否现在添加财务项目',
                                                    success(res) {
                                                        if (res.confirm) {
                                                            createinfo_CW_data = SysConfig.WorkflowManage.setCWXM(that.data.pageParams.urlid);
                                                            createinfo_CW_data.then((createinfo_CW) => {
                                                                if (createinfo_CW.success) {
                                                                    wx.showToast({
                                                                        title: createinfo_XM.message,
                                                                        icon: 'success',
                                                                        duration: 2000,
                                                                        complete: () => {
                                                                            wx.showToast({
                                                                                title: "当前审批环节完成",
                                                                                icon: 1,
                                                                                time: 3000,
                                                                                complete: () => {
                                                                                    wx.navigateBack({
                                                                                        delta: 1
                                                                                    });
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            })

                                                        } else {
                                                            wx.showToast({
                                                                title: "立项完成！",
                                                                icon: 1,
                                                                time: 3000,
                                                                complete: () => {
                                                                    wx.navigateBack({
                                                                        delta: 1
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }
                                                })
                                            } else {
                                                wx.showToast({
                                                    title: "立项完成！",
                                                    icon: 'success',
                                                    duration: 2000,
                                                    complete: () => {
                                                        wx.navigateBack({
                                                            delta: 1
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                    }, 2000)

                                }
                            })
                        }
                    })
                } else {
                    wx.showToast({
                        title: res.message,
                        icon: 'success',
                        duration: 2000,
                        complete: () => {
                            wx.navigateBack({
                                delta: 1
                            });
                        }
                    })
                }
            })
        } else {
            console.log(e.detail.value.wQPYJ)
                // 发送退回请求
            SysConfig.WorkflowManage.gotoNode(e.detail.value.wQPYJ, this.data.ht_jd).then((res) => {
                console.log(res)
                wx.showToast({
                    title: res.message,
                    icon: 'success',
                    duration: 1000,
                    complete: () => {
                        wx.navigateBack({
                            delta: 1
                        });
                    }
                })
            })
        }
    }
})