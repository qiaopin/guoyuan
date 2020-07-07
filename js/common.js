function gettime() {
    var MyDate = new Date();
    var Year = MyDate.getFullYear();
    var Month = MyDate.getMonth() + 1;
    var dat = MyDate.getDate();
    var time = MyDate.toLocaleTimeString();
    var mytime = Year + "-" + Month + "-" + dat;
    return mytime;
}

function newfso() {
    var fso;
    try {
        fso = new ActiveXObject("Scripting.FileSystemObject");
        return fso;
    } catch (e) {
//		alert("当前浏览器不支持ActiveXObject");
        return null;
    }
}

function newguid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }

    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

/**
 * 输入验证
 * @type {{}}
 */
var verification = {
    /*姓名身份证，手机号提交*/
    isChinaName: function (name) {
        var pattern = /^[\u4E00-\u9FA5]{1,6}$/;
        return pattern.test(name);
    },
// 验证身份证
    isCardNo: function (card) {
        var pattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        return pattern.test(card);
    },
// 验证手机号 或 座机号
    isPhoneNo: function (phone) {
        var rex = /^1[3-9]+\d{9}$/;
        var rex2 = /^((0\d{2,3})-)(\d{7,8})(-(\d{3,}))?$/;
        if (rex.test(phone) || rex2.test(phone)) {
            return true;
        } else {
            return false;
        }
    },
    // 验证邮箱格式
    isEmail:function(email){
        var pattern = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        return pattern.test(email);
    }
};

//读取本地txt文件
function uploadTxt(input) {
    //支持chrome IE10
    if (window.FileReader) {
        var file = input.files[0];
        filename = file.name.split(".")[0];
        var reader = new FileReader();
        reader.onload = function () {
            console.log(this.result);
            return this.result;
        };
        reader.readAsText(file);
    }
    //支持IE 7 8 9 10
    else if (typeof window.ActiveXObject != 'undefined') {
        var xmlDoc;
        xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
        xmlDoc.async = false;
        xmlDoc.load(input.value);
        console.log(xmlDoc.xml);
        return xmlDoc.xml;
    }
    //支持FF
    else if (document.implementation && document.implementation.createDocument) {
        var xmlDoc;
        xmlDoc = document.implementation.createDocument("", "", null);
        xmlDoc.async = false;
        xmlDoc.load(input.value);
        console.log(xmlDoc.xml);
        return xmlDoc.xml;
    } else {
        alert('导入文件出错error');
    }
}