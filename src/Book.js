var Book = {
	pages : [],
	canvas : null,
	holder : null,
	pageHolder : null,
	currentIndex : 0,
	CANVAS_WIDTH : 0,
	CANVAS_HEIGHT : 0,
	mouse : {
		x : 0,
		y : 0
	},
	init : function() {
		this.getPages();
		this.setBook();
		this.buildCanvas();
		this.addListeners();
		this.showPage(this.currentIndex);
	},
	getPages : function() {
		this.holder = document.getElementById("book");
		if (!this.holder)
			return;

		//get page width and height
		this.CANVAS_WIDTH = this.holder.clientWidth;
		this.CANVAS_HEIGHT = this.holder.clientHeight;
		
		//set book size
		this.holder.style.width = (this.CANVAS_WIDTH * 2)+"px";
		this.holder.style.border = "1px solid #e4e4e4";
		
		for (var a = 0; a < this.holder.childNodes.length; a++) {
			var child = this.holder.childNodes[a];
			if (child.tagName == 'DIV') {
				this.pages.push(child);
				this.holder.removeChild(child);
			}
		}
	},
	setBook:function()
	{
		this.pageHolder = document.createElement("div");
		this.pageHolder.style.width = (this.CANVAS_WIDTH * 2) + "px";
		this.pageHolder.style.height = this.CANVAS_HEIGHT + "px";
		this.pageHolder.style.position = "relative";
		this.holder.appendChild(this.pageHolder);
	},
	buildCanvas : function() {
		if (!this.holder)
			return;
		this.canvas = document.createElement("canvas");
		if (window.G_vmlCanvasManager)
			G_vmlCanvasManager.initElement(this.canvas);
		this.canvas.style.width = (this.CANVAS_WIDTH * 2) + "px";
		this.canvas.style.height = this.CANVAS_HEIGHT + "px";
		this.canvas.style.position = "absolute";
		this.holder.appendChild(this.canvas);
	},
	setPage : function(page, side) {
		page.style.border = "1px solid #e4e4e4";
		page.style.position = "absolute";
		page.style.backgroundColor = "#fff";
		page.style.top = "0px";
		page.style.width = this.CANVAS_WIDTH+"px";
		page.style.left = (side == "LEFT" ? 0 : this.CANVAS_WIDTH) + "px";
	},
	showPage : function(index) {
		var page = this.pages[index];
		var side = this.isEven(index)?"RIGHT":"LEFT";
		this.setPage(page, side);
		this.pageHolder.appendChild(page);
	},
	addListeners : function() {
		Utensil.addListener(document, "mousemove", this.onMouseMove, false);
		Utensil.addListener(document, "mousedown", this.onMouseDown, false);
		Utensil.addListener(document, "mouseup", this.onMouseUp, false);
	},
	onMouseMove : function(event) {
		Book.mouse.x = Utensil.mouseX(Book.holder, event);
		Book.mouse.y = Utensil.mouseY(Book.holder, event);
	},
	onMouseDown : function(event) {

	},
	onMouseUp : function(event) {

	},
	render : function() {

	},
	isEven : function(value) {
		if (value % 2 == 0)
			return true;
		else
			return false;
	}
};
