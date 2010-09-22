if(!window.TShirt){ TShirt = {}; }

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
			$("#new_" + klass + "_top").val((ui.position.top - 1) + "px");
			$("#new_" + klass + "_left").val((ui.position.left - 1) + "px");
		}
	});
	$("input.slider").slider({from: 1, to: 200, step: 1, dimension: "px", onstatechange: function(val){
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

$(function(){
	TShirt.get(TShirt, function(res){
		if(res.viewer.getId() === res.owner.getId()){
			for(var k in res){
				var e = $("#new_" + k);
				if(e.length === 0){ continue; }
				e.val(res[k]);
			};

			this.bindEvents();

			$("#change_form").show();
		}
	});
});

