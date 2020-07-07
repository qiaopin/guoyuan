layui.define(function (exports) {
    var getDate = function () {
        var that = this;
        var dateFormatConversion = function (inputTime) {
            var date = new Date(inputTime);
            var y = date.getFullYear();
            var m = date.getMonth() + 1;
            m = m < 10 ? ('0' + m) : m;
            var d = date.getDate();
            d = d < 10 ? ('0' + d) : d;
            var h = date.getHours();
            h = h < 10 ? ('0' + h) : h;
            var minute = date.getMinutes();
            var second = date.getSeconds();
            minute = minute < 10 ? ('0' + minute) : minute;
            second = second < 10 ? ('0' + second) : second;
            // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second;
            return y + '-' + m + '-' + d;
        };
//今天时间：
        var year = new Date().getFullYear();
        var month = new Date().getMonth() + 1;
        var day = new Date().getDate();
// 当天零点到晚上零点时间：
        that.time = dateFormatConversion(new Date(new Date(new Date().toLocaleDateString()).getTime()));
        that.totime = dateFormatConversion(new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1));
// 获得本周时间   【周一到当天的时间】
        var thisWeekStart; //本周周一的时间
        if (new Date().getDay() == 0) {  //周天的情况；
            thisWeekStart = (new Date(year + '/' + month + '/' + day)).getTime() - ((new Date().getDay()) + 6) * 86400000;
        } else {
            thisWeekStart = (new Date(year + '/' + month + '/' + day)).getTime() - ((new Date().getDay()) - 1) * 86400000;
        }

        that.weekStartDate = dateFormatConversion(new Date(thisWeekStart));
        that.weekEndDate = dateFormatConversion(new Date());

//获得上周时间
        var prevWeekStart = thisWeekStart - 7 * 86400000;//上周周一的时间
        var prevWeekEnd = thisWeekStart - 1 * 86400000;//上周周日的时间
        that.prevweekStartDate = dateFormatConversion(new Date(prevWeekStart));
        that.prevweekEndDate = dateFormatConversion(new Date(prevWeekEnd));


//获得本月时间
        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth();
        that.monthStartDate = dateFormatConversion(new Date(currentYear, currentMonth, 1));
        that.monthEndDate = that.weekEndDate;


//获得上月时间
        var currentYear = new Date().getFullYear();
        var currentMonth = new Date().getMonth();
        var prevCurrentYear = 0, prevCurrentMonth = 0;
        if (currentMonth == 0) {
            prevCurrentYear = currentYear - 1;
            prevCurrentMonth = 12;
        } else {
            prevCurrentYear = currentYear;
            prevCurrentMonth = currentMonth - 1;
        }
        var prevmonthLastday = (new Date(currentYear, currentMonth, 1)).getTime() - 86400000;

        that.prevmonthStartDate = dateFormatConversion(new Date(prevCurrentYear, prevCurrentMonth, 1));
        that.prevmonthEndDate = dateFormatConversion(new Date(prevmonthLastday));

//获得今年时间
        var currentYear = new Date().getFullYear();
        that.yearStartDate = dateFormatConversion(new Date(currentYear, 0, 1));
        that.yearEndDate = that.weekEndDate;

//获得去年时间
        var prevCurrentYear = new Date().getFullYear() - 1;
        that.prevyearStartDate = dateFormatConversion(new Date(prevCurrentYear, 0, 1));
        that.prevyearEndDate = dateFormatConversion(new Date(prevCurrentYear, 11, 31));
    };

//输出接口
    exports('getDate', getDate);
});
