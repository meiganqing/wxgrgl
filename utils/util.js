// const http = "http://192.168.28.251:8111";
// const http = "http://117.34.118.124:9988";
const http = "https://syoa.october3d.com";
// const http = "http://117.34.118.124:2020";
class user_data {
    set_storage(name, data) {
        return new Promise((resolve, reject) => {
            wx.setStorage({
                key: name,
                data: data,
                success: function(res) {
                    resolve(res)
                },
                fail(error) {
                    reject(error);
                }
            })
        })
    }
    get_storage(name) {
        return new Promise((resolve, reject) => {
            wx.getStorage({
                key: name,
                success: function(res) {
                    resolve(res)
                },
                fail(error) {
                    reject(error)
                    wx.redirectTo({
                        //目的页面地址
                        url: '/pages/login/login',
                    })
                }
            })
        })
    }

    clear_storage(name) {
        if (name) {
            return new Promise((resolve, reject) => {
                wx.removeStorage({
                    key: name,
                    success(res) {
                        resolve(res)
                    },
                    fail(res) {
                        reject(res);
                    }
                })
            })
        } else {
            return new Promise((resolve, reject) => {
                wx.clearStorage({
                    success(res) {
                        resolve(res)
                    }
                })
            })
        }
    }
    GetUserName() {
        return this.get_storage("mUserName")
    }
    GetUserID() {
        return this.get_storage("mUserID")
    }
    GetUserOnlynum() {
        return this.get_storage("mUserOnlyNum")
    }
    GetUserDepart() {
        return this.get_storage("mDepartment")
    }
    GetSysToken() {
        return this.get_storage("sytoken");
    }
    Getloginname() {
        return this.get_storage("mLoginName");
    }
    GetPassword() {
        return this.get_storage("Password");
    }
}
const UserInfo = new user_data()
class request_data {
    constructor() {}
    request(params) {
        let that = this
        return new Promise((resolve, reject) => {
            if (params.istoken) {
                UserInfo.GetSysToken().then((res) => {
                    params.token = res.data
                        // console.log(params.token)
                    wx.request({
                        url: http + "/xdData/xdDataManage.ashx?XAction=" + params.XAction + "&XKLX=" + params.XKLX,
                        method: params.method || 'POST',
                        data: params.data,
                        header: {
                            'Authorization': params.token
                        },
                        success: (res) => {
                            if (res.data.message == "NOTLOGIN" || res.data.msg == "NOTLOGIN" || res.data.message == "非法访问001" || res.data.message == "非授权地址访问，用户被授权地址与访问地址不一致") {
                                wx.showToast({
                                    title: "网络变化将返回首页",
                                    icon: 'none',
                                    duration: 2000,
                                    complete: () => {
                                        wx.showLoading({
                                            title: '网络变化将返回首页',
                                        })
                                        let login_name = ""
                                        let login_password = ""
                                        UserInfo.Getloginname().then((res) => {
                                            login_name = res.data
                                            return UserInfo.GetPassword()
                                        }).then((res) => {
                                            login_password = res.data
                                            if (login_name && login_password) {
                                                that.login_data(login_name, login_password)
                                            } else {
                                                that.gettoken()
                                            }
                                        })
                                    }
                                })
                            } else {
                                if (res.data.success || res.data.code == "0") {
                                    resolve(res.data)
                                } else {
                                    wx.showToast({
                                        title: res.data.message,
                                        icon: 'none',
                                        duration: 2000
                                    })
                                    reject(res.data);
                                }
                            }
                        },
                        //失败
                        fail: (err) => {
                            // console.log(err)
                            wx.showToast({
                                title: "抱歉,出现了一个错误",
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                })
            } else {
                params.token = ""
                wx.request({
                    url: http + "/xdData/xdDataManage.ashx?XAction=" + params.XAction + "&XKLX=" + params.XKLX,
                    method: params.method || 'POST',
                    data: params.data,
                    header: {
                        'Authorization': params.token
                    },
                    success: (res) => {
                        console.log(res)
                        if (res.data.success) {
                            console.log(res.data)
                            resolve(res.data)
                        } else {
                            wx.showToast({
                                    title: res.data.message,
                                    icon: 'none',
                                    duration: 2000
                                })
                                // console.log(res.data)
                                // reject(res);
                        }
                    },
                    //失败
                    fail: (err) => {
                        // console.log(err)
                        wx.showToast({
                            title: "抱歉,出现了一个错误",
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })
            }
            // console.log(params)

        }).catch((e) => {});
    }
    _deldata(del_params, pagethis) {
        let that = this
        wx.showModal({
            title: '提示',
            content: '确定要删除吗？',
            success(res) {
                if (res.confirm) {
                    that.request({
                        istoken: true,
                        method: "GET",
                        XKLX: del_params.XKLX,
                        XAction: del_params.XAction,
                        data: del_params.data
                    }).then((res) => {
                        // console.log(res)
                        wx.showToast({
                            title: "删除完成",
                            icon: 'none',
                            duration: 2000
                        })
                        pagethis.onShow()
                    })
                }
            }
        })
    }
    login_data(login_name, login_password) {
        let that = this
        wx.request({
            url: http + "/xdData/xdDataManage.ashx?XAction=GetDataInterface&XKLX=SYYHGL",
            method: "GET",
            data: {
                "XKLX_APPID": "92837277",
                "XDLMCID": "7000",
                "XDLMSID": "DYBH2019100817082905540958",
                "XDLMTID": "7001",
                "XDLMmLoginName": login_name,
                "XDLMPassword": login_password
            },
            success: (data) => {
                if (data.data.success) {
                    wx.setStorageSync('mUserName', data.data.data[0].mUserName)
                    wx.setStorageSync('mUserID', data.data.data[0].mUserID)
                    wx.setStorageSync('mUserOnlyNum', data.data.data[0].onlynum)
                    wx.setStorageSync('mDepartment', data.data.data[0].mDepart)
                    wx.setStorageSync('sytoken', data.data.sytoken)
                    wx.hideLoading()
                    wx.reLaunch({
                        url: "/pages/index/index",
                    })
                } else {
                    that.gettoken()
                }
            },
            fail: (err) => {
                wx.hideLoading()
                wx.showToast({
                    title: "抱歉,出现了一个错误",
                    icon: 'none',
                    duration: 2000,
                    complete: () => {
                        wx.reLaunch({
                            //目的页面地址
                            url: "/pages/login/login",
                        })
                    }
                })
            }
        })
    }
    gettoken() {
        wx.login({
            success(res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: http + "/xdData/xdDataManage.ashx?XAction=GetDataInterface&XKLX=SYBGGL",
                        method: "GET",
                        data: {
                            "XKLX_APPID": "92837277",
                            "XDLMCID": "9000",
                            "XDLMSID": "9203051",
                            "XDLMTID": "9203",
                            'method': "autoLogin",
                            'code': res.code
                        },
                        success: (data) => {
                            if (data.data.success) {
                                wx.setStorageSync('mUserName', data.data.data[0].mUserName)
                                wx.setStorageSync('mUserID', data.data.data[0].mUserID)
                                wx.setStorageSync('mUserOnlyNum', data.data.data[0].onlynum)
                                wx.setStorageSync('mDepartment', data.data.data[0].mDepart)
                                wx.setStorageSync('sytoken', data.data.sytoken)
                                wx.hideLoading()
                                wx.reLaunch({
                                    url: "/pages/index/index",
                                })
                            } else {
                                wx.hideLoading()
                                wx.showToast({
                                    title: "返回首页失败将返回至登录页",
                                    icon: 'none',
                                    duration: 2000,
                                    complete: () => {
                                        wx.reLaunch({
                                            //目的页面地址
                                            url: "/pages/login/login",
                                        })
                                    }
                                })
                            }
                        },
                        fail: (err) => {
                            wx.hideLoading()
                            wx.showToast({
                                title: "抱歉,出现了一个错误",
                                icon: 'none',
                                duration: 2000,
                                complete: () => {
                                    wx.reLaunch({
                                        //目的页面地址
                                        url: "/pages/login/login",
                                    })
                                }
                            })
                        }
                    })
                } else {
                    wx.hideLoading()
                    wx.showToast({
                        title: "返回首页失败将返回至登录页",
                        icon: 'none',
                        duration: 2000,
                        complete: () => {
                            wx.reLaunch({
                                //目的页面地址
                                url: "/pages/login/login",
                            })
                        }
                    })
                }
            }
        })
    }
}

const SubSystemData = new request_data()

class mToolBoxConfig {
    CurrentDate() { //年月日
        var d = new Date(),
            str = '';
        str += d.getFullYear() + '-';
        if (d.getMonth() < 9) {

            str += '0' + parseInt(d.getMonth() + 1) + '-';
        } else {
            str += d.getMonth() + 1 + '-';
        }
        if (d.getDate() < 10) {
            str += '0' + d.getDate();
        } else {
            str += d.getDate();
        }
        return str;
    }
    CurrentTime() { //时分秒
        var d = new Date(),
            str = '';
        let times = d.toLocaleDateString();
        if (d.getHours() < '10') {
            str += '0' + d.getHours() + ':';
        } else {
            str += d.getHours() + ':';
        }
        if (d.getMinutes() < '10') {
            str += '0' + d.getMinutes() + ':';
        } else {
            str += d.getMinutes() + ':';
        }
        if (d.getSeconds() < '10') {
            str += '0' + d.getSeconds() + '';
        } else {
            str += d.getSeconds() + '';
        }
        return str;
    }
    CurDateTime() { //年月日时分秒
        var d = new Date();
        var year = d.getFullYear() + "";
        var month = d.getMonth() + 1;
        var date = d.getDate();
        var day = d.getDay();
        var Hours = d.getHours(); //获取当前小时数(0-23)
        var Minutes = d.getMinutes(); //获取当前分钟数(0-59)
        var Seconds = d.getSeconds(); //获取当前秒数(0-59)
        var Milliseconds = d.getMilliseconds();
        var curDateTime = year;
        if (month > 9) {
            curDateTime = curDateTime + month;

        } else {
            curDateTime = curDateTime + "0" + month;
        }
        if (date > 9)
            curDateTime = curDateTime + date;
        else
            curDateTime = curDateTime + "0" + date;
        if (Hours > 9)
            curDateTime = curDateTime + Hours;
        else
            curDateTime = curDateTime + "0" + Hours;
        if (Minutes > 9)
            curDateTime = curDateTime + Minutes;
        else
            curDateTime = curDateTime + "0" + Minutes;
        if (Seconds > 9)
            curDateTime = curDateTime + Seconds;
        else
            curDateTime = curDateTime + "0" + Seconds;
        curDateTime = curDateTime + "0" + Milliseconds;
        //alert(curDateTime);
        //document.getElementByIdx_x("NumberNo").value=curDateTime;
        return curDateTime;
    }
    RndNum(n) { //随机数
            var rnd = "";
            for (var i = 0; i < n; i++) {
                rnd += Math.floor(Math.random() * 10);
            }
            return rnd;
        }
        // onlynum
    getTimeAndRandom() {
        return this.CurDateTime() + this.RndNum(4);
    }
    transTime(unixtime, m_or_d) { //时间戳转字符串
        var d = new Date(parseInt(unixtime)),
            str = '';
        str += d.getFullYear() + '-';
        if (d.getMonth() < 9) {
            str += '0' + parseInt(d.getMonth() + 1) + '-';
        } else {
            str += d.getMonth() + 1 + '-';
        }
        if (d.getDate() < 10) {
            str += '0' + d.getDate();
        } else {
            str += d.getDate();
        }
        if (m_or_d) {
            str += ' '
            if (d.getHours() < '10') {
                str += '0' + d.getHours() + ':';
            } else {
                str += d.getHours() + ':';
            }
            if (d.getMinutes() < '10') {
                str += '0' + d.getMinutes() + ':';
            } else {
                str += d.getMinutes() + ':';
            }
            if (d.getSeconds() < '10') {
                str += '0' + d.getSeconds() + '';
            } else {
                str += d.getSeconds() + '';
            }
        }
        return str;
    }

}
const ToolBox = new mToolBoxConfig()
class Workflow_data {
    constructor() {
        UserInfo.GetUserID().then((res) => {
            this.m_comPeopleID = res.data
        }).catch((data) => {
            // console.log(data)
        })
    }
    getXMInfo(xmdata) {
        this.m_Onlynum = xmdata.rows[0].onlynum;
        this.m_LConlynum = xmdata.rows[0].xmlcid;
        this.m_currentLCxh = xmdata.rows[0].currentLCxh;
        this.m_shr = xmdata.rows[0].shr;
        this.m_lczt = xmdata.rows[0].shzt;
        UserInfo.GetUserID().then((res) => {
            this.m_comPeopleID = res.data
        })
    }
    create(onlynum, lcname) { //流程创建

            return new Promise((resolve, reject) => {
                SubSystemData.request({
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                        "XDLMCID": "1001",
                        "XDLMSID": "DYBH20190823102030203044241",
                        "XDLMA": lcname
                    },
                    method: "GET"  
                }).then((res) => {
                    if (res.rows.length > 0) {
                        return SubSystemData.request({
                            istoken: true,
                            XKLX: "SYBGGL",
                            XAction: "ExtFC",
                            data: {
                                "XDLMCID": "AutoRunLc",
                                "wonlynum": onlynum,
                                "wLConlynum": res.rows[0].LcOnlynum,
                                "comPeopleID": this.m_comPeopleID
                            },
                            method: "GET"  
                        })
                    } else {
                        reject({ success: false, code: 999, message: "未找到审核人！" })
                    }
                }).then((res) => {
                    resolve(res)
                })
            })
        }
        //审核通过
    complete(QPYJ) {
            return new Promise((resolve, reject) => {
                SubSystemData.request({
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                        "XDLMCID": "1001",
                        "XDLMSID": "DYBH20190823102030203078271",
                        "XDLMlcbh": this.m_LConlynum,
                        "XDLMxmonlynum": this.m_Onlynum,
                        "XDLMjdbh": this.m_currentLCxh,
                        "XDLMrunCons": "等待用户反馈"
                    },
                    method: "GET"  
                }).then((returnData_GN) => {
                    SubSystemData.request({
                        istoken: true,
                        XKLX: "SYBGGL",
                        XAction: "ExtFC",
                        data: {
                            XDLMCID: 'UserReturn',
                            wonlynum: this.m_Onlynum, //【wonlynum == 项目唯一编号】
                            wLConlynum: this.m_LConlynum, //【wLCID == 流程ID】
                            comPeopleID: this.m_comPeopleID, //【comPeopleID == 完成人mUserID】
                            wJDBH: this.m_currentLCxh, //【wJDBH == 流程节点编号】
                            wGNBH: returnData_GN.rows[0].funcID, //【wGNBH == 流程功能编号】流程功能编号只能为3或4
                            wQPYJ: QPYJ ? QPYJ : "同意" //【wQPYJ == 签批意见】
                        },
                        method: "GET"  
                    }).then((data) => {
                        resolve(data)
                    })
                })
            })
        }
        //获取退回节点列表
    getRollbackNodeList() {
            return new Promise((resolve, reject) => {
                SubSystemData.request({
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                        XDLMCID: '1001',
                        XDLMSID: "DYBH201908231020302030164411",
                        XDLMA: this.m_LConlynum,
                        XDLMC: this.m_currentLCxh,
                        XDLMD: this.m_currentLCxh,
                    },
                    method: "GET"  
                }).then((res) => {
                    let arr = []
                    if (res.rows) {
                        res.rows.forEach((item, index) => {
                            if (index == 0) {
                                arr.push({
                                    "Lc_name": item['Lc_name'],
                                    "Lc_xh": item['Lc_xh'],
                                    "checkedtype": true
                                })
                            } else {
                                arr.push({
                                    "Lc_name": item['Lc_name'],
                                    "Lc_xh": item['Lc_xh'],
                                    "checkedtype": false
                                })
                            }
                        })
                        resolve(arr)
                    }
                })
            })
        }
        //审核不通过，执行返回到流程到指定节点


    gotoNode(QPYJ, CHJDBH) {
        return new Promise((resolve, reject) => {
            SubSystemData.request({
                istoken: true,
                XKLX: "SYBGGL",
                XAction: "ExtFC",
                data: {
                    XDLMCID: 'JumpToJD',
                    wonlynum: this.m_Onlynum, //【wonlynum == 项目唯一编号】
                    wLConlynum: this.m_LConlynum, //【wLCID == 流程ID】

                    comPeopleID: this.m_comPeopleID, //【comPeopleID == 提交人mUserID】
                    wQPYJ: QPYJ ? QPYJ : "不同意", //【wQPYJ == 签批意见】
                    wJDBH: this.m_currentLCxh, //【wJDBH == 当前流程节点编号】
                    wCHJDBH: CHJDBH //【wCHJDBH == 目标流程节点编号】
                },
                method: "GET"  
            }).then((res) => {
                resolve(res)
            })
        })
    }

    //流程撤回 
    reback(onlynum, lc_onlynum, pagethis) {
            return new Promise((resolve, reject) => {
                SubSystemData.request({
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "ExtFC",
                    data: {
                        XDLMCID: "BackDel",
                        wonlynum: onlynum,
                        wLConlynum: lc_onlynum
                    },
                    method: "GET"  
                }).then((data) => {
                    if (data.msg) {
                        pagethis.onShow()
                            // resolve(data)
                        wx.showToast({
                            title: "撤回成功！",
                            icon: 'success',
                            duration: 2000
                        })
                    } else {
                        wx.showToast({
                            title: "退回失败！",
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })
            })
        }
        //获取签批列表(流转意见)
    getWorkflowInfoAndList() {
            return new Promise((resolve, reject) => {
                SubSystemData.request({
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                        XDLMCID: '1001',
                        XDLMSID: 'DYBH2020021415275906564857',
                        XDLMA: this.m_Onlynum, //主表唯一编号
                        XDLMB: this.m_LConlynum
                    },
                    method: "GET"  
                }).then((res) => {
                    let arr = []
                    if (res.rows) {
                        res.rows.forEach((item, index) => {
                            console.log(item.流程节点编号)
                            if (item.流程节点编号 > 1) {
                                arr.push({
                                    "biaoti": item['流程名称'],
                                    "name": "审核人:" + item['签批人'],
                                    "dep": "部门:" + item['签批人部门'],
                                    "time": "签批时间:" + item['签批时间'],
                                    "yijian": "签批意见:" + item['签批意见'],
                                    "tixing_time": "提醒时间" + res.rows[index - 1]['签批时间']
                                })
                            } else {
                                arr.push({
                                    "biaoti": item['流程名称'],
                                    "name": "申请人:" + item['签批人'],
                                    "time": "申请时间:" + item['签批时间']
                                })
                            }
                        })
                        resolve(arr)
                    }
                })
            })
        }
        //获取流程节点进度（流程说明）
    getWorkflowNodesState() {
            return new Promise((resolve, reject) => {
                SubSystemData.request({
                    istoken: true,
                    XKLX: "SYBGGL",
                    XAction: "GetDataInterface",
                    data: {
                        XDLMCID: '1001',
                        XDLMSID: 'DYBH201908231020302030164411',
                        XDLMA: this.m_LConlynum
                    },
                    method: "GET"
                }).then((res) => {
                    let arr = []
                    if (res.rows && res.rows.length > 0) {
                        for (let i in res.rows) {
                            arr.push({
                                text: res.rows[i].Lc_name
                            })
                        }
                        resolve(arr)
                    }
                })
            })
        }
        // 判断是否显示撤回按钮
    isCheHui(onlynum, lc_onlynum, pagethis) {
        let that = this
        wx.showModal({
            title: '提示',
            content: '确定要撤回吗？',
            success(res) {
                if (res.confirm) {
                    //获取节点完成表，如果节点完成表只有一条数据那么可以撤
                    return new Promise((resolve, reject) => {
                        SubSystemData.request({
                            istoken: true,
                            XKLX: "SYBGGL",
                            XAction: "GetDataInterface",
                            data: {
                                XDLMCID: '1001',
                                XDLMSID: 'DYBH201908231020302030151421',
                                XDLMjdxh: 2,
                                XDLMonlynum: onlynum,
                                XDLMxmlclx: lc_onlynum
                            },
                            method: "GET"
                        }).then((res) => {
                            if (res.success) {
                                if (res.rows.length > 0) {
                                    wx.showToast({
                                        title: "此申请已审核，不可撤回",
                                        icon: 'none',
                                        duration: 2000
                                    })
                                } else {
                                    that.reback(onlynum, lc_onlynum, pagethis)

                                }
                            } else {
                                wx.showToast({
                                    title: "获取信息失败，不可撤回",
                                    icon: 'none',
                                    duration: 2000
                                })
                            }
                        })
                    })
                }
            }
        })
    }
    createXMBH(rowid) {
            // 1、获取项目编号
            return new Promise((resolve, reject) => {
                SubSystemData.request({
                    istoken: true,
                    XKLX: "SYXMGL",
                    XAction: "GetDataInterface",
                    data: {
                        XDLMCID: '9000',
                        XDLMTID: '9209',
                        XDLMSID: '9209002'
                    },
                    method: "GET"
                }).then((getxmbh) => {
                    if (getxmbh.msg) { // 2、给主表分配项目编号（修改方法）
                        SubSystemData.request({
                            istoken: true,
                            XKLX: "SYXMGL",
                            XAction: "GetDataInterface",
                            data: {
                                XDLMCID: "6000",
                                XDLMSID: "DYBH201908231026422642211215",
                                XDLMID: rowid,
                                XDLMxmbh: getxmbh.data
                            },
                            method: "GET"
                        }).then((setxmbh) => {
                            if (setxmbh.success) {
                                console.log(setxmbh)
                                resolve({ success: true, code: 0, message: "创建项目编号完成！" });
                            } else {
                                resolve({ success: false, code: 999, message: "未能更新项目编号！" });
                            }
                        })

                    } else {
                        resolve({ success: false, code: 999, message: "创建项目编号失败,没有获取到项目信息！" });
                    }

                })
            })
        }
        // 判断是否启用财务项目
    usingCWXM() {
        // 1、首先判断当前用户是否启用财务项目

        return new Promise((resolve, reject) => {
            SubSystemData.request({
                istoken: true,
                XKLX: "SYYHGL",
                XAction: "GetDataInterface",
                data: {
                    XDLMCID: "1001",
                    XDLMSID: "DYBH2019082310260126113621",
                    XDLMA: '财务系统',
                    QueryType: 'enabled',
                    QueryKey: '是'
                },
                method: "GET"
            }).then((hascw) => {
                if (hascw.success) {
                    if (hascw.rows.length > 0) { //启用
                        return resolve(true);
                    } else {
                        return resolve(false);
                    }
                } else {
                    return resolve("查询财务项目启用状态失败！");
                }
            })
        })
    }

    // 添加财务项目
    setCWXM(xm_rowid) {
        return new Promise((resolve, reject) => {
            SubSystemData.request({
                istoken: true,
                XKLX: "SYXMGL",
                XAction: "GetDataInterface",
                data: {
                    XDLMCID: "1001",
                    XDLMSID: "DYBH201908231026422642114212",
                    XDLMA: xm_rowid
                },
                method: "GET"
            }).then((getxmdata) => {
                if (getxmdata.success) {
                    // 1）.finance_id不为空说明已有财务项目，无需再添加财务项目    
                    // 2）.finance_id为空就添加新的财务项目
                    if (getxmdata.rows[0].finance_id == null || getxmdata.rows[0].finance_id == undefined || getxmdata.rows[0].finance_id == "") {
                        SubSystemData.request({
                            istoken: true,
                            XKLX: "SYCWGL",
                            XAction: "GetDataInterface",
                            data: {
                                XDLMCID: "9000",
                                XDLMTID: "9207",
                                XDLMSID: "9207002",
                                type: getxmdata.rows[0].xmlx,
                                year: getxmdata.rows[0].year
                            },
                            method: "GET"
                        }).then((getcwid) => {
                            if (getcwid.msg) {
                                let cw_onlynum = ToolBox.getTimeAndRandom();
                                SubSystemData.request({
                                    istoken: true,
                                    XKLX: "SYCWGL",
                                    XAction: "GetDataInterface",
                                    data: {
                                        XDLMCID: "5000",
                                        XDLMSID: "DYBH20190823103404344204113",
                                        XDLMonlynum: cw_onlynum,
                                        XDLMfinance_code: getcwid.data,
                                        XDLMfinance_name: getxmdata.rows[0].xmmc,
                                        XDLMcreated_at: ToolBox.CurrentDate() + " " + ToolBox.CurrentTime(),
                                        XDLMyear: getxmdata.rows[0].year,
                                        XDLMclass: getxmdata.rows[0].module,
                                        XDLMdirector: getxmdata.rows[0].负责人,
                                        XDLMprotocol_type: getxmdata.rows[0].xmlx
                                    },
                                    method: "GET"
                                }).then((addcwxm) => {
                                    if (addcwxm.success) {
                                        // 财务表单添加成功之后与当前项目进行绑定（即把当前新增财务项目的onlynum修改进项目的finance_id字段）
                                        SubSystemData.request({
                                            istoken: true,
                                            XKLX: "SYXMGL",
                                            XAction: "GetDataInterface",
                                            data: {
                                                XDLMCID: "6000",
                                                XDLMSID: "DYBH201908231026422642211215",
                                                XDLMID: xm_rowid,
                                                XDLMfinance_id: cw_onlynum
                                            },
                                            method: "GET"
                                        }).then((bandcwxm) => {
                                            if (bandcwxm.success) {
                                                resolve({ success: true, code: 0, message: "财务项目添加成功！" });
                                            } else {
                                                resolve({ success: false, code: 999, message: "财务项目添加成功,但未能与现有项目绑定" });
                                            }
                                        })

                                    } else {
                                        resolve({ success: false, code: 999, message: "财务项目添加失败！" });
                                    }
                                })
                            } else {
                                resolve({ success: false, code: 999, message: "生成财务编号失败！" });
                            }
                        })
                    } else {
                        resolve({ success: false, code: 999, message: "存在现有财务项目，未能新建！" });
                    }
                } else {
                    resolve({ success: false, code: 999, message: "获取项目信息失败，未能创建财务项目！" });
                }

            })
        })

    }

}

// 下载封装方法：
class downloads {
    requirefile(src) {
        var extension = src.substring(src.lastIndexOf('.') + 1);
        if (extension != 'img' && extension != 'png' && extension != 'jpg') {
            //图片预览
            wx.previewImage({
                current: src, // 当前显示图片的http链接
                urls: [src] // 需要预览的图片http链接列表
            })
        } else {
            // console.log(typeof (src))
            // 下载
            wx.downloadFile({
                url: src,
                success(res) {
                    // console.log(res)
                    // console.log(1)
                    // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
                    if (res.statusCode === 200) {
                        const filePath = res.tempFilePath
                            // console.log(typeof (filePath))
                        wx.openDocument({
                            filePath: filePath,
                            success: function(res) {
                                // console.log('打开文档成功')
                            }
                        })
                    }
                }
            })
        }
    }

}
// 附件封装方法
class upload {
    upLoadFile(filePath, name) {
        return new Promise((resolve, reject) => {
            UserInfo.GetSysToken().then((res) => {
                wx.uploadFile({
                    url: http + "/xdData/xdFileAllSysUpload.ashx?XKLX=SYBGGL",
                    filePath: filePath,
                    name: "file",
                    formData: {
                        fileName: name
                    },
                    success: function(res) {
                        // console.log(res);
                        resolve(res)
                    },
                    fail: function(res) {
                        wx.showToast({
                            title: "上传失败",
                            icon: 'none',
                            duration: 2000
                        })
                    }
                })
            })
        })
    }
    downloadFile(url) {
        let h = url.substring(url.lastIndexOf('.') + 1)
        if (h != 'img' && h != 'png' && h != 'jpg') {
            wx.downloadFile({
                url: http + url,
                success: function(res) {
                    wx.openDocument({
                        filePath: res.tempFilePath,
                        showMenu: true,
                        success: function(res) {

                        },
                        fail: function(res) {
                            wx.showToast({
                                title: "文件打开失败",
                                icon: 'none',
                                duration: 2000
                            })
                        }
                    })
                },
                fail: function(res) {
                    wx.showToast({
                        title: "文件下载失败",
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        } else {
            console.log(url)
            let img_path = http + url
            wx.previewImage({
                current: img_path,
                urls: [img_path],
                fail: function(res) {
                    wx.showToast({
                        title: "文件打开失败",
                        icon: 'none',
                        duration: 2000
                    })
                }
            })
        }
    }
}

module.exports = {
    UserInfo: UserInfo,
    ToolBox: ToolBox,
    SubSystemData: SubSystemData,
    WorkflowManage: new Workflow_data(),
    Download: new downloads(),
    Upload: new upload(),
    http
}