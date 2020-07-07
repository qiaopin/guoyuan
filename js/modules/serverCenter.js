layui.define(['jquery', 'table', 'form', 'ljfBase'], function (exports) {
    var $ = layui.$;
    var table = layui.table;
    var form = layui.form;
    var ljfBase = layui.ljfBase;

    var testobj = {};

    //重置
    $('.reset').click(function () {
        //监听重置
        $('#searchFrom')[0].reset();//清空搜索条件
        form.render();
        $('.search').click(); //执行一次搜索
    });

    var serverCenter = {
        data: {
            tableUrl: '',
            cols: [],
            repData: {}
        },
        hasToolBar: false,
        /**
         * 初始化表格
         * @param tableUrl 接口
         * @param cols 表头
         * @param repData 接口参数
         * @param hasToolBar 是否有头工具条
         */
        tableInit: function (tableUrl, cols, repData, hasToolBar) {
            //初始化
            serverCenter.data.tableUrl = tableUrl;
            serverCenter.data.cols = cols;
            serverCenter.data.repData = repData;
            if (hasToolBar) {
                serverCenter.hasToolBar = true;
            }
            serverCenter.initSelectClass(true);//初始化select
            serverCenter.tableRender();//渲染表格
        },
        initSelectClass: function (isAddAll) {
            if (isAddAll) {
                //搜索框需要加 ‘全部’ 选项
                if ($('.serviceClass')) {
                    //服务类型
                    var classArr = ljfBase.configJson.serviceClass;
                    classArr.unshift({value: '', text: '全部'});
                    ljfBase.refreshSelect('.serviceClass', classArr);
                }
                if ($('.datatype')) {
                    //数据类型
                    var classArr = ljfBase.configJson.dataClass;
                    classArr.unshift({value: '', text: '全部'});
                    ljfBase.refreshSelect('.datatype', classArr);
                }

                if ($('.doctype')) {
                    //数据类型
                    var classArr = ljfBase.configJson.doctype;
                    classArr.unshift({value: '', text: '全部'});
                    ljfBase.refreshSelect('.doctype', classArr);
                }
            } else {
                if ($('.maptype')) {
                    //获取所有服务类型
                    ljfBase.refreshSelect('.maptype', ljfBase.configJson.serviceClass);
                }
                if ($('.datatype')) {
                    //获取所有数据类型
                    ljfBase.refreshSelect('.datatype', ljfBase.configJson.dataClass);
                }
                if ($('.doctype')) {
                    //获取所有数据类型
                    ljfBase.refreshSelect('.doctype', ljfBase.configJson.doctype);
                }
            }
            //获取所有行业信息
            ljfBase.GetAllIndustryInfo(isAddAll);
        },
        tableRender: function (repData, tableUrl) {
            var tableUrl = tableUrl || serverCenter.data.tableUrl;
            var repData = repData || serverCenter.data.repData;
            var cols = serverCenter.data.cols;
            //渲染表格
            ljfBase.post(tableUrl, repData, function (xml) {
                var arr = JSON.parse(xml);
                if (serverCenter.hasToolBar) {
                    ljfBase.showTableHasToolBar(arr, cols);
                } else {
                    ljfBase.showTable(arr, cols);
                }

            });
        },
        formInit: function (type) {
            //初始化select
            serverCenter.initSelectClass();
            //点击取消按钮 关闭弹窗
            $('#close').click(function () {
                top.layer.close(window.layerIndex);
                return false;
            });

            if (type == 'show') {
                //如果是查看 隐藏确定按钮 页面不可操作
                $('input,textarea,select').attr('disabled', 'disabled');
                $('.hiddeWhenShow').hide();
                form.render();
            }

            // var height = $(document).height() + 'px';
            // top.layer.style(window.layerIndex, {
            //     height: height
            // });
        },
        changeHot: function (url, resourceid, chekced, success) {
            //推荐 取消推荐
            ljfBase.post(url, {
                sprid: localStorage.sprid,
                resourceid: resourceid,
                recommend: chekced
            }, function (data) {
                if (data.trim() == 'true') {
                    if (chekced) {
                        layer.msg('推荐成功！');
                    } else {
                        layer.msg('取消推荐成功！');
                    }
                    return success && success();
                }
            });
        }
    };

    //输出接口
    exports('serverCenter', serverCenter);
});
