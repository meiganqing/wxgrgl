var mWorkflowManage = {
  m_Onlynum: "",
  m_LConlynum: "",

  m_currentLCxh: "",
  m_shr: "",
  m_lczt: "",

  //获取项目列表信息，初始化流程信息，项目初始信息，第一步必须设置
  //非项目表不适用，可重新建立此类 绑定其他表的更新操作
  //不同的审核页面只需引用此类
  getXMInfo: function (xmdata) {
    this.m_Onlynum = xmdata.rows[0].onlynum;
    this.m_LConlynum = xmdata.rows[0].xmlcid;
    this.m_currentLCxh = xmdata.rows[0].currentLCxh;
    this.m_shr = xmdata.rows[0].shr;
    this.m_lczt = xmdata.rows[0].shzt;

    return xmdata;
  },
  //流程创建
  create: function (onlynum, lcname) {
    //onlynum 主业务唯一编码
    //按类型获取流程属性
    let info = {};
    let getLCXX = SysConfig.SubSystemData.SYBGGL.PostData("GetDataInterface", {
      XDLMCID: '1001',
      XDLMSID: "DYBH20190823102030203044241",
      XDLMA: lcname,  //流程名
    });
    if (getLCXX.success) {
      if (getLCXX.rows.length > 0) {

        let returndata = SysConfig.SubSystemData.SYBGGL.PostData("ExtFC", {
          XDLMCID: "AutoRunLc",
          wonlynum: onlynum,//【wonlynum == 项目唯一编号】
          wLConlynum: getLCXX.rows[0].LcOnlynum,//【LcOnlynum】
          comPeopleID: SysConfig.UserInfo.GetCookieName("mUserID")//【comPeopleID == 提交人mUserID】
        });
        if (returndata.msg) {

          info = { success: true, code: 0, message: returndata.message };

        }
        else {
          info = { success: false, code: 999, message: "未找到审核人！" };
        }
      }
      else {

        info = { success: false, code: 999, message: "未找到可执行的流程！" };
      }
    }
    else {
      info = { success: false, code: 999, message: "创建流程失败！" };
    }

    return info;
  },

  //审核通过
  complete: function (QPYJ) {
    //获取流程功能编号
    //xdData/xdDataManage.ashx ? XAction = GetDataInterface & XKLX=SYBGGL & XDLMCID=1001 & XDLMSID=DYBH20190823102030203078271
    //结果中的funcID 即为审核通过时需要的 流程功能编号
    var returnData_GN = SysConfig.SubSystemData.SYBGGL.PostData("GetDataInterface", {
      XDLMCID: '1001',
      XDLMSID: 'DYBH20190823102030203078271', //【wonlynum == 项目唯一编号】
      XDLMlcbh: this.m_LConlynum, //【XDLMjdbh == jdbh】当前节点编号 当前currentLCxh值  
      XDLMxmonlynum: this.m_Onlynum, //【XDLMxmonlynum == xmonlynum】项目唯一编号
      XDLMjdbh: this.m_currentLCxh, //【XDLMjdbh==jdbh】当前节点编号 当前currentLCxh值
      XDLMrunCons: "等待用户反馈", //【XDLMrunCons == runCons】固定值 即 XDLMrunCons = 等待用户反馈
    });
    return SysConfig.SubSystemData.SYBGGL.PostData("ExtFC", {
      XDLMCID: 'UserReturn',
      wonlynum: this.m_Onlynum, //【wonlynum == 项目唯一编号】
      wLConlynum: this.m_LConlynum, //【wLCID == 流程ID】
      comPeopleID: SysConfig.UserInfo.GetCookieName('mUserID'),//【comPeopleID == 完成人mUserID】
      wJDBH: this.m_currentLCxh, //【wJDBH == 流程节点编号】
      wGNBH: returnData_GN.rows[0].funcID, //【wGNBH == 流程功能编号】流程功能编号只能为3或4
      wQPYJ: QPYJ //【wQPYJ == 签批意见】
    });
  },


  //获取退回节点列表
  getRollbackNodeList: function () {
    let rvcompleted = SysConfig.SubSystemData.SYBGGL.PostData("GetDataInterface", {
      XDLMCID: '1001',
      XDLMSID: "DYBH201908231020302030164411",
      XDLMA: this.m_LConlynum,
      XDLMC: this.m_currentLCxh,
      XDLMD: this.m_currentLCxh,
    });

    if (rvcompleted.success) {
      $('.returnRadios').empty();
      $('#returnBackJD').addClass('layui-show').removeClass('layui-hide');
      var html = '';
      for (var i in rvcompleted.rows) {
        html += '<input type="radio" name="returnBackJD" value="' + rvcompleted.rows[i].Lc_name + '" title="' + rvcompleted.rows[i].Lc_name + '"  data_targetJD="' + rvcompleted.rows[i].Lc_xh + '" lay-filter="returnBackJD">';
      }
      $('.returnRadios').append(html);
      if (rvcompleted.rows.length > 1) {
        $('[name="returnBackJD"]:last-child').attr('checked', 'checked');
      } else {
        $('[name="returnBackJD"]:first-child').attr('checked', 'checked');
      }

    }
  },

  //审核不通过，执行返回到流程到指定节点
  gotoNode: function (QPYJ, CHJDBH) {
    return SysConfig.SubSystemData.SYBGGL.PostData("ExtFC", {
      XDLMCID: 'JumpToJD',
      wonlynum: this.m_Onlynum,//【wonlynum == 项目唯一编号】
      wLConlynum: this.m_LConlynum, //【wLCID == 流程ID】
      comPeopleID: SysConfig.UserInfo.GetCookieName('mUserID'),  //【comPeopleID == 提交人mUserID】
      wQPYJ: QPYJ, //【wQPYJ == 签批意见】
      wJDBH: this.m_currentLCxh, //【wJDBH == 当前流程节点编号】
      wCHJDBH: CHJDBH //【wCHJDBH == 目标流程节点编号】
    });
  },


  // 判断是否显示撤回按钮
  isCheHui: function (onlynum, lc_onlynum) {
    //获取节点完成表，如果节点完成表只有一条数据那么可以撤回
    var data = SysConfig.SubSystemData.SYBGGL.PostData("GetDataInterface", {
      XDLMCID: "1001",
      XDLMSID: "DYBH201908231020302030151421",
      XDLMjdxh: 2,
      XDLMonlynum: onlynum,
      XDLMxmlclx: lc_onlynum
    });
    if (data.success) {
      if (data.rows.length > 0) {
        return false;
      } else {
        return true;
      }
    } else {
      return { code: "999", message: "获取信息失败，无法判断是否可撤回！" };
    }

  },

  //流程撤回
  reback: function (onlynum, lc_onlynum) {
    var back_node = SysConfig.SubSystemData.SYBGGL.PostData("ExtFC", {
      XDLMCID: "BackDel",
      wonlynum: onlynum,
      wLConlynum: lc_onlynum
    });
    if (back_node.msg) {
      return { code: 0, success: true, message: "撤回成功！" };
    } else {
      return { code: 9999, success: false, message: "退回失败！" };
    }

  },


  //流程撤回
  // reback: function (onlynum, lc_onlynum) {
  //     var returnData = SysConfig.Data.PostData("GetDataInterface", {
  //         XDLMCID: '1001',
  //         XDLMSID: 'DYBH201908231020302030151421',
  //         XDLMjdxh: 2, //【XDLMjdxh == jdxh】节点序号  主单currentLCxh值 只能是2 且shzt = 待完成
  //         XDLMonlynum: onlynum,//【XDLMonlynum == onlynum】主表onlynum
  //         XDLMxmlclx: lc_onlynum //【XDLMxmlclx == xmlclx】流程onlynum
  //     });
  //     if (returnData.rows[0].shzt == "待完成") {
  //         //【wonlynum == 项目唯一编号】
  //         //【wLConlynum == 流程唯一编码】
  //         return SysConfig.Data.PostData("ExtFC", { XDLMCID: 'BackDel', wonlynum: onlynum, wLConlynum: lc_onlynum });
  //     }
  //     else {
  //         return { code: "999", message: "已有审核人审批，不可撤回！" };
  //     }
  // },

  getProgressInfo: function (lc_onlynum) {
    //【XDLMA == 项目唯一编码】
    return SysConfig.SubSystemData.SYBGGL.SYBGGL.PostData("GetDataInterface", { XDLMCID: '1001', XDLMSID: 'DYBH201908231020302030164411', XDLMA: lc_onlynum });

  },
  getWorkflowInfo: function (xm_onlynum, lc_onlynum) {
    //【XDLMA == 项目唯一编码】
    //【XDLMB == 流程唯一编码】
    return SysConfig.SubSystemData.SYBGGL.PostData("GetDataInterface", { XDLMCID: '1001', XDLMSID: 'DYBH2020021415275906564857', XDLMA: xm_onlynum, XDLMB: lc_onlynum });
  },

  //获取流程节点进度（流程说明）
  getWorkflowNodesState: function (nodes_dom_id) {
    var html = '';
    var json = [];
    var data = SysConfig.SubSystemData.SYBGGL.PostData("GetDataInterface", {
      XDLMCID: '1001',
      XDLMSID: 'DYBH201908231020302030164411',
      XDLMA: this.m_LConlynum
    });
    if (data.success) {
      if (data.rows.length > 0) {
        for (let i = 0; i < data.rows.length; i++) {
          json.push({
            "step": data.rows[i].Lc_xh,
            "stepName": "" + data.rows[i].Lc_name + ""
          });
        }
        //初始化流程，加载每个节点和节点名称
        html += '<div class="site-block" style="margin:10px;"><div id="fuelux-wizard-container" class="wizard wizard-wired" ><div>' +
          '<ul class="steps">';
        for (let i = 0; i < json.length; i++) {
          html += '<li data-step="' + json[i].step + '" class="complete"><span class="step">' + json[i].step + '</span><span class="title">' + json[i].stepName + '</span><span class="chevron"></span></li>';
        } +
          '</ul>' +
          '</div></div>';
        //确定当前项目处于哪步流程，并且将div传递过去,
      }
    }

    $(nodes_dom_id).append(html);  //此节点控件必须先push节点，再分别判断节点状态

    if (data.rows[0].shzt == '已完成') {
      $('#fuelux-wizard-container').wizard({
        selectedItem: {}
      });
    } else {
      $('#fuelux-wizard-container').wizard({
        selectedItem: {
          step: this.m_currentLCxh
        }
      });
    }

    // return html; 
  },

  //获取签批列表(流转意见)
  getWorkflowInfoAndList: function () {
    var shjlData = SysConfig.SubSystemData.SYBGGL.PostData("GetDataInterface", {
      XDLMCID: '1001',
      XDLMSID: 'DYBH2020021415275906564857',
      XDLMA: this.m_Onlynum, //主表唯一编号
      XDLMB: this.m_LConlynum
    });
    var shHml = '';
    if (shjlData.success) {
      if (shjlData.rows.length > 0) {
        for (let i = 0; i < shjlData.total; i++) {
          shHml += '<li class="layui-timeline-item"> <i class="layui-icon layui-timeline-axis"></i>';
          shHml += '  <div class="layui-timeline-content layui-text">';
          if (shjlData.rows[i].流程节点编号 > 1) {
            shHml += ' <h3 class="layui-timeline-title">' + shjlData.rows[i].流程名称 + '</h3>';
            shHml += '  <ul>';
            shHml += '   <li>审核人【' + shjlData.rows[i].签批人 + '】</li>';
            shHml += '   <li>部门【' + shjlData.rows[i].签批人部门 + '】</li>';
            shHml += ' <li>提醒时间【' + shjlData.rows[i - 1].签批时间 + '】</li>';
            shHml += ' <li>签批意见【' + shjlData.rows[i].签批意见 + '】</li>';
            shHml += ' <li>签批时间【' + shjlData.rows[i].签批时间 + '】</li>';
          } else {
            shHml += ' <h3 class="layui-timeline-title">' + shjlData.rows[i].流程名称 + '</h3>';
            shHml += '  <ul>';
            shHml += '   <li>申请人【' + shjlData.rows[i].签批人 + '】</li>';
            shHml += ' <li>申请时间【' + shjlData.rows[i].签批时间 + '】</li>';
          }
          shHml += '  </ul>';
          shHml += ' </div>';
          shHml += ' </li>';
        }
      }
    }
    return shHml;
  },


  //获取项目列表信息，初始化流程信息
  getSHZT: function () {
    if (this.m_lczt == "待完成" && this.m_shr.indexOf(SysConfig.UserInfo.GetCookieName('mUserName')) != -1) {
      return true;
    }
    else {
      return false;
    }

  },

  createXMBH: function (rowid) {
    let info;
    // 1、获取项目编号
    var getxmbh = SysConfig.SubSystemData.SYXMGL.PostData("GetDataInterface", {
      XDLMCID: "9000",
      XDLMTID: "9209",
      XDLMSID: "9209002"
    });
    if (getxmbh.msg) {
      // 2、给主表分配项目编号（修改方法）
      var setxmbh = SysConfig.SubSystemData.SYXMGL.PostData("GetDataInterface", {
        XDLMCID: "6000",
        XDLMSID: "DYBH201908231026422642211215",
        XDLMID: rowid,
        XDLMxmbh: getxmbh.data
      });
      if (setxmbh.success) {
        info = { success: true, code: 0, message: "创建项目编号完成！" };
      }
      else {
        info = { success: false, code: 999, message: "未能更新项目编号！" };
      }
    }
    else {
      info = { success: false, code: 999, message: "创建项目编号失败,没有获取到项目信息！" };
    }
    return info;
  },


  // 判断是否启用财务项目
  usingCWXM: function () {
    // 1、首先判断当前用户是否启用财务项目
    var hascw = SysConfig.SubSystemData.SYYHGL.PostData("GetDataInterface", {
      XDLMCID: "1001",
      XDLMSID: "DYBH2019082310260126113621",
      XDLMA: '财务系统',
      QueryType: 'enabled',
      QueryKey: '是'
    })
    if (hascw.success) {
      if (hascw.rows.length > 0) {  //启用
        return true;
      } else {
        return false;
      }
    } else {
      return "查询财务项目启用状态失败！";
    }
  },


  // 创建财务项目前询问
  createCWXM: function (rowid) {
    var index_create = layer.confirm('是否现在添加财务项目？', {
      btn: ['是', '再想想'] //按钮
    }, function () {
      // 添加财务项目流程
      setCWXM(rowid);
    }, function () {
      layer.close(index_create);
    });
  },


  // 添加财务项目
  setCWXM: function (xm_rowid) {
    // 2、判断是否已存在财务项目（finance_id是否为空）
    var getxmdata = SysConfig.SubSystemData.SYXMGL.PostData("GetDataInterface", {
      XDLMCID: "1001",
      XDLMSID: "DYBH201908231026422642114212",
      XDLMA: xm_rowid,
    })
    if (getxmdata.success) {
      // 1）.finance_id不为空说明已有财务项目，无需再添加财务项目    
      // 2）.finance_id为空就添加新的财务项目
      if (getxmdata.rows[0].finance_id == null || getxmdata.rows[0].finance_id == undefined || getxmdata.rows[0].finance_id == "") {
        // 3、添加新的财务项目之前先分配好财务项目编号（后台生成，编号格式：协议/专项-年度-顺序号）
        var getcwid = SysConfig.SubSystemData.SYCWGL.PostData("GetDataInterface", {
          XDLMCID: "9000",
          XDLMTID: "9207",
          XDLMSID: "9207002",
          type: getxmdata.rows[0].xmlx,
          year: getxmdata.rows[0].year
        })
        if (getcwid.msg) {
          // 财务项目表单提交
          var cw_onlynum = SysConfig.ToolBox.getTimeAndRandom();
          var addcwxm = SysConfig.SubSystemData.SYCWGL.PostData("GetDataInterface", {
            XDLMCID: "5000",
            XDLMSID: "DYBH20190823103404344204113",
            XDLMonlynum: cw_onlynum,
            XDLMfinance_code: getcwid.data,
            XDLMfinance_name: getxmdata.rows[0].xmmc,
            XDLMcreated_at: SysConfig.ToolBox.CurrentDate() + " " + SysConfig.ToolBox.CurrentTime(),
            XDLMyear: getxmdata.rows[0].year,
            XDLMclass: getxmdata.rows[0].module,
            XDLMdirector: getxmdata.rows[0].负责人,
            XDLMprotocol_type: getxmdata.rows[0].xmlx
          })
          if (addcwxm.success) {
            // 财务表单添加成功之后与当前项目进行绑定（即把当前新增财务项目的onlynum修改进项目的finance_id字段）
            var bandcwxm = SysConfig.SubSystemData.SYXMGL.PostData("GetDataInterface", {
              XDLMCID: "6000",
              XDLMSID: "DYBH201908231026422642211215",
              XDLMID: xm_rowid,
              XDLMfinance_id: cw_onlynum
            })
            if (bandcwxm.success) {
              info = { success: true, code: 0, message: "财务项目添加成功！" };
            } else {
              info = { success: false, code: 999, message: "财务项目添加成功,但未能与现有项目绑定" };
            }
          } else {
            info = { success: false, code: 999, message: "财务项目添加失败！" };
          }
        } else {
          info = { success: false, code: 999, message: "生成财务编号失败！" };
        }
      } else {
        info = { success: false, code: 999, message: "存在现有财务项目，未能新建！" };
      }
    } else {
      info = { success: false, code: 999, message: "获取项目信息失败，未能创建财务项目！" };
    }


    return info;


    // 1、首先判断当前用户是否启用财务项目
    // let info = {};
    // var hascw = SysConfig.Data.PostDatasyyh("GetDataInterface", {
    //     XDLMCID: "1001",
    //     XDLMSID: "DYBH2019082310260126113621",
    //     XDLMA: '财务系统',
    //     QueryType: 'enabled',
    //     QueryKey: '是'
    // })
    // if (hascw.success) {
    //     if (hascw.rows.length > 0) {  //启用




    //     } else { //未启用，无需添加财务项目
    //         info = { success: true, code: 0, message: "建立完成！" };
    //     }
    // } else {
    //     info = { success: false, code: 999, message: "查询财务项目启用状态失败！" };
    // }

  }

};