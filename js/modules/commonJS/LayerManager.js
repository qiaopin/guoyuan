layui.define(['jquery', 'ljfBase', 'NULayer'], function (exports) {
    var $ = layui.$;
    var ljfBase = layui.ljfBase;
    var NULayer = layui.NULayer;

    var LayerManager = function (target, center, zoom, linkage) {
        var target = target;
        var that = this;
        that._mapView = false;
        that.NULayers = [];
        that.baseMapAll = []; //所有底图
        that._mapObject = false;
        that.zoom = zoom || 12;
        that.center = center;
        that.mouseEvt = false; //鼠标点击后获取到的
        that.createMapObject = function () {
            var scaleLineControl = new ol.control.ScaleLine({
                units: "metric" //设置比例尺单位，degrees、imperial、us、nautical、metric（度量单位）
            });
            var _mapObject = new ol.Map({
                target: target,
                logo: false,
                view: that._mapView,
                //加载控件到地图容器中
                controls: ol.control.defaults({
                    attribution: false
                }).extend([scaleLineControl]), //加载比例尺控件
                layers: that.NULayers.concat([window.NUSourceLayer1, window.NUSourceLayer2, window.NUSourceLayer3, window.NUSourceLayer4]),
                legend: false
            });
            //地图比例尺切换事件
            _mapObject.getView().on('change:resolution', function (e) {
                var zoom = Math.floor(that._mapObject.getView().getZoom());
                that.zoom = zoom;
                //判断所有图层 在该比例尺下是否显示
                $.each(that.NULayers, function (i, v) {
                    if ($.inArray(zoom.toString(), v.scale) == -1) {
                        v.isView = false;
                        v.setView(false);
                    } else {
                        if (!v.isView) {
                            //判断当前图层是否是隐藏状态
                            v.isView = true;
                            v.setView(true);
                        }
                    }
                });
                that.checkZoom();
            });

            _mapObject.addEventListener('click', function (evt) {
                // 监听鼠标点击事件;
                that.mouseEvt = evt;
                that.getMouseClick();
            });

            that._mapObject = _mapObject;
        };
        that.getMouseClick = function () {
            // 监听鼠标点击事件;
        };
        that.checkZoom = function () {
            //监听比例尺改变事件  可在方法外重新初始化此方法，额外添加一些操作
        };
        that.moveLayer = function (i, g) {

        };
        that.removeTopLayer = function () {
            //把isTopMap为true 的图层移除
        };
        that.removeLayerById = function (layerId) {
            //删除图层
            for (var i = 0; i < that.NULayers.length; i++) {
                var v = that.NULayers[i];
                if (v.layerId == layerId) {
                    that._mapObject.removeLayer(v.layer);
                    that.NULayers.splice(i, 1);
                }
            }
        };
        that.setVisible = function (layerId, visible) {
            //设置图层显示隐藏
            var nulayer = that.getLayerById(layerId);
            nulayer.setVisible(visible);
        };
        that.setOpacity = function (layerId, opacity) {
            //设置图层显示隐藏
            var nulayer = that.getLayerById(layerId);
            nulayer.setOpacity(opacity);
        };
        that.setZIndex = function (layerId, zIndex) {
            //设置图层排序
            var nulayer = that.getLayerById(layerId);
            nulayer.setZindex(zIndex);
        };
        that.load = function () {

        };
        that.setCenter = function (center) {
            //重设中心点
            that._mapObject.getView().setCenter(center);
        };
        that.setZoom = function (zoom) {
            //重设比例尺
            that._mapObject.getView().setZoom(zoom);
        };
        that.hideBaseMap = function () {
            //隐藏所有底图
            $.each(that.NULayers, function (i, v) {
                if (v.isBaseMap) {
                    v.setVisible(false);
                }
            })
        };
        that.errorUrls = []; //加载错误地图数组
        that.isAlertError = true; //加载错误提示
        that.msgTimeOut = function () { //重置错误提示
            that.isAlertError = false;
            var t = 60 * 2;
            var timer = setInterval(function () {
                t--;
                if (t == 0) {
                    that.isAlertError = true;
                    that.errorUrls = [];
                    clearInterval(timer);
                }
            }, 1000)
        };
        that.saveThemelayer = function () {
            //保存当前图层数组为专题图
            //遍历当前that.NULayers 不要底图 不要拓扑图层 顺序加载
            var ztArr = [];
            $.each(that.NULayers, function (i, v) {
                if (!v.isBaseMap) {
                    ztArr.push(v);
                }
            });
            return ztArr;
        };
        that.removeAllLayer = function () {
            //删除除底图外的所有图层
            for (var i = 0; i < that.NULayers.length; i++) {
                if (!that.NULayers[i].isBaseMap) {
                    that._mapObject.removeLayer(that.NULayers[i].layer);
                    that.NULayers.splice(i, 1);
                    i--;
                }
            }
        };
        that.loadBaseMap = function (arr, name) {
            //加载底图数组
            if (that.baseMapAll.length == 0) {
                //第一次调用时加载全部底图
                that.loadAllBaseMap(arr);
            }
            that.baseMapAll = arr;
            //通过类型名称 获取要显示的底图数组
            $.each(arr, function (i, v) {
                if (v.NAME == name) {
                    $.each(v.MAPS, function (s, k) {
                        // 显示对应的底图
                        var layerId = k.TYPE + s;
                        that.setVisible(layerId, true);
                    })
                } else {
                    $.each(v.MAPS, function (s, k) {
                        // 隐藏其他底图
                        var layerId = k.TYPE + s;
                        that.setVisible(layerId, false);
                    })
                }
            });
        };
        //加载所有底图
        that.loadAllBaseMap = function (arr) {
            //通过类型名称 获取底图数组
            var maps = [];
            $.each(arr, function (i, v) {
                $.each(v.MAPS, function (s, k) {
                    var obj = $.extend({}, k);
                    obj.isBaseMap = true;
                    obj.layers = false; //底图加载所有图层 layers传入false后获取所有图层
                    obj.SCALE = k.SCALE;
                    obj.layerId = k.TYPE + s;
                    obj.visible = false; //全部设为隐藏
                    maps.push(obj);
                })
            });
            //加载底图数组
            that.loadMapArr(maps);
        };
        that.addNULayer = function (nulayer) {
            //加载图层
            that._mapObject.addLayer(nulayer.layer);
            that.NULayers.push(nulayer);
        };

        that.addLayer = function (nulayerParam) {
            //加载一个图层前进行判断
            //判断必传参数
            nulayerParam.zoom = that.zoom;
            if (!nulayerParam.layerId) {
                top.layer.alert("新建图层必须传入‘layerId’");
                return false;
            }
            if (!nulayerParam.mapUrl) {
                top.layer.alert("新建图层必须传入‘mapUrl’");
                return false;
            }
            //判断当前图层是否已经存在 存在则设置显示
            var isHasLayer = that.getLayerById(nulayerParam.layerId);
            if (isHasLayer) {
                isHasLayer.setVisible(true);
                return isHasLayer;
            } else { //不存在再加载
                //判断是否需要加载所有图层
                if (nulayerParam.layers) { //如果传入了图层 则加载当前传入的
                    var nulayer = new NULayer(nulayerParam);
                    that.addNULayer(nulayer);
                    return nulayer;
                } else { //如果没有传图层则获取当前服务有多少图层
                    var layers = [];
                    ljfBase.getServerLayers(nulayerParam.mapUrl, function (layerArr) {
                        $.each(layerArr, function (i, v) {
                            layers.push(v.id);
                        });
                    });
                    layers = layers.join(',');
                    nulayerParam.layers = layers;
                    var nulayer = new NULayer(nulayerParam);
                    that.addNULayer(nulayer);
                    return nulayer;
                }
            }
        };
        that.loadMapArr = function (mapArr) {
            //加载一组图层 [{MAPNAME:"名称",MAPURL:"地址",SCALE:"比例尺",layers:"图层","layrId:"id",visible:"显示隐藏",zIndex:"图层排序"}]
            if (that.errorUrls.length > 0) { //如果上一次有错误的
                if (!that.isAlertError) { //如果没到报错的时间 再一次加载的时候不再判断
                    var arr = [];
                    for (var i = 0; i < mapArr.length; i++) {
                        var isHas = false;
                        for (var s = 0; s < that.errorUrls.length; s++) {
                            if (mapArr[i].MAPNAME == that.errorUrls[s].MAPNAME) {
                                isHas = true;
                            }
                        }
                        if (!isHas) {
                            arr.push(mapArr[i]);
                        }
                    }
                    mapArr = arr;
                }
            }
            //倒序加载图层数组
            var foreachArr = function (i) {
                if (i == -1) {
                    if (that.errorUrls.length > 0) {
                        var names = [];
                        $.each(that.errorUrls, function (s, k) {
                            names.push(k.MAPNAME);
                        });
                        if (that.isAlertError) {
                            var str = "服务[" + names.join(",") + "]不可用,请检查!";
                            top.layer.open({
                                type: 1,
                                area: ['300px', 'auto'],
                                shadeClose: true, //点击遮罩关闭
                                content: '<div style="padding:20px;">' + str + '<br>(本页面2分钟内不再提示)</div>'
                            });
                            that.msgTimeOut();
                        }
                    }
                    return;
                }
                var v = mapArr[i];
                var layerId = v.layerId || new Date().getTime();
                var scale = false;
                if (v.SCALE) {
                    scale = v.SCALE.split(",");
                }
                var visible = true;
                if (v.visible === false) {
                    visible = false;
                }

                var nulayerParam = {
                    layerId: layerId,
                    mapUrl: v.MAPURL,
                    scale: scale,
                    layers: v.LAYERINDEX,
                    isBaseMap: v.isBaseMap || false,
                    zIndex: v.zIndex || 0,
                    visible: visible
                };

                //加载当前图层
                var isAddOver = that.addLayer(nulayerParam);
                if (!isAddOver) { //加载失败
                    that.errorUrls.push(v);
                }
                i--;
                foreachArr(i);
            };
            //开始加载
            foreachArr(mapArr.length - 1);
        };
        that.getLayerById = function (layerId) {
            //根据layerId获取当前图层
            var nulayer = false;
            for (var i = 0; i < that.NULayers.length; i++) {
                if (that.NULayers[i].layerId == layerId) {
                    nulayer = that.NULayers[i];
                }
            }
            return nulayer;
        };
        var init = function () {
            //初始化的时候设置4个绘画图层
            window.NUSourceLayer1 = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [],
                }),
                name: "NUSourceLayer1",
                zIndex: 99991
            });
            window.NUSourceLayer2 = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [],
                }),
                name: "NUSourceLayer2",
                zIndex: 99992
            });
            window.NUSourceLayer3 = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [],
                }),
                name: "NUSourceLayer3",
                zIndex: 99993
            });
            window.NUSourceLayer4 = new ol.layer.Vector({
                source: new ol.source.Vector({
                    features: [],
                }),
                name: "NUSourceLayer4",
                zIndex: 99994
            });

            var mzxZoom = 25;
            if (linkage) { //传值时表示 不联动
                that._mapView = new ol.View({
                    projection: "EPSG:4326",
                    center: that.center,
                    zoom: that.zoom,
                    minZoom: 4,
                    maxZoom: mzxZoom,
                    extent: [-180, -90, 180, 90]
                });
            } else {
                if (window._mapView) {
                    that._mapView = window._mapView;
                } else {
                    that._mapView = new ol.View({
                        projection: "EPSG:4326",
                        center: that.center,
                        zoom: that.zoom,
                        minZoom: 4,
                        maxZoom: mzxZoom,
                        extent: [-180, -90, 180, 90]
                    });
                    window._mapView = that._mapView;
                }
            }
            that.createMapObject();
        };
        init();
    };

    //输出接口
    exports('LayerManager', LayerManager);
});
