var Book = {
	pages : [],
	canvas : null,
	holder : null,
	pageHolder : null,
	currentIndex : 0,
	CANVAS_WIDTH : 0,
	CANVAS_HEIGHT : 0,
	mouse : {
		startX : 0,
		startY : 0,
		x : 0,
		y : 0
	},
	drag : {
		side : "",
		index:0
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
		this.holder.style.width = (this.CANVAS_WIDTH * 2) + "px";
		this.holder.style.border = "1px solid #e4e4e4";

		for (var a = 0; a < this.holder.childNodes.length; a++) {
			var pageContainer;
			var child = this.holder.childNodes[a];
			if (child.tagName == 'DIV') {
				pageContainer = document.createElement("div");
				this.holder.removeChild(child);
				child.style.width = this.CANVAS_WIDTH + "px";
				pageContainer.appendChild(child);
				this.pages.push(pageContainer);
			}
		}
	},
	setBook : function() {
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
	setPage : function(page, side, w) {
		page.style.border = "1px solid #e4e4e4";
		page.style.position = "absolute";
		page.style.overflow = "hidden";
		page.style.backgroundColor = "#fff";
		page.style.top = "0px";
		page.style.width = w ? w : this.CANVAS_WIDTH + "px";
		page.style.left = (side == "LEFT" ? 0 : this.CANVAS_WIDTH) + "px";
		this.pageHolder.appendChild(page);
	},
	removePage : function(page) {
		if (!this.hasChild(page))
			return;
		this.pageHolder.removeChild(page);
	},
	hasChild : function(page) {
		for (var a = 0; a < this.pageHolder.childNodes.length; a++) {
			if (this.pageHolder.childNodes[a] == page)
				return true;
		}
		return false;
	},
	showPage : function(index) {
		var page = this.pages[index];
		var side = this.isEven(index) ? "RIGHT" : "LEFT";
		if (side == "RIGHT" && this.pages[index + 2]) {
			console.log("right");
			this.setPage(this.pages[index + 2], "RIGHT");
		}
		this.setPage(page, side);

	},
	addListeners : function() {

		Utensil.addListener(this.holder, "mousedown", this.onMouseDown, false);

	},
	onMouseMove : function(event) {
		Book.mouse.x = Utensil.mouseX(Book.holder, event);
		Book.mouse.y = Utensil.mouseY(Book.holder, event);

		
		if (Book.drag.side == "RIGHT") {
			Book.movePageRight();
		} else {
			//Book.movePageLeft();
		}
	},
	movePageRight : function() {
		//set new page width and pos
		var w = (1 - (Book.mouse.x / (Book.CANVAS_WIDTH * 2))) * Book.CANVAS_WIDTH;
		var cw = ((Book.mouse.x / (Book.CANVAS_WIDTH * 2))) * Book.CANVAS_WIDTH;
		Book.pages[Book.drag.index+1].style.width = w + "px";
		Book.pages[Book.drag.index+1].style.left = Book.mouse.x + "px";
		//set currentpage width
		Book.pages[Book.drag.index].style.width = cw + "px";
		
		console.log(Book.pages[Book.drag.index]);
	},
	movePageLeft : function() {
		//set new page width and pos
		var w = (1 - (Book.mouse.x / (Book.CANVAS_WIDTH * 2))) * Book.CANVAS_WIDTH;
		var cw = ((Book.mouse.x / (Book.CANVAS_WIDTH * 2))) * Book.CANVAS_WIDTH;
		Book.pages[Book.drag.index].style.width = w + "px";
		Book.pages[Book.drag.index].style.left = Book.mouse.x + "px";
		//set currentpage width
		Book.pages[Book.currentIndex].style.width = cw + "px";
	},
	onMouseDown : function(event) {
		Utensil.addListener(document, "mousemove", Book.onMouseMove, false);
		Utensil.addListener(document, "mouseup", Book.onMouseUp, false);
		Book.mouse.startX = Utensil.mouseX(Book.holder, event);
		Book.mouse.startY = Utensil.mouseY(Book.holder, event);
			Book.drag.index = Book.currentIndex;
		if (Book.mouse.startX > Book.CANVAS_WIDTH) {
			if (Book.currentIndex > 0)
			Book.setNextPage(Book.drag.index+2, "RIGHT");
			Book.dragRightPage();
			Book.drag.side = "RIGHT";
		} else {
			console.log(Book.currentIndex - 1);
			if (Book.currentIndex > 0)
			Book.setNextPage(Book.drag.index-2, "LEFT");
			Book.dragLeftPage();
			Book.drag.side = "LEFT";
		}
	},
	dragRightPage : function() {
		Book.setNextPage(Book.drag.index +1, "RIGHT");
	},
	dragLeftPage : function() {
		Book.setNextPage(Book.drag.index -1, "LEFT");
	},
	onMouseUp : function(event) {
		Utensil.removeListener(document, "mousemove", Book.onMouseMove, false);
		Utensil.removeListener(document, "mouseup", Book.onMouseUp, false);
		switch(Book.drag.side) {
			case "LEFT":
				break;
			case "RIGHT":
				Book.animateRightPage();
				break;
		}
	},
	animateRightPage : function() {
		if (Book.mouse.x > Book.CANVAS_WIDTH) {
			TweenLite.to(Book.pages[Book.drag.index + 1],1,{css:{left:(Book.CANVAS_WIDTH * 2)+"px",width:0+"px"},onComplete:Book.onRightComplete,
				onCompleteParams : [Book.pages[Book.drag.index + 1]]});
				TweenLite.to(Book.pages[Book.drag.index], 1, {
				css : {
					width : Book.CANVAS_WIDTH + "px"
				}
			});
		} else {
			console.log("here");
			TweenLite.to(Book.pages[Book.drag.index+1], 1, {
				css : {
					left : 0 + "px",
					width : Book.CANVAS_WIDTH + "px"
				}
			});
			TweenLite.to(Book.pages[Book.drag.index], 1, {
				css : {
					width : 0 + "px"
				},
				onComplete : Book.onRightComplete,
				onCompleteParams : [Book.pages[Book.drag.index]]
			});
			Book.currentIndex =Book.drag.index + 1;
		}
	},
	onRightComplete : function(page) {
		Book.removePage(page)
	},
	setNextPage : function(index, side) {
		Book.setPage(this.pages[index], side, 0);
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
