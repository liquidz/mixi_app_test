var MyApp = {};

MyApp.init = function(){
	var req = opensocial.newDataRequest();
	req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
	req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.OWNER), "owner");
	req.send(function(data) {
		var viewer = data.get("viewer").getData();
		var owner = data.get("owner").getData();
		$("#target").html(viewer.getDisplayName());
	});
};

(function(){
	gadgets.util.registerOnLoadHandler(MyApp.init);
})();
