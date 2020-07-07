/**
 * 量测长度或面积
 * @param {Object} obj
 */
var draw; //绘制控件对象
var sketch; //当前绘制的要素
//创建测量工具提示框（tooltip）
var measureTooltipElement;
var measureTooltip;
var wgs84Sphere;
var marker;
var _wktParser;
var scope = null;  //当前绘制的要素范围

         
function initModify(){
	wgs84Sphere = new ol.Sphere(6378137);
	_wktParser = new ol.format.WKT();
	Modify.init(); //初始化几何图形修改控件
	Modify.setActive(false);//激活修改要素控件
	
}

function initModify1(){
	Modify.init(); //初始化几何图形修改控件
	Modify.setActive(true);//激活修改要素控件
	
}

function mapclear() {
	scope = null;
	//设置鼠标样式
	$("#map").css("cursor", "default");
	source = new ol.source.Vector();
	vector.setSource(source);
//	$(".tooltipbar-static").css("display", "none");
	//移除交互事件
	_mapObject.removeInteraction(draw);
	if(marker){
		_mapObject.removeOverlay(marker);
	}
	if(_vector){
    	_mapObject.removeLayer(_vector);
    }
	$(".tooltipbar").html("");//清除测量文字
	$(".ctfxfwmj").html("").hide();
}

function measure(obj) {
	//设置鼠标样式
	$("#map").css("cursor", "default");
	//移除交互事件
	_mapObject.removeInteraction(draw);
	source = new ol.source.Vector();
	vector.setSource(source);
	var type = (obj.id == "area" ? "Polygon" : "LineString");
	draw = new ol.interaction.Draw({
		source: source, //测量绘制层数据源
		type: (type), //几何图形类型
//		style: new ol.style.Style({ //测量几何图形的样式
//			fill: new ol.style.Fill({
//				color: "rgba(255,255,255,0.2)"
//			}),
//			stroke: new ol.style.Stroke({
//				color: "rgba(0,0,0,0.5)",
//				lineDash: [10, 10],
//				width: 2
//			}),
//			image: new ol.style.Circle({
//				radius: 5,
//				stroke: new ol.style.Stroke({
//					color: "rgba(0,0,0,0.7)",
//				}),
//				fill: new ol.style.Fill({
//					color: "rgba(255,255,255,0.2)"
//				})
//			})
//		})
	});
	_mapObject.addInteraction(draw);
	//创建测量提示工具
	createMeasureTooltip();
	var listener;
	//绑定交互绘制工具开始绘制事件
	draw.on("drawstart", function(evt) {
		sketch = evt.feature; //绘制的要素
		var tooltipCoord = evt.coordinate; //绘制的坐标
		//绑定change事件，根据绘制几何类型得到测量长度或面积
		//并将其设置到测量工具提示框中进行显示
		listener = sketch.getGeometry().on("change", function(evt) {
			var geom = evt.target;
			var output;
			if(geom instanceof ol.geom.Polygon) {
				//输出面积
				output = formatArea(geom);
				tooltipCoord = geom.getInteriorPoint().getCoordinates();
			} else if(geom instanceof ol.geom.LineString) {
				//输出长度
				output = formatLength(geom);
				tooltipCoord = geom.getLastCoordinate();
			}
			//将测量值设置到测量工具提示框中进行显示
			measureTooltipElement.innerHTML = output;
			//设置测量工具提示框的显示位置
			measureTooltip.setPosition(tooltipCoord);
		}, this);
	});
	//绑定交互绘制工具结束绘制束事件
	draw.on("drawend", function(evt) {
		var geom=evt.feature.getGeometry();
		measureTooltipElement.className = "tooltipbar tooltipbar-static";
		measureTooltip.setOffset([0, -7]);
		sketch = null;
		measureTooltipElement = null;
		createMeasureTooltip();
		ol.Observable.unByKey(listener);
		
	}, this);
}
function createMeasureTooltip() {
	if(measureTooltipElement) {
		measureTooltipElement.parentNode.removeChild(measureTooltipElement);
	}
	measureTooltipElement = document.createElement("div");
	measureTooltipElement.className = "tooltipbar tooltipbar-measure";
	measureTooltip = new ol.Overlay({
		element: measureTooltipElement,
		offset: [0, -15],
		positioning: "bottom-center"
	});
	_mapObject.addOverlay(measureTooltip);
}

