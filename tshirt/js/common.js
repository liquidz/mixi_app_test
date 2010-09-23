if(!window.TShirt){ TShirt = {}; }

TShirt.url = "http://github.com/liquidz/mixi_app_test/raw/develop/tshirt/";

TShirt.defaultData = {
	tshirt_image: "tshirt.png",
	tshirt_name: null,
	tshirt_number: "X",
	tshirt_color: "#04c",
	tshirt_name_color: "#fff",
	tshirt_number_color: "#fff",
	tshirt_name_size: "17",
	tshirt_number_size: "60",
	tshirt_name_top: "40",
	tshirt_name_left: "55",
	tshirt_number_top: "60",
	tshirt_number_left: "75"
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

TShirt.unit = function(val){ return(((val + "").indexOf("px") !== -1) ? val : val + "px"); };

TShirt.set = function(data){
	$("#tshirt")
		.css("background-image", "url(" + this.url + "img/" + data.tshirt_image + ")")
		.css("background-color", data.tshirt_color);

	$("#tshirt p.tshirt_name")
		.html(data.tshirt_name)
		.css("color", data.tshirt_name_color)
		.css("font-size", this.unit(data.tshirt_name_size))
		.css("top", this.unit(parseInt(data.tshirt_name_top) - 1)) // - border:1
		.css("left", this.unit(parseInt(data.tshirt_name_left) - 1)); // - border:1
	$("#tshirt p.tshirt_number")
		.html(data.tshirt_number)
		.css("color", data.tshirt_number_color)
		.css("font-size", this.unit(data.tshirt_number_size))
		.css("top", this.unit(parseInt(data.tshirt_number_top) - 1)) // - border:1
		.css("left", this.unit(parseInt(data.tshirt_number_left) - 1)); // - border:1
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
		.css("color", data.tshirt_name_color)
		.css("font-size", this.unit(data.tshirt_name_size / 3))
		.css("top", this.unit(parseInt(data.tshirt_name_top) / 3))
		.css("left", this.unit(parseInt(data.tshirt_name_left) / 3));
	$(selector + " p.tshirt_number")
		.html(data.tshirt_number)
		.css("color", data.tshirt_number_color)
		.css("font-size", this.unit(data.tshirt_number_size / 3))
		.css("top", this.unit(parseInt(data.tshirt_number_top) / 3))
		.css("left", this.unit(parseInt(data.tshirt_number_left) / 3));

	return true;
};

TShirt.previewSetting = function(){
	var data = kuma.map(this.defaultData, function(key){
		return $("#new_" + key).val();
	});
	this.set(data);
};

TShirt.saveSetting = function(){
	if(confirm("do you really save this setting?")){
		var newData = kuma.map(this.defaultData, function(k){
			return $("#new_" + k).val();
		});
		MyOpenSocial.set(newData, function(){
			this.set(newData);
		});
	}
};

TShirt.resetSetting = function(){
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

TShirt.bindEvents = function(){
	$("#save_setting").bind("click", kuma.scope(this, this.saveSetting));
	$("#reset_setting").bind("click", kuma.scope(this, this.resetSetting));
	$("#new_tshirt_image").bind("change", kuma.scope(this, function(event){
		$("#tshirt").css("background-image", "url("+ this.url +"img/" + $(event.target).val() + ")");
	}));
	$(".color").each(function(){
		$(this).ColorPicker({
			color: $(this).val(),
			onShow: function(cp){ $(cp).fadeIn(250); },
			onHide: function(cp){ $(cp).fadeOut(250); },
			onChange: kuma.scope(this, function(hsb, hex, rgb){
				$(this).val("#" + hex);
				if(this.id === "new_tshirt_color"){
					$("#tshirt").css("background-color", "#" + hex);
				} else if(this.id === "new_tshirt_name_color"){
					$("#tshirt p.tshirt_name").css("color", "#" + hex);
				} else {
					$("#tshirt p.tshirt_number").css("color", "#" + hex);
				}
			})
		});
	});
	$("#change_form input.text").bind("keyup", kuma.scope(this, this.previewSetting));
	$("#tshirt p").draggable({
		container: "#tshirt",
		drag: function(ev, ui){
			var klass = ev.target.className.split(" ")[0];
			$("#new_" + klass + "_top").val(this.unit(ui.position.top - 1)));
			$("#new_" + klass + "_left").val(this.unit(ui.position.left - 1));
		}
	});
	$("input.slider").slider({from: 1, to: 200, step: 1, dimension: "px", onstatechange: function(val){
		var target = (this.inputNode[0].id === "new_tshirt_name_size") ? ".tshirt_name" : ".tshirt_number";
		$("#tshirt " + target).css("font-size", this.unit(val));
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
		MyOpenSocial.sendActivity("hogehoge");
	});
};

TShirt.init = function(){
	this.get(kuma.scope(this, function(res){
		this.set(res);
		this.setSmall("#hoge", res);

		gadgets.window.adjustHeight();

		if(res.viewer.getId() === res.owner.getId()){
			for(var k in res.response){
				var e = $("#new_" + k);
				if(e.length === 0){ continue; }
				e.val(res[k]);
			};

			this.bindEvents();

			$("#change_form").show();
		}
	}));
};

(function(){
	gadgets.util.registerOnLoadHandler(kuma.scope(TShirt, TShirt.init));
})();
