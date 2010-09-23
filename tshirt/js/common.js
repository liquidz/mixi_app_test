if(!window.TShirt){ TShirt = {}; }

TShirt.url = "http://github.com/liquidz/mixi_app_test/raw/develop/tshirt/";

TShirt.defaultData = {
	tshirt_image: "tshirt.png",
	tshirt_name: null,
	tshirt_number: "X",
	tshirt_color: "#04c",
	tshirt_name_color: "#fff",
	tshirt_number_color: "#fff",
	tshirt_name_size: "17px",
	tshirt_number_size: "60px",
	tshirt_name_top: "40px",
	tshirt_name_left: "55px",
	tshirt_number_top: "60px",
	tshirt_number_left: "75px"
};

TShirt.get = function(callback, opt_id){
	var os = MyOpenSocial;
	var withDefault = function(obj, key, defaultVal){
		return((kuma.isNull(obj) || kuma.isBlank(obj[key])) ? defaultVal : obj[key]);
	};
	var targetUser = (kuma.isBlank(opt_id)) ? os.owner : opt_id;

	os.get({
		viewer: os.viewer,
		owner: os.owner,
		target: targetUser,
		response: os.data(targetUser, kuma.keys(this.defaultData))
	}, kuma.scope(this, function(res){
		var data = res.response[res.owner.getId()];
		var getData = kuma.fold(this.defaultData, {}, function(k, v, r){
			r[k] = withDefault(data, k, v);
			return r;
		});
		getData.tshirt_name = withDefault(data, "tshirt_name", res.target.getDisplayName());
		getData.viewer = res.viewer;
		getData.owner = res.owner;
		getData.target = res.target;

		callback(getData);
	}));
};

TShirt.set = function(data){
	//DD_belatedPNG.fix(".iepngfix");

	kuma.foreach(data, function(k, v){
		console.log("  > " + k + " = " + v);
	});

	$("#tshirt")
		.css("background-image", "url(" + this.url + "img/" + data.tshirt_image + ")")
		.css("background-color", data.tshirt_color);

	console.log(">>" + data.tshirt_name_size + "px");
	$("#tshirt p.tshirt_name")
		.html(data.tshirt_name)
		.css("color", data.tshirt_name_color)
		.css("top", (parseInt(data.tshirt_name_top) - 1) + "px") // - border:1
		.css("left", (parseInt(data.tshirt_name_left) - 1) + "px"); // - border:1
	$("#tshirt p.tshirt_name").css("font-size", data.tshirt_name_size + "px");
	$("#tshirt p.tshirt_number")
		.html(data.tshirt_number)
		.css("color", data.tshirt_number_color)
		.css("font-size", data.tshirt_number_size)
		.css("top", (parseInt(data.tshirt_number_top) - 1) + "px") // - border:1
		.css("left", (parseInt(data.tshirt_number_left) - 1) + "px"); // - border:1
};

TShirt.setSmall = function(selector, data){
	var target = $(selector);
	if(target.length === 0){ return false; }

	DD_belatedPNG.fix(".iepngfix");
	target
		.css("background-image", "url(" + this.url + "img/small/" + data.tshirt_image + ")")
		.css("background-color", data.tshirt_color);
	$(selector + " p.tshirt_name")
		.html(data.tshirt_name)
		.css("color", data.tshirt_name_color + "px")
		.css("font-size", data.tshirt_name_size / 3)
		.css("top", (parseInt(data.tshirt_name_top) / 3) + "px")
		.css("left", (parseInt(data.tshirt_name_left) / 3) + "px");
	$(selector + " p.tshirt_number")
		.html(data.tshirt_number)
		.css("color", data.tshirt_number_color)
		.css("font-size", data.tshirt_number_size / 3)
		.css("top", (parseInt(data.tshirt_number_top) / 3) + "px")
		.css("left", (parseInt(data.tshirt_number_left) / 3) + "px");

	return true;
};

TShirt.init = function(){
	this.get(kuma.scope(this, function(res){
		this.set(res);
		this.setSmall("#hoge", res);

		gadgets.window.adjustHeight();

//		if(res.viewer.getId() === res.owner.getId()){
//			for(var k in res.response){
//				var e = $("#new_" + k);
//				if(e.length === 0){ continue; }
//				e.val(res[k]);
//			};
//
//			this.bindEvents();
//
//			$("#change_form").show();
//		}
	}));
};

(function(){
	gadgets.util.registerOnLoadHandler(kuma.scope(TShirt, TShirt.init));
})();
