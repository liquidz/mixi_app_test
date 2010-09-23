MyOpenSocial = {};
MyOpenSocial.viewer = opensocial.IdSpec.PersonId.VIEWER;
MyOpenSocial.owner = opensocial.IdSpec.PersonId.OWNER;
MyOpenSocial.idSpec = function(groupId, userId){
	var params = {};
	params[opensocial.IdSpec.Field.USER_ID] = (userId === undefined) ? this.viewer : userId;
	params[opensocial.IdSpec.Field.GROUP_ID] = groupId;
	return opensocial.newIdSpec(params);
};
MyOpenSocial.data = function(idspec, keys){
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
			console.log("mapping = " + mapping);
			for(var key in mapping){
//			kuma.foreach(mapping, function(key){
				console.log("  > " + key + " = " + data.get(key).getData());
//			});
			}
			callback(kuma.map(mapping, function(key){ return data.get(key).getData(); }));
		}
	});
};

MyOpenSocial.get = function(mapping, callback){
	this.sendRequest(function(req, key, val){
		return((kuma.isString(val)) ? req.newFetchPersonRequest(val) : val(req));
	}, mapping, callback);
};

MyOpenSocial.set = function(mapping, callback){
	this.sendRequest(kuma.scope(this, function(req, key, val){
		return req.newUpdatePersonAppDataRequest(this.viewer, key, val);
	}), mapping, callback);
};

MyOpenSocial.setObject = function(mapping, callback){
	this.set(kuma.map(mapping, function(k, v){
	}), callback);
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
