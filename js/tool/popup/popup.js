/*
	刘玉峰  jjxliu306@163.com
	2018-05-05
*/

//点击后高亮下方的feature 并且弹出popup信息做展示
Popup = function (map) {
    this.map = map;

    //添加一个popup的div
    var div = document.createElement("div");
    div.id = 'popup';
    div.className = 'ol-popup';
    div.innerHTML = ' <a href="#" id="popup_closer" class="ol-popup-closer"></a>  ' +
        '  <div id="popup_content"></div>  ';

    document.body.appendChild(div);

    var overlay = new ol.Overlay({
        element: div,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }/* ,
		   offset:[0,-45]*/
    });
    map.addOverlay(overlay);
    //扔到map里 后面方便调用
    this.popup = overlay;

    document.getElementById('popup_closer').onclick = function () {
        overlay.setPosition(undefined);
        //$('#popup_closer').blur();
        if (window.LightVector) {
            _source = window.LightVector.getSource();
            _source.clear();
        }
        return false;
    };
};


/**
 * 泡泡显示信息
 * @param _info 气泡内容
 * @param _position 气泡显示的位置 [lon,lat]
 */
Popup.prototype.tooltip = function (_info, _position) {
    document.getElementById('popup_content').innerHTML = _info;
    //设置popup的位置
    this.popup.setPosition(_position);
};
 
 