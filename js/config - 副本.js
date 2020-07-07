var baseUrl = "http://110.249.159.46:8089/";
var config = {
	ip:"http://110.249.159.46:8089/gtkjghTest",
	SurveyUserManagerService: "http://110.249.159.46:8089/gtkjghTest/SurveyUserManagerService.asmx",
	SurveyUserManagerService2: baseUrl +"gtkjghTest/SurveyUserManagerService2.asmx",
	JCTBStatisticsManagerService: baseUrl+"gtkjghTest/JCTBStatisticsManagerService.asmx",
	JKTBSummaryManagerService: "http://110.249.159.46:8089/gtkjghTest/JKTBSummaryManagerService.asmx",
	WorkManagerService: "http://110.249.159.46:8089/gtkjghTest/WorkManagerService.asmx",
	WorkManagerService2: baseUrl+"gtkjghTest/WorkManagerService.asmx",
	LocationMonitorManager: baseUrl+"gtkjghTest/LocationMonitorManager.asmx",
	OrbitWebService: "http://110.249.159.46:8089/gtkjghTest/OrbitWebService.asmx",
	UserManagerService: "http://110.249.159.46:8089/gtkjghTest/UserManagerService.asmx",
    LogManagerServices: baseUrl + "gtkjghTest/LogManagerServices.asmx",
    ConfigManagerServices: baseUrl + "gtkjghTest/ConfigManagerService.asmx",
    MapResourceManagerService: baseUrl + "gtkjghTest/MapResourceManagerService.asmx",
    DataResourceManagerService: baseUrl + "gtkjghTest/DataResourceManagerService.asmx",
    DocResourceManagerService: baseUrl + "gtkjghTest/DocResourceManagerService.asmx",
    ResourceManagerService:"http://110.249.159.46:8089/gtkjghTest/ResourceManagerService.asmx",
    MonitorManagerService:"http://110.249.159.46:8089/gtkjghTest/MonitorManagerService.asmx",
    RoleManagerService:"http://110.249.159.46:8089/gtkjghTest/RoleManagerService.asmx",
    JCTBManagerService:"http://110.249.159.46:8089/gtkjghTest/JCTBManagerService.asmx",
    JudgeManagerService:"http://110.249.159.46:8089/gtkjghTest/JudgeManagerService.asmx",
};
//var esrilayerUrl = {
//	XZT: "http://124.205.115.26:6080/arcgis/services/ZHJX/XZT/MapServer/WMSServer",
//	RLT: "http://124.205.115.26:6080/arcgis/services/ZHJX/RLT/MapServer/WMSServer",
//	
//}
var esrilayerUrl = {
	CTJC:"http://124.205.115.26:6080/arcgis/services/WY/CTJC/MapServer/WMSServer",//冲突检测
	LDL: "http://124.205.115.26:6080/arcgis/rest/services/ZHJX/LDL/MapServer",
	WYDLTB:"http://124.205.115.26:6080/arcgis/services/WY/WYDLTB/MapServer/WMSServer",//地类图斑
}
var querylayerUrl = {
	CTJC:"http://124.205.115.26:6080/arcgis/rest/services/WY/CTJC/MapServer",//冲突检测
	WYDLTB: "http://124.205.115.26:6080/arcgis/rest/services/WY/WYDLTB/MapServer",
}
config.nav = [
    {'name':'业务办理','menu':[
      {'name':'数据申请办理','submenu':[
         {'name':'代办任务','id':'','url':'SJSQBL.html','iconclass':'layui-icon layui-icon-login-wechat','warnconut':'2'},
         {'name':'已办任务','id':'','url':'','iconclass':'layui-icon layui-icon-login-weibo','warnconut':''},
      ]},
      {'name':'服务申请办理','submenu':[
         {'name':'代办任务','id':'','url':'Apicture.html','iconclass':'layui-icon layui-icon-fire','warnconut':'3'},
         {'name':'已办任务','id':'','url':'','iconclass':'layui-icon layui-icon-find-fill','warnconut':''},
      ]},
      {'name':'服务注册办理','submenu':[
         {'name':'代办任务','id':'','url':'Apicture.html','iconclass':'layui-icon layui-icon-snowflake','warnconut':''},
         {'name':'已办任务','id':'','url':'','iconclass':'layui-icon layui-icon-template-1','warnconut':'8'},
      ]},
      {'name':'服务注销办理','submenu':[
         {'name':'代办任务','id':'','url':'Apicture.html','iconclass':'layui-icon layui-icon-top','warnconut':'3'},
         {'name':'已办任务','id':'','url':'','iconclass':'layui-icon layui-icon-search','warnconut':''},
      ]},
      {'name':'用户审核','submenu':[
         {'name':'代办任务','id':'','url':'Apicture.html','iconclass':'layui-icon layui-icon-star-fill','warnconut':'3'},
         {'name':'已办任务','id':'','url':'','iconclass':'layui-icon layui-icon-cellphone','warnconut':''},
      ]}
     
    ]},
    {'name':'服务中心','menu':[
      {'name':'服务列表','id':'','url':'homepage.html','iconclass':'layui-icon layui-icon-fire','warnconut':'5','submenu':[]},
      {'name':'服务注册管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-fire','warnconut':'8','submenu':[]},
      {'name':'服务目录管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-cellphone','warnconut':'8','submenu':[]},
      {'name':'服务推荐管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-search','warnconut':'8','submenu':[]},
      {'name':'服务巡检管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-template-1','warnconut':'8','submenu':[]},
      {'name':'数据资源管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-login-weibo','warnconut':'8','submenu':[]},
      {'name':'矢量图层管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-login-wechat','warnconut':'8','submenu':[]},
    ]},
    {'name':'门户管理','menu':[
      {'name':'应用案例管理','id':'','url':'homepage.html','iconclass':'layui-icon layui-icon-fire','warnconut':'5','submenu':[]},
      {'name':'标准规范管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-search','warnconut':'8','submenu':[]},
      {'name':'新闻公告管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-template-1','warnconut':'8','submenu':[]},
      {'name':'在线评论管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-login-weibo','warnconut':'8','submenu':[]},
      {'name':'在线反馈管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-login-wechat','warnconut':'8','submenu':[]},
      {'name':'地图纠错管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-snowflake','warnconut':'8','submenu':[]},
      {'name':'操作日志管理','id':'','url':'resource.html','iconclass':'layui-icon layui-icon-fire','warnconut':'8','submenu':[]},
    ]},
];
//写入cookie
config.setCookie = function(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString() + ";path=/";

};
//读取cookie
config.getCookie = function(name) {
	var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
	if(arr = document.cookie.match(reg))
		return unescape(arr[2]);
	else
		return null;
};
//删除cookie
config.delCookie = function(name) {
	var exp = new Date();
	exp.setTime(exp.getTime() - 1);
	var cval = STAMP_config.getCookie(name);
	if(cval != null)
		document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
};


