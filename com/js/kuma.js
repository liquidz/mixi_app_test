var kuma = {};

kuma.isNull = function(obj){ return (obj === undefined || obj === null); };
kuma.isBlank = function(obj){ return (this.isNull(obj) || obj === ""); };

kuma.some = function(arr, pred){
	if(!$.isArray(arr) || !$.isFunction(pred)){ return false; }

	var res = false;
	$.each(arr, function(i, v){ if(pred(v)) return !(res = true); });
	return res;
};
kuma.every = function(arr, pred){ return !this.some(arr, function(x){ return !pred(x); }); };

kuma.fold = function(obj, initial, fn){
	if(!$.isFunction(fn) || this.isNull(initial)){ return false; }
	if($.isArray(obj)){
		var l = obj.length;
		var body = function(i, res){
			return (i < l) ? body(i + 1, fn(obj[i], res)) : res;
		};
		return body(0, initial);
	} else {
		var res = initial;
		for(var key in obj){
			res = fn(key, obj[key], res);
		}
		return res;
	}
};

kuma.keys = function(hash){
	return this.fold(hash, [], function(k, v, r){ return r.concat(k); });
};

kuma.map = function(obj, fn){
	if(!$.isFunction(fn)){ return false; }
	if($.isArray(obj)){
		return this.fold(obj, [], function(x, res){ return res.concat(fn(x)); });
	} else {
		return this.fold(obj, {}, function(k, v, res){
			res[k] = fn(k, v); return res;
		});
	}
};

kuma.scope = function(ns, fn){ return function(){ return fn.apply(ns, arguments); }; };

kuma.clone = function(obj){
	if($.isArray(obj)){
		return this.fold(obj, [], this.scope(this, function(x, res){
			return((typeof x === 'object') ? this.clone(x) : x);
		}));
	} else {
		return this.fold(obj, new (obj.constructor), this.scope(this, function(key, val, res){
			res[key] = (typeof val === 'object') ? this.clone(val) : val;
			return res;
		}));
	}
};
