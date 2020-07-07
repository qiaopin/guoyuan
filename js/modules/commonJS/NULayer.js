layui.define(['jquery', 'ljfBase'], function (exports) {
    var $ = layui.$;
    var ljfBase = layui.ljfBase;

    /**
     * 初始化图层
     * @param paramObj layerId、mapUrl 必填
     * @constructor
     */
    var NULayer = function (paramObj) {
        var that = this;
        var _resolutions;
        var _matrixIds;
        var size = 1.40625;
        var mZoom = 18;
        _resolutions = new Array(mZoom);
        _matrixIds = new Array(mZoom);
        for (var z = 0; z < mZoom; z++) {
            _resolutions[z] = size / Math.pow(2, z);
            _matrixIds[z] = z;
        }
        // 属性
        that.layer = false; //openLayers图层
        that.zIndex = paramObj.zIndex || 0;
        that.zoom = paramObj.zoom || 12;
        that.isTopMap = paramObj.isTopMap || false; //是否是最上层的
        that.isBaseMap = paramObj.isBaseMap || false; //是否是底图
        that.isView = true; //当前比例尺下是否显示
        that.visible = paramObj.visible || true; //图层是否显示
        that.opacity = paramObj.opacity || 1; //图层透明度
        that.baseMapType = paramObj.baseMapType || ""; //矢量 地形 影像 空
        that.layerId = paramObj.layerId; //对应地图服务的id *
        that.layerName = paramObj.layerName || ""; //对应地图服务的id *
        that.mapId = paramObj.mapId || ""; //服务id 新增专题服务的时候使用
        that.scale = []; //显示比例尺 string[] 注：当其有值时表示是瓦片地图 默认0-20
        that.mapUrl = paramObj.mapUrl; //服务地址
        that.isTileL = true;//是否是切片地图
        that.layers = paramObj.layers || "0";//要加载服务的图层
        that.mapServiceType = paramObj.mapServiceType || ''; //地图服务类型 WMS.WMTS.MapServer
        that.layerType = 0; //0 表示是底图不能移动位置 1是自己加的图层可以移动位置 2表示拓扑图层不可移动在最上层
        //方法
        that.setOpacity = function (opacity) {
            that.opacity = opacity;
            that.layer.setOpacity(opacity);
        }; //设置地图图片透明度
        that.setVisible = function (visible) { //改变图层显示隐藏
            if (!that.isView) {//在当前比例尺下不显示
                return;
            }
            that.visible = visible;
            that.layer.setVisible(visible);
        };
        that.setView = function (isView) { //不改变that.visible的值
            //设置当前比例尺下 显示隐藏
            that.isView = isView;
            if (isView) {//如果当前比例尺下应该显示
                if (that.visible) {//同时之前是显示状态
                    that.layer.setVisible(true);//设置为显示
                }
            } else {//如果当前比例尺下不应该显示
                that.layer.setVisible(false);
            }
        };
        //设置图层排序
        that.setZIndex = function (zIndex) {
            that.zIndex = zIndex;
            that.layer.zIndex = zIndex;
        };
        that.createLayer = function () { //创建openLayers图层
            var serviceType = ljfBase.getServiceTypeByUrl(that.mapUrl);

            if (serviceType == 'WMTS') { //如果是加载WMTS
                var sourceLayer = that.mapUrl.split('/')[3].split("_c")[0];
                that.layer = new ol.layer.Tile({
                    visible: that.visible,
                    source: new ol.source.WMTS({
                        url: that.mapUrl,
                        layer: sourceLayer,
                        format: "tiles",
                        style: "default",
                        matrixSet: "c",
                        tileGrid: new ol.tilegrid.WMTS({
                            origin: [-180, 90],
                            resolutions: _resolutions,
                            matrixIds: _matrixIds
                        }),
                        projection: "EPSG:4326"
                    }),
                    zIndex: that.zIndex
                });
            } else if (serviceType == 'WMS') {//WMS
                that.layer = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        params: {'LAYERS': that.layers},
                        url: that.mapUrl
                    }),
                    zIndex: that.zIndex
                });
            } else if (serviceType == 'GeoServer') {//GeoServer
                that.layer = new ol.layer.Tile({
                    source: new ol.source.TileWMS({
                        url: that.mapUrl.split('@')[0],
                        params: {
                            'LAYERS': that.layers,
                            'TILED': true   //是否要将数据制作成切片，省略后返回的是一张完整图。
                        },
                        serverType: 'geoserver',
                        projection: "EPSG:4326"
                    }),
                    zIndex: that.zIndex
                });
            } else if (serviceType == 'MapServer') {//MapServer;
                if (that.isTileL) {//如果是切片
                    that.layer = new ol.layer.Tile({
                        source: new ol.source.XYZ({
                            params: {'LAYERS': that.layers},
                            url: that.mapUrl + '/tile/{z}/{y}/{x}',
                            projection: "EPSG:4326"
                        }),
                        zIndex: that.zIndex
                    });
                } else {
                    that.layer = new ol.layer.Tile({
                        source: new ol.source.TileArcGISRest({
                            params: {'LAYERS': 'show:' + that.layers},
                            projection: "EPSG:4326",
                            url: that.mapUrl
                        }),
                        zIndex: that.zIndex
                    });
                }
            } else if (serviceType == 'XYZ') {//XYZ;
                that.layer = new ol.layer.Tile({
                    source: new ol.source.XYZ({
                        url: that.mapUrl
                    }),
                    zIndex: that.zIndex
                });
            }
        };
        var init = function () {
            //初始化方法
            //判断必传参数
            if (!paramObj.layerId) {
                top.layer.alert("新建图层必须传入‘layerId’");
                return;
            }
            if (!paramObj.mapUrl) {
                top.layer.alert("新建图层必须传入‘mapUrl’");
                return;
            }

            //初始化方法 判断是否是瓦片
            ljfBase.isTile(that.mapUrl, function (isTileL) {
                that.isTileL = isTileL;
                //初始化完成后创建图层
                that.createLayer();

                if (paramObj.visible === false) {
                    that.visible = false;
                    that.setVisible(false);
                }

                if (paramObj.opacity) {
                    that.opacity = paramObj.opacity;
                    that.setOpacity(that.opacity);
                }

                //判断当前图层在当前比例尺下是否显示
                if (paramObj.scale) {
                    if (typeof paramObj.scale == "string") {
                        that.scale = paramObj.scale.split(',');
                    } else {
                        that.scale = paramObj.scale;
                    }
                } else {
                    for (var i = 0; i < 26; i++) {//默认0-30
                        that.scale.push(i.toString());
                    }
                }
                if ($.inArray(that.zoom.toString(), that.scale) == -1) {
                    that.isView = false;
                    that.layer.setVisible(false);
                }
            });
        };
        init();
    };
    //输出接口
    exports('NULayer', NULayer);
});