config.ico={
	icoarr:["A","B","C","D","E","F","G","H","I","G","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"]
}
config.item = [
  {
  	name:"土地利用",
  	cid:"TDLY",
  	items:[
  	   {name:"园地",index:"0",classname:"rode-case4"},
  	   {name:"水域及水利设施用地",index:"1",classname:"rode-case3"},
  	   {name:"其他土地",index:"2",classname:"rode-case3"},
  	   {name:"林地",index:"3",classname:"rode-case5"},
  	   {name:"交通运输用地",index:"4",classname:"rode-case3"},
  	   {name:"耕地",index:"5",classname:"rode-case3"},
  	   {name:"城镇村及工矿用地",index:"6",classname:"rode-case3"},
  	   {name:"草地",index:"7",classname:"rode-case6"},
  	]
  },
  {
  	name:"总体规划",
  	cid:"TDGH",
  	items:[
  	   {name:"基本农田保护区",index:"0",classname:"rode-case3"},
  	   {name:"城市开发边界管制区",index:"1",classname:"rode-case3"},
  	   {name:"有条件建设用地",index:"2",classname:"rode-case3"},
  	   {name:"允许建设区",index:"3",classname:"rode-case3"},
  	]
  },
  
 
]
	

config.item1 = [
   {
  	name:"居住用地",
  	cid:"JZYD",
  	items:[
  	   {name:"一类居住用地",value:"0"},
  	   {name:"二类居住用地",value:"0"},
  	   {name:"三类居住用地",value:"0"},
  	   {name:"四类居住用地",value:"0"},
  	]
  },
  {
  	name:"公共设施用地",
  	cid:"GGSSYD",
  	items:[
  	   {name:"行政办公用地",value:"0"},
  	   {name:"商业金融业用地",value:"0"},
  	   {name:"文化用地",value:"0"},
  	   {name:"体育用地",value:"0"},
  	   {name:"医疗卫生用地",value:"0"},
  	   {name:"教育科研设计用地",value:"0"},
  	   {name:"文物古迹用地",value:"0"},
  	   {name:"其它公共设施用地",value:"0"},
  	]
  },
  {
  	name:"工业用地",
  	cid:"GYYD",
  	items:[
  	   {name:"一类工业用地",value:"0"},
  	   {name:"二类工业用地",value:"0"},
  	   {name:"三类工业用地",value:"0"},  	  
  	]
  },
  {
  	name:"仓储用地",
  	cid:"CCYD",
  	items:[
  	   {name:"普通仓库用地",value:"0"},
  	   {name:"危险品仓库用地",value:"1"},
  	   {name:"堆场用地",value:"2"},
  	]
  },
  {
  	name:"对外交通用地",
  	cid:"DWJTYD",
  	items:[
  	   {name:"铁路用地",value:"0"},
  	   {name:"公路用地",value:"1"},
  	   {name:"管道运输用地",value:"2"},
  	   {name:"港口用地",value:"0"},
  	   {name:"机场用地",value:"1"},
  	]
  },
  {
  	name:"道路广场用地",
  	cid:"DLGCYD",
  	items:[
  	   {name:"道路用地",value:"0"},
  	   {name:"广场用地",value:"1"},
  	   {name:"社会停车场库用地",value:"2"},
  	]
  },
  {
  	name:"市政公用设施用地",
  	cid:"SZGYSSYD",
  	items:[
  	   {name:"供应设施用地",value:"0"},
  	   {name:"交通设施用地",value:"1"},
  	   {name:"邮电设施用地",value:"2"},
  	   {name:"环境卫生设施用地",value:"0"},
  	   {name:"施工与维修设施用地",value:"1"},
  	   {name:"殡葬设施用地",value:"2"},
  	   {name:"其它市政公用设施用地",value:"2"},
  	   
  	]
  },
  {
  	name:"绿地",
  	cid:"LD",
  	items:[
  	   {name:"公共绿地",value:"2"},
  	   {name:"生产防护绿地",value:"2"},
  	]
  },
  {
  	name:"特殊用地",
  	cid:"TSYD",
  	items:[
  	   {name:"军事用地",value:"0"},
  	   {name:"外事用地",value:"1"},
  	   {name:"保安用地",value:"2"},
  	]
  },
  {
  	name:"水域和其它用地",
  	cid:"SYHQTYD",
  	items:[
  	   {name:"水域",value:"0"},
  	   {name:"耕地",value:"1"},
  	   {name:"园地",value:"2"},
  	   {name:"林地",value:"3"},
  	   {name:"牧草地",value:"0"},
  	   {name:"村镇建设用地",value:"1"},
  	   {name:"弃置地",value:"2"},
  	   {name:"露天矿用地",value:"3"},
  	]
  },
]






