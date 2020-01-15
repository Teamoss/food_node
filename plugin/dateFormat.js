/**
 *格式化时间
 * */
const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

module.exports = {
    formatTime
}


// module.exports = function localDate() {
//
//     const dt = new Date();
//     //获取年
//     let year = dt.getFullYear();
//     //获取月
//     let month = dt.getMonth() + 1;
//     //获取日
//     let day = dt.getDate();
//     //获取小时
//     let hour = dt.getHours();
//     //获取分钟
//     let minute = dt.getMinutes();
//     //获取秒
//     let second = dt.getSeconds();
//     month = month < 10 ? "0" + month : month;
//     day = day < 10 ? "0" + day : day;
//     hour = hour < 10 ? "0" + hour : hour;
//     minute = minute < 10 ? "0" + minute : minute;
//     second = second < 10 ? "0" + second : second;
//     return year + "-" + month + "-" + day + "  " + hour + ":" + minute + ":" + second;
// }

