var MyApp = {};

MyApp.url = "http://github.com/liquidz/mixi_app_test/raw/develop/tshirt/";

MyApp.defaultData = {
	tshirt_image: "tshirt.png",
	tshirt_name: null,
	tshirt_number: "X",
	tshirt_color: "#04c",
	tshirt_word_color: "#fff",
	tshirt_name_size: "17px",
	tshirt_number_size: "60px",
	tshirt_name_top: "40px",
	tshirt_number_top: "30px"
//	tshirt_font: "Droid Sans"
};

//MyApp.loadFont = function(fontName){
//	WebFontConfig = {
//		google: { families: [fontName]}
//	};
//	var wf = document.createElement("script");
//	wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
//		'://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
//	wf.type = 'text/javascript';
//	wf.async = 'true';
//	var s = document.getElementsByTagName('script')[0];
//	s.parentNode.insertBefore(wf, s);
//};

MyApp.get = function(callback){
	var os = MyOpenSocial;
	var withDefault = function(obj, key, defaultVal){
		return((obj === undefined || obj[key] === undefined || obj[key] === null || obj[key] === "") ? defaultVal : obj[key]);
	};

	os.get({
		viewer: os.viewer,
		owner: os.owner,
		response: os.data(os.owner, "tshirt_image", "tshirt_name", "tshirt_number", "tshirt_color", "tshirt_word_color", "tshirt_name_size", "tshirt_number_size", "tshirt_name_top", "tshirt_number_top")
	}, function(res){
		var data = res.response[res.owner.getId()];
		var getData = {};
		for(var k in MyApp.defaultData){
			getData[k] = withDefault(data, k, MyApp.defaultData[k])
		}
		getData.tshirt_name = withDefault(data, "tshirt_name", res.owner.getDisplayName());
		getData.viewer = res.viewer;
		getData.owner = res.owner;

		callback(getData);
	});
};

MyApp.set = function(data){
	//this.loadFont(data.tshirt_font);
	
	DD_belatedPNG.fix(".iepngfix");
	console.log("tshirt_image = " + data.tshirt_image);
	$("#tshirt").css("background-image", "url(" + MyApp.url + "img/" + data.tshirt_image + ")");
	$("#tshirt").css("background-color", data.tshirt_color);
	$("#tshirt p").css("color", data.tshirt_word_color);
	//$(".wf-inactive #tshirt p").css("font-family", "sans-serif");
	//$(".wf-active #tshirt p").css("font-family", data.tshirt_font);
	$("#tshirt p.tshirt_name")
		.html(data.tshirt_name)
		.css("font-size", data.tshirt_name_size)
		.css("top", data.tshirt_name_top);
	$("#tshirt p.tshirt_number")
		.html(data.tshirt_number)
		.css("font-size", data.tshirt_number_size)
		.css("top", data.tshirt_number_top);
};

MyApp.saveSetting = function(){
//	if(confirm("do you really save this setting?")){
		var newData = {};
		for(var key in MyApp.defaultData){
			newData[key] = $("#new_" + key).val();
			if(newData[key] === ""){ return false; }
		}
		MyOpenSocial.set(newData, function(){
			MyApp.set(newData);
		});
//	}
};

MyApp.bindEvents = function(){
	$("#save_setting").bind("click", MyApp.saveSetting);
	$("#new_tshirt_image").bind("change", function(event){
		$("#tshirt").css("background-image", "url("+ MyApp.url +"img/" + $(event.target).val() + ")");
	});
	$(".color").each(function(){
		var self = this;
		$(this).ColorPicker({
			color: $(this).val(),
			onShow: function(cp){ $(cp).fadeIn(250); },
			onHide: function(cp){ $(cp).fadeOut(250); },
			onChange: function(hsb, hex, rgb){
				$(self).val("#" + hex);
				if(self.id === "new_tshirt_color"){
					$("#tshirt").css("background-color", "#" + hex);
				} else {
					$("#tshirt p").css("color", "#" + hex);
				}
			}
		});
	});
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
		MyOpenSocial.activity("てすてす");
	});
};

MyApp.init = function(){
	MyApp.get(function(res){
		MyApp.set(res);
		gadgets.window.adjustHeight();

		if(res.viewer.getId() === res.owner.getId()){
			for(var k in res){
				var e = $("#new_" + k);
				if(e.length === 0){ continue; }
				e.val(res[k]);
			};

			MyApp.bindEvents();

		} else {
			$("#change_form").hide();
		}
	});
};

(function(){
	gadgets.util.registerOnLoadHandler(MyApp.init);
})();
