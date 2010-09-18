var MyApp = {};

MyApp.url = "http://github.com/liquidz/mixi_app_test/raw/develop/tshirt/";

MyApp.defaultData = {
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

MyApp.get = function(callback){
	var os = MyOpenSocial;
	var withDefault = function(obj, key, defaultVal){
		return((kuma.isNull(obj) || kuma.isBlank(obj[key])) ? defaultVal : obj[key]);
	};

	os.get({
		viewer: os.viewer,
		owner: os.owner,
		response: os.data(os.owner, kuma.keys(this.defaultData))
	}, kuma.scope(this, function(res){
		var data = res.response[res.owner.getId()];
		var getData = kuma.fold(this.defaultData, {}, function(k, v, r){
			r[k] = withDefault(data, k, v);
			return r;
		});
		getData.tshirt_name = withDefault(data, "tshirt_name", res.owner.getDisplayName());
		getData.viewer = res.viewer;
		getData.owner = res.owner;

		callback(getData);
	}));
};

MyApp.set = function(data){
	DD_belatedPNG.fix(".iepngfix");
	$("#tshirt").css("background-image", "url(" + this.url + "img/" + data.tshirt_image + ")");
	$("#tshirt").css("background-color", data.tshirt_color);
	$("#tshirt p.tshirt_name")
		.html(data.tshirt_name)
		.css("color", data.tshirt_name_color)
		.css("font-size", data.tshirt_name_size)
		.css("top", (parseInt(data.tshirt_name_top) - 1) + "px") // - border:1
		.css("left", (parseInt(data.tshirt_name_left) - 1) + "px"); // - border:1
	$("#tshirt p.tshirt_number")
		.html(data.tshirt_number)
		.css("color", data.tshirt_number_color)
		.css("font-size", data.tshirt_number_size)
		.css("top", (parseInt(data.tshirt_number_top) - 1) + "px") // - border:1
		.css("left", (parseInt(data.tshirt_number_left) - 1) + "px"); // - border:1
};

MyApp.previewSetting = function(){
	var data = kuma.map(this.defaultData, function(key){
		return $("#new_" + key).val();
	});
	this.set(data);
};

MyApp.saveSetting = function(){
	if(confirm("do you really save this setting?")){
		var newData = kuma.map(this.defaultData, function(k){
			return $("#new_" + k).val();
		});
//		var newData = {};
//		for(var key in this.defaultData){
//			newData[key] = $("#new_" + key).val();
//			if(newData[key] === ""){ return false; }
//		}
		MyOpenSocial.set(newData, function(){
			this.set(newData);
		});
	}
};

MyApp.resetSetting = function(){
	if(confirm("reset?")){
		var os = MyOpenSocial;
		os.get({viewer: os.viewer}, kuma.scope(this, function(res){
			var data = kuma.clone(this.defaultData);
			data.tshirt_name = res.viewer.getDisplayName();
	
			for(var k in data){
				var e = $("#new_" + k);
				if(e.length === 0){ continue; }
				e.val(data[k]);
			};
			this.set(data);
		}));
	}
};

MyApp.bindEvents = function(){
	$("#save_setting").bind("click", kuma.scope(this, this.saveSetting));
	$("#reset_setting").bind("click", kuma.scope(this, this.resetSetting));
	$("#new_tshirt_image").bind("change", kuma.scope(this, function(event){
		$("#tshirt").css("background-image", "url("+ this.url +"img/" + $(event.target).val() + ")");
	}));
	$(".color").each(function(){
//		var self = this;
		$(this).ColorPicker({
			color: $(this).val(),
			onShow: function(cp){ $(cp).fadeIn(250); },
			onHide: function(cp){ $(cp).fadeOut(250); },
			onChange: kuma.scope(this, function(hsb, hex, rgb){
				$(this).val("#" + hex);
				if(this.id === "new_tshirt_color"){
					$("#tshirt").css("background-color", "#" + hex);
				} else {
					$("#tshirt p").css("color", "#" + hex);
				}
			})
		});
	});
	$("#change_form input.text").bind("keyup", kuma.scope(this, this.previewSetting));
	$("#tshirt p").draggable({
		container: "#tshirt",
		drag: function(ev, ui){
			var klass = ev.target.className.split(" ")[0];
			$("#new_" + klass + "_top").val((ui.position.top - 1) + "px");
			$("#new_" + klass + "_left").val((ui.position.left - 1) + "px");
		}
	});
	$("input.slider").slider({from: 1, to: 100, step: 1, dimension: "px", onstatechange: function(val){
		var target = (this.inputNode[0].id === "new_tshirt_name_size") ? ".tshirt_name" : ".tshirt_number";
		$("#tshirt " + target).css("font-size", val + "px");
	}});
	$("#invite").bind("click", function(){
		MyOpenSocial.invite(function(res){
			if(res.hadError()){
				alert("failed");
			} else {
				alert("success");
			}
		});
	});
	$("#activity").bind("click", function(){
		MyOpenSocial.sendActivity("背番号が変更されました");
	});
};

MyApp.init = function(){
	this.get(kuma.scope(this, function(res){
		this.set(res);
		gadgets.window.adjustHeight();

		if(res.viewer.getId() === res.owner.getId()){
			for(var k in res){
				var e = $("#new_" + k);
				if(e.length === 0){ continue; }
				e.val(res[k]);
			};

			this.bindEvents();

		} else {
			$("#change_form").hide();
		}
	}));
};

(function(){
	gadgets.util.registerOnLoadHandler(kuma.scope(MyApp, MyApp.init));
})();
