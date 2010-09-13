var MyApp = {
	viewer: null,
	owner: null,
	step: 0
};

MyApp.redraw = function(){
	for(var i = 0; i < MyApp.step; ++i){
		Tadashii.draw(i, "rgb(0, 0, 0)");
	}
};

MyApp.init = function(){
	var req = opensocial.newDataRequest();
	var params = {};
	params[opensocial.IdSpec.Field.USER_ID] = opensocial.IdSpec.PersonId.VIEWER;
	params[opensocial.IdSpec.Field.GROUP_ID] = "FRIENDS";
	var idSpec = opensocial.newIdSpec(params);

	req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
	req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), "owner");
	//req.add(req.newFetchPersonAppDataRequest(idSpec, ["step"]), "step");
	req.add(req.newFetchPersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, ["step"]), "step");
	req.send(function(data) {
		var viewer = data.get("viewer").getData();
		var owner = data.get("owner").getData();
		//$("#name").html(this.viewer.name);
		$("#name").html(viewer.getDisplayName());
//		MyApp.viewer = {id: viewer.getId(), name: viewer.getDisplayName()};
//		MyApp.owner = {id: owner.getId(), name: owner.getDisplayName()};
		var step = data.get("step").getData();
		$("#debug").html(step);
		MyApp.step = (step === null || step === undefined) ? 0 : parseInt(step);
		Tadashii.createCanvas("#target");
		MyApp.redraw();
		$("#add").bind("click", function(){
			MyApp.step++;
			if(MyApp.step > 5){ MyApp.step = 0; }
			var req = opensocial.newDataRequest();
			req.add(req.newUpdatePersonAppDataRequest(opensocial.IdSpec.PersonId.VIEWER, "comment", msg), "response");
			req.send(function(data) {
				MyApp.redraw();
			});
		});
	});
};

(function(){
	gadgets.util.registerOnLoadHandler(MyApp.init);
})();
