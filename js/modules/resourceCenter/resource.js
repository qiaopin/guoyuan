layui.define(['form', 'table', 'ljfBase', 'table', 'jquery', 'laypage', 'laydate', 'getDate'], function (exports) {
    var form = layui.form;
    var table = layui.table;
    var laypage = layui.laypage;
    var laydate = layui.laydate;
    var ljfBase = layui.ljfBase;
    var $ = layui.jquery;
    var getDate = new layui.getDate();//当前日期
    var type = parent.type;
    window.type = type;
    var resource = function () {
        var that = this;
        that.resjson = [];//列表
        that.limit = 4;
        that.curr = 1;
        that.cols = [];//表格头
        that.URIComponent = "";//请求地址
        that.searchData = {};//筛选条件
        that.getList = function (URIComponent) {
            //获取列表
            that.resjson = [];
            var loading = top.layer.load();
            ljfBase.post(ljfBase.https.ResourceManagerService + "/" + that.URIComponent, that.searchData, function (xml) {
                if (xml.indexOf("false") > -1) {
                    top.layer.alert("未查询到结果!");
                    top.layer.close(loading);
                    that.resjson = [];
                } else {
                    top.layer.close(loading);
                    that.resjson = $.parseJSON(xml);
                    that.renderTable(that.resjson);
                }
                that.resetPage(that.resjson.length);
                window.showList(1);
            });
        };

        that.renderTable = function (data) {
            // 渲染表格
            var height = $(document).height() - 380;
            $('.tableBox').attr('style', 'height:' + height + 'px;');
            table.render({
                elem: '#table',
//              height: height,
                page: true, //开启分页
                limit: that.limit,
                limits: [that.limit, 10, 20],
                cols: that.cols,
                data: data
            });
        };

        that.init = function () {
            //页面初始化时执行的事件
            laydate.render({
                elem: '#date',
                range: true,
                done: function (value) {
                    $(".createTime li").removeClass("active");
                    that.searchData.startTime = value.split(" - ")[0];
                    that.searchData.endTime = value.split(" - ")[1];
                    that.getList();
                }
            });
            //获取行业类别
            if ($('.industry')) {
                ljfBase.post(ljfBase.https.ConfigManagerServices + "/GetAllIndustryInfo", {}, function (xml) {
                    var resArr = $.parseJSON(xml);
                    //如果是查询 第一行增加一个全部
                    var str = "<li class='active'>全部</li>";
                    $.each(resArr, function (i, v) {
                        str += "<li>" + v.NAME + "</li>";
                    });
                    $('.industry').html(str);
                });
            }
            //获取数据类型
            if ($('.dataClass')) {
                var dataArr = ljfBase.configJson.dataClass;
                var dataStr = "<li class='active'>全部</li>";
                $.each(dataArr, function (i, v) {
                    dataStr += "<li>" + v.text + "</li>";
                });
                $('.dataClass').html(dataStr);
            }
            //获取服务类型
            if ($('.serviceClass')) {
                var dataArr = ljfBase.configJson.serviceClass;
                var dataStr = "<li class='active'>全部</li>";
                $.each(dataArr, function (i, v) {
                    dataStr += "<li>" + v.text + "</li>";
                });
                $('.serviceClass').html(dataStr);
            }
            //获取文档类型
            if ($('.doctype')) {
                var dataArr = ljfBase.configJson.doctype;
                var dataStr = "<li class='active'>全部</li>";
                $.each(dataArr, function (i, v) {
                    dataStr += "<li>" + v.text + "</li>";
                });
                $('.doctype').html(dataStr);
            }

            that.getList();

            //切换大图 列表
            $('.changeShow>div').click(function () {
                $('.changeShow>div').removeClass("curr");
                $(this).addClass("curr");
                if ($(this).hasClass("pic-style")) {
                    $('.picBox').removeClass("hide");
                    $('.tableBox').addClass("hide");
                } else if ($(this).hasClass("list-style")) {
                    $('.picBox').addClass("hide");
                    $('.tableBox').removeClass("hide");
                }
            });

            //表格头工具栏事件
            table.on('tool(table)', function (obj) {
                switch (obj.event) {
                    case 'detail':
                        //详情
                        window.showDetail(obj.data.RESOURCEID);
                        break;
                    case 'apply':
                        //详情
                        window.apply(obj.data.RESOURCEID);
                        break;
                }
            });

            $('.serviceClass').on('click', 'li', function () {
                //按服务类型进行筛选
                var str = $(this).html();
                if (str == "全部") {//选择全部
                    $('.serviceClass li').removeClass("active");
                    $(this).addClass("active");
                } else {
                    $('.serviceClass li').eq(0).removeClass("active");
                    $(this).toggleClass("active");
                }
                //获取当前所有选中的行业
                var serviceTypeArr = [];
                $('.serviceClass .active').each(function () {
                    serviceTypeArr.push($(this).html());
                });
                var serviceType = serviceTypeArr.join(",");
                if (serviceType == "全部") {
                    serviceType = "";
                }
                that.searchData.serviceType = serviceType;
                that.getList();
            });

            $('.industry').on('click', 'li', function () {
                //按行业类型进行筛选
                var str = $(this).html();
                if (str == "全部") {//选择全部
                    $('.industry li').removeClass("active");
                    $(this).addClass("active");
                } else {
                    $('.industry li').eq(0).removeClass("active");
                    $(this).toggleClass("active");
                }
                //获取当前所有选中的行业
                var industryArr = [];
                $('.industry .active').each(function () {
                    industryArr.push($(this).html());
                });
                var industry = industryArr.join(",");
                if (industry == "全部") {
                    industry = "";
                }
                that.searchData.industry = industry;
                that.getList();
            });

            $('.doctype').on('click', 'li', function () {
                //按文档类型进行筛选
                var str = $(this).html();
                if (str == "全部") {//选择全部
                    $('.doctype li').removeClass("active");
                    $(this).addClass("active");
                } else {
                    $('.doctype li').eq(0).removeClass("active");
                    $(this).toggleClass("active");
                }
                //获取当前所有选中的行业
                var doctypeArr = [];
                $('.doctype .active').each(function () {
                    doctypeArr.push($(this).html());
                });
                var docType = doctypeArr.join(",");
                if (docType == "全部") {
                    docType = "";
                }
                that.searchData.docType = docType;
                that.getList();
            });

            $('.dataClass').on('click', 'li', function () {
                //按数据类型进行筛选
                var str = $(this).html();
                if (str == "全部") {//选择全部
                    $('.dataClass li').removeClass("active");
                    $(this).addClass("active");
                } else {
                    $('.dataClass li').eq(0).removeClass("active");
                    $(this).toggleClass("active");
                }
                //获取当前所有选中的
                var industryArr = [];
                $('.dataClass .active').each(function () {
                    industryArr.push($(this).html());
                });
                var dataType = industryArr.join(",");
                if (dataType == "全部") {
                    dataType = "";
                }
                that.searchData.dataType = dataType;
                that.getList();
            });

            $('.createTime').on('click', 'li', function () {
                //按时间进行筛选
                $("#date").val("");
                form.render();
                var time = $(this).html();
                var startTime = '';
                var endTime = '';
                switch (time) {
                    case "全部":
                        startTime = '';
                        endTime = '';
                        break;
                    case "本周":
                        startTime = getDate.weekStartDate;
                        endTime = getDate.weekEndDate;
                        break;
                    case "上周":
                        startTime = getDate.prevweekStartDate;
                        endTime = getDate.prevweekEndDate;
                        break;
                    case "本月":
                        startTime = getDate.monthStartDate;
                        endTime = getDate.monthEndDate;
                        break;
                    case "上月":
                        startTime = getDate.prevmonthStartDate;
                        endTime = getDate.prevmonthEndDate;
                        break;
                    case "今年":
                        startTime = getDate.yearStartDate;
                        endTime = getDate.yearEndDate;
                        break;
                    case "去年":
                        startTime = getDate.prevyearStartDate;
                        endTime = getDate.prevyearEndDate;
                        break;
                }
                that.searchData.startTime = startTime;
                that.searchData.endTime = endTime;
                $('.createTime li').removeClass("active");
                $(this).addClass("active");
                that.getList();
            });

            that.resetPage = function (count) {
                //设置分页
                if (count <= that.limit) {
                    $('#layuiPage').hide();
                } else {
                    $('#layuiPage').show();
                    //执行一个laypage实例
                    laypage.render({
                        elem: 'layuiPage' //注意，这里的 test1 是 ID，不用加 # 号
                        , count: count //数据总数，从服务端得到
                        , limit: that.limit
                        , jump: function (obj, first) {
                            //首次不执行
                            if (!first) {
                                window.showList(obj.curr);
                            }
                        }
                    });
                }
            };

            //打开详情页
            window.showDetail = function (id) {
                if (type == "地图服务") {
                    window.MAPID = id;
                    ljfBase.layerOpen('html/FWZX/addService.html?type=show', '详情信息', ["737px", '655px']);
                } else if (type == "数据资源") {
                    window.DATAID = id;
                    ljfBase.layerOpen('html/FWZX/addData.html?type=show', '详情信息', ["715px", '420px']);
                } else if (type == "成果资料") {
                    window.DOCID = id;
                    ljfBase.layerOpen('html/FWZX/addDoc.html?type=show', '详情信息', ["740px", '430px']);
                }
            };

            //申请
            window.apply = function (guid) {
                parent.layer.RESOURCEID = guid;
                parent.layer.RESOURCETYPE = type;
                parent.layer.openIndex = parent.layer.open({
                    type: 2,
                    title: "申请订单",
                    closeBtn: 1,
                    skin: 'layui-layer-lan',
                    area: ['520px', '290px'],
                    anim: 2,//弹出动画
                    shade: 0.2,//遮盖层
                    content: ['YWBL/examine.html', 'no'] //这里content是一个普通的String
                });
            };

            //预览
            window.preview = function (guid) {
                window.mapId = guid;
                //预览
                ljfBase.layerOpen('html/preview.html', "预览", ['80%', '80%']);
            };
            //下载
            window.downloadDoc = function (guid) {
                if (type == "数据资源") {
                    var urlD = ljfBase.https.DataResourceManagerService + "/GetDataResourceByID";
                    var dataD = {
                        resourceid: guid,
                        sprid: localStorage.sprid
                    };
                    ljfBase.post(urlD, dataD, function (resjson) {
                        if (resjson.indexOf("false") > -1) {
                            parent.layer.alert("未查询到结果!");
                            parent.layer.close(parent.layer.loadIndex);
                        } else {
                            var resjosn = $.parseJSON(resjson);
                            var DATAPATH = resjosn[0].DATAPATH;
                            DATAPATH = DATAPATH.split('GTKJGH')[1].replace(/\\/g, "/");
                            window.open(config.ip + DATAPATH);
                        }
                    });
                } else if (type == "成果资料") {
                    var url = ljfBase.https.DocResourceManagerService + "/GetDocResourceByID";
                    var data = {
                        resourceid: guid,
                        sprid: localStorage.sprid
                    };
                    ljfBase.post(url, data, function (resjson) {
                        if (resjson.indexOf("false") > -1) {
                            parent.layer.alert("未查询到结果!");
                            parent.layer.close(parent.layer.loadIndex);
                        } else {
                            var resjosn = $.parseJSON(resjson);
                            var DATAPATH = resjosn[0].DATAPATH;
                            DATAPATH = DATAPATH.split('GTKJGH')[1].replace(/\\/g, "/");
                            window.open(config.ip + DATAPATH);
                        }
                    });
                }
            };

            window.showList = function (currIndex) {
                //渲染列表
                var arr = that.resjson;
                var str = "";
                var limit = that.limit;
                var s = (currIndex - 1) * limit;
                var e = s + limit;
                if (arr.length < e) {
                    e = arr.length;
                }
                for (var i = s; i < e; i++) {
                    var v = arr[i];
                    var imgSrc = v.TITLE ? ljfBase.changeTile(v.TITLE) : "../images/nopic.jpg";
                    var id = v.RESOURCEID + "";
                    var POWER = v.POWER;
                    str += '<li>' +
                        '<div class="img-item">' +
                        '<a href="javascript:;" target="_blank"><img src="' + imgSrc + '"></a>' +
                        '</div>' +
                        '<div class="info-item">' +
                        '<p class="title"><a href="javascript:;" target="_blank" title="' + v.NAME + '">' + v.NAME + '</a></p>' +
                        '<p>行业类别：' + v.RESOURCEINDUSTRY + '</p>' +
                        '<p>服务类型：' + v.TYPE + '</p>' +
                        '<p>生产时间：' + v.CREATETIME + '</p>' +
                        '<p class="operation">' +
                        '<a class="" href="javascript:;" target="_blank" onclick="showDetail(\'' + id + '\')">详情</a>';
                    if (POWER == "是") {
                        if (window.type == "地图服务") {
                            str += '<a class="" href="javascript:;" target="_blank" onclick="preview(\'' + id + '\')">预览</a>';
                        } else {
                            str += '<a class="" href="javascript:;" target="_blank" onclick="downloadDoc(\'' + id + '\')">下载</a>';
                        }
                    } else {
                        str += '<a class=" _submitApply" data-id="" href="javascript:;" onclick="apply(\'' + id + '\')">申请</a>' +
                            '</p>' +
                            '</div>' +
                            '</li>';
                    }
                }
                $('#imagelistPanel').html(str);
            };
        };
    };
//输出接口
    exports('resource', resource);
});
