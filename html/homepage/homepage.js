var mapArr = [
    { //果园村
        layerId: 1003,
        layerName: "房屋",
        mapUrl: "http://110.249.159.46:6080/arcgis/rest/services/GYC/GYCPolygon/MapServer",
        zIndex: 4,
        opacity:0.8,
        layers: 6
    }, { //果园村
        layerId: 1004,
        layerName: "集体",
        mapUrl: "http://110.249.159.46:6080/arcgis/rest/services/GYC/GYCPolygon/MapServer",
        zIndex: 3,
        opacity:0.8,
        layers: 7
    }, { //果园村
        layerId: 1005,
        layerName: "村界",
        mapUrl: "http://110.249.159.46:6080/arcgis/rest/services/GYC/GYCPolygon/MapServer",
        zIndex: 2,
        layers: 5
    }, { //果园村
        layerId: 1006,
        layerName: "国有",
        mapUrl: "http://110.249.159.46:6080/arcgis/rest/services/GYC/GYCPolygon/MapServer",
        zIndex: 1,
        opacity:0.8,
        layers: 8
    },
];

//双击高亮
function lightPolygon(_mapObject, geometry) {
    var _source;
    if (window.LightVector) {
        _source = window.LightVector.getSource();
        _source.clear();
    } else {
        _source = new ol.source.Vector({
            features: []
        });
        window.LightVector = new ol.layer.Vector({ //临时高亮图层
            name: "高亮图层",
            source: _source,
            zIndex: 111,
            style: function (feature, resolution) {
                var a = new ol.style.Style({
                    stroke: new ol.style.Stroke({
                        color: "#4384DB",
                        width: 5
                    }),
                    fill: new ol.style.Fill({
                        color: "rgba(67,132,219,0.7)"
                    })
                });
                return a;
            }
        });

        _mapObject.addLayer(window.LightVector);
    }

    var RINGS = geometry.rings[0];
    var Coordinatesstr = "POLYGON((";
    for (var i = 0; i < RINGS.length; i++) {
        if (i != 0) {
            Coordinatesstr += ",";
        }
        Coordinatesstr += RINGS[i][0] + " " + RINGS[i][1];
    }
    Coordinatesstr += "))";
    var feature = _wktParser.readFeature(Coordinatesstr);

    // var polygon = new ol.geom.Polygon(geometry.rings);
    // var feature = new ol.Feature(polygon);

    // polygon.applyTransform(ol.proj.getTransform('EPSG:4326', 'EPSG:3857'));//面的坐标系转换

    _source.addFeature(feature);
    _mapObject.render();
    // window.LightVector.setVisible(true);
    // _mapObject.getView().fit(_source.getExtent(), _mapObject.getSize());
}

var ZNToCNForm = [
    {zn: "Text", cn: "标注"},
    {zn: "Shape_Area", cn: "占地面积"},
    {zn: "FID", cn: "设施id"},
    {zn: "", cn: "对应主体id"},
    {zn: "", cn: "设施名称"},
    {zn: "", cn: "设施类型"},
    {zn: "", cn: "占地面积"},
    {zn: "", cn: "层数"},
    {zn: "", cn: "建筑面积"},
    {zn: "", cn: "建筑结构"},
    {zn: "", cn: "设施用途"},
];

function getFeaturesByMapUrl(mapUrl) {
    var mapUrl = mapUrl + "/query";
    var features = [];
    var geometryType;
    var data = {
        f: "json",
        outFields: "*",
        where: "1=1",
        returnGeometry: true,
        esriGeometryEnvelope: ""
    };

    $.ajax({
        type: 'get',
        async: false,
        url: mapUrl,
        data: data,
        success: function (xml) {
            var resjosn = $.parseJSON(xml);
            if (resjosn.features.length > 0) {
                features = resjosn.features;
                geometryType = resjosn.geometryType;
            }
        },
        error: function () {
            parent.alert('获取图层信息失败');
        }
    });

    return features;
}