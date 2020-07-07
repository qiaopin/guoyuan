# JS解析shapefile并在地图加载演示

为了解决SHP文件上传过程中用户需要预览，或者shp小文件需要进行实时加载，后端解析太频繁的问题。现在可以通过HTML5的方式直接读取本地文件，将解析的二进制流按照shp 和dbf的格式读取后按照ol的规范拼装features并加载图层。

###  **程序主要的几个点有：** 
** 1.  本地文件读取：** 

借助H5的FileReader，可以轻松读取本地的文件（前提是在input type=file中已经加载）。

 **html:** 

```
<input type="file" id="shpFile"> <br>
```

 **JS:** 
```
var file=document.getElementById("shpFile");
var reader = new FileReader();
//将文件以二进制形式读入页面
reader.readAsBinaryString(file);
reader.onload=function(){
     var fileData = this.result ; //fileData就是读取到的文件的二进制数据
}

```

 ** FileReader接口的方法** 


<table style="width: 100%" border="1" cellspacing="1" cellpadding="1">
<tbody>
<tr><th scope="col">方法名</th><th scope="col">参数</th><th scope="col">描述</th></tr>
</tbody>
<tbody>
<tr>
<td>readAsBinaryString</td>
<td>file</td>
<td>将文件读取为二进制编码</td>
</tr>
<tr>
<td>readAsText</td>
<td>file,[encoding]</td>
<td>将文件读取为文本</td>
</tr>
<tr>
<td>readAsDataURL</td>
<td>file</td>
<td>将文件读取为DataURL</td>
</tr>
<tr>
<td>abort</td>
<td>(none)</td>
<td>终端读取操作</td>
</tr>
</tbody>
</table>

 **FileReader接口事件** 

FileReader接口包含了一套完整的事件模型，用于捕获读取文件时的状态。

<table style="width: 100%" border="1" cellspacing="1" cellpadding="1">
<tbody>
<tr>
<td>事件</td>
<td>描述</td>
</tr>
<tr>
<td>onabort</td>
<td>中断</td>
</tr>
<tr>
<td>onerror</td>
<td>出错</td>
</tr>
<tr>
<td>onloadstart</td>
<td>开始</td>
</tr>
<tr>
<td>onprogress</td>
<td>正在读取</td>
</tr>
<tr>
<td>onload</td>
<td>成功读取</td>
</tr>
<tr>
<td>onloadend</td>
<td>读取完成，无论成功失败</td>
</tr>
</tbody>
</table>




 **2. shp解析** 

借助开源 shapefile 的js解析库，我们可以轻松的解析shp，dbf这些数据格式。

[https://github.com/mbostock/shapefile](https://github.com/mbostock/shapefile)


 **3. DBF独立解析** 

  参考demo：[ dbf.html](https://gitee.com/jjxliu306/ol_extension/blob/master/tool/shapefile/dbf.html)


 **

### 公网demo可以参考：
** 

 **SHP解析** 

[http://211.159.185.23:8000/ol_extension/shapefile](http://211.159.185.23:8000/ol_extension/shapefile/) 

本地demo参见 [index.html ](https://gitee.com/jjxliu306/ol_extension/edit/master/tool/shapefile/index.html)

 **DBF独立解析**  
[http://211.159.185.23:8000/ol_extension/shapefile/dbf.html](http://211.159.185.23:8000/ol_extension/shapefile/dbf.html)

本地demo参见 [dbf.html ](https://gitee.com/jjxliu306/ol_extension/edit/master/tool/shapefile/dbf.html)