config.hgsc = {
	"111":{TG:"城镇用地,城镇用地（新增）",CG:"A,A1,A2,A21,A22,A3,A31,A32,A33,A34,A35,A4,A41,A42,A5,A51,A52,A53,A59,A6,A7,A8,H12,H13"},
	"112":{TG:"城镇用地,城镇用地（新增）",CG:"B,B1,B11,B12,B13,B14,B2,B21,B22,B29,B3,B31,B32,B4,B41,B49,B9"},
	"113":{TG:"城镇用地,城镇用地（新增）,农村居民点用地,农村居民点用地（新增）",CG:"R,R1,R2,R3,H14"},
	"114":{TG:"城镇用地,城镇用地（新增）",CG:"M,M1,M2,M3"},
	"115":{TG:"城镇用地,城镇用地（新增）",CG:"W,W1,W2,W3"},
	"116":{TG:"城镇用地,城镇用地（新增）",CG:"S,S1,S2,S3,S4,S41,S42,S9"},
	"117":{TG:"城镇用地,城镇用地（新增）",CG:"U,U1,U11,U12,U13,U14,U15,U16,U2,U21,U22,U23,U3,U31,U32,U9"},
	"118":{TG:"城镇用地,城镇用地（新增）",CG:"G,G3"},
	"121":{TG:"交通水利用地,铁路用地,公路用地,民用机场用地,港口码头用地",CG:"H,H2,H21,H22,H23,H24,H25"},
	"122":{TG:"交通水利用地,水工建筑用地",CG:"H,H3"},
	"123":{TG:"其他独立建设用地,其他独立建设用地（新增）",CG:"H,H3"},
	"130":{TG:"采矿用地",CG:"H,H5"},
	"141":{TG:"特殊用地,特殊用地（新增）",CG:"H,H4,H41,H42"},
	"143":{TG:"特殊用地,特殊用地（新增）",CG:"A,A9"},
	"144":{TG:"特殊用地,特殊用地（新增）",CG:"H,H3"},
	"151":{TG:"其他独立建设用地,其他独立建设用地（新增）",CG:"H,H9"},
	"152":{TG:"其他独立建设用地,其他独立建设用地（新增）",CG:"H,H9"},
	"153":{TG:"其他建设用地,盐田",CG:"H,H5"},
	"211":{TG:"耕地",CG:"E,E2"},"212":{TG:"耕地",CG:"E,E2"},"213":{TG:"耕地",CG:"E,E2"},"221":{TG:"园地",CG:"E,E2"},
	"222":{TG:"园地",CG:"E,E2"},"223":{TG:"园地",CG:"E,E2"},"231":{TG:"其他农用地,设施农用地",CG:"E,E2"},"232":{TG:"其他农用地,农村道路",CG:"E,E2"},
	"233":{TG:"其他农用地,坑塘水平",CG:"E,E1,E13"},
	"234":{TG:"其他农用地,农田水利用地",CG:"E,E1,E13"},
	"241":{TG:"林地",CG:"E,E2"},
	"242":{TG:"林地",CG:"E,E2"},
	"243":{TG:"林地",CG:"E,E2"},
	"244":{TG:"林地",CG:"E,E2"},
	"251":{TG:"牧草地",CG:"E,E2"},
	"252":{TG:"牧草地",CG:"E,E2"},
	"311":{TG:"林地",CG:"E,E2"},
	"312":{TG:"林地",CG:"E,E2"},
	"313":{TG:"林地",CG:"E,E2"},
	"321":{TG:"牧草地",CG:"E,E2"},
	"322":{TG:"牧草地",CG:"E,E2"},
	"331":{TG:"水域",CG:"E,E1,E11"},
	"332":{TG:"水域",CG:"E,E1,E11"},
	"333":{TG:"水域",CG:"E,E1,E11"},
	"334":{TG:"水域",CG:"E,E1,E11"},
	"341":{TG:"水域",CG:"E,E1,E11"},
	"342":{TG:"自然保留地",CG:"E,E9"},
	"351":{TG:"自然保留地",CG:"E,E9"},
	"352":{TG:"自然保留地",CG:"E,E9"},
	"353":{TG:"自然保留地",CG:"E,E9"},
	"354":{TG:"自然保留地",CG:"E,E9"},
	"361":{TG:"城镇用地,城镇用地（新增）",CG:"G,G1"},
	"362":{TG:"牧草地",CG:"G,G2"},	
}