# Oenlayers4 POPUP弹出框工具封装

针对ol4的封装的弹出层空间，调用只需一行代码 popup.tooltip(info,position).

效果图：
![popup效果](https://gitee.com/uploads/images/2018/0606/112834_bef21c51_146738.png "QQ图片20180606112747.png")

调用代码：

` 
    //初始化
  var popup = new Popup(map);`
 
`  
 //弹出框
  popup.tooltip(info , position);
`

点击地图弹出鼠标点击当前位置代码：

`
    
      var popup = new Popup(map);
      
      
      //下面对鼠标点击时间进行监听
       map.on('click', function(evt) {
    	   var position = map.getEventCoordinate(evt.originalEvent);
    	    
    	 
    	   popup.tooltip(position , position);
      });
`


demo 可以参考[index.html](https://gitee.com/jjxliu306/ol_extension/blob/master/tool/popup/index.html)

[http://47.98.238.202:8000/ol_extension/tool/popup/](http://47.98.238.202:8000/ol_extension/tool/popup/)


