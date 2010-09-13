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
		var step = response["step"];
		MyApp.step = (step === null || step === undefined || step === "") ? 0 : parseInt(step);
		Tadashii.createCanvas("#target");
		MyApp.redraw();
		$("#add").bind("click", function(){
			MyApp.step++;
			if(MyApp.step > 5){ MyApp.step = 0; }
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
	gadgets.util.registerOnLoadHandler(MyApp.init);
})();