/**
 * 测量长度
 * @param {Object} line
 */
function formatLength(line) {
	var length;
	//解析线的坐标
	var coordinates = line.getCoordinates();
	length = 0;
	//地图数据源投影坐标系
	var sourceProj = _mapObject.getView().getProjection();
	//通过遍历坐标计算两点之间的距离，进而得到整条线的长度
	for(var i = 0, ii = coordinates.length - 1; i < ii; ++i) {
		var c1 = ol.proj.transform(coordinates[i], sourceProj, "EPSG:4326");
		var c2 = ol.proj.transform(coordinates[i + 1], sourceProj, "EPSG:4326");
		length += wgs84Sphere.haversineDistance(c1, c2);
	}
	var output;
	if(length > 1000) {
		//换算成千米
		output = (Math.round(length / 1000 * 100) / 100) + "千米";
	} else {
		output = (Math.round(length * 100) / 100) + "米";
	}
	return output;
}
/**
 * 测量面积输出
 * @param {Object} polygon
 */
function formatArea(polygon) {
	var area;
	//地图数据源投影坐标系
	var sourceProj = _mapObject.getView().getProjection();
	//将多边形要素坐标投影为EPSG:4326
	var geom = (polygon.clone().transform(sourceProj, "EPSG:4326"));
	//解析多边形的坐标值
	var coordinates = geom.getLinearRing(0).getCoordinates();
	//计算面积
	area = Math.abs(wgs84Sphere.geodesicArea(coordinates));
	var output;
	if(area > 1000000) {
		//换算成平方千米
		output = (Math.round(area / 1000000 * 100) / 100) + "平方千米";
	} else {
		output = (Math.round(area * 100) / 100) + "平方米";
	}
	return output;
}



function drawGraphical(type) {
	mapclear();
	delModify();
//	$("#queryFruitlength").html("");
//  $("#queryFruit").html("");
//  $(".result-find-box").hide();
	if(type !== "None") {
		if(source == null) {
			source = new ol.source.Vector({
				wrapX: false
			});
			vector.setSource(source);
		}
		var geometryFunction, maxPoints;
		if(type === "Square") {
			debugger;
			type = "Circle";
			geometryFunction = ol.interaction.Draw.createRegularPolygon(4);
		} else if(type == "Box") {
			type = "LineString";
			maxPoints = 2;
			geometryFunction = function(coordinates, geometry) {
				if(!geometry) {
					geometry = new ol.geom.Polygon(null);
				}
				var start = coordinates[0];
				var end = coordinates[1];
				geometry.setCoordinates([
					[start, [start[0], end[1]], end, [end[0], start[1]], start]
				]);
				return geometry;
			};
		}
		//实例化绘制对象并添加到地图容器中
		draw = new ol.interaction.Draw({
			source: source,
			type: type,
			geometryFunction: geometryFunction,
			maxPoints: maxPoints,
			
		});
		_mapObject.addInteraction(draw);
		draw.on("drawend", function(evt) {
			_mapObject.removeInteraction(draw);
			var polygon = evt.feature.getGeometry();
//			var center = polygon.getCenter();
//			var radius = polygon.getRadius();
            scope = polygon;
//			scope = polygon.getExtent();
			var flatCoordinates = polygon.flatCoordinates;
			var points1 = getPoints(flatCoordinates);
		    var area1 = PolygonArea(points1,points1.length-1);
		    $(".ctfxfwmj").html("项目范围面积"+(area1/1000000).toFixed(2)+"km²").show();
//	        var Coordinatesstr = "";
//	        for (var i=0;i<flatCoordinates.length;i=i+2) {
//	        	if(i!=0){
//	        		Coordinatesstr+=";"
//	        	}
//	        	Coordinatesstr+=flatCoordinates[i]+","+flatCoordinates[i+1];
//	        }
//	        var features = hssl.getSource().getFeaturesInExtent(extent); //先缩小feature的范围
//	        query(extent,roadType,keyType,keyValue);
			
		}, this);
	} else {
		source = null;
		vector.setSource(source);
	}
}

