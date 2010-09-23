if(!window.kuma){ kuma = {}; }

kuma.checkTypeFn = function(type){
	return function(obj){ return (toString.call(obj) === type); };
};

kuma.isArray = kuma.checkTypeFn("[object Array]");
kuma.isString = kuma.checkTypeFn("[object String]");
kuma.isFunction = kuma.checkTypeFn("[object Function]");
kuma.isObject = kuma.checkTypeFn("[object Object]");

kuma.isNull = function(obj){ return (obj === undefined || obj === null); };
kuma.isBlank = function(obj){ return (this.isNull(obj) || obj === ""); };
kuma.isCollection = function(obj){ return (this.isArray(obj) || this.isObject(obj)); };

kuma.foreach = function(obj, fn){ // {{{
	if(!this.isFunction(fn)){ return false; }
	if(this.isArray(obj)){
		for(var i = 0, l = obj.length; i < l; ++i){
			var res = fn.apply(fn, [obj[i], i]);
			if(res === false){ break; }
			else if(res === true){ continue; }
		}
	} else if(this.isObject(obj)){
		for(var key in obj){
			var res = fn.apply(fn, [obj[key], key]);
			if(res === false){ break; }
			else if(res === true){ continue; }
		}
	} else {
		return false;
	}
}; // }}}

kuma.toList = function(obj){
	if(!obj.length){ return []; }
	var res = [];
	for(var i = 0, l = obj.length; i < l; ++i){ res.push(obj[i]); }
	return res;
};

kuma.some = function(arr, pred){
	if(!this.isArray(arr) || !this.isFunction(pred)){ return false; }

	var res = false;
	this.each(arr, function(i, v){ if(pred(v)) return !(res = true); });
	return res;
};
kuma.every = function(arr, pred){ return !this.some(arr, function(x){ return !pred(x); }); };

kuma.fold = function(obj, initial, fn){ // {{{
	//if(!$.isFunction(fn) || this.isNull(initial)){ return false; }
	if(!this.isFunction(fn)){ return false; }
	if(this.isArray(obj)){
		var l = obj.length;
		var body = function(i, res){
			return (i < l) ? body(i + 1, fn(obj[i], res)) : res;
		};
		return body(0, initial);
	} else {
		var res = initial;
		this.foreach(obj, function(k, v){ res = fn(k, v, res); });
//		for(var key in obj){
//			res = fn(key, obj[key], res);
//		}
		return res;
	}
}; // }}}

kuma.keys = function(hash){
	return this.fold(hash, [], function(k, v, r){ return r.concat(k); });
};

kuma.map = function(obj, fn){ // {{{
	if(!this.isFunction(fn)){ return false; }
	if(this.isArray(obj)){
		return this.fold(obj, [], function(x, res){ return res.concat(fn(x)); });
	} else {
		return this.fold(obj, {}, function(k, v, res){
			res[k] = fn(k, v); return res;
		});
	}
}; // }}}

kuma.deepMap = function(obj, fn){
	if(!this.isFunction(fn)){ return false; }
	if(this.isArray(obj)){
		return this.fold(obj, [], function(x, res){
			return res.concat((kuma.isCollection(x)) ? kuma.deepMap(x, fn) : fn(x));
		});
	} else {
		return this.fold(obj, {}, function(k, v, res){
			res[k] = (kuma.isCollection(v)) ? kuma.deepMap(v, fn) : fn(k, v);
			return res;
		});
	}
};

kuma.scope = function(ns, fn){ return function(){ return fn.apply(ns, arguments); }; };

kuma.clone = function(obj){
	if(this.isArray(obj)){
		return this.fold(obj, [], function(x, res){
			return((typeof x === 'object') ? kuma.clone(x) : x);
		});
	} else {
		return this.fold(obj, {}, function(key, val, res){
			res[key] = (typeof val === 'object') ? kuma.clone(val) : val;
			return res;
		});
	}
};

kuma.comp = function(){
	return kuma.fold(kuma.toList(arguments), null, function(fn, res){
		if(kuma.isFunction(fn)){
			return (res === null) ? fn : function(){
				return res(fn.apply(fn, arguments));
			};
		} else {
			return res;
		}
	});
};
