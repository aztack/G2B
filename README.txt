			Google Map to Baidu Map 迁移工具说明
                               aztack@163.com
0) 变更记录
version 0.1
	- 修正GLatLngBounds无参数初始化加了坐标偏移的问题
	- 增加GIcon拷贝构造时更新image,iconSize,iconAnchor,infoWindowAnchor属性到实现
	- 修正GMarker构造时options的icon属性没有正确设置的问题

1) G2B介绍
	G2B是什么?
		G2B是一个适配层脚本。它使用百度地图API实现了“部分”谷歌地图API的接口
		通过加载G2B脚本,用户可以通过无需或少量修改已有map应用,做到从google map api
		迁移到baidu map api

	G2B不是什么?
		G2B不是完整的谷歌地图API的实现。由于谷歌地图API的接口类、函数非常多。
		在编写G2B时无法一一实现。所以采用了“案例驱动”的编写模式：逐个实现
		
		http://code.google.com/apis/maps/documentation/javascript/v2/examples/index.html
		
		中的实例功能。目前已经支持“去哪儿”网地图应用的迁移。

	G2B实现难点
		适配层编写的困难指出就是要处理上下两层(google map api和baidu map api)之间的差异。
		具体体现在坐标系统、事件处理、框架结构方面。

2) G2B的实现
	为什么没有选择继承?
		最初的确尝试过通过继承BMap中对应类，并重写部分函数的实现方法。
		但是这种方法有个明显的问题：名字冲突。比如
		GLatLng中有两个方法用于获得对应的经纬度坐标值lng()和lat()。
		但是在对应的BMap.Point中lng和lat是两个属性。
		所以放弃了这种实现方法
	
	实现方法
		最终G2B选择了聚合的实现方式：将具体实现保存在一个名为_impl的属性中。
		然后在实现的谷歌接口函数中调用_impl中对应的方法。
	
	Klass帮助类 - 元编程
		百度地图API和谷歌地图API中存在很多函数名和功能完全一致或相似的情况。
		为了避免大量重复代码，并能做到同意修改。在G2B前面部分实现了一个名为Klass
		的帮助类。比如如果某个类的函数名和语义完全一样。那么调用Klass的same方法自动生成
		一个同名函数绑定到对_impl的调用上。如toString方法:
		
			Klass("GLatLng",function(lat,lng),[BMap.Point])
			.same("toString")
			.end();
			
		其中GLatLng为要实现的谷歌接口。后面接构造函数；第三个参数标明该接口对应百度地图
		API中的BMap.Point。然后二者有一个名字和功能相同的函数“toString”；end表示定义结束。
		
		当二者有功能相同但是名字不同的函数时，可以使用alias来声明别名:
		
			Klass("GMarker",function(...){...},[])
			.alias("openInfoWindowHtml","openInfoWindow")
			.end();
		
		上面代码中，openInfoWindow是BMap.Marker的方法，它和GMarker的openInfoWindowHtml功能相同.
		
		当百度地图API没有对应实现时（比如GMap.enableRotation），那么使用noimpl标明没有对应实现.
		
	事件
		谷歌地图和百度地图采用了完全不同的事件注册机制。前者使用GEvent注册事件处理函数。
		后者采用与W3C标准一致的addEventListener/removeEventListener方法注册、注销事件处理函数
		在G2B中实现了一个与GEvent功能一样的对象。
		
	事件派发
		由于实现的差异，二者的事件处理函数的参数完全不同。为了适配这个差异，G2B在调用事件处理函数
		之前进行了“翻译”。详见EVENT_SINGNATUR和translateEventArgs。
		目前只实现了必要的几个核心类的事件处理。
		translateEventArgs抽象了这些类的事件的共同处。是一个泛化的处理函数。如果今后需要增加
		更多的事件翻译，可以通过直接判断对象和事件的类型调用相应的翻译代码进行翻译。
		
	常量定义
		使用Const函数定义常量:Const("Const_Name",value);
		
	坐标偏移
		目前坐标偏移采用线性偏移。
		进行偏移的原则是：
			a)所有进入GXXX函数的坐标都认为是谷歌坐标。进入函数后用TO_BLNG和TO_BLAT转换为百度坐标。
			b)所有传出GXXX函数的坐标都认为是谷歌坐标。返回之前用TO_GLNG和TO_GLAT转换为谷歌坐标
			c)在G2B的实现函数内部，对_impl之间的调用不需要转换，都是百度坐标

	用于预处理器生成不同的代码（可选）
		默认情况下TO_BLNG/TO_BLAT/TO_GLNG/TO_GLAT都是函数。
		如果传入的参数全部已经预先转换为百度坐标（也就是说不需要进行线性偏移）
		那么可以将上述几个函数改写为直接返回传入的参数不进行偏移。
		为了避免这个无意义的函数调用的开销。可以打开给g2b.h中的
		#define __GOOGLE__
		然后按照g2b.o.js头部的命令用c++预处理器将上述偏移函数去掉。
		
3) 局限性
	功能的局限性
		由于采用的是“案例驱动”的编写方式，所以只实现了谷歌实例的大部分功能和“去哪儿”网
		迁移需要的功能。如果需要其他功能还需要继续完善G2B。
		
	坐标偏移
		由于各种原因无法做到谷歌和百度坐标之间的精确双向转换。
		目前只能做到线性偏移转换，偏移导致的误差最大在70米

	G2B只是一个迁移解决方案。还是希望用户可以主动去了解、使用百度地图API