function getPoints(flatCoordinates){
	var points1 = [];
    for (var i=0;i<flatCoordinates.length;i=i+2) {
    	var lon = flatCoordinates[i];
    	var lat = flatCoordinates[i+1];
        var point = {
			x:Number(lon),
			y:Number(lat)
		}
        point = BL2XY(point);		
		points1.push(point);
          
    }
    return points1;
}


var Modify = {
    init: function () {
        //初始化一个交互选择控件,并添加到地图容器中
        this.select = new ol.interaction.Select();
        _mapObject.addInteraction(this.select);
        //初始化一个交互编辑控件，并添加到地图容器中
        this.modify = new ol.interaction.Modify({
            features: this.select.getFeatures()//选中的要素
        });
        _mapObject.addInteraction(this.modify);
        //设置几何图形变更的处理
        this.setEvents();
    },
    setEvents: function () {
        var selectedFeatures = this.select.getFeatures(); //选中的要素
        //添加选中要素变更事件
        this.select.on('change:active', function () {
            selectedFeatures.forEach(selectedFeatures.remove, selectedFeatures);
        });
    },
    setActive: function (active) {
        this.select.setActive(active);//激活选择要素控件
        this.modify.setActive(active);//激活修改要素控件
    }
};



function delModify(){
	Modify.setActive(false);//激活修改要素控件
}


