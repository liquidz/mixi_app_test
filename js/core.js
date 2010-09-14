var MyApp = {
	viewer: null,
	owner: null,
	step: 0
};

// MyOpenSocial {{{
MyOpenSocial = {};
MyOpenSocial.viewer = opensocial.idSpec.PersonId.VIEWER;
MyOpenSocial.owner = opensocial.idSpec.PersonId.OWNER;
MyOpenSocial.idSpec = function(groupId, userId){
	var params = {};
	params[opensocial.IdSpec.Field.USER_ID] = (userId === undefined) ? this.viewer : userId;
	params[opensocial.IdSpec.Field.GROUP_ID] = groupId;
	return opensocial.newIdSpec(params);
};
MyOpenSocial.data = function(){
	if(arguments.length < 2){ return null; }
	var idspec = arguments[0];
	var kes = arguments.slice(1);
	return function(req){
		return req.newFetchPersonAppDataRequest(idspec, kes);
	};
};

MyOpenSocial.sendRequest = function(conv, mapping, callback){
	var request = opensocial.newDataRequest();
	for(var key in mapping){
		request.add(conv(request, key, mapping[key]), key);
	}
	return request.send(function(data){
		if($.isFunction(callback)){
			var res = {};
			for(var key in mapping){
				res[key] = data.get(key).getData();
			}
			callback(res);
		}
	});
};

MyOpenSocial.get = function(){
	this.sendRequest.apply(
		this, [function(req, key, val){
			if(val === this.viewer || val === this.owner){
				return req.newFetchPersonRequest(val);
			} else if($.isFunction(val)){
				//return request.add(val(req), key);
				return val(req);
			}
		}].concat(arguments)
	);
};

//MyOpenSocial.get = function(mapping, callback){
//	var request = opensocial.newDataRequest();
//	for(var key in mapping){
//		if(mapping[key] === this.viewer || mapping[key] === this.owner){
//			request.add(request.newFetchPersonRequest(mapping[key]), key);
//		} else if($.isFunction(mapping[key])){
//			request.add(mapping[key](request), key);
//		}
//	}
//
//	return request.send(function(data){
//		if($.isFunction(callback)){
//			var res = {};
//			for(var key in mapping){
//				res[key] = data.get(key).getData();
//			}
//			callback(res);
//		}
//	});
//};


MyOpenSocial.set = function(){
	this.sendRequest.apply(this,
		[function(req, key, val){
			return req.newUpdatePersonAppDataRequest(this.viewer, key, val);
		}].concat(arguments)
	);
};
//MyOpenSocial.set = function(mapping, callback){
//	var request = opensocial.newDataRequest();
//	for(var key in mapping){
//		request.add(request.newUpdatePersonAppDataRequest(this.viewer, key, mapping[key]), key);
//	}
//
//	request.send(function(data){
//		if($.isFunction(callback)){
//			var res = {};
//			for(var key in mapping){
//				res[key] = data.get(key).getData();
//			}
//			callback(res);
//		}
//	});
//};

// }}}

MyApp.redraw = function(){
	Tadashii.clear();
	for(var i = 0; i < MyApp.step; ++i){
		Tadashii.draw(i, "rgb(0, 0, 0)");
	}
};

MyApp.setStep = function(val){
	this.step = (val === null || val === undefined || val === "") ? 0 : parseInt(val);
	if(this.step > 5){ this.step = 0; }
};
MyApp.incStep = function(){
	this.step++;
	if(this.step > 5){ this.step = 0; }
	return this.step;
};

MyApp.init_new = function(){
	var os = MyOpenSocial;

	os.get({
		viwer: os.viewer,
		response: os.data(os.viewer, "step")
	}, function(res){
		$("#name").html(res.viewer.getDisplayName());
		MyApp.setStep(res[res.viewer.getId()]["step"]);
		Tadashii.createCanvas("#target");
		MyApp.redraw();

		$("#add").bind("click", function(){
			os.set({step: MyApp.incStep()}, function(){
				alert("fin");
				MyApp.redraw();
			});
		});
	});
};

MyApp.init = function(){
	var req = opensocial.newDataRequest();
	var params = {};
	params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
	params[opensocial.IdSpec.Field.GROUP_ID] = "FRIENDS";
	var idSpec = opensocial.newIdSpec(params);

	req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
	req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), "owner");
	//req.add(req.newFetchPersonAppDataRequest(idSpec, ["step"]), "response");
	req.add(req.newFetchPersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, ["step"]), "response");
	req.send(function(data) {
		var viewer = data.get("viewer").getData();
		var owner = data.get("owner").getData();
		//$("#name").html(this.viewer.name);
		$("#name").html(viewer.getDisplayName());
//		MyApp.viewer = {id: viewer.getId(), name: viewer.getDisplayName()};
//		MyApp.owner = {id: owner.getId(), name: owner.getDisplayName()};
//		var steps = data.get("response").getData();
//		for(var id in steps){
//			var yy = $("#debug").html();
//			$("#debug").html(yy + "<br/ >id = " + id + ", step = " + steps[id]["step"]);
//		}
		var response = data.get("response").getData();
		$("#debug").html("step = " + response[viewer.getId()]["step"]);
		var step = response[viewer.getId()]["step"];
		MyApp.step = (step === null || step === undefined || step === "") ? 0 : parseInt(step);
		if(MyApp.step > 5){ MyApp.step = 0; }
		Tadashii.createCanvas("#target");
		MyApp.redraw();
		$("#add").bind("click", function(){
			MyApp.step++;
			if(MyApp.step > 5){ MyApp.step = 0; }
			// os.set({step: MyApp.step}, function(data){});
			var req = opensocial.newDataRequest();
			req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, "step", ""+MyApp.step), "response");
			req.send(function(data) {
				alert("fin");
				MyApp.redraw();
			});
		});
	});
};

(function(){
	gadgets.util.registerOnLoadHandler(MyApp.init_new);
})();
