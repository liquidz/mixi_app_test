MyOpenSocial = {};
MyOpenSocial.viewer = opensocial.IdSpec.PersonId.VIEWER;
MyOpenSocial.owner = opensocial.IdSpec.PersonId.OWNER;
MyOpenSocial.idSpec = function(groupId, userId){
	var params = {};
	params[opensocial.IdSpec.Field.USER_ID] = (userId === undefined) ? this.viewer : userId;
	params[opensocial.IdSpec.Field.GROUP_ID] = groupId;
	return opensocial.newIdSpec(params);
};
MyOpenSocial.toList = function(obj){
//	return kuma.fold(obj, [], function(x, r){ return r.concat(x); });
	var res = [];
	for(var i = 0, l = obj.length; i < l; ++i){ res.push(obj[i]); }
	return res;
};
MyOpenSocial.data = function(idspec, keys){
//	var alist = this.toList(arguments);
//	var idspec = alist[0];
//	var kes = alist.slice(1);
	return function(req){
		return req.newFetchPersonAppDataRequest(idspec, keys);
	};
};

MyOpenSocial.sendRequest = function(conv, mapping, callback){
	var request = opensocial.newDataRequest();
	for(var key in mapping){
		request.add(conv(request, key, mapping[key]), key);
	}
	return request.send(function(data){
		if($.isFunction(callback)){
			callback(kuma.map(mapping, function(key){ return data.get(key).getData(); }));
//			var res = {};
//			for(var key in mapping){ res[key] = data.get(key).getData(); }
//			callback(res);
		}
	});
};

MyOpenSocial.get = function(mapping, callback){
	this.sendRequest(kuma.scope(this, function(req, key, val){
		if($.isFunction(val)){
			return val(req);
		} else {
			return req.newFetchPersonRequest(val);
		}
	}), mapping, callback);
};

MyOpenSocial.set = function(mapping, callback){
	this.sendRequest(kuma.scope(this, function(req, key, val){
		return req.newUpdatePersonAppDataRequest(this.viewer, key, val);
	}), mapping, callback);
};

MyOpenSocial.invite = function(callback){
	var cb = (kuma.isNull(callback) || !$.isFunction(callback)) ? function(){} : callback;
	opensocial.requestShareApp("VIEWER_FRIENDS", null, cb);
};

MyOpenSocial.sendActivity = function(msg){
	var params = {};
	params[opensocial.Activity.Field.TITLE] = msg;
	var activity = opensocial.newActivity(params);
	opensocial.requestCreateActivity(
		activity, opensocial.CreateActivityPriority.HIGH, function(res){}
	);
};
