//工具条
var maptool = {
    layerManager: null,
    source: null,
    vector: null,
    mapObj: null,
    draw: null,
    wgs84Sphere: null,
    measureTooltip: null,
    marker: null,
    measureTooltipElement: null,
    sketch: null,//当前绘制的要素
    _wktParser: null,
    init: function (layerManager) {
        this.layerManager = layerManager;
        this.mapObj = layerManager._mapObject;
        this.wgs84Sphere = new ol.Sphere(6378137);
        this._wktParser = new ol.format.WKT();
    },
    measure: function (obj) {
        if (!this.vector) {
            this.source = new ol.source.Vector();
            this.vector = new ol.layer.Vector({
                source: maptool.source,
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
            this.mapObj.addLayer(this.vector);
        }
        document.getElementById("map").style.cursor = "default";
        //移除交互事件
        if (maptool.draw) {
            maptool.mapObj.removeInteraction(maptool.draw);
        }
        var type = (obj == "area" ? "Polygon" : "LineString");
        maptool.draw = new ol.interaction.Draw({
            source: maptool.source, //测量绘制层数据源
            type: (type), //几何图形类型
        });
        maptool.mapObj.addInteraction(maptool.draw);
        //创建测量提示工具
        this.createMeasureTooltip();
        var listener;
        //绑定交互绘制工具开始绘制事件
        maptool.draw.on("drawstart", function (evt) {
            maptool.sketch = evt.feature; //绘制的要素
            var tooltipCoord = evt.coordinate; //绘制的坐标
            //绑定change事件，根据绘制几何类型得到测量长度或面积
            //并将其设置到测量工具提示框中进行显示
            listener = maptool.sketch.getGeometry().on("change", function (evt) {
                var geom = evt.target;
                var output;
                if (geom instanceof ol.geom.Polygon) {
                    //输出面积
                    output = maptool.formatArea(geom);
                    tooltipCoord = geom.getInteriorPoint().getCoordinates();
                } else if (geom instanceof ol.geom.LineString) {
                    //输出长度
                    output = maptool.formatLength(geom);
                    tooltipCoord = geom.getLastCoordinate();
                }
                //将测量值设置到测量工具提示框中进行显示
                maptool.measureTooltipElement.innerHTML = output;
                //设置测量工具提示框的显示位置
                maptool.measureTooltip.setPosition(tooltipCoord);
            }, this);
        });
        //绑定交互绘制工具结束绘制束事件
        maptool.draw.on("drawend", function (evt) {
            var geom = evt.feature.getGeometry();
            maptool.measureTooltipElement.className = "tooltipbar tooltipbar-static";
            maptool.measureTooltip.setOffset([0, -7]);
            maptool.sketch = null;
            maptool.measureTooltipElement = null;
            maptool.createMeasureTooltip();
            ol.Observable.unByKey(listener);
        }, this);
    },
    createMeasureTooltip: function () {
        if (maptool.measureTooltipElement) {
            maptool.measureTooltipElement.parentNode.removeChild(maptool.measureTooltipElement);
        }
        maptool.measureTooltipElement = document.createElement("div");
        maptool.measureTooltipElement.className = "tooltipbar tooltipbar-measure";
        this.measureTooltip = new ol.Overlay({
            element: maptool.measureTooltipElement,
            offset: [0, -15],
            positioning: "bottom-center"
        });
        this.mapObj.addOverlay(maptool.measureTooltip);
    },
    formatArea: function (polygon) {
        var area;
        //地图数据源投影坐标系
        var sourceProj = maptool.mapObj.getView().getProjection();
        //将多边形要素坐标投影为EPSG:4326
        var geom = (polygon.clone().transform(sourceProj, "EPSG:4326"));
        //解析多边形的坐标值
        var coordinates = geom.getLinearRing(0).getCoordinates();
        //计算面积
        area = Math.abs(maptool.wgs84Sphere.geodesicArea(coordinates));
        var output;
        if (area > 1000000) {
            //换算成平方千米
            output = (Math.round(area / 1000000 * 100) / 100) + "平方千米";
        } else {
            output = (Math.round(area * 100) / 100) + "平方米";
        }
        return output;
    },
    formatLength: function (line) {
        var length;
        //解析线的坐标
        var coordinates = line.getCoordinates();
        length = 0;
        //地图数据源投影坐标系
        var sourceProj = maptool.mapObj.getView().getProjection();
        //通过遍历坐标计算两点之间的距离，进而得到整条线的长度
        for (var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
            var c1 = ol.proj.transform(coordinates[i], sourceProj, "EPSG:4326");
            var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, "EPSG:4326");
            length += maptool.wgs84Sphere.haversineDistance(c1, c2);
        }
        var output;
        if (length > 1000) {
            //换算成千米
            output = (Math.round(length / 1000 * 100) / 100) + "千米";
        } else {
            output = (Math.round(length * 100) / 100) + "米";
        }
        return output;
    },
    clear: function () {
        if (this.vector) {
            this.source.clear();
            this.mapObj.removeLayer(this.vector);
            this.vector = null;
        }

        maptool.mapObj.removeInteraction(maptool.draw);
        if (maptool.marker) {
            maptool.mapObj.removeOverlay(maptool.marker);
        }
        $(".tooltipbar").html("");

        try {
            maptool.mapObj.removeLayer(_vector);
        } catch (e) {

        }
    },
    allover: function () {
        var lon = this.layerManager.center[0];
        var lat = this.layerManager.center[1];
        var zoom = this.layerManager.zoom;
        var Extent = [lon, lat];
        var _mapView = maptool.mapObj.getView();
        _mapView.setCenter(Extent);//单点定位
        _mapView.setZoom(zoom);
    }
};

