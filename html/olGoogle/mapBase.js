//经纬度转百度墨卡托
function wgs84ToBD09(point, success) {
    //地图中心点
    var bdAK = "UcZTZgE5ucaWESXDzAREI1U2aGa52hLw";
    //经纬度转百度墨卡托
    var bdUrl = "http://api.map.baidu.com/geoconv/v1/?coords=" + point[0] + "," + point[1] + "&from=1&to=6&ak=" + bdAK;
    $.ajax({
        type: "get", //请求方式
        url: bdUrl,
        async: false,
        //请求成功后的回调函数
        success: function (res) {
            var point = res.result[0];
            x = point.x;
            y = point.y;
            var resPoint = [x, y];
            return success(resPoint);
        }
    });
}

//设置地图禁止双击放大
function setDoubleClickZoom(map, canSize) {
    var pan;
    map.getInteractions().forEach(function (element, index, array) {
        if (element instanceof ol.interaction.DoubleClickZoom) {
            pan = element
        }
    });
    pan.setActive(canSize);
}


//谷歌地形
var googleLayerDX = new ol.layer.Tile({
    source: new ol.source.XYZ({
        // url:'http://www.google.cn/maps/vt?lyrs=t@189&gl=cn&x={x}&y={y}&z={z}'
        url: 'http://www.google.cn/maps/vt?lyrs=t@189&x={x}&y={y}&z={z}'
    })
});

//谷歌影像
var googleLayerYX = new ol.layer.Tile({
    source: new ol.source.XYZ({
        // url:'http://mt0.google.cn/maps/vt?lyrs=s@773&gl=cn&x={x}&y={y}&z={z}'
        url: 'http://mt0.google.cn/maps/vt?lyrs=s@773&x={x}&y={y}&z={z}'
    })
});

var googleLayerZJ = new ol.layer.Tile({
    source: new ol.source.XYZ({
        // url:'http://www.google.cn/maps/vt?lyrs=h@189&gl=cn&x={x}&y={y}&z={z}'
        url: 'http://www.google.cn/maps/vt?lyrs=h@189&x={x}&y={y}&z={z}'
    })
});

//谷歌矢量
var googleLayerSL = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
    })
});

var googleMapLayer0623 = new ol.layer.Tile({
    source: new ol.source.XYZ({
        url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
    })

});

var googleMapLayer = new ol.layer.Tile({
    source: new ol.source.XYZ({
        // url:'http://www.google.cn/maps/vt?lyrs=t@189&gl=cn&x={x}&y={y}&z={z}'
        // url: 'http://www.google.cn/maps/vt/pb=!1m4!1m3!1i{z}!2i{x}!3i{y}!2m3!1e0!2sm!3i380072576!3m8!2szh-CN!3scn!5e1105!12m4!1e68!2m2!1sset!2sRoadmap!4e0!5m1!1e0'
        url: 'http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}'
    })
});

function changeBaseMapType(type) {
    // baiduMapLayer.setVisible(false);
    // baiduRasterLayer.setVisible(false);
    // baiduMapLayerLabel.setVisible(false);
    // if (type == "sl") {
    //     baiduMapLayer.setVisible(true);
    // } else if (type == "yx") {
    //     baiduRasterLayer.setVisible(true);
    //     baiduMapLayerLabel.setVisible(true);
    // }
}

//截图
function saveImage(target) {
    var readBlobAsDataURL = function (blob, callback) {
        var a = new FileReader();
        a.onload = function (e) {
            callback(e.target.result);
        };
        a.readAsDataURL(blob);
    };

    var SaveAs = function (dataurl, type, name) {
        var link = document.createElement("a");
        var exportName = name ? name : 'data';
        link.href = dataurl;
        link.download = exportName + "." + type;
        link.click();
    };

    html2canvas(document.getElementById(target)).then(
        function (canvas) {
            canvas.toBlob(function (ttt) {
                // debugger
                readBlobAsDataURL(ttt, function (dataurl) {
                    var name = "map";
                    SaveAs(dataurl, "png", name);
                })
            });
        });
}

