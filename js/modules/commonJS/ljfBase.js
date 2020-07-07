layui.define(['jquery', 'table', 'form', 'bluebird', 'xml2json'], function (exports) {
    var $ = layui.$;
    var table = layui.table;
    var xml2json = layui.xml2json;
    var form = layui.form;
    var ljfBase = {
        baseUrl: baseUrl,
        https: {
            MapResourceManagerService: baseUrl + "MapResourceManagerService.asmx", //服务资源管理
            UserManagerService: baseUrl + "UserManagerService.asmx",//用户管理
            BaseMapManagerService: baseUrl + "BaseMapManagerService.asmx",//地图配置
            ResourceManagerService: baseUrl + "ResourceManagerService.asmx",
            BaseMapConfigManagerService: baseUrl + "BaseMapConfigManagerService.asmx",//地图
            NewsPictureUpload: baseUrl + "NewsPictureUpload.ashx",//上传图片
        },
        baseMapArr: [{ //天地图底图
            "MAPURL": "http://t0.tianditu.com/cva_c/wmts?tk=0247d3e7f770fa1ee61333536cf67aca",
            "SERVICETYPE": "WMTS",
            "SCALE": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
            "layerId": "01",
            "MAPNAME": "矢量注记",
            "visible": false,
            "TYPE": "sl",
            "isBaseMap": true
        }, {
            "MAPURL": "http://t0.tianditu.com/vec_c/wmts?tk=0247d3e7f770fa1ee61333536cf67aca",
            "SERVICETYPE": "WMTS",
            "SCALE": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
            "layerId": "02",
            "MAPNAME": "矢量底图",
            "TYPE": "sl",
            "visible": false,
            "isBaseMap": true
        },
            {
                "MAPURL": "http://t{0-2}.tianditu.com/cia_c/wmts?tk=4c0d2b71e64f9a2634eb6791c0d89979",
                "SERVICETYPE": "WMTS",
                "SCALE": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
                "layerId": "11",
                "MAPNAME": "天地图影像注记",
                "TYPE": "yx",
                "visible": false,
                "isBaseMap": true
            },
            //     {
            //     "MAPURL": "http://t{0-2}.tianditu.com/img_c/wmts?tk=4c0d2b71e64f9a2634eb6791c0d89979",
            //     "SERVICETYPE": "WMTS",
            //     "SCALE": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17",
            //     "layerId": "12",
            //     "MAPNAME": "影像底图",
            //     "TYPE": "yx",
            //     "visible": false,
            //     "isBaseMap": true
            // },
            {
                "MAPURL": "http://mt1.google.cn/vt/lyrs=s@126&hl=en-US&gl=US&src=app&s=G&x={x}&y={y}&z={z}",
                "SERVICETYPE": "XYZ",
                "SCALE": "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25",
                "layerId": "112",
                "MAPNAME": "google影像底图",
                "TYPE": "yx",
                "visible": false,
                "isBaseMap": true
            },

        ],
        configJson: {
            serviceClass: [//地图服务类型
                {
                    value: "MapServer",
                    text: "MapServer",
                    lastUrl: '?f=json&pretty=true&callback='
                },
                {value: "WMS", text: "WMS", lastUrl: '?request=GetCapabilities&service=WMS'},
                {value: "GeoServer", text: "GeoServer", lastUrl: '?request=GetCapabilities&service=WMS'},
                {value: "WMTS", text: "WMTS", lastUrl: '&SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities'}
            ]
        },
        getServiceTypeByUrl: function (url) {
            //根据服务地址 获取服务类型
            //先判断最后结尾是否是/MapServer /WMSServer
            var arr = url.split('/');
            var last = arr[arr.length - 1];
            if (last == "MapServer") {
                return "MapServer";
            } else if (arr[3] == "geoserver") {
                return "GeoServer";
            } else if (last == "WMSServer") {
                return "WMS";
            } else {
                //判断是否是 /wmts?
                if (url.indexOf("/wmts?") > -1) {
                    return "WMTS";
                } else if (url.indexOf("{x}") > -1) {
                    return "XYZ";
                }
            }
        },
        //切换底图
        changeBaseMap: function (type) {
            $.each(ljfBase.baseMapArr, function (i, v) {
                var layerId = v.layerId;
                layerManager.setVisible(layerId, (v.TYPE == type));
            })
        },
        /**
         * 随机id
         * @returns {string}
         */
        newguid: function () {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }

            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        },
        /**
         * 获取地图服务元数据
         * @param serviceUrl 服务地址
         */
        getServiceData: function (serviceUrl) {
            if (ljfBase.isServerRuning(serviceUrl)) {
                // 服务可用
                var serviecType = ljfBase.getServiceTypeByUrl(serviceUrl);
                var serverJson = {
                    fullExtent: {},//范围
                    layers: [],//图层
                    wkid: '',//坐标系
                };
                if (serviecType == ("WMTS" || "XYZ")) {//不判断WMTS的服务
                    return serverJson;
                }
                var lastUrl = "";
                $.each(ljfBase.configJson.serviceClass, function (i, v) {
                    if (v.value == serviecType) {
                        lastUrl = v.lastUrl;
                    }
                });
                var mapUrl = serviceUrl + lastUrl;
                var loading = top.layer.load();
                // 封装get请求
                $.ajax({
                    type: "get", //请求方式
                    url: mapUrl,
                    data: {},
                    dataType: "text",
                    async: false,
                    timeout: 1000,//设置请求超时
                    jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                    //请求成功后的回调函数
                    success: function (data) {
                        top.layer.close(loading);
                        if (serviecType == "GeoServer" || serviecType == "WMS") {
                            var res = xml2json(data);//xml转json
                            if (res.Capability.Layer) {
                                var fullExtent;
                                var crs;
                                //判断 Layer 是否是一个对象数组
                                var layers = res.Capability.Layer.Layer;
                                var isObj = JSON.stringify(layers).indexOf("{");
                                if (isObj == 0) {
                                    //如果是对象
                                    fullExtent = layers.EX_GeographicBoundingBox;
                                    crs = layers.CRS;
                                    var arr = [{
                                        id: layers.Name,
                                        name: layers.Title
                                    }];
                                    serverJson.layers = arr;
                                } else {//如果是数组
                                    fullExtent = layers[0].EX_GeographicBoundingBox;
                                    crs = layers[0].CRS;
                                    var arr = [];
                                    $.each(layers, function (i, v) {
                                        var obj = {
                                            id: v.Name,
                                            name: v.Title
                                        };
                                        arr.push(obj);
                                    });
                                    serverJson.layers = arr;
                                }
                                serverJson.fullExtent = {
                                    xmin: fullExtent.westBoundLongitude,
                                    xmax: fullExtent.eastBoundLongitude,
                                    ymin: fullExtent.southBoundLatitude,
                                    ymax: fullExtent.northBoundLatitude
                                };
                                //判断SRS是否是一个数组
                                var isArr = JSON.stringify(crs).indexOf("[");
                                if (isArr == 0) {
                                    serverJson.wkid = crs[crs.length - 1];
                                } else {
                                    serverJson.wkid = crs;
                                }
                            }
                        } else if (serviecType == "MapServer") {
                            var res = JSON.parse(data);
                            if (res) {
                                serverJson.fullExtent = res.fullExtent;
                                serverJson.layers = res.layers;
                                serverJson.wkid = "EPSG:" + res.fullExtent.spatialReference.wkid;
                            }
                        }
                    },
                    error: function (e) {
                        top.layer.close(loading);
                    }
                });
                return serverJson;
            } else {
                layer.msg("服务不可用");
            }
        },

        /**
         * 判断当前地图服务是否可用
         * @param serviceUrl 服务地址
         */
        isServerRuning: function (serviceUrl) {
            //判断服务是否可用
            var isRun = false;
            var serviecType = ljfBase.getServiceTypeByUrl(serviceUrl);
            if (serviecType == ("WMTS" || "XYZ")) {//不判断WMTS XYZ服务
                isRun = true;
                return isRun;
            }
            var lastUrl = "";
            $.each(ljfBase.configJson.serviceClass, function (i, v) {
                if (v.value == serviecType) {
                    lastUrl = v.lastUrl;
                }
            });
            var mapUrl = serviceUrl + lastUrl;
            var loading = top.layer.load();
            // 封装get请求
            $.ajax({
                type: "get", //请求方式
                url: mapUrl,
                data: {},
                dataType: "text",
                async: false,
                timeout: 1000,//设置请求超时
                jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                //请求成功后的回调函数
                success: function (data) {
                    top.layer.close(loading);
                    if (serviecType == "WMS" || serviecType == "GeoServer") {
                        var json_obj = xml2json(data);//xml转json
                        if (json_obj.Capability.Layer) {
                            isRun = true;
                        }
                    } else if (serviecType == "MapServer") {
                        if (JSON.parse(data).layers) {
                            isRun = true;
                        }
                    }
                },
                error: function (e) {
                    top.layer.close(loading);
                    isRun = false;
                }
            });
            return isRun;
        },
        /**
         * 获取服务所有图层
         * @param mapUrl
         * @param success
         */
        getServerLayers: function (mapUrl, success) {
            var serviceType = ljfBase.getServiceTypeByUrl(mapUrl);
            if (serviceType == "XYZ") {
                return success && success([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]);
            }
            var layers = ljfBase.getServiceData(mapUrl).layers;
            $.each(layers, function (i, v) {
                layers[i].index = i;
            });
            if (serviceType == "WMTS") {
                layers = [{id: 0, name: ""}];
            }
            if (success) {
                return success && success(layers);
            } else {
                return layers;
            }
        },
        //判断是否是瓦片地图
        isTile: function (mapUrl, func) {
            var serviceType = ljfBase.getServiceTypeByUrl(mapUrl);
            if (serviceType == "MapServer") {
                $.ajax({
                    type: "get", //请求方式
                    url: mapUrl + '?f=pjson',
                    data: {},
                    dataType: "json", //返回json
                    jsonp: "jsonp", //传递给请求处理程序或页面的，用以获得jsonp回调函数名的参数名(默认为:callback)
                    async: false,
                    cache: false,
                    global: false,
                    //请求成功后的回调函数
                    success: function (res) {
                        var isTileLayer = false;
                        if (res.tileInfo) {
                            isTileLayer = true;
                        }
                        return func && func(isTileLayer);
                    },
                    error: function (res) {
                        // top.layer.alert('访问服务器失败!');
//                          throw res;
                        return func && func(false);
                    }
                });
            } else {
                return func && func("notMapServer");
            }
        },
        refreshSelect: function (elem, resArr, value, text) {
            //更新select下拉框
            var value = value || "value";
            var text = text || "text";
            var str = "";
            $.each(resArr, function (i, v) {
                str += "<option value='" + v[value] + "'>" + v[text] + "</option>";
            });
            $(elem).html(str);
            form.render();
        },
        showTableHasToolBar: function (data, cols) {
            //渲染有头部工具条的table
            var height = $(document).height() - $('.head').outerHeight();
            $('.table-content').attr('style', 'height:' + height + 'px;');
            table.render({
                elem: '#table',
                height: height,
                toolbar: '#toolbarDemo',
                page: true, //开启分页
                limit: 10,
                limits: [10, 20, 30],
                cols: cols,
                data: data,
                done: function () {
                    // return success && success();
                }
            });
        },
        showTable: function (data, cols) {
            //渲染table
            var height = $(document).height() - $('.head').outerHeight();
            $('.table-content').attr('style', 'height:' + height + 'px;');
            table.render({
                elem: '#table',
                height: height,
                page: true, //开启分页
                limit: 10,
                limits: [10, 20, 30],
                cols: cols,
                data: data,
                done: function () {
                    // return success && success();
                }
            });
        },
        layerOpen: function (url, title, area) {
            var title = title || "信息";
            var url = localStorage.rootPath + url;
            var area = area || ['740px', '680px'];
            // 打开弹窗
            top.layer.open({
                type: 2,
                title: title,
                closeBtn: 1,
                skin: 'layui-layer-lan',
                area: area,
                anim: 2,//弹出动画
                shade: 0.2,//遮盖层
                content: [url, 'no'],//这里content是一个普通的String  不出滚动条
                success: function (layero, index) {
                    // top.layer.iframeAuto(index);//高度自适应
                    var iframeWin = top.window[layero.find('iframe')[0]['name']];//获取子页面
                    iframeWin.parWin = window;//在子页面获取父页面
                    iframeWin.layerIndex = index;//子页面获取弹窗index
                    window.layerIndex = index;//父页面获取弹窗index
                }
            });
        },
        resetLayerHeight: function () {
            //重设弹出层高度
            var height = $(document).height() + 45 + 'px';
            top.layer.style(window.layerIndex, {
                height: height
            });
        },
        ajax: function (paraObj, success) {
            // 封装ajax请求
            // var loading = top.layer.load();
            $.ajax({
                type: paraObj.type || 'post', //请求方式
                url: paraObj.url,
                data: paraObj.data,
                timeout: paraObj.timeout || 10000, // 设置超时时间
                dataType: paraObj.dataType || "json", //返回文本
                contentType: paraObj.contentType || "application/json",
                async: paraObj.async || true,
                //请求成功后的回调函数
                success: function (res) {
                    // top.layer.close(loading);
                    return success && success(JSON.parse(res));
                },
                error: function (res) {
                    // top.layer.close(loading);
                    throw res;
                }
            });
        },
        getParamByUrl: function (name) {
            //截取url中的参数
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); //构造一个含有目标参数的正则表达式对象
            var r = window.location.search.substr(1).match(reg);  //匹配目标参数
            if (r != null) return unescape(r[2]);
            return null; //返回参数值
        }
    };
    //输出接口
    exports('ljfBase', ljfBase);
});
