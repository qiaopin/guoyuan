/**
 * 显示底图、违法图斑、县界
 * @type {null}
 */

var ljfBase = null;
var slider = null;
var layuiform = null;
var layuitable = null;
var layerManager = null;
var source = null;

var dataFromLayer, tbFromLayer;

var sourceClues = null;//采集的面信息
var vectorClues = null;//采集的面图层
var _mapObject, _mapView, _wktParser = null;

var encoding = "GBK";// UTF-8
var shpData, dbfData;
var map;
var fLayer;
var loadStatus = false;

var fxDataFrom = "kx";//tb卫片图斑 kx shape数据 txt数据
var shapeFeatures = [];//上传shape文件获取到的features
var txtFeature = null;//上传的txt的文件获取到的feature;暂时只支持上传一个闭合文件
var currentFeatures = [];//当前要分析的features

layui.use(['form', 'element', 'laydate', 'table', 'slider', 'ljfBase', 'LayerManager', 'NULayer', 'bluebird'], function () {
    var $ = layui.jquery;
    var element = layui.element;
    layuiform = layui.form;
    layuitable = layui.table;
    slider = layui.slider;
    ljfBase = layui.ljfBase;
    var xml2json = layui.xml2json;
    var LayerManager = layui.LayerManager;
    var NULayer = layui.NULayer;

    $("#xzqTool").click(function () {
        $(".xzqSearchBox").toggle();
    });

    var init = function () {
        var LayerManager = layui.LayerManager;
        var center = [116.04915, 39.7929];
        layerManager = new LayerManager("map", center, 13);
        _mapObject = layerManager._mapObject;
        _mapView = _mapObject.getView();
        _wktParser = new ol.format.WKT();

        //加载所有底图
        layerManager.loadMapArr(ljfBase.baseMapArr);
        //默认加载矢量图层
        ljfBase.changeBaseMap("sl");
        maptool.init(layerManager);
        popup = new Popup(_mapObject);

        //初始化对比数据源
        initDataFrom();
    }();

    //初始化对比数据源
    function initDataFrom() {
        var dataFromArr = [
            {
                name: "地类图斑",
                url: "http://124.193.79.18:6080/arcgis/rest/services/ZHSQQLH/地类图斑/MapServer"
            }
        ];
        var str = "";
        $.each(dataFromArr, function (i, v) {
            str += '<option value="' + v.url + '">' + v.name + '</option>';
        });
        $("#dataFrom").html(str);
        layuiform.render();
    }

    window.showFromLayer = function () {
        var mapUrl = $("#dataFrom").val();
        var layerName = $("select#dataFrom option:selected").text();
        var dataLayer = {
            mapUrl: mapUrl,
            layerName: layerName,
            layerId: 'dataFrom',
            zIndex: 1
        };
        layerManager.addLayer(dataLayer);
        // _mapView.fit(_mapObject.getExtent(), _mapObject.getSize());
        var fullExtent = ljfBase.getServiceData(mapUrl).fullExtent;
        _mapView.fit([fullExtent.xmin, fullExtent.ymin, fullExtent.xmax, fullExtent.ymax], _mapObject.getSize());
    };

    window.removeFromLayer = function () {
        layerManager.removeLayerById("dataFrom");
    };

    //切换对比数据源
    layuiform.on('select(dataFrom)', function (data) {
        var data = data.value;
        top.dataFormType = data;
        layuiform.render();
    });

    //监听选项卡切换
    element.on('tab(docDemoTabBrief)', function (data) {
        // console.log(data.index); //得到当前Tab的所在下标
        fxDataFrom = this.dataset.type;
    });

    /**
     * TODO 上传shape文件进行分析
     * @type {string}
     */
    map = layerManager._mapObject;
    fLayer = window.NUSourceLayer3;
//弹出dialog封装
    popup = new Popup(map);
//map 监听点击事件
    map.on('click', function (evt) {
        if (evt.dragging) {
            return;
        }
        var pixel = map.getEventPixel(evt.originalEvent);

        var feature = map.forEachFeatureAtPixel(pixel, function (feature) {
            return feature;
        });//查询方式有很多

        if (feature) {
            var str = '<table style="background: white;color: black;z-index: 1000000; font-size: 12px;">';
            var f_properties = feature.getProperties();
            console.log(f_properties);
            // for (var key in f_properties) {
            //     str += '<tr>' +
            //         '<td style="width:80px;">' + key + '&nbsp;:&nbsp; </td>' +
            //         '<td> ' + f_properties[key] + '</td>' +
            //         '</tr>';
            // }
            // str += '</table>';
            //
            // var position = map.getEventCoordinate(evt.originalEvent);
            // popup.tooltip(str, position);
        } else {
            popup.tooltip(null, null);
        }
    });

    window.doParseShp = function () {
        shpData = null;
        dbfData = null;
        loadStatus = false;
        popup.tooltip(null, null);

        var shpFile = document.getElementById("shpFile").files[0];
        var dbfFile = document.getElementById("dbfFile").files[0];

        // var maxNum = document.getElementById('maxNum').value;
        var maxNum = 111111111111111111;
        if (!maxNum) {
            alert('最大展示条数不能为空');
            return;
        }
        if (!shpFile) {
            alert('shp文件不能为空');
            return;
        }
        if (!dbfFile) {
            alert('DBF文件不能为空');
            return;
        }

        //通过HTML5 读取本地文件数据流
        var readDbf = new FileReader();
        readDbf.readAsArrayBuffer(dbfFile, encoding);//读取文件的内容

        var readShp = new FileReader();
        readShp.readAsArrayBuffer(shpFile, encoding);//读取文件的内容

        //SHP
        readShp.onload = function () {
            shpData = this.result;
            loadData(parseInt(maxNum));
        };
        //DBF
        readDbf.onload = function () {
            dbfData = this.result;
            loadData(parseInt(maxNum));
        }
    };

    function loadData(maxNum) {
        if (!dbfData || !shpData || loadStatus) {
            return;
        }
        loadStatus = true;
        //var shapefile = new shapefile();
        shapeFeatures = [];
        var index = 0;
        shapefile.open(shpData, dbfData, {encoding: encoding}).then(source => source.read().then(
            function next(result) {
                if (result.done || maxNum == index) {
                    layerReloadFeatures(shapeFeatures);
                    return;
                }

                var geometry = result.value.geometry;
                console.log(JSON.stringify(geometry.coordinates));
                var propreties = result.value.properties;

                var f = createFeature(geometry, propreties);
                if (f) {
                    shapeFeatures.push(f);
                }
                index++;
                return source.read().then(next);
            }
        ))
    }

    function layerReloadFeatures(features) {
        fLayer.getSource().clear();
        fLayer.getSource().addFeatures(features);
        var extent = fLayer.getSource().getExtent();
        if (extent) {
            map.getView().fit(extent, map.getSize());
        }
    }

    /**
     * 根据shp解析出来的数据创建一个ol4 的feature
     */
    function createFeature(geometry, properties) {

        var type = geometry.type;
        var geom;

        if (type == 'Polygon') {
            geom = new ol.geom.Polygon(geometry.coordinates);
        } else if (type == 'Point') {
            geom = new ol.geom.Point(geometry.coordinates);
        } else if (type == 'LineString') {
            geom = new ol.geom.LineString(geometry.coordinates);
        } else if (type == 'MultiPolygon') {
            geom = new ol.geom.MultiPolygon(geometry.coordinates);
        } else if (type == 'MultiPoint') {
            geom = new ol.geom.MultiPoint(geometry.coordinates);
        } else if (type == 'MultiLineString') {
            geom = new ol.geom.MultiLineString(geometry.coordinates);
        }

        if (!geom) return null;
        var feature = new ol.Feature({
            geometry: geom
        });

        //属性
        for (var key in properties) {
            feature.set(key, properties[key]);
        }

        return feature;
    }

    window.inputChange = function (input) {
        txtFeature = null;
        //支持chrome IE10
        if (window.FileReader) {
            var file = input.files[0];
            filename = file.name.split(".")[0];
            var reader = new FileReader();
            reader.onload = function () {
                console.log(this.result);
                var text = "POLYGON((" + this.result + "))";
                _wktParser = new ol.format.WKT();
                txtFeature = _wktParser.readFeature(text);
            };
            reader.readAsText(file);
        } else {
            layer.alert("请切换到谷歌浏览器或360的急速模式下打开");
        }
    };

    window.showTextFeature = function () {
        if (txtFeature) {
            fLayer.getSource().clear();
            fLayer.getSource().addFeature(txtFeature);
            var extent = fLayer.getSource().getExtent();
            if (extent) {
                map.getView().fit(extent, map.getSize());
            }
        } else {
            layer.alert("没有获取到闭合的坐标数据");
        }
    };

    top.dataFormType = "SD";//数据源 三调数据 二调数据
    top.fxType = "dl";

    window.fullScreen = function () {//全屏显示地图
        if ($("#fullBtn").hasClass("active")) {//取消全屏
            $(".left").show();
            $(".right").attr("style", "");
        } else {//全屏
            $(".left").hide();
            $(".right").attr("style", "width:100%;left:0;");
        }
        _mapObject.updateSize();
        $("#fullBtn").toggleClass("active");
    };

//点击分析按钮
    $("#analysis").click(function () {
        //清空结果table
        $("#tbody_tb").html("");

        if (fxDataFrom == "tb") {
            var BH = $("#DLBH").val();
            if (!BH) {
                layer.msg("请先选择图斑");
            }
            $("#tbody_tb").html("");
            $("#totalAreaTd").html("");
            var Features = sourceClues.getFeatures();
            for (var i = 0; i < Features.length; i++) {
                if (Features[i].get("BH") == BH) {
                    showFeatureInfo(Features[i]);
                    var polygon = Features[i].getGeometry();
                    var extent = polygon.getExtent();
                    flatCoordinates = polygon.flatCoordinates;
                    // DBwftb(extent);
                    var feature = Features[i];
                    fxByFeature(feature);
                }
            }
        } else if (fxDataFrom == "shape") {
            if (shapeFeatures.length == 0) {
                layer.alert("请先导入shape数据");
            } else if (shapeFeatures.length == 1) {
                var feature = shapeFeatures[0];
                fxByFeature(feature);
            } else {
                // shape数据中包含多个feature;
                var select = new ol.interaction.Select({
                    condition: ol.events.condition.click,
                    toggleCondition: ol.events.condition.click
                });
                _mapObject.addInteraction(select);
                select.on('select', function (eve) {
                    if (eve.deselected.length > 0) {
                        //取消选择
                        var deselectFeature = eve.deselected[0];
                        $.each(currentFeatures, function (i, v) {
                            if (v == deselectFeature) {
                                currentFeatures.splice(i, 1);
                            }
                        })
                    } else {
                        //选择
                        var selectFeature = eve.selected[0];
                        var isHave = false;
                        $.each(currentFeatures, function (i, v) {
                            if (v == selectFeature) {
                                isHave = true;
                            }
                        });
                        if (!isHave) {
                            currentFeatures.push(selectFeature);
                        }
                    }
                    console.log(currentFeatures);
                });

                if (currentFeatures.length == 0) {
                    layer.msg("请先点击选择要分析的图斑");
                } else {
                    var myCombinedFeature = toMulti(currentFeatures);
                    fxByFeature(myCombinedFeature);
                }
            }
        } else if (fxDataFrom == "txt") {
            if (!txtFeature) {
                layer.alert("请先导入txt数据");
            } else {
                var feature = txtFeature;
                fxByFeature(feature)
            }
        }
    });

//合并多个polygon到multiPolygon
    function toMulti(features) {
        // add Polygons to a MultiPolygon
        var mutil = new ol.geom.MultiPolygon();
        $.each(features, function (i, v) {
            mutil.appendPolygon(v.getGeometry());
        });
        var myCombinedFeature = new ol.Feature({
            geometry: mutil,
            name: 'My MutilPolygon'
        });
        return myCombinedFeature;
    }

//根据单个feature 进行分析
    function fxByFeature(feature) {
        var scope = feature.getGeometry();
        var mapUrl;
        var layerName;

        // if (top.dataFormType == "SD") {
        //     mapUrl = "http://110.249.159.46:6080/arcgis/rest/services/DLTB/SD" + feature.get("XZQDM") + "2019/MapServer";
        // } else if (top.dataFormType == "ED") {
        //     mapUrl = "http://110.249.159.46:6080/arcgis/rest/services/ZYSJ/DLTBED/MapServer";
        // }
        mapUrl = $("#dataFrom").val();
        layerName = $("#dataFrom option:selected").text();

        $.each(layerManager.NULayers, function (i, v) {
            if (!v.isBaseMap) {
                v.setVisible(false);
            }
        });

        if (mapUrl && ljfBase.isServerRuning(mapUrl)) {
            if(!layerManager.getLayerById('dataFrom')){
                var dataLayer = {
                    mapUrl: mapUrl,
                    layerName: layerName,
                    layerId: 'dataFrom',
                    zIndex: 1
                };
                layerManager.addLayer(dataLayer);
            }
            query(scope, top.fxType, mapUrl);
        } else {
            layer.close(layer.loadIndex);
            layer.alert("未找到对应的地图服务");
        }
    }

//选择分析类型
    $(".changeTypeBox").on("click", "button", function () {
        $(".changeTypeBox button").attr("class", "layui-btn layui-btn-primary");
        $(this).attr("class", "layui-btn layui-btn-noraml");
        var type = $(this).attr("data-type");
        top.fxType = type;
    });
});