/**
 *
 * @param type
 <option value="None">无</option>
 <option value="Point">点</option>
 <option value="LineString">线</option>
 <option value="Polygon">多边形</option>
 <option value="Circle">圆</option>
 <option value="Square">正方形</option>
 <option value="Box">长方形</option>
 * @param map 地图对象
 * @param success 返回一个feature
 */
function mapDraw(type, map, success) {//绘图
    var addDrewSource = function (source, map) {
        if (source) {
            source.clear();
        } else {
            source = new ol.source.Vector();
            var vector = new ol.layer.Vector({
                source: source,
                style: new ol.style.Style({
                    fill: new ol.style.Fill({
                        color: "rgba(255,255,255,0.2)"
                    }),
                    stroke: new ol.style.Stroke({
                        color: "#ffcc33",
                        width: 2
                    }),
                    image: new ol.style.Circle({
                        radius: 7,
                        fill: new ol.style.Fill({
                            color: "#ffcc33"
                        })
                    })
                }),
            });
            map.addLayer(vector);
        }
    };

    //创建临时绘图层
    var source = null;
    addDrewSource(source, map);
    var typeValue = type;
    var maxPoints;
    if (typeValue === 'Square') {                 //正方形
        typeValue = 'Circle';               //设置绘制类型为Circle
        //设置几何信息变更函数，即创建正方形
        geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
    } else if (typeValue === 'Box') {              //长方形
        typeValue = 'LineString';           //设置绘制类型为LineString
        maxPoints = 2;                      //设置最大点数为2
        //设置几何信息变更函数，即设置长方形的坐标点
        geometryFunction = function (coordinates, geometry) {
            if (!geometry) {
                geometry = new ol.geom.Polygon(null);       //多边形
            }
            var start = coordinates[0];
            var end = coordinates[1];
            geometry.setCoordinates([
                [
                    start,
                    [start[0], end[1]],
                    end,
                    [end[0], start[1]],
                    start
                ]
            ]);
            return geometry;
        };
    }

    //实例化图形绘制控件对象并添加到地图容器中
    var draw = new ol.interaction.Draw({
        source: source,
        type: typeValue,                                //几何图形类型
        geometryFunction: geometryFunction,             //几何信息变更时的回调函数
        maxPoints: maxPoints                            //最大点数
    });
    map.addInteraction(draw);

    //绑定交互绘制工具开始绘制事件
    draw.on("drawstart", function (evt) {
        var sketch = evt.feature; //绘制的要素
    });
    //绑定交互绘制工具结束绘制束事件
    draw.on("drawend", function (evt) {
        map.removeInteraction(draw);
        return success(evt.feature);
    });
}

//初始化面图层
function initPolygonLayer(map) {
    var polygonLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [],
        }),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255,255,255,0.2)"
            }),
            stroke: new ol.style.Stroke({
                color: "#ffcc33",
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: "#ffcc33"
                })
            })
        }),
        name: "polygonLayer",
        zIndex: 10
    });
    map.addLayer(polygonLayer);
    return polygonLayer;
}

//初始化点图层
function initPointLayer() {
    var pointLayer = new ol.layer.Vector({
        source: new ol.source.Vector({
            features: [],
        }),
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: "rgba(255,255,255,0.2)"
            }),
            stroke: new ol.style.Stroke({
                color: "#ffcc33",
                width: 2
            }),
            image: new ol.style.Circle({
                radius: 7,
                fill: new ol.style.Fill({
                    color: "#ffcc33"
                })
            })
        }),
        name: "pointLayer",
        zIndex: 11
    });
    map.addLayer(pointLayer);
    return pointLayer;
}

//编辑节点 返回拖动后的features数据
function modify(editSource, map, end) {
    // 创建一个Modify控件
    try {
        var modify = new ol.interaction.Modify({
            source: editSource
        });
        // 将Modify控件加入到Map对象中
        map.addInteraction(modify);
        modify.on('modifyend', function (evt) {
            var fs = evt.features.array_; //拖动后的数组
            return end(evt.features);
        });
    } catch (e) {

    }
}