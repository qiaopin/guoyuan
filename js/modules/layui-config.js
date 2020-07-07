//全局变量
rootPath = getRootPath_web() + "/";//项目根目录
baseUrl = "http://110.249.159.46:8089/gtkjghTest/";//请求地址根目录

//引入layui模块化方法
layui.config({
    version: true,//不缓存页面
    base: rootPath + '/js/modules/'//自定义layui组件的目录
}).extend({ //设定组件别名
    ljfBase: 'commonJS/ljfBase',//公共基础模块
    md5: 'commonJS/md5',
    xml2json: 'commonJS/xml2json',
    bluebird: 'commonJS/bluebird.min',
    LayerManager: 'commonJS/LayerManager',//地图对象基础模块
    NULayer: 'commonJS/NULayer',//地图图层基础模块
    nicescroll: 'commonJS/nicescroll',//首页左侧菜单滚动条模块
    getDate: 'commonJS/getDate',//日期
    treetable: 'treetable-lay/treetable',
    serverCenter: 'serverCenter',
    resource: 'resourceCenter/resource',
});

function getRootPath_web() {
    //获取当前网址，如： http://localhost:8083/uimcardprj/share/meun.jsp
    var curWwwPath = window.document.location.href;
    //获取主机地址之后的目录，如： uimcardprj/share/meun.jsp
    var pathName = window.document.location.pathname;
    var pos = curWwwPath.indexOf(pathName);
    //获取主机地址，如： http://localhost:8083
    var localhostPaht = curWwwPath.substring(0, pos);
    //获取带"/"的项目名，如：/uimcardprj
    var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    return (localhostPaht + projectName);
}