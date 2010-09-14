var Tadashii = {
	canvasName: "tadashii_canvas",
	canvasSize: 100,
	canvas: null
};

Tadashii.createCanvas = function(targetId){
	var c = $("<canvas width='" + this.canvasSize + "' height='" + this.canvasSize + "' id='" + this.canvasName + "'></canvas>");
	return $(targetId).append(c);
};

Tadashii.getCanvas = function(){
	if(this.canvas === null){
		var c = document.getElementById(this.canvasName);
		if(c === null || c === undefined){ return false; }
		this.canvas = c.getContext("2d");
	}
	return this.canvas;
};

Tadashii.getLine = function(step, weight){
	var s = parseInt(this.canvasSize / 5);
	var w = (weight === undefined) ? 1 : weight;
	return [[s, s, s * 2, w],
		    [s * 2, s, w, s * 2],
		    [s * 2, s * 2, s, w],
		    [s, s * 2, w, s],
		    [parseInt(s / 2), s * 3, s * 3, w]
		   ][step];
};

Tadashii.draw = function(step, color, weight){
	var c = this.getCanvas();
	c.fillStyle = color;
	c.fillRect.apply(this.canvas, this.getLine(step, weight));
	return true;
};

Tadashii.clear = function(){
	var c = this.getCanvas();
	c.fillStyle = "rgb(255, 255, 255)";
	c.fillRect(0, 0, this.canvasSize, this.canvasSize);
};
