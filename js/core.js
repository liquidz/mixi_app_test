var MyApp = {
	viewer: null,
	owner: null,
	step: 0
};

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

MyApp.init = function(){
	var os = MyOpenSocial;

	os.get({
		viewer: os.viewer,
		response: os.data(os.viewer, "step")
	}, function(res){
		$("#name").html(res.viewer.getDisplayName());
		MyApp.setStep(res.response[res.viewer.getId()]["step"]);
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

(function(){
	gadgets.util.registerOnLoadHandler(MyApp.init);
})();
