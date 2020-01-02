/**
 *格式化时间
 * */


module.exports = function localDate() {

    const dt = new Date();
    //获取年
    let year = dt.getFullYear();
    //获取月
    let month = dt.getMonth() + 1;
    //获取日
    let day = dt.getDate();
    //获取小时
    let hour = dt.getHours();
    //获取分钟
    let minute = dt.getMinutes();
    //获取秒
    let second = dt.getSeconds();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    second = second < 10 ? "0" + second : second;
    return year + "-" + month + "-" + day + "  " + hour + ":" + minute + ":" + second;
}

