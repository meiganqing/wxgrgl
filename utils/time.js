//获取请假时间
function getVacationTimes(start, end) {
  var workon, workoff, vacateEnd_workonm, vacateStart_workoff, vacateEnd_workon, hours1, hours2, days3, hours3

  //开始请假的时间和结束时间
  var d1 = new Date(start);
  var d2 = new Date(end);

  // 存储请假的小时数、天数
  var days = 0;
  var hours = 0;
  var timeobj = {};  //返回值存放

  var vacateDate_start = start.split(' ')[0];    //开始请假的日期 年月日字符串
  var vacateDate_end = end.split(' ')[0];        //结束请假的日期 年月日字符串

  //开始请假和结束请假的小时
  var vacateHour_start = start.split(' ')[1].split(":")[0];
  var vacateHour_end = end.split(' ')[1].split(":")[0];

  //上下班的时间戳
  workon = " 09:00:00" //默认9点为上班时间
  workoff = " 17:00:00"  //默认为17点下班时间
  var vacateStart_workon = new Date(vacateDate_start + workon).getTime(); //开始请假的日期和规定的上班时间
  var vacateEnd_workoff = new Date(vacateDate_end + workoff).getTime(); //结束请假的日期和规定的下班时间



  //上班时间为 09点，下班时间为18点。
  //请假时间早于上班时间9点则设置请假时间为09:00:00
  if (d1.getTime() < vacateStart_workon) {
    d1.setHours(9, 0, 0, 0);
  }


  //结束请假时间晚于下班时间17点则设置请假时间为17:00:00
  if (d2.getTime() > vacateEnd_workoff) {
    d2.setHours(17, 0, 0, 0);
  }



  //开始请假的日期和结束请假的日期相同，说明是当天请假，则只需要判断小时
  if (new Date(vacateDate_start).getTime() == new Date(vacateDate_end).getTime()) {


    //请假时间晚于下班时间，或者结束时间早于上班时间直接返回请假0小时
    if (d1.getTime() >= vacateEnd_workoff || d2.getTime() <= vacateStart_workon) {
      hours = 0;
      days = 0;
      timeobj = { success: true, "hours": hours, "days": days };
    }

    else if (d1.getTime() > d2.getTime()) {
      hours = 0;
      days = 0;
      timeobj = { success: false, "hours": hours, "days": days };

    }

    else {

      //时间戳相减得到小时
      hours = (d2.getTime() - d1.getTime()) / 1000 / 60 / 60;
      days = getDays(hours);
      hours = Math.floor(hours);
      timeobj = { success: true, "hours": hours, "days": days };
    }



  } else if (new Date(vacateDate_start).getTime() > new Date(vacateDate_end).getTime()) {
    //开始时间大于结束时间，请假时间为0
    hours = 0;
    days = 0;
    timeobj = { success: false, "hours": hours, "days": days };

  } else {    // 开始请假和结束请假不是同一天

    //计算请假开始当天的小时
    vacateEnd_workon = new Date(vacateDate_end + workon);     //结束请假的年月日和规定的上班时间
    vacateStart_workoff = new Date(vacateDate_start + workoff);  //开始请假的年月日和规定的下班时间
    hours1 = (vacateStart_workoff.getTime() - d1.getTime()) / 1000 / 60 / 60;

    //开始请假的时间晚于下班时间
    if (d1.getTime() >= vacateStart_workoff.getTime()) {
      hours1 = 0;
    }
    hours += hours1;

    //计算请假结束当天的小时
    hours2 = (d2.getTime() - vacateEnd_workon.getTime()) / 1000 / 60 / 60;
    //开始请假的时间晚于下班时间
    if (d2.getTime() <= vacateEnd_workon.getTime()) {
      hours2 = 0;
    }
    hours += hours2;

    // 请假中间的天数*8小时
    //请假天数的差 
    days3 = parseInt((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24)); //工作天数
    // days3 = d2.getDate() - d1.getDate();


    if (days3 >= 2) {
      //跨2天以上会多算1天，所以要减去1
      days3 -= 1;
      hours3 = days3 * 8;
      hours += hours3;

    } else {
      hours += 0;
    }

    days = getDays(hours);
    hours = Math.floor(hours);

    timeobj = { success: true, "hours": hours, "days": days };

  }

  return timeobj;
}

//一天内的请假, 4小时以内算0.5天，8小时以内算1.0天
function getDays(hours) {   // hours 请假总小时数
  var days = 0;
  if (hours < 4 && hours > 0) {
    days += 0.5;
  }
  else if (hours >= 4) {
    days += Math.floor(hours / 8);          //整天的数
    days += Math.ceil(hours % 8 / 4) * 0.5;  //比一天还多的，算半天
  }
  return days;  //请假天数
}



// 加班时间
function getWorkOverTimes(start, end) {

  //开始加班的时间和结束时间
  var d1 = new Date(start);
  var d2 = new Date(end);

  let timeObj = {};
  if (d1.getTime() > d2.getTime()) {
    timeObj = { success: false, "hours": 0 };
  } else {
    var hours = Math.floor((d2.getTime() - d1.getTime()) / 1000 / 60 / 60);
    timeObj = { success: true, "hours": hours };
  }

  return timeObj;

}
module.exports={
  gettime:getVacationTimes,
  getdays:getDays,
  getWorkOverTimes:getWorkOverTimes
}