function insidePolygon(points, testPoint){
        var x = testPoint[0], y = testPoint[1];
        var inside = false;
        for (var i = 0, j = points.length - 1; i < points.length; j = i++) {
            var xi = points[i][0], yi = points[i][1];
            var xj = points[j][0], yj = points[j][1];
 
            var intersect = ((yi > y) != (yj > y))
                    && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
}
 

/**
 *  判断一个点是否在圆的内部
 *  @param point  测试点坐标
 *  @param circle 圆心坐标
 *  @param r 圆半径
 *  返回true为真，false为假
 *  */
function pointInsideCircle(point, circle, r) {
    if (r===0) return false
    var dx = circle[0] - point[0]
    var dy = circle[1] - point[1]
    return dx * dx + dy * dy <= r * r
}

//衡水bl转xy
function BL2XY(point){
	var m_aAxis = 6378137.0;
	var m_bAxis = 6356752.314140356;
	var m_X = point.y;
	var m_Y = point.x;
	var m_dbMidLongitude = 115.50;
	var m_xOffset = 0.0;
	var m_yOffset = 500000.0;
	var x = 0.0;
	var y = 0.0;
    //角度到弧度的系数
    var dblD2R = Math.PI / 180;           

    //代表e的平方
    var e1 = (Math.pow(m_aAxis, 2) - Math.pow(m_bAxis, 2)) / Math.pow(m_aAxis, 2);
    //代表e'的平方
    var e2 = (Math.pow(m_aAxis, 2) - Math.pow(m_bAxis, 2)) / Math.pow(m_bAxis, 2);

    //a0
    var a0 = m_aAxis * (1 - e1) * (1.0 + (3.0 / 4.0) * e1 + (45.0 / 64.0) * Math.pow(e1, 2) + (175.0 / 256.0) * Math.pow(e1, 3) + (11025.0 / 16384.0) * Math.pow(e1, 4));
    //a2                
    var a2 = -0.5 * m_aAxis * (1 - e1) * (3.0 / 4 * e1 + 60.0 / 64 * Math.pow(e1, 2) + 525.0 / 512.0 * Math.pow(e1, 3) + 17640.0 / 16384.0 * Math.pow(e1, 4));               
    //a4
    var a4 = 0.25 * m_aAxis * (1 - e1) * (15.0 / 64 * Math.pow(e1, 2) + 210.0 / 512.0 * Math.pow(e1, 3) + 8820.0 / 16384.0 * Math.pow(e1, 4));                
    //a6
    var a6 = (-1.0 / 6.0) * m_aAxis * (1 - e1) * (35.0 / 512.0 * Math.pow(e1, 3) + 2520.0 / 16384.0 * Math.pow(e1, 4));                
    //a8
    var a8 = 0.125 * m_aAxis * (1 - e1) * (315.0 / 16384.0 * Math.pow(e1, 4));
    ////纬度转换为弧度表示
    //B
    var B = m_X * dblD2R;
    //l
    var l = (m_Y - m_dbMidLongitude) * dblD2R;
    ////X
    var X = a0 * B + a2 * Math.sin(2.0 * B) + a4 * Math.sin(4.0 * B) + a6 * Math.sin(6.0 * B) + a8 * Math.sin(8.0 * B);
    //
    var ll = Math.pow(Math.cos(B), 2) * e2;
    var c = m_aAxis * m_aAxis / m_bAxis;
    //N
    var N = c /Math.sqrt(1 + ll);
    //t
    var t = Math.tan(B);                                
    var p = Math.cos(B) * l;     
               
    var dbx = X + N * t * (1 + ((5.0 - t * t + (9.0 + 4.0 * ll) * ll) + ((61.0 + (t * t - 58.0) * t * t + (9.0 - 11.0 * t * t) * 30.0 * ll) + (1385.0 + (-31111.0 + (543 - t * t) * t * t) * t * t) * p * p / 56.0) * p * p / 30.0) * p * p / 12.0) * p * p / 2.0;                

    var dby;                
    dby = N * (1.0 + ((1.0 - t * t + ll) + ((5.0 + t * t*(t * t - 18.0 - 58.0 * ll) + 14 * ll) + (61.0 + (-479.0 + (179.0 - t * t) * t * t) * t * t) * p * p / 42.0) * p * p / 20.0) * p * p / 6.0) * p;

    x = dbx + m_xOffset;
   
    y = dby + m_yOffset;      
    var xyPoint = {
    	x:x,
    	y:y
    }
    return xyPoint;
}


//----------------------
var eps = 1e-8;
function dcmp(x)
{
    if(x > eps) return 1;
    return x < -eps ? -1 : 0;
}

function cross( a, b, c) ///叉积
{
    return (a.x-c.x)*(b.y-c.y)-(b.x-c.x)*(a.y-c.y);
}

function intersection( a, b, c, d)
{
    var p={
        x:0.0,
        y:0.0
    } 
    p.x = a.x;
    p.y = a.y;
    var t =((a.x-c.x)*(c.y-d.y)-(a.y-c.y)*(c.x-d.x))/((a.x-b.x)*(c.y-d.y)-(a.y-b.y)*(c.x-d.x));
    p.x +=(b.x-a.x)*t;
    p.y +=(b.y-a.y)*t;
    return p;
}

//计算多边形面积,默认首尾闭合
function PolygonArea( p,n)
{
//	var n = p.length;
    if(n < 3) return 0.0;
    var s = p[0].y * (p[n - 1].x - p[1].x);
    p[n].x = p[0].x;
    p[n].y = p[0].y;
    for(var i = 1; i < n; ++ i)
        s += p[i].y * (p[i - 1].x - p[i + 1].x);
    return Math.abs(s * 0.5);
}

function CPIA( a,  b, na, nb)//ConvexPolygonIntersectArea
{
//	var na = a.length-1;
//	var nb = b.length-1;
    var p = [];
    var tmp = [];
    var tn, sflag, eflag;
    a[na].x = a[0].x;
    a[na].y = a[0].y;
    b[nb].x = b[0].x;
    b[nb].y = b[0].y;
    for(var i = 0;i<20;i++)
    {
    	var point1 = {
    		x:0.0,
    		y:0.0,
    	}
    	p.push(point1);
    	var point2 = {
    		x:0.0,
    		y:0.0,
    	}
    	tmp.push(point2);
    }   
    for(var i = 0;i<4;i++)
    {
    	p[i].x = b[i].x;
    	p[i].y = b[i].y;
    }   
    
    for(var i = 0; i < na && nb > 2; i++)
    {
        sflag = dcmp(cross(a[i + 1], p[0],a[i]));
        for(var j = tn = 0; j < nb; j++, sflag = eflag)
        {
            if(sflag>=0){
            	tmp[tn].x = p[j].x;
            	tmp[tn].y = p[j].y;
            	tn++;
            } 
            eflag = dcmp(cross(a[i + 1], p[j + 1],a[i]));
            if((sflag ^ eflag) == -2)            
                tmp[tn++] = intersection(a[i], a[i + 1], p[j], p[j + 1]); ///求交点
        }
        p=[];
        for(var k=0;k<tn;k++)
        {
        	var pointTmp = {
        		x:tmp[k].x,
        		y:tmp[k].y
        	}
        	p.push(pointTmp);        	
        }      
        if(tn>0){
	        var pointTmp2 = {
	        	x:p[0].x,
	        	y:p[0].y
	        }
	        p.push(pointTmp2);
        }
        else
        {
        	var temp = 0.0;
        }
        nb = tn;
    }
    if(nb < 3) return 0.0;
    return PolygonArea(p,nb);
}
function SPIA( a,  b, na, nb)///SimplePolygonIntersectArea 调用此函数
{
//	var na = a.length-1;
//	var nb = b.length-1;
    var i, j;
    var t1=[];
    var t2=[];
    for(var i = 0;i<4;i++){
    	var point1 = {
    	    x:0.0,
    	    y:0.0
        }
    	t1.push(point1);
    	var point2 = {
    	    x:0.0,
    	    y:0.0
        }
    	t2.push(point2);
    }
    
    var res = 0;
    var num1;
    var num2;
    t1[0].x = a[0].x,t1[0].y = a[0].y;
    t2[0].x = b[0].x,t2[0].y = b[0].y;
    for(var i = 2; i < na; i++)
    {
        t1[1].x = a[i-1].x;
        t1[1].y = a[i-1].y;
        t1[2].x = a[i].x;
        t1[2].y = a[i].y;
        num1 = dcmp(cross(t1[1], t1[2],t1[0]));
        if(num1 < 0) 
        {
        	//swap(t1[1], t1[2]);
        	var point1 = {
        		x:t1[1].x,
        		y:t1[1].y
        	}        	
        	t1[1].x = t1[2].x;
        	t1[1].y = t1[2].y;
        	t1[2].x = point1.x;
        	t1[2].y = point1.y;
        }
        for(var j = 2; j < nb; j++)
        {
            t2[1].x = b[j - 1].x;
            t2[1].y = b[j - 1].y;
            t2[2].x = b[j].x;
            t2[2].y = b[j].y;
            num2 = dcmp(cross(t2[1], t2[2],t2[0]));
            if(num2 < 0)
            {   
            	var point2 = {
        			x:t2[1].x,
        			y:t2[1].y
        		}               	
        		t2[1].x = t2[2].x;
        		t2[1].y = t2[2].y;
        		t2[2].x = point2.x;
        		t2[2].y = point2.y;
            }
            res += CPIA(t1, t2,3,3) * num1 * num2;
        }
    }
    return res;
}