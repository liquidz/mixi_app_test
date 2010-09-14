var MyApp = {};

MyApp.update = function(name, no){
};

MyApp.init = function(){
	var os = MyOpenSocial;

	os.get({
		owner: os.owner,
		response: os.data(os.owner, "tshirt_name", "tshirt_number", "tshirt_color", "tshirt_word_color", "tshirt_name_size", "tshirt_number_size")
	}, function(res){
		var data = res.response[res.owner.getId()];
		//var name = (data.tshirt_name === undefined) ? res.owner.getDisplayName() : data.tshirt_name;
		//var no = (data.tshirt_number === undefined) ? "X" : data.tshirt_number;
		//var color = (data.tshirt_color === undefined) ? "#04c" : data.tshirt_color;
		//var word_color = (data.tshirt_word_color === undefined) ? "#fff" : data.tshirt_word_color;
		//var name_size = (data.tshirt_name_size === undefined) ? "17px" : data.tshirt_name_size;
		//var number_size = (data.tshirt_number_size === undefined) ? "60px" : data.tshirt_number_size;

		var name = (data === undefined) ? res.owner.getDisplayName() : data.tshirt_name;
		var no = (data === undefined) ? "X" : data.tshirt_number;
		var color = (data === undefined) ? "#04c" : data.tshirt_color;
		var word_color = (data === undefined) ? "#fff" : data.tshirt_word_color;
		var name_size = (data === undefined) ? "17px" : data.tshirt_name_size;
		var number_size = (data === undefined) ? "60px" : data.tshirt_number_size;

		$("#new_name").val(name);
		$("#new_number").val(no);
		$("#new_color").val(color);
		$("#new_word_color").val(word_color);
		$("#new_name_size").val(name_size);
		$("#new_number_size").val(number_size);

		$("#tshirt").css("background-color", color);
		$("#tshirt p").css("color", word_color);
		$("#tshirt p.name").html(name).css("font-size", name_size);
		$("#tshirt p.number").html(no).css("font-size", number_size);

		$("#save_setting").bind("click", function(){
			var new_name = $("#new_name").val();
			var new_number = $("#new_number").val();
			var new_color = $("#new_color").val();
			var new_word_color = $("#new_word_color").val();
			var new_name_size = $("#new_name_size").val();
			var new_number_size = $("#new_number_size").val();

			if(new_name !== "" && new_number !== "" && new_color !== "" && new_word_color !== "" && new_name_size !== "" && new_number_size !== ""){
				os.set({
					tshirt_name: new_name,
					tshirt_number: new_number,
					tshirt_color: new_color,
					tshirt_word_color: new_word_color,
					tshirt_name_size: new_name_size,
					tshirt_number_size: new_number_size
				}, function(){
					$("#tshirt").css("background-color", new_color);
					$("#tshirt p").css("color", new_word_color);
					$("#tshirt p.name").html(new_name).css("font-size", new_name_size);
					$("#tshirt p.number").html(new_number).css("font-size", new_number_size);
				});
			}
		});
	});
};

(function(){
	gadgets.util.registerOnLoadHandler(MyApp.init);
})();
