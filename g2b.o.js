/**
 * This is a un-pre-processed javascript file mixed with c/cpp macro
 * run "cpp -P -C g2b.o.js>g2b.cpp.js" to pre-process
 * or  "cl /EP g2b.o.js>g2b.cpp.js
 */
//#include "g2b.h"
(function(_G,CFG){
	if(_G.___G2B___)return;
	//if not silence many exception/error will be threw
	CFG = CFG || {silence:true};

	//#ifndef __INLINE_IMPL_TO_TERNARY__
	var _ = function(o){return o._impl ? o._impl : o;};
	//#endif

	//#ifdef __GOOGLE__
	var TO_BLNG = function(lng){return lng+0.0065;};
	var TO_BLAT = function(lat){return lat+0.0060;};
	var TO_GLNG = function(lng){return lng-0.0065;};
	var TO_GLAT = function(lat){return lat-0.0060;};
	//#endif

	var INTERNAL = function(x)	{return "_"+x+"_";};
	//globals	
	var DEBUG = false,EMPTY_FN = function(){};
	_gprivate = {maps:[],activeMap:null,version:0.1};
	_G.___G2B___ = _gprivate;
	
	//properties updating
	_gprivate.objs = [];
	_gprivate.updateProperties = function(){
		for(var i = 0;i<_gprivate.objs.length;++i){
			_gprivate.objs[i]();
		}
	};
	//var _updateTimer = _G.setInterval(_gprivate.update,1000);
	//_gprivate.stopUpdate = function(){
	//	if(_updateTimer)clearInterval(_updateTimer);
	//};
	
	function _registerUpdater(callback){
		if(callback && typeof(callback)==="function"){
			_gprivate.objs.push(callback);
		}
	}
	
	if(typeof(T)=="undefined"){
		var t = document.createElement("script");
		t.type = "text/javascript";
		t.src = "http://img.baidu.com/js/tangram-base-core-1.3.7.js";
		document.getElementsByTagName("head")[0].appendChild(t);
	}

	function log(message){
		if(DEBUG && _G.console && _G.console.log){
			_G.console.log(message);
		}
	}
	var _$ = DEBUG ? log : EMPTY_FN;

	/**
	 * declare a 'constant' in scope
	 */
	function Const(name,v,scope){
		(scope || _G)[name] = v;
	}
	
	/**
	 * A Wrapper writing helper
	 * simplify wrapper writing, save some meta data
	 * for future use
	 */
	function Klass(name,value,father,inherit){
		if(father && father.length>0){
			if(father.splice){
				father = father[0];
			}
			//base class of current class
			Klass.f = father;
		}
		if(typeof(value)=="function"){
			var fun = value.toString();
			//we want the ctor has a function name not anonymouse
			//_G.eval(fun.replace(/^function/,"function "+name));
			//_G[name] = eval(name);
			
			//exports to global namespace
			_G[name] = value;
			
			//current defining class
			Klass.c = eval(name);
		}else{
			_G[name] = value;
			Klass.c = value;
		}
		//name of current class
		Klass.c.__name__ = name;
		if(inherit){
			Klass.c.prototype = new Klass.f();
		}		
		_$("<class name='"+name+"'>");		
		return Klass;
	}
	var Interface = Klass;
	function Typedef(name,type,scope){
		var t = (scope || _G)[name] = type;
		return t;
	}
	/**
	 * add addEventListener/removeEventListener to class
	 */
	Klass.dispatcher = function(){
		_$("  <method name='addEventListener' />");
		_$("  <method name='removeEventListener' />");
		var that = Klass.c;
		that.prototype.addEventListener = function(){
			this._impl.addEventListener.apply(this._impl,arguments);
		};
		that.prototype.removeEventListener = function(){
			this._impl.removeEventListener.apply(this._impl,arguments);
		};
		return Klass;
	};
	
	/**
	 * add a empty method
	 */
	Klass.dummy = function(){
		for(var i = 0; i < arguments.length; ++i){
			var f = arguments[i];
			_$("  <method type='dummy' name='"+f+"' />");
			Klass.c.prototype[f] = EMPTY_FN;
		}
		return Klass;
	};
	
	/**
	 * if wrapper class's method has the same name and signature and semantics with
	 * _impl then you can generate a proxy function by calling Klass(..).same("fun")
	 */
	Klass.same = function(){
		for(var i = 0; i < arguments.length; ++i){
			var f = arguments[i];
			_$("  <method type='same' name='"+f+"' />");
			(function(f){
				Klass.c.prototype[f] = function(){
					return this._impl[f].apply(this._impl,arguments);				
				};
			})(f);
		}
		return Klass;
	};
	
	/**
	 * method a is an alias of method b
	 */
	Klass.alias = function(a,b){
		Klass.c.prototype[a] = Klass.c.prototype[b];
		return Klass;
	};
	
	/**
	 * implements an method which exits in _impl
	 */
	Klass.reimpl = function(name,fn){
		_$("  <method type='reimp' name='"+name+"' />");
		if(Klass.c.prototype[name]){
			Klass.c.prototype[INTERNAL(name)] = Klass.c.prototype[name];
		}
		Klass.c.prototype[name] = fn;
		return Klass;
	};
	
	/**
	 * implements an method which does not exits in _impl
	 */
	Klass.impl = function(name,fn){
		_$("  <method type='impl' name='"+name+"' />");
		Klass.c.prototype[name] = fn;
		return Klass;
	};
	Klass.override = Klass.impl;
	
	/**
	 * not supported features
	 */
	Klass.noimpl = function(){		
		for(var i = 0;i<arguments.length; ++i){
			var f = arguments[i];
			if(Klass.c.prototype[f]){
				log("! "+f+" has already been defined !");
				continue;
			}
			_$("  <method type='noimpl' name='"+f+"' />");
			(function(f){				
				Klass.c.prototype[f] = function(){
					if(!CFG.silence)
						throw Error(f+" is not implemented!");
				};
			})(f);
		}
		return Klass;
	};
	
	/**
	 * methods of interface
	 */
	Klass.virtual = Klass.noimpl;
	
	/**
	 * static method
	 */
	Klass.statik = function(name,v){
		_$("  <method type='static' name='"+name+"' />");
		if(Klass.c[name]){
			Klass.c[INTERNAL(name)] = Klass.c[name];
		}
		Klass.c[name] = v;
		return Klass;
	};
	
	/**
	 * class constants
	 */
	Klass.konst = Klass.statik;
	
	function $tryget(o,path,v){
		if(typeof(o)==="undefined")return v;
		var props = path.split(".");
		if(props.length===0)return v;
		for(var t = o,i = 0;i<props.length;++i){
			t = t[props[i]];
			if(typeof(t)==="undefined")return v;
		}
		return t;
	}
	/**
	 * attribute accessor
	 */
	Klass.attr_reader = function(name,path){
		Klass.prototype[name] = function(){
			return $tryget(this,path);
		};
		return Klass;
	};
	
	/**
	 * end of a class delcareation
	 */
	Klass.end = function(){
		_$("</class>");
	};
	
	
	/**
	 * event dispatcher for internal use
	 */
	Klass("_IDispatcher",function(){
		this.subscribers = {};
	})
	.impl("addEventListener",function(event,callback){
		var subs = this.subscribers;
		if(!subs[event]){
			subs[event] = [];
		}
		subs.push(callback);
		return callback;
	})
	.impl("removeEventListener",function(event,callback){		
		if(!this.subscribers[event])return false;
		var subs = this.subscribers[event];
		for(var i in subs){
			var c = subs[i];
			if(c!==callback)continue;
			subs.splice(i,1);
			return true;
		}
		return false;
	})
	.impl("dispatch",function(event,e){
		if(!this.subscribers[event])return;
		var subs = this.subscribers[event];
		for(var i in subs){
			var c = subs[i];
			if(typeof(c)!="function")continue;
			c(e);
		}
	})
	.end();

	GLog = {write:log,writeUrl:log,writeHtml:log};
	
	//global constants
	Const("G_API_VERSION",			"340c");
	Const("G_ANCHOR_TOP_LEFT",		BMAP_ANCHOR_TOP_LEFT);
	Const("G_ANCHOR_TOP_RIGHT",		BMAP_ANCHOR_TOP_RIGHT);
	Const("G_ANCHOR_BOTTOM_LEFT",	BMAP_ANCHOR_BOTTOM_LEFT);
	Const("G_ANCHOR_BOTTOM_RIGHT",	BMAP_ANCHOR_BOTTOM_RIGHT);
	
	//TODO! G_*_MAP不是数值常量，而是对象
	Const("G_NORMAL_MAP",BMAP_NORMAL_MAP);
	Const("G_SATELLITE_MAP",BMAP_NORMAL_MAP);
	Const("G_AERIAL_MAP",BMAP_NORMAL_MAP);
	Const("G_HYBRID_MAP",BMAP_NORMAL_MAP);
	Const("G_AERIAL_HYBRID_MAP",BMAP_NORMAL_MAP);
	Const("G_PHYSICAL_MAP",BMAP_NORMAL_MAP);
	Const("G_MAPMAKER_NORMAL_MAP",BMAP_NORMAL_MAP);
	Const("G_MAPMAKER_HYBRID_MAP",BMAP_NORMAL_MAP);
	
	//GGeoStatusCode
	Const("G_GEO_SUCCESS",200);
	Const("G_GEO_BAD_REQUEST",400);
	Const("G_GEO_SERVER_ERROR",500);
	Const("G_GEO_MISSING_QUERY",601);
	Const("G_GEO_MISSING_ADDRESS",601);
	Const("G_GEO_UNKNOWN_ADDRESS",602);
	Const("G_GEO_UNAVAILABLE_ADDRESS",603);
	Const("G_GEO_UNKNOWN_DIRECTIONS",604);
	Const("G_GEO_BAD_KEY",610);
	Const("G_GEO_TOO_MANY_QUERIES",620);
	
	Const("G_MAP_MAP_PANE","mapPane");
	Const("G_MAP_OVERLAY_LAYER_PANE","mapPane");
	Const("G_MAP_MARKER_SHADOW_PANE","markerPane");
	Const("G_MAP_MARKER_PANE","markerPane");
	Const("G_MAP_FLOAT_SHADOW_PANE","floatShadow");
	Const("G_MAP_MARKER_MOUSE_TARGET_PANE","markerMouseTarget");
	Const("G_MAP_FLOAT_PANE","floatPane");
	
	//global function
	GBrowserIsCompatible = function(){
		return true;
	};
	GUnload = EMPTY_FN;


	//basic class
	/**
	 * GLatLng
	 */	

	Klass("GLatLng",function(lat,lng,unbounded){
		//TODO unbounded?see google api doc
		//lat,lng may be a string
		if(typeof(lng)==="string"){
			lng = parseFloat(lng);
		}
		if(typeof(lat)==="string"){
			lat = parseFloat(lat);
		}
		this._impl = new BMap.Point(TO_BLNG(lng),TO_BLAT(lat));
	},[
		BMap.Point
	])
	.reimpl("equals",function(o){
		return this._impl.equals(_(o));
	})
	.impl("lat",function(){
		return TO_GLAT(this._impl.lat);
	})
	.impl("lng",function(){
		return TO_GLNG(this._impl.lng);
	})
	.impl("latRadians",function(){
		//TODO
	})
	.impl("lngRadians",function(){
		//TODO
	})
	.impl("distancFrom",function(other,radius){
		//TODO
	})
	.impl("toUrlValue",function(precision){
		//TODO
	})
	.statik("fromUrlValue",function(latlng){
		var v = latlng.split(",");
		return new GLatLng(Number(v[0]),Number(v[1]));
	})
	.same("toString")
	.end();

	/**
	 * GLatLngBounds
	 */
	Klass("GLatLngBounds",function(sw,ne){
		var swlng = sw ? TO_BLNG(sw.lng()) : 0,
			swlat = sw ? TO_BLAT(sw.lat()) : 0,
			nelng = ne ? TO_BLNG(ne.lng()) : 0,
			nelat = ne ? TO_BLAT(ne.lat()) : 0;
		var _sw = new BMap.Point(swlng,swlat),
			_ne = new BMap.Point(nelng,nelat);
		this._impl = new BMap.Bounds(_sw,_ne);
	},[
		BMap.Bounds	
	])
	.reimpl("equals",function(o){
		return this._impl.equals(_(o));
	})
	.reimpl("getSouthWest",function(){
		var p = this._impl.getSouthWest();
		return new GLatLng(TO_GLAT(p.lat),TO_GLNG(p.lng));
	})
	.reimpl("getNorthEast",function(){
		var p = this._impl.getNorthEast();
		return new GLatLng(TO_GLAT(p.lat),TO_GLNG(p.lng));
	})
	.reimpl("getCenter",function(){
		var p = this._impl.getCenter();
		return new GLatLng(TO_GLAT(p.lat),TO_GLNG(p.lng));
	})
	.impl("containsLatLng",function(latlng){
		return this._impl.containsPoint(_(latlng));
	})
	.reimpl("containsBounds",function(b){
		return this._impl.containsBounds(_(b));
	})
	.reimpl("extend",function(latlng){
		this._impl.extend(_(latlng));
	})
	.reimpl("intersects",function(other){
		return this._impl.intersects(_(other));
	})
	.reimpl("toSpan",function(){
		var p = this._impl.toSpan();
		return new GLatLng(TO_GLAT(p.lat),TO_GLNG(p.lng));
	})
	.noimpl("isFullLat","isFullLng")
	.same("isEmpty")	
	.end();
	/**
	 * GPoint
	 */

	Klass("GPoint",function(x,y){
		this._impl = new BMap.Pixel(x,y);
		this.x = this._impl.x;
		this.y = this._impl.y;
		//sync property?
	},[
		BMap.Pixel
	])
	.reimpl("equals",function(other){
		return this._impl.equal(_(other));
	})
	.impl("toString",function(){//??
		return "("+this._impl.x + "," + this._impl.y+")";
	})
	.konst("ORIGIN",new GPoint(0,0))
	.impl()	
	.end();


	/**
	 * GBounds is a rectangular area of the map in pixel coordinates
	 */
	//TEST
	Klass("GBounds",function(points){
		//NOTICE: max is negtive and min is positive
		// and this make max<min
		this.minX = this.minY = Number.MAX_VALUE;
		this.maxX = this.maxY = -Number.MAX_VALUE;
		var a = arguments;
		if(a.length>=4){
			this.minX = a[0];
			this.minY = a[1];
			this.maxX = a[2];
			this.maxY = a[3];
		}else if(a.length){
			for(var i = 0;i<arguments.length;++i){
				this.extend(arguments[i]);
			}
		}
	},[
		//BMap.Size
	])
	.impl("equals",function(o){
		return this.minX == a.minX 
			&& this.minY == a.minY 
			&& this.maxX == a.maxX 
			&& this.maxY == a.maxY;
	})
	.impl("copy",function(){
		return new GBounds(this.minX,this.minY,this.maxX,this.maxY);
	})
	.impl("mid",function(){
		return new GPoint((this.minX+this.maxX)/2,(this.minY+this.maxY)/2);
	})
	.impl("min",function(){
		return new GPoint(this.minX,this.minY);
	})
	.impl("max",function(){
		return new GPoint(this.maxX,this.maxY);
	})
	.impl("extend",function(p){
	})
	.impl("containsBounds",function(other){
		return this.minX <= a.minX && this.maxX >= a.maxX && this.minY <= a.minY && this.maxY >= a.maxY;
	})
	.impl("containsPoint",function(p){
		return this.minX <= a.x && this.maxX >= a.x && this.minY <= a.y && this.maxY >= a.y;
	})
	.impl("empty",function(){
		return this.minX > this.maxX || this.minY > this.maxY;
	})
	.impl("extend",function(p){
		if(this.empty()){
			this.minX = this.maxX = p.x;
			this.minY = this.maxY = p.h;
		}else{
			this.minX = Math.min(this.minX,p.x);
			this.maxX = Math.max(this.maxX,p.x);
			this.minY = Math.min(this.minX,p.y);
			this.maxY = Math.max(this.maxY,p.y);
		}
	})
	.impl("toString",function(){
		return "(" + this.min() + ", " + this.max() + ")";
	})
	.end();

	/**
	 * GSize
	 */
	Typedef("GSize",BMap.Size).ZERO = new GSize(0,0);

	/**
	 * GMarker
	 */
	Klass("GMarker",function(latlng,opt){
		opt = opt || {};
		options = baidu.object.clone(opt);
		if(options.draggable)options.enableDragging = true;
		if(opt.icon){
			options["icon"] = _(opt.icon) ||new BMap.Icon(opt.icon.image,opt.icon.size);
		}
		this._impl = new BMap.Marker(_(latlng),options);
		if(typeof(opt.zIndexProcess)==="function"){
			var zIndex = opt.zIndexProcess();
			if(!isNaN(zIndex)){
				this._impl.setZIndex(zIndex);
			}
		}
	},[
		BMap.Marker
	])
	.dispatcher()
	.reimpl("openInfoWindow",function(value,opt){
		var infoWindow;
		if(typeof(value)=="string"){
			infoWindow = new BMap.InfoWindow(value);			
		}else{
			//TODO! value is a DOM node
			var t = GXml.value(value);
			infoWindow = new BMap.InfoWindow(t);
		}
		this._impl.openInfoWindow(infoWindow,opt);
	})
	.impl("getLatLng",function(){
		var p = this._impl.getPosition();
		return new GLatLng(TO_GLAT(p.lat),TO_GLNG(p.lng));
	})
	.impl("setLatLng",function(latlng){
		this._impl.setPosition(_(latlng));
	})
	.impl("isHidden",function(){
		return !this._impl.isVisible();
	})
	.alias("openInfoWindowHtml","openInfoWindow")
	.same("show","hide","closeInfoWindow","toString")
	.end();
	
	/**
	 * GMapType
	 */
	Klass("GMapType",function(layers,projection,name,opts){
		if(!opts.impl){
			throw Error("Sorry,you can not create GMapType");
		}
		this._impl = opts.impl;
	})
	.impl("getMinimumResolution",function(){
		return this._impl.zoomLevelMin || this._impl.getMinZoom();
	})
	.impl("getMaximumResolution",function(){
		return this._impl.zoomLevelMax || this._impl.getMaxZoom();
	})
	.impl("getTileSize",function(){
		return this._impl.tileSize || this._impl.getTileSize();
	})
	.noimpl(
		"getSpanZoomLevel","getBoundsZoomLevel","getName","getTileLayers",
		"getMaxZoomAtLatLng","getTextColor","getLinkColor","getErrorMessage",
		"getCopyrights","getAlt","getHeading"
	)
	.end();
	/**
	 * GMap2
	 */
	//百度地图的一些API需要提供当前城市
	//但是Google的不需要。这里保存下所有创建的map实例
	//最好的情况是就一个实例，此时map._city就是当前城市
	//如果有多余一个实例，还要想一个策略设置activeCity
	Klass("GMap2",function(e,opt){
		this._impl = new BMap.Map(e,opt);
		this._config = {enableInfoWindow:true};
		_gprivate.maps.push(this);
		_gprivate.activeMap = this;
	},[
		BMap.Map
	])
	.dispatcher()
	.impl("setCenter",function(center,zoom,type){
		//zoom should not be undefined or zero!
		if(!zoom){
			zoom = this._impl.getZoom();
		}
		this._impl.centerAndZoom(_(center),zoom);
		//尝试得到当前地图所在显示的城市
		this._trySetCurrentCity();
	})
	.reimpl("getCenter",function(){
		var p = this._impl.getCenter();		
		return new GLatLng(TO_GLAT(p.lat),TO_GLNG(p.lng));
	})
	.reimpl("openInfoWindow",function(latlng,value,opt){
		//TODO get html from dom node
		if(!this._config.enableInfoWindow)return;
		var w = new BMap.InfoWindow(value.nodeValue);
		this._impl.openInfoWindow(w,_(latlng));
	})
	.impl("openInfoWindowHtml",function(latlng,html,opt){
		if(!this._config.enableInfoWindow)return;
		var w = new BMap.InfoWindow(html);
		this._impl.openInfoWindow(w,_(latlng));
	})
	.impl("setUIToDefault",function(){
		this._impl.addControl(new BMap.NavigationControl());
	})
	.reimpl("getBounds",function(){
		var b = this._impl.getBounds();
		var sw = b.getSouthWest(),ne = b.getNorthEast();
		return new GLatLngBounds(
			new GLatLng(TO_GLAT(sw.lat),TO_GLNG(sw.lng)),
			new GLatLng(TO_GLAT(ne.lat),TO_GLNG(ne.lng))
		);
	})
	.reimpl("addOverlay",function(o){
		if(!o)return;
		o._initialize && o._initialize(this);
		if(o._impl || o instanceof BMap.Overlay){
			//builtin overlays
			this._impl.addOverlay(_(o));
		}else{
			if(o.redraw && !o.draw){
				//Overlay Manager will call 'draw'
				//when map load/zoomed etc
				o.draw = o.redraw;
			}
			//custom overlays
			o.domElement = o.initialize(this);
			o.draw(true);

			var forceRedraw = function(){o.draw(true);};
			this._impl.addEventListener("moveend",forceRedraw);
			this._impl.addEventListener("zoomend",forceRedraw);
			this._impl.addEventListener("dragend",forceRedraw);
			if(!o._map){
				o._gmap = this;
				o._map = this._impl;
			}
		}
	})
	.reimpl("removeOverlay",function(o){
		this._impl.removeOverlay(_(o));
	})
	.reimpl("addControl",function(c,pos){
		var ctrl = c;
		if(c._impl)ctrl = c._impl;
		pos = pos || {_offset:new BMap.Size(0,0)};
		ctrl.setOffset(pos._offset);
		if(pos._impl)ctrl.setAnchor(_(pos));
		this._impl.addControl(ctrl);
	})
	.reimpl("removeControl",function(c){
		this._impl.removeControl(_(c));
	})
	.reimpl("setMapType",function(type){
		if(type!=BMAP_NORMAL_MAP && type!=BMAP_PERSPECTIVE_MAP){
			throw Error("map type "+type+" is not supported!");
		}
		this._impl.setMapType(type);
	})
	.impl("getCurrentMapType",function(){
		var impl = null,mt = null;
		if(typeof(BMap.MapType)==="function"){
			//1.2
			impl = this._impl.getMapType();
		}else{
			//1.1
			impl = BMap.MapType[this._impl.getMapType()];
		}
		mt = new GMapType(null,null,null,{impl:impl});
		return mt;
	})
	.impl("getMapTypes",function(){
		return [this.getCurrentMapType()];
	})
	.impl("_trySetCurrentCity",function(callback){
		var geo = new BMap.Geocoder(),m = this._impl,that = this;
		geo.getLocation(m.getCenter(),function(result){
			/*
			if(result===null){
				throw Error("Can not get current city!");
			}
			*/
			if(result===null){
				if(typeof(callback)=="function")callback(m,null);
				return;
			}
			that._city = result.addressComponents.city;
			m.setCurrentCity(that._city);
			if(typeof(callback)=="function")callback(m,that._city);
		});
	})
	.impl("setUI",function(opt){
		var m = this._impl;
		// Get current city from map.getCenter();
		var geo = new BMap.Geocoder();
		geo.getLocation(m.getCenter(),function(result){
			if(result===null){
				throw Error("Can not get current city!");
			}
			m._city = result.addressComponents.city;
			m.setCurrentCity(m._city);
		});
		if(!opt)return;
		if(opt.maptypes){
			m.setMapType(opt.maptypes.normal ? BMAP_NORMAL_MAP : BMAP_PERSPECTIVE_MAP);
		}
		opt.keyboard ? m.enableKeyboard() : m.disableKeyboard();
		if(opt.zoom){
			opt.zoom.scrollwheel ? m.enableScrollWheelZoom() : m.disableScrollWheelZoom();
			opt.zoom.doubleclick ? m.enableDoubleClickZoom() : m.disableDoubleClickZoom();
		}
		if(opt.controls){
			for(var c in opt.controls){
				if(!opt.controls[c])continue;
				var meta = GControl._builtins[c];
				if(!meta)continue;
				m.addControl(new meta.klass(meta.param));
			}
		}
	})
	.impl("getDefaultUI",function(){
		var opt = new GMapUIOptions(),m = this._impl;
		opt.maptypes.normal = m.config.mapType == BMAP_NORMAL_MAP;
		opt.keyboard = m.config.enableKeyboard;
		opt.zoom.scrollwheel = m.config.enableWheelZoom;
		opt.zoom.doubleclick = m.config.enableDblclickZoom;
		//has navigation control by default
		opt.controls._navigationcontrol = true;
		return opt;
	})
	.reimpl("panTo",function(latlng){
		this._impl.panTo(_(latlng));
	})
	.impl("panBy",function(size){
		this._impl.panBy(size.width,size.height);
	})
	.impl("panDirection",function(dx,dy){
		var s = this._impl.getSize();
		this._impl.panBy(dx*(s.width/2),dy*(s.height/2));
	})
	.impl("getPane",function(pane){
		var div = this._impl.getPanes()[pane];
		return div;
	})
	.impl("fromLatLngToContainerPixel",function(latlng){
		var pixel = this._impl.pointToPixel(_(latlng));
		return new GPoint(pixel.x,pixel.y);
	})
	.impl("fromContainerPixelToLatLng",function(pixel){
		var latlng = this._impl.pixelToPoint(_(pixel));
		return new GLatLng(TO_GLAT(latlng.lat),TO_GLNG(latlng.lng));
	})
	.impl("fromLatLngToDivPixel",function(latlng){
		var pixel = this._impl.pointToOverlayPixel(_(latlng));
		return new GPoint(pixel.x,pixel.y);
	})
	.impl("fromDivPixelToLatLng",function(pixel){
		var latlng = this._impl.overlayPixelToPoint(_(pixel));
		return new GLatLng(TO_GLAT(latlng.lat),TO_GLNG(latlng.lng));
	})
	.reimpl("getZoom",function(){
		return this._impl.getZoom();
	})
	.reimpl("setZoom",function(zoom){
		this._impl.setZoom ? this._impl.setZoom(zoom) : this._impl.zoomTo(zoom);
	})
	.impl("getBoundsZoomLevel",function(bounds){
		var sw = _(bounds).getSouthWest(),ne = _(bounds).getNorthEast();
		this._impl.setViewport([sw,ne]);
		return this._impl.getZoom();
		//return this._impl._getBestLevel(_(bounds).getCenter(),{});
	})
	.impl("getPane",function(i){
		return this._impl.getPanes()[i];
	})
	.impl("savePosition",function(){
		//TODO multi map
		this._lastPosition = this.getCenter();
	})
	.impl("returnToSavedPosition",function(){
		//TODO multi map
		var pos =this._lastPosition;
		pos && this.panTo(pos);
	})
	.impl("zoomIn",function(latlng,center,continuose){
		this._impl.zoomIn();
	})
	.impl("zoomOut",function(latlng,center,continuose){
		this._impl.zoomOut();
	})
	.impl("getInfoWindow",function(){
		//TODO TEST
		var w = this._impl.getInfoWindow();
		return new GInfoWindow(w);
	})
	.same(
		"checkResize",
		"getSize",
		"enableDragging",
		"disableDragging",
		"enableDoubleClickZoom",
		"disableDoubleClickZoom",
		"enableScrollWheelZoom",
		"disableScrollWheelZoom",
		"enableContinuousZoom",
		"disableContinuousZoom",
		"enablePinchToZoom",
		"disablePinchToZoom",
		"clearOverlays",
		"getContainer",
		"closeInfoWindow"
	)
	.impl("enableInfoWindow",function(){
		this._config.enableInfoWindow = true;
	})
	.impl("disableInfoWindow",function(){
		this._config.enableInfoWindow = false;
		this._impl.closeInfoWindow();
	})
	.attr_reader("infoWindowEnabled","_config.enableInfoWindow")
	.attr_reader("draggingEnabled","_impl.config.enableDragging")
	.attr_reader("doubleClickZoomEnabled","_impl.config.enableDblclickZoom")
	.attr_reader("continuousZoomEnabled","_impl.config.enableContinuousZoom")
	.attr_reader("scrollWheelZoomEnabled","_impl.config.enableWheelZoom")
	.attr_reader("pinchToZoomEnabled","_impl.config.enablePinchToZoom")
	.noimpl("enableRotation","disableRotation",
		"rotationEnabled","isRotatable","changeHeading")
	.end();

	/**
	 * Translate baidu map event object into arguments
	 * array for google map event handlers
	 */
	///String,Boolean,GMapType,GOverlay,GLatLng,GPoint,Element,Number
	var EVENT_SINGNATUR = {
		'GEvent':{
			'clearlisteners'
				:['clearlisteners',['String']]
		},
		'GGroundOverlay':{
			'visibilitychanged'
				:['visibilitychanged',['Boolean']]
		},
		'GInfoWindow':{
			'closeclick'
				:['closeclick',[]],
			'maximizeclick'
				:['maximizeclick',[]],
			'maximizeend'
				:['maximizeend',[]],
			'restoreclick'
				:['restoreclick',[]],
			'restoreend'
				:['restoreend',[]]
		},
		'GMap2':{
			//'addmaptype'
			//	:['addmaptype',['GMapType']],
			//'removemaptype'
			//	:['removemaptype',['GMapType']],
			'click'
				:['click',['GOverlay','GLatLng','GLatLng']],
			'dblclick'
				:['dblclick',['GOverlay','GLatLng']],
			'singlerightclick'
				:['rightclick',['GPoint','Element','GOverlay']],
			'movestart'
				:['movestart',[]],
			'move'
				:['moving',[]],
			'moveend'
				:['moveend',[]],
			'zoomend'
				:['zoomend',['Number','Number']],
			'maptypechanged'
				:['maptypechange',[]],
			'infowindowopen'
				:['-infowindowopen',[]],
			'infowindowbeforeclose'
				:['-infowindowbeforeclose',[]],
			'infowindowclose'
				:['-infowindowclose',[]],
			'addoverlay'
				:['addoverlay',['GOverlay']],
			'removeoverlay'
				:['removeoverlay',['GOverlay']],
			'clearoverlays'
				:['clearoverlays',[]],
			'mouseover'
				:['-mouseover',['GLatLng']],
			'mouseout'
				:['-mouseout',['GLatLng']],
			'mousemove'
				:['mousemove',['GLatLng']],
			'dragstart'
				:['dragstart',[]],
			'drag'
				:['dragging',[]],
			'dragend'
				:['dragend',[]],
			'load'
				:['load',[]],
			'tilesloaded'
				:['-tilesloaded',[]],
			'headingchanged'
				:['-headingchanged',[]],
			'rotatabilitychanged'
				:['-rotatabilitychanged',[]]
		},
		'GMarker':{
			'click'
				:['click',['GLatLng']],
			'dblclick'
				:['dblclick',['GLatLng']],
			'mousedown'
				:['mousedown',['GLatLng']],
			'mouseup'
				:['mouseup',['GLatLng']],
			'mouseover'
				:['mouseover',['GLatLng']],
			'mouseout'
				:['mouseout',['GLatLng']],
			'infowindowopen'
				:['infowindowopen',[]],
			'infowindowbeforeclose'
				:['infowindowbeforeclose',[]],
			'infowindowclose'
				:['infowindowclose',[]],
			'remove'
				:['remove',[]],
			'dragstart'
				:['dragstart',['GLatLng']],
			'drag'
				:['dragging',['GLatLng']],
			'dragend'
				:['dragend',['GLatLng']]
			//'visibilitychanged'
			//	:['visibilitychanged',['Boolean']]
		},
		'GPolygon':{
			'remove'
				:['remove',[]],
			//'visibilitychanged'
			//	:['visibilitychanged',['Boolean']],
			'click'
				:['click',['GLatLng']],
			'mouseover'
				:['mouseover',[]],
			'mouseout'
				:['mouseout',[]],
			'lineupdated'
				:['lineupdate',[]]
			//'endline'
			//	:['endline',[]],
			//'cancelline'
			//	:['cancelline',[]]
		},
		'GPolyline':{
			'remove'
				:['remove',[]],
			//'visibilitychanged'
			//	:['visibilitychanged',['Boolean']],
			'click'
				:['click',['GLatLng']],
			'mouseover'
				:['mouseover',[]],
			'mouseout'
				:['mouseout',[]],
			'lineupdated'
				:['lineupdate',[]]
			//'endline'
			//	:['endline',[]],
			//'cancelline'
			//	:['cancelline',[]]
		}
	};

	var EVENT_EXTRA = {
		'GMap2':{
			'moveend':['zoomend',['Number','Number']]
		}
	};
	
	function translateEventArgs(src,eventName,e){
		if(!src || !e)return false;
		var ctor = src.constructor,
			name = ctor.name || ctor.__name__,
			args = [];
		if(!name || !EVENT_SINGNATUR[name]){
			throw Error("Don not support events on "+name+"!");
		}
		var meta = EVENT_SINGNATUR[name][eventName];
		if(!e || !meta){
			return [e];
		}else if(meta[1].length===0){
			return [];
		}else{
			for(var i=0;i<meta[1].length;i++){
				var type = meta[1][i];
				if(type=="GLatLng"){
					args.push(new GLatLng(TO_GLAT(e.point.lat),TO_GLNG(e.point.lng)));
				}else if(type=="GPoint"){
					args.push(e.pixel);
				}else if(type=="GOverlay"){
					args.push(e.overlay);
				}else if(type=="Element"){
					args.push(e.target);
				}
				/*
				else if(type=="Number" && i===0){//zoomend oldlevel
					void(0);
				}else if(type=="Number" && i===1){//zoomend newlevel
					void(0);
				}*/
			}
		}
		return args;
	}
	/**
	 * GEvent
	 */
	Klass("GEvent",{_slot:[]})
	.statik("addListener",function(src,event,handler){
		var ctor = src.constructor,
			name = ctor.name || ctor.__name__;

		if(src.addEventListener){
			var callback = function(e){
				var a = translateEventArgs(src,event,e);
				handler.apply(this,a);
			};
			src.addEventListener(event,callback);
			//patch
			if(EVENT_EXTRA[name]){
				extra = EVENT_EXTRA[name][event];
				extra && src.addEventListener(extra[0],callback);
			}
			GEvent._slot.push({event:event,handler:handler,src:src,proxy:callback});
		}else{
			throw Error(src +"{" + (ctor.name || ctor.__name__ ||ctor)+ "} does not dispatch event!");
		}
		return handler;
	})
	.statik("addDomListener",function(node,event,handler){
		baidu.event.on(node,event,handler);
		GEvent._slot.push({event:event,handler:handler,src:node});
	})
	.statik("removeListener",function(handler){
		for(var i=0;i<GEvent._slot.length;++i){
			var o = GEvent._slot[i];
			if(o.handler !== handler)continue;
			if(o.src.removeEventListener){
				o.src.removeEventListener(o.event,o.proxy);
				GEvent._slot.splice(i,1);
				return;
			}
		}
	})
	.statik("removeDomListener",function(handler){
		for(var i=0;i<GEvent._slot.length;++i){
			var o = GEvent._slot[i];
			if(o.handler !== handler)continue;
			baidu.event.un(o.src,o.event,o.handler);
			GEvent._slot.splice(i,1);
			return;
		}
	})
	.statik("bind",function(src,event,obj,method){
		return GEvent.addListener(src,event,function(){
			method.apply(obj,arguments);
		});
	})
	.statik("bindDom",function(node,event,obj,method){
		return GEvent.addDomListener(node,event,function(){
			method.apply(obj,arguments);
		});
	})
	.statik("trigger",function(src,event){
		var args = Array.prototype.slice.call(arguments,2);
		for(var i=0;i<GEvent._slot.length;++i){
			var o = GEvent._slot[i];
			if(o.src === src && o.event === event){
				o.handler.apply(o.src,args);
			}
		}
	})
	.statik("clearInstanceListeners",function(src){
		var indices = [];
		for(var i=0;i<GEvent._slot.length;++i){
			var o = GEvent._slot[i];
			if(o.src === src){
				indices.push(i);
			}
		}
		for(i=indices.length-1;i>=0;--i){
			GEvent._slot.splice(indices[i],1);
		}
	})
	.statik("clearListener",function(src,event){
		var indices = [];
		for(var i=0;i<GEvent._slot.length;++i){
			var o = GEvent._slot[i];
			if(o.src === src && o.event === event){
				indices.push(i);
			}
		}
		for(i=indices.length-1;i>=0;--i){
			GEvent._slot.splice(indices[i],1);
		}
	})
	.statik("callback",function(obj,method){
		return function(){
			method.apply(obj,arguments);
		};
	})
	.statik("callbackArgs",function(obj,method){
		var args = Array.prototype.splice.call(arguments,2);
		return function(){
			method.apply(obj,args);
		};
	})
	.end();

	/**
	 *
	 */
	Typedef("GOverlay",BMap.Overlay);
	GOverlay.prototype.copy = function(){
		throw Error("copy not implementated!");
	};
	GOverlay.prototype.getKml = function(){
		throw Error("getKml not implementated!");
	};
	/**
	 * GControl
	 */
	Typedef("GControl",BMap.Control);
	GControl.prototype.getDefaultPosition = function(){
		return this.defaultAnchor;
	};
	GControl.prototype.printable = function(){
		return false;
	};
	GControl.prototype.selectable = function(){
		return false;
	};
	GControl._builtins = {
		"smallmapcontrol"  :
			{klass:BMap.NavigationControl,param:{type:BMAP_NAVIGATION_CONTROL_SMALL}},
		"largemapcontrol"  :
			{klass:BMap.NavigationControl},
		"largemapcontrol3d":
			{klass:BMap.NavigationControl},
		"smallzoomcontrol" :
			{klass:BMap.NavigationControl,param:{type:BMAP_NAVIGATION_CONTROL_ZOOM}},
		"smallzoomcontrol3d" :
			{klass:BMap.NavigationControl,param:{type:BMAP_NAVIGATION_CONTROL_ZOOM}},
		"scalecontrol" :
			{klass:BMap.ScaleControl},
		"menumaptypecontrol" :
			{klass:BMap.MapTypeControl},
		"hierarchicalmaptypecontrol" :
			{klass:BMap.MapTypeControl},
		"overviewmapcontrol" :
			{klass:BMap.OverviewMapControl},
		"navlabelcontrol" :
			{},
		"_navigationcontrol" :
			{klass:BMap.NavigationControl}
	};

	/**
	 * TODO Controls
	 */
	Klass("GSmallMapControl",function(map){
		this._impl = new BMap.NavigationControl({type:BMAP_NAVIGATION_CONTROL_SMALL});
	},[
		BMap.NavigationControl
	])
	.end();
	
	Klass("GLargeMapControl",function(map){
		this._impl = new BMap.NavigationControl();
	})
	.end();

	Typedef("GLargeMapControl3D",GLargeMapControl);
	
	Klass("GSmallZoomControl",function(map){
		//TODO
		this._impl = new BMap.NavigationControl({type:BMAP_NAVIGATION_CONTROL_ZOOM});
	})
	.end();
	
	Typedef("GSmallZoomControl3D",GSmallZoomControl);

	Klass("GScaleControl",function(map){
		this._impl = new BMap.ScaleControl();
	},[
		BMap.ScaleControl
	])
	.end();

	Klass("GMapTypeControl",function(map){
		//TODO not work?
		this._impl = new BMap.MapTypeControl();
	},[
		BMap.MapTypeControl
	])
	.end();
	
	Klass("GMenuMapTypeControl",function(map){
		this._impl = new BMap.MapTypeControl();
	})
	.end();

	Klass("GHierarchicalMapTypeControl",function(map){
		this._impl = new BMap.MapTypeControl();
	})
	.end();

	Klass("GOverviewMapControl",function(map){
		this._impl = new BMap.OverviewMapControl(map);
	},[
		BMap.OverviewMapControl
	])
	.end();

	Klass("GNavLabelControl",function(map){},[BMap.NavigationControl]).end();

	Klass("GCopyright",function(id,bounds,minZoom,text){
		this.id = id;
		this.bounds = bounds;
		this.minZoom = minZoom;
		this.text = text;
		this._impl = new BMap.Copyright(id,text,bounds._impl);
	})
	.end();
	
	/**
	 * GMapUIOptions
	 */
	Klass("GMapUIOptions",function(size){
		return {
		  maptypes:{
			normal:true,
			satellite:false,//not support!
			hybrid:false,//not support!
			physical:false//not support!
		  },zoom:{
			scrollwheel:false,
			doubleclick:true
		  },keyboard:false,controls:{
			largemapcontrol3d:false,//not support!
			smallzoomcontrol3d:false,
			maptypecontrol:false,
			menumaptypecontrol:false,//not support!
			scalecontrol:false,
			overviewmapcontrol:false
		  }
		};
	})
	.end();
	
	/**
	 * GKeyboardHandler
	 */
	Klass("GKeyboardHandler",function(map){
		if(map && map._impl){
			this.map = map._impl;
			map.enableKeyboard();
		}		
	})
	.end();

	
	Klass("GControlPosition",function(type,offset){
		this._impl = type;
		this._offset = offset;
	},[
		/*BMap.ControlAnchor*/
	])
	.end();
	
	/**
	 * GTileLayer
	 */
	Klass("GTileLayer",function(copyrights,minResolution,maxResolution,opt){
		//TODO
		this._copyrights = copyrights;
		this._minResolution = minResolution;
		this._maxResolution = maxResolution;
		this._opt = opt;
	},[
		BMap.TileLayer
	])
	.override("_initialize",function(map){
		if(this._initialized){
			return;
		}
		this._initialized = true;
		var o = this._opt;
		this._impl = new BMap.TileLayer({
			transparentPng  : this.isPng ? this.isPng() : o.isPng,
			tileUrlTemplate : this.getTileUrl ? this.getTileUrl : o.tileUrlTemplate,
			copyright : new BMap.Copyright(),
			zIndex : o.zIndex || undefined
		});
	})
	.attr_reader(
		"minResolution","_minResolution"
	)
	.attr_reader(
		"maxResolution","_maxResolution"
	)
	.impl("getCopyright",function(){
		
	})
	.end();
	
	/**
	 * GCopyright
	 */
	Klass("GCopyright",function(id,bounds,minZoom,text){
		this.id = id;
		this.bounds = bounds;
		this.minZoom = minZoom;
		this.text = text;
	},[])
	.end();
	
	/**
	 * GCopyrightCollection
	 */
	Klass("GCopyrightCollection",function(prefix){
		this._prefix = prefix;
		this._copyrights = [];
	},[_IDispatcher],true).impl("addCopyright",function(copyright){
		this._copyrights.push(copyright);
		this.dispatch("newcopyright",copyright);
	})
	.impl("getCopyrights",function(latlng,zoom){
		//TODO!
		return [];
	})
	.impl("getCopyrightNotice",function(latlng,zoom){
		//TODO!
		return "";
	})
	.end();
	
	Klass("GIcon",function(copy,image){
		var size = new BMap.Size(23,25),_pt = null,_anchor = null;
		if(copy == undefined){
			//construct from image
			this._impl = new BMap.Icon(image,size);
			this.size = size;//for marker drawing
		}else{
			//copy construct
			//size = _(copy).size;
			var img = image || copy.image || _(copy).imageUrl;
			var impl = this._impl = new BMap.Icon(img,size);
			if(img){
				impl.setImageUrl(img);
				copy._impl.setImageUrl(img);
			}
			var t = copy.iconSize;
			if(t){
				impl.setSize(t);
				copy._impl.setSize(t);
			}
			this.size = t || size;//for marker drawing
			t = copy.iconAnchor;
			if(t){
				_pt = _(t);
				_anchor = new BMap.Size(_pt.x,_pt.y);
				impl.setAnchor(_anchor);
				copy._impl.setAnchor(_anchor);
			}
			t = copy.infoWindowAnchor;
			if(t){
				_pt = _(t);
				_anchor = new BMap.Size(_pt.x,_pt.y);
				impl.setInfoWindowAnchor(_anchor);
				copy._impl.setInfoWindowAnchor(_anchor);
			}
		}
	},[
		BMap.Icon
	])
	.end();
	
	Const("G_DEFAULT_ICON",new GIcon(undefined,"http://api.map.baidu.com/images/marker_red.png"));
	
	/**
	 * Decode Encoded Latitudes and Longitudes String
	 * http://code.google.com/apis/maps/documentation/utilities/polylinealgorithm.html
	 */
	function _decodePath(str){
		var b = str ? str.length : 0,
			c = Array(Math.floor(str.length /2)),
			d = 0,e = 0, f = 0, g = 0;
		for (; d < b; ++g) {
			var h = 1,n = 0,q;
			do q = str.charCodeAt(d++) - 63 - 1, h += q << n, n += 5;
			while (q >= 31);
			e += h & 1 ? ~ (h >> 1) : h >> 1;
			h = 1;
			n = 0;
			do q = str.charCodeAt(d++) - 63 - 1, h += q << n, n += 5;
			while (q >= 31);
			f += h & 1 ? ~ (h >> 1) : h >> 1;
			c[g] = new GLatLng(e * 1.0E-5, f * 1.0E-5, !0);
		}
		c.length = g;
		return c;
	}
	/**
	 * Decode Encoded Levels String
	 */
	function _decodeLevel(str){
	  var a = [];
	  for (var i = 0; i < str.length; ++i) {
		var level = str.charCodeAt(i) - 63;
		a.push(level);
	  }
	  return a;
	}
	/**
	 * GPolyline
	 */
	Klass("GPolyline",function(latlngs,color,weight,opacity,opts){
		var points = [];
		for(var i in latlngs){			
			points.push(_(latlngs[i]));
		}
		//TODO translate opt fields
		opts = opts || {};
		opts.strokeColor = color;//format??
		opts.strokeWeight = weight;
		opts.strokeOpacity = opacity;
		this._impl = new BMap.Polyline(points,opts);
	},[
		BMap.Polyline
	])
	.dispatcher()
	.impl("getLength",function(){
		var len = 0, map = _gprivate.activeMap;
		if(map===null)return len;
		var points = this._impl.getPoints();
		if(points.length <= 1)return len;
		for(var i=1;i<points.length;++i){
			len += map.getDistance(points[i-1],points[i]);
		}
		return len;
	})
	.impl("isHidden",function(){
		return !this._impl.isVisible();
	})
	.impl("getVertexCount",function(){
		return this._impl.getPoints().length;
	})
	.impl("getVertex",function(index){
		var points = this._impl.getPoints();
		if(index<0 || index>=points.length)return null;
		var p = points[index],
		latlng = new GLatLng(TO_GLAT(p.lat),TO_GLNG(p.lng));
		return latlng;
	})
	.impl("getBounds",function(){
		var points = this._impl.getPoints(),
		bounds = new GLatLngBounds();
		for(var i=0;i<points.length;++i){
			var p = points[i];
			pt = new GLatLng(TO_GLAT(p.lat),TO_GLNG(p.lng));
			bounds.extend(pt);
		}
		return bounds;
	})
	.impl("insertVertex",function(index,latlng){
		var points = this._impl.getPoints();
		if(index<0 || index>=points.length)return;
		points.splice(index,0,_(latlng));
		this._impl.setPoints(points);
	})
	.impl("deleteVertext",function(index){
		var points = this._impl.getPoints();
		if(index<0 || index>=points.length)return;
		points.splice(index,1);
		this._impl.setPoints(points);
	})
	.impl("supportHide",function(){
		return true;
	})
	.impl("setStrokeStyle",function(opt){
		if(opt.color != undefined){
			this._impl.setStrokeColor(opt.color);
		}
		if(opt.weight != undefined){
			this._impl.setStrokeWeight(opt.weight);
		}
		if(opt.opacity != undefined){
			this._impl.setStrokeOpacity(opt.opacity);
		}
	})
	.statik("fromEncoded",function(o){
		o = o || {};
		var color = o.color,
			weight = o.weight,
			opacity = o.opacity,
			points = o.points,
			zoomFactor = o.zoomFactor,
			levels = o.levels,
			numLevels = o.numLevels;
		var latlngs = _decodePath(points),l = _decodeLevel(levels);
		var opts = {};
		return new GPolyline(latlngs,color,weight,opacity,opts);
	})
	.same("show","hide","disableEditing","enableEditing")
	.end();
	
	
	/**
	 * Polygon
	 */
	Klass("GPolygon",function(latlngs,opt){
		var points = [];
		for(var i in latlngs){
			points.push(_(latlngs[i]));
		}
		//TODO translate opt fields
		var options = opt || {};
		options.mouseOverTolerance = 1;
		this._impl = new BMap.Polygon(points,options);
	},[
		BMap.Polygon
	])
	.dispatcher()
	.reimpl("setFillStyle",function(s){
		s = s || {};
		this._impl.setFillColor(s.color);
		this._impl.setFillOpacity(s.opacity);
	})
	.reimpl("setStrokeStyle",function(s){
		s = s || {};
		this._impl.setStrokeColor(s.color);
		this._impl.setStrokeWeight(s.weight);
		this._impl.setStrokeOpacity(s.opacity);
	})
	.reimpl("getBounds",function(){
		var b = this._impl.getBounds();
		var sw = b.getSouthWest(),ne = b.getNorthEast();
		return new GLatLngBounds(
			new GLatLng(TO_GLAT(sw.lat),TO_GLNG(sw.lng)),
			new GLatLng(TO_GLAT(ne.lat),TO_GLNG(ne.lng))
		);
	})
	.impl("isHidden",function(){
		return !this._impl.isVisible();
	})
	.impl()
	.statik("fromEncoded",function(o){
		var polylines = o.polylines,fill = o.fill,color = o.color,opacity = o.opacity,outline = o.outline;
		var glatlngs = [];
		for(var i = 0;i<polylines.length; ++i){
			glatlngs = glatlngs.concat(_decodePath(polylines[i].points));
		}
		var p = new GPolygon(glatlngs);
		p.setStrokeStyle({color:color,opacity:opacity,weight:outline?4:0});

		return p;
	})
	.same("show","hide","disableEditing","enableEditing")
	.end();
	
	
	/**
	 * GGroundOverlay
	 * TODO
	 */
	Klass("GGroundOverlay",function(url,boundaries){
		this._url = url;
		//TODO coordinate correction from google->baidu!
		this._boundaries = boundaries._impl;
	},[BMap.Overlay],true).override("initialize",function(map){
		this._map = map;
		var div = document.createElement("div"),
			img = document.createElement("img");			
		div.style.position = "absolute";
		img.src = this._url;
		div.appendChild(img);
		map.getPanes().markerPane.appendChild(div);
		this._div = div;
		this._img = img;
		return div;
	})
	.override("draw",function(){
		var b = this._boundaries,m = this._map,div = this._div,img = this._img,
			bl = m.pointToOverlayPixel(b.getSouthWest()),
			tr = m.pointToOverlayPixel(b.getNorthEast());
		div.style.left = tr.x + "px";
		div.style.top = bl.y + "px";
		img.style.width  = (tr.x - bl.x) + "px";
		img.style.height = (bl.y - tr.y) + "px";
	})
	.override("show",function(){
		if(this._div){
			this._div.style.display = "";
		}
	})
	.override("hide",function(){
		if(this._div){
			this._div.style.display = "none";
		}
	})
	.override("isHidden",function(){
		return this._div.style.dispaly === "none";
	})
	.end();
	
	/**
	 * GLayer
	 */
	Klass("GLayer",function(id){
		throw Error("GLayer is not supported!");
	},[])
	.end();
	
	/**
	 * GTileLayerOverlay
	 * TODO
	 */
	Klass("GTileLayerOverlay",function(tileLayer){
		this.titlelayer = tileLayer;
		this.show = true;
	},[
		BMap.TileLayer
	])
	.impl("show",function(){
		var m = this.titlelayer._map;
		if(!m)return;
		m.addOverlay(this.titlelayer);
		this.show = true;
	})
	.impl("hide",function(){
		var m = this.titlelayer._map;
		if(!m)return;
		m.removeOverlay(this.titlelayer);
		this.show = false;
	})
	.impl("isHidden",function(){
		return !this.show;
	})
	.impl("supportsHide",function(){
		return true;
	})
	.impl("getTileLayer",function(){
		return this.titlelayer;
	})
	.impl("refresh",function(){
		this.hide();
		this.show();
	})
	.end();
	
	/**
	 * GXml
	 */
	Klass("GXml",{})
	//NOT TESTED!
	.statik("parse",function(xml){
		var parser = null;
		if(typeof(DOMParser) != "undefined"){
			parser = new DOMParser();
			return parser.parseFrom(xml,"text/xml");
		}else if(typeof(ActiveXObject)!="undefined" && typeof(GetObject) != "undefined"){
			parser = new ActiveXObject("Microsoft.XMLDOM");
			parser.loadXML(xml);
			return parser;
		}
		throw Error("Can not parse xml string!");
	})
	//NOT TESTED!
	.statik("value",function(node){
		var value = "",
			i = 0,
			fn = arguments.callee,
			t = node.nodeType;
		if(!node){
			return value;
		}else{
			if(t==2||t==3||t==4){
				value += node.nodeValue;
			}else if(t==1||t==9||t==11){
				for(;i<node.childNodes.length;++i){
					value += fn(node.childNodes[i]);
				}
			}
		}
		return value;
	})
	.end();
	/**
	 * GClientGeocoder
	 */
	Klass("GClientGeocoder",function(){
		this._impl = new BMap.Geocoder();
	},[
		BMap.Geocoder
	])
	.impl("getLatLng",function(address,callback,opt){
		var len = _gprivate.maps.length,that = this,city = opt;
		if(len === 0){
			throw Error("Can not get current city,at least one Map instance need to be created");
		}
		var map = (len == 1) ? _gprivate.maps[0]: _gprivate.activeMap;
		//目前全球/全国范围内的搜索必须设置城市，需要到等待后台升级后
		//才能不再指定城市
		if(opt){
			this._impl.getPoint(address,callback,city);
		}else{
			map._trySetCurrentCity(function(map,city){
				that._impl.getPoint(address,callback,city);
			});
		}
	})
	.impl("_resultToPlacemark",function(result){
		var o = {};
		o.id = "p1";
		o.address = result.address;
		o.Point = {coordinates:[result.point.lng,result.point.lat,0]};
		o.ExtendedData = null;
		
		//TODO???
		o.AddressDetails = {
			Accuracy:4,Country:{CountryName:"China",CountryNameCode:"CN"},
			AdministrativeAreaName: result.addressComponents.province,
			Locality:{LocalityName : result.addressComponents.city},
			DependentLocality:{DependentLocality : result.addressComponents.district}
		};
		return o;
	})
	.impl("getLocations",function(address,callback,opt){
		if(!address)callback();
		var type = typeof(address),that = this;
		if(type=="string" || address.constructor === String){
			var wrap0 = function(result){
				var resp = {
					_result:result,
					name:address,
					Status:{code:200,request:"geocode"},
					Placemark:[that._resultToPlacemark(result)]
				};
				result ? callback(resp) : callback();
			};
			var wrap1 = function(point){
				point ? that._impl.getLocation(point,wrap0,opt) : callback();		
			};
			this.getLatLng(address,wrap1,opt);
		}else if(type == "object" && address.constructor === GLatLng){
			this._impl.getLocation(_(address),function(result){
				that.getLocations(result.address,callback,opt);
			},opt);
		}else{
			throw Error("address must be string or GLatLng");
		}
	})
	.same("toString")
	.noimpl("getCache","setCache","setViewport","setBaseCountryCode","getBaseCountryCode","reset")
	.end();
	
	Const("G_TRAVEL_MODE_DRIVING",1);
	Const("G_TRAVEL_MODE_WALKING",2);
	
	Klass("_ImplPlaceHolder",function(){
		this.listeners = [];
	})
	.impl("addEventListener",function(){
		var arg = arguments;
		this.listeners.push({event:arg[0],handler:arg[1]});
	})
	.impl("inject",function(target){
		//call inject on real _impl right after it is created
		for(var i = 0;i<this.listeners.length;++i){
			var o = this.listeners[i];
			target.addEventListener && target.addEventListener(o.event,o.handler);
		}
	})
	.end();
	/**
	 * GDirection
	 */
	Klass("GDirections",function(map,div){
		this._map = _(map || _gprivate.activeMap);
		this._panel = div;
		//ImplPlaceHolder will holde the event listener for real _impl
		this._impl = new _ImplPlaceHolder();
	})
	//.dummy("addEventListener","removeEventListener","getPolyline")
	.dummy("getPolyline")
	.dispatcher()
	.impl("loadFromWaypoints",function(destAndSrcAry,opt){
		opt = opt || {};
		var mode = opt.travelMode,m = this._map,that = this;
		opt.renderOptions = {map:m,autoViewport:true};
		if(opt.avoidHighways){
			opt.drivingPolicy = BMAP_DRIVING_POLICY_AVOID_HIGHWAYS;
		}
		var holder = this._impl;
		//create real _impl
		if(!this.__impl){
			if(mode === G_TRAVEL_MODE_DRIVING){
				this.__impl = new BMap.DrivingRoute(m,opt);
			}else{
				this.__impl = new BMap.WalkingRoute(m,opt);
			}
			holder.inject(this.__impl);
			this.__impl.setSearchCompleteCallback(function(result){
				that._result = result;
				GEvent.trigger(that,"load");
			});
		}

		var dest = destAndSrcAry[1],src = destAndSrcAry[0];
		if(typeof(dest[0])==="string"){
			dest[0] = parseFloat(dest[0]);
		}
		if(typeof(dest[1])==="string"){
			dest[1] = parseFloat(dest[1]);
		}
		if(typeof(src[0])==="string"){
			src[0] = parseFloat(src[0]);
		}
		if(typeof(src[1])==="string"){
			src[1] = parseFloat(src[1]);
		}
		if(baidu.lang.isArray(dest)){
			dest = new BMap.Point(TO_BLNG(dest[1]),TO_BLAT(dest[0]));
		}
		if(baidu.lang.isArray(src)){
			src = new BMap.Point(TO_BLNG(src[1]),TO_BLAT(src[0]));
		}
		this.__impl.search(dest,src);
	})
	.impl("clear",function(){
		if(this.__impl){
			this.__impl.clearResults();
		}else{
			if(!CFG.silence){
				throw Error("real implementation  is not created yet");
			}
		}
	})
	.impl("getDistance",function(){
		var impl = this.__impl;
		if(impl && this._result){
			if(this._result.getNumPlans()===0)throw Error("not plan founded!");
			var plan = this._result.getPlan(0);
			var m = plan._distance;
			var html = null;
			if(m>=1000){
				html = (m/1000).toFixed(1) + "公里";
			}else{
				html = m + "米";
			}
			return {meters: m,html: html};
		}else{
			if(!CFG.silence){
				throw Error("real implementation  is not created yet");
			}
		}
	})
	.impl("getDuration",function(){
		var impl = this.__impl;
		if(impl && this._result){
			if(this._result.getNumPlans()===0)throw Error("not plan founded!");
			var plan = this._result.getPlan(0);
			var s = plan._duration;
			var html = null;
			if(s<60){
				html = s + "秒";
			}else if(s>=60 && s<=3600){
				html = (s/60).toFixed(0) + "分钟";
			}else{
				html = (s/3600).toFixed(1) + "小时";
			}
			return {seconds: s,html:html};
		}else{
			if(!CFG.silence){
				throw Error("real implementation  is not created yet");
			}
		}
	})
	.end(); 

	/**
	 * GGeocodeCache
	 */
	Klass("GGeocodeCache",function(){
		throw Error("GGeocodeCache is not supoorted!");
	}).end();
	
	/**
	 * GTrafficOverlay
	 */
	Klass("GTrafficOverlay",function(opt){
		//TODO
		this._impl = new BMap.TrafficLayer(opt);
	},[
		BMap.TrafficLayer
	])
	.impl("_initialize",function(map){
		if(this._map)return;
		this._map = map;
		map.addOverlay(this._impl);
	})
	.same("show","hide")
	.end();

	/**
	 * GInfoWindow
	 */
	//TODO TEST
	Klass("GInfoWindow",function(impl){
		this._impl = impl;
	},[BMap.InfoWindow])
	.impl("isHidden",function(){
		return !this._impl.isVisible();
	})
	.impl("getPoint",function(){
		var fn = this._impl.getPoint || this._impl.getPosition;
		var p = fn.call(this._impl);
		return new GLatLng(TO_GLAT(p.lat),TO_GLNG(p.lng));
	})
	.same("show","hide","maximize","restore")
	.end();

})(window